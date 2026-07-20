"use client";

import { useState, useEffect, Suspense, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  XCircle,
  Search,
  Loader2,
  ArrowLeft,
  QrCode,
  Camera,
  Upload,
  X,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { MoleculeBackground } from "@/components/MoleculeBackground";
import jsQR from "jsqr";

type VerifyResult =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "valid"; product: string; category: string; batch: string; manufactured: string; expiry: string }
  | { status: "invalid" };

// Prototype hardcoded codes — replace with database lookup when scaling up
const VALID_CODES: Record<string, { product: string; category: string; batch: string; manufactured: string; expiry: string }> = {
  "CYNAPEPT-RET-INJ-A1B2C3": { product: "Retatrutide Injection", category: "Injectable Peptide", batch: "BATCH-RET-001", manufactured: "January 2025", expiry: "January 2027" },
  "CYNAPEPT-RET-INJ-P7Q8R9": { product: "Retatrutide Injection", category: "Injectable Peptide", batch: "BATCH-RET-002", manufactured: "April 2025", expiry: "April 2027" },
  "CYNAPEPT-RET-POW-D4E5F6": { product: "Retatrutide Powder", category: "Lyophilized Peptide", batch: "BATCH-RET-001", manufactured: "January 2025", expiry: "January 2027" },
  "CYNAPEPT-RET-POW-X2Y3Z4": { product: "Retatrutide Powder", category: "Lyophilized Peptide", batch: "BATCH-RET-002", manufactured: "April 2025", expiry: "April 2027" },
  "CYNAPEPT-TIR-INJ-G7H8I9": { product: "Tirzepatide Injection", category: "Injectable Peptide", batch: "BATCH-TIR-001", manufactured: "February 2025", expiry: "February 2027" },
  "CYNAPEPT-TIR-INJ-S1T2U3": { product: "Tirzepatide Injection", category: "Injectable Peptide", batch: "BATCH-TIR-002", manufactured: "April 2025", expiry: "April 2027" },
  "CYNAPEPT-TIR-POW-J1K2L3": { product: "Tirzepatide Powder", category: "Lyophilized Peptide", batch: "BATCH-TIR-001", manufactured: "February 2025", expiry: "February 2027" },
  "CYNAPEPT-TIR-POW-W5X6Y7": { product: "Tirzepatide Powder", category: "Lyophilized Peptide", batch: "BATCH-TIR-002", manufactured: "April 2025", expiry: "April 2027" },
  "CYNAPEPT-ORF-TAB-M4N5O6": { product: "Orforglipron Tablets", category: "Oral Non-peptide", batch: "BATCH-ORF-001", manufactured: "March 2025", expiry: "March 2027" },
  "CYNAPEPT-ORF-TAB-V4W5X6": { product: "Orforglipron Tablets", category: "Oral Non-peptide", batch: "BATCH-ORF-002", manufactured: "May 2025", expiry: "May 2027" },
};

function VerifyContent() {
  const searchParams = useSearchParams();
  const { t } = useLanguage();
  const [code, setCode] = useState("");
  const [result, setResult] = useState<VerifyResult>({ status: "idle" });

  // QR Code Scanner state
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [scanTab, setScanTab] = useState<"camera" | "upload">("camera");
  const [streamActive, setStreamActive] = useState(false);
  const [cameraError, setCameraError] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "scanning" | "success" | "error">("idle");
  const [uploadError, setUploadError] = useState("");

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const verify = (codeToCheck: string) => {
    const trimmed = codeToCheck.trim().toUpperCase();
    if (!trimmed) return;
    setResult({ status: "loading" });
    setTimeout(() => {
      const info = VALID_CODES[trimmed];
      if (info) {
        setResult({ status: "valid", ...info });
      } else {
        setResult({ status: "invalid" });
      }
    }, 600);
  };

  useEffect(() => {
    const urlCode = searchParams.get("code");
    if (urlCode) {
      setTimeout(() => {
        setCode(urlCode);
        verify(urlCode);
      }, 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    verify(code);
  };

  const handleReset = () => {
    setCode("");
    setResult({ status: "idle" });
  };

  // QR Parsing helper.
  // Product stickers encode a shortened redirect link (e.g. qrco.de/xxxx),
  // not the final /verify?code=... URL. A phone's native camera scanner
  // works because opening the link lets the browser follow the redirect
  // before landing on the real destination. Our own decoder only sees the
  // raw, un-resolved QR string, so if it's a URL with no `code` param we
  // must navigate to it (letting the browser follow the redirect) instead
  // of guessing — a client-side fetch can't read the redirect target
  // cross-origin, and this site is statically exported so there's no
  // server available to resolve it for us either.
  type ScanOutcome = { type: "code"; value: string } | { type: "navigate"; url: string };

  const resolveScan = (str: string): ScanOutcome => {
    const trimmed = str.trim();
    try {
      const url = new URL(trimmed);
      const paramCode = url.searchParams.get("code");
      if (paramCode) return { type: "code", value: paramCode };
      return { type: "navigate", url: trimmed };
    } catch {
      return { type: "code", value: trimmed };
    }
  };

  // Camera implementation
  const startCamera = async () => {
    setCameraError(false);
    setStreamActive(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute("playsinline", "true");
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            // Ignore interruption error when component unmounts
          });
        }
        setStreamActive(true);
        animationFrameRef.current = requestAnimationFrame(scanFrame);
      }
    } catch (err) {
      console.error("Camera error:", err);
      setCameraError(true);
    }
  };

  const stopCamera = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setStreamActive(false);
  };

  const scanFrame = () => {
    if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
      if (!canvasRef.current) {
        canvasRef.current = document.createElement("canvas");
      }
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const qrCode = jsQR(imageData.data, imageData.width, imageData.height);
        if (qrCode) {
          const outcome = resolveScan(qrCode.data);
          if (outcome.type === "navigate") {
            window.location.href = outcome.url;
            return;
          }
          setCode(outcome.value);
          verify(outcome.value);
          closeScanner();
          return;
        }
      }
    }
    animationFrameRef.current = requestAnimationFrame(scanFrame);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadStatus("scanning");
    setUploadError("");

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = document.createElement("img");
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const qrCode = jsQR(imageData.data, imageData.width, imageData.height);
          if (qrCode) {
            setUploadStatus("success");
            const outcome = resolveScan(qrCode.data);
            setTimeout(() => {
              if (outcome.type === "navigate") {
                window.location.href = outcome.url;
                return;
              }
              setCode(outcome.value);
              verify(outcome.value);
              closeScanner();
            }, 600);
          } else {
            setUploadStatus("error");
            setUploadError("Could not find a QR code in the selected photo.");
          }
        } else {
          setUploadStatus("error");
          setUploadError("Canvas drawing context error.");
        }
      };
      img.onerror = () => {
        setUploadStatus("error");
        setUploadError("Failed to load selected image file.");
      };
      img.src = event.target?.result as string;
    };
    reader.onerror = () => {
      setUploadStatus("error");
      setUploadError("Failed to read selected image file.");
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isScannerOpen && scanTab === "camera") {
      timer = setTimeout(() => {
        startCamera();
      }, 0);
    } else {
      setTimeout(() => {
        stopCamera();
      }, 0);
    }
    return () => {
      if (timer) clearTimeout(timer);
      setTimeout(() => {
        stopCamera();
      }, 0);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isScannerOpen, scanTab]);

  const closeScanner = () => {
    setIsScannerOpen(false);
    stopCamera();
    setUploadStatus("idle");
    setUploadError("");
  };

  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-24 md:py-16 relative overflow-hidden">
      {/* Peptide molecule network — same decorative layer as the homepage hero */}
      <div className="absolute inset-0 z-0 text-primary molecule-bg-slow pointer-events-none opacity-60">
        <MoleculeBackground />
      </div>

      {/* Gradient overlays */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-background/20 via-background/60 to-background pointer-events-none" />
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_35%,oklch(0.50_0.16_192/8%),transparent)] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <Link
        href="/"
        className="absolute top-4 left-4 md:top-6 md:left-6 z-20 inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-muted-foreground hover:text-primary rounded-full border border-border/30 bg-background/60 backdrop-blur-xl shadow-[0_12px_40px_rgba(14,116,144,0.06),0_1px_2px_rgba(14,116,144,0.02)] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        {t.verify.backLink}
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex flex-col items-center group/logo mb-5">
            <div className="relative flex items-center justify-center mb-4 pointer-events-none">
              {/* Elegant soft glowing halo behind the symbol */}
              <div className="absolute w-28 h-28 md:w-32 md:h-32 bg-[radial-gradient(circle,oklch(0.50_0.16_192/12%)_0%,transparent_70%)] rounded-full blur-xl pointer-events-none" />
              {/* Glassmorphic backplate for the symbol */}
              <div className="absolute w-20 h-20 md:w-24 md:h-24 rounded-full bg-white/5 border border-white/10 backdrop-blur-[2px] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_10px_30px_rgba(0,0,0,0.02)] pointer-events-none" />
              <div className="relative w-14 md:w-16 aspect-[435/342] transition-transform duration-500 group-hover/logo:scale-105 pointer-events-auto filter drop-shadow-[0_12px_24px_oklch(0.50_0.16_192/16%)]">
                <Image
                  src="/cynova-c-symbol.png"
                  alt="CYNAPEPT"
                  fill
                  className="object-contain"
                  sizes="64px"
                  priority
                />
              </div>
            </div>
            <span className="text-lg font-bold tracking-widest text-foreground transition-colors group-hover/logo:text-primary">
              CYNAPEPT
            </span>
          </Link>

          <div className="mb-6 flex justify-center">
            <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary backdrop-blur-sm tracking-widest uppercase">
              <span className="flex h-1.5 w-1.5 rounded-full bg-primary mr-2 animate-pulse" />
              {t.hero.badge}
            </div>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">{t.verify.title}</h1>
          <p className="text-muted-foreground text-base leading-relaxed">{t.verify.subtitle}</p>
        </div>

        {/* Verification card */}
        <div className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-3xl shadow-[0_20px_60px_-15px_rgba(14,116,144,0.15)] p-5 md:p-6 mb-6">

        {/* Scan QR Button */}
        {!isScannerOpen && (
          <div className="flex gap-2 mb-4">
            <Button
              type="button"
              onClick={() => setIsScannerOpen(true)}
              className="w-full h-12 bg-primary/10 border border-primary/20 hover:bg-primary/20 text-primary rounded-xl font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <QrCode className="w-4.5 h-4.5" />
              {t.verify.scanQrBtn}
            </Button>
          </div>
        )}

        {/* QR Code Scanner component */}
        <AnimatePresence>
          {isScannerOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              className="bg-background/60 border border-border/50 rounded-2xl p-6 mb-2 overflow-hidden relative"
            >
              {/* Close button */}
              <button
                onClick={closeScanner}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                aria-label="Close Scanner"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Tabs */}
              <div className="flex border-b border-border/50 mb-6">
                <button
                  onClick={() => setScanTab("camera")}
                  className={`flex-1 pb-3 text-sm font-semibold transition-colors flex items-center justify-center gap-2 border-b-2 cursor-pointer ${
                    scanTab === "camera"
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Camera className="w-4 h-4" />
                  {t.verify.scanCameraTab}
                </button>
                <button
                  onClick={() => setScanTab("upload")}
                  className={`flex-1 pb-3 text-sm font-semibold transition-colors flex items-center justify-center gap-2 border-b-2 cursor-pointer ${
                    scanTab === "upload"
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Upload className="w-4 h-4" />
                  {t.verify.scanUploadTab}
                </button>
              </div>

              {/* Camera Scanner View */}
              {scanTab === "camera" && (
                <div className="flex flex-col items-center">
                  <div className="relative w-full max-w-[260px] aspect-square rounded-2xl overflow-hidden bg-slate-950 border border-border flex items-center justify-center mb-4">
                    <video
                      ref={videoRef}
                      className="absolute inset-0 w-full h-full object-cover"
                      playsInline
                      muted
                    />
                    
                    {/* Scanning overlay guidelines */}
                    <div className="absolute inset-0 border-[20px] border-slate-950/40 pointer-events-none" />
                    
                    {/* Target box frame corners */}
                    <div className="absolute top-6 left-6 w-5 h-5 border-t-2 border-l-2 border-primary pointer-events-none" />
                    <div className="absolute top-6 right-6 w-5 h-5 border-t-2 border-r-2 border-primary pointer-events-none" />
                    <div className="absolute bottom-6 left-6 w-5 h-5 border-b-2 border-l-2 border-primary pointer-events-none" />
                    <div className="absolute bottom-6 right-6 w-5 h-5 border-b-2 border-r-2 border-primary pointer-events-none" />

                    {/* Sweeping Laser Line Animation */}
                    <div className="absolute top-6 left-6 right-6 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent animate-pulse pointer-events-none shadow-[0_0_8px_rgba(8,145,178,0.8)] scan-line-animation" />

                    {cameraError && (
                      <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center p-6 text-center text-red-400 z-20">
                        <AlertCircle className="w-8 h-8 mb-2" />
                        <p className="text-xs leading-relaxed">{t.verify.cameraError}</p>
                      </div>
                    )}

                    {!cameraError && !streamActive && (
                      <div className="absolute inset-0 bg-slate-950/80 flex flex-col items-center justify-center text-slate-300 z-20">
                        <Loader2 className="w-6 h-6 animate-spin text-primary mb-2" />
                        <p className="text-xs">{t.verify.cameraStarting}</p>
                      </div>
                    )}
                  </div>

                  <Button
                    onClick={closeScanner}
                    variant="outline"
                    className="h-10 text-xs px-4"
                  >
                    {t.verify.cameraClose}
                  </Button>
                </div>
              )}

              {/* Photo Upload Scanner View */}
              {scanTab === "upload" && (
                <div className="flex flex-col items-center">
                  <label className="w-full max-w-[260px] aspect-square rounded-2xl border-2 border-dashed border-border hover:border-primary bg-card flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-colors relative overflow-hidden group">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                    
                    {uploadStatus === "idle" && (
                      <>
                        <Upload className="w-10 h-10 text-muted-foreground group-hover:text-primary transition-colors mb-3" />
                        <p className="text-xs text-muted-foreground font-medium px-4 leading-relaxed">
                          {t.verify.uploadPlaceholder}
                        </p>
                      </>
                    )}

                    {uploadStatus === "scanning" && (
                      <div className="flex flex-col items-center text-primary">
                        <Loader2 className="w-8 h-8 animate-spin mb-3" />
                        <p className="text-xs font-semibold">{t.verify.uploadScanning}</p>
                      </div>
                    )}

                    {uploadStatus === "success" && (
                      <div className="flex flex-col items-center text-emerald-600">
                        <CheckCircle2 className="w-10 h-10 mb-3 animate-bounce" />
                        <p className="text-xs font-bold">{t.verify.uploadSuccess}</p>
                      </div>
                    )}

                    {uploadStatus === "error" && (
                      <div className="flex flex-col items-center text-red-500">
                        <AlertCircle className="w-10 h-10 mb-3" />
                        <p className="text-xs font-bold">{t.verify.uploadFailed}</p>
                        <p className="text-[10px] text-muted-foreground mt-1 px-4 leading-normal">{uploadError}</p>
                      </div>
                    )}
                  </label>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder={t.verify.placeholder}
            className="h-12 bg-background/60 border-border/50 rounded-xl focus-visible:ring-primary font-mono text-sm"
            disabled={result.status === "loading"}
          />
          <Button
            type="submit"
            className="h-12 px-4 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_4px_20px_oklch(0.50_0.16_192/30%)] flex-shrink-0"
            disabled={result.status === "loading" || !code.trim()}
          >
            {result.status === "loading" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          </Button>
        </form>
        </div>

        <AnimatePresence mode="wait">
          {result.status === "valid" && (
            <motion.div
              key="valid"
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.35 }}
              className="bg-emerald-50/90 backdrop-blur-xl border border-emerald-200 rounded-3xl shadow-[0_20px_60px_-15px_rgba(16,185,129,0.2)] p-6"
            >
              <div className="flex items-center gap-3 mb-5">
                <CheckCircle2 className="w-9 h-9 text-emerald-600 flex-shrink-0" />
                <div>
                  <p className="font-bold text-emerald-800 text-lg md:text-xl leading-tight">{t.verify.validTitle}</p>
                  <p className="text-emerald-600 text-[17px]">{t.verify.validSubtitle}</p>
                </div>
              </div>
              <div className="border-t border-emerald-200 pt-4 space-y-3">
                {([
                  [t.verify.productLabel, result.product],
                  [t.verify.categoryLabel, result.category],
                  [t.verify.batchLabel, result.batch],
                  [t.verify.manufacturedLabel, result.manufactured],
                  [t.verify.expiryLabel, result.expiry],
                ] as [string, string][]).map(([label, value]) => (
                  <div key={label} className="flex justify-between text-[17px]">
                    <span className="text-emerald-700 font-medium">{label}</span>
                    <span className="text-emerald-900 font-semibold text-right ml-4">{value}</span>
                  </div>
                ))}
              </div>
              <button onClick={handleReset} className="mt-5 text-sm text-emerald-600 hover:text-emerald-800 underline underline-offset-2 transition-colors cursor-pointer bg-transparent border-none p-0">
                {t.verify.verifyAnother}
              </button>
            </motion.div>
          )}

          {result.status === "invalid" && (
            <motion.div
              key="invalid"
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.35 }}
              className="bg-red-50/90 backdrop-blur-xl border border-red-200 rounded-3xl shadow-[0_20px_60px_-15px_rgba(239,68,68,0.2)] p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <XCircle className="w-9 h-9 text-red-500 flex-shrink-0" />
                <div>
                  <p className="font-bold text-red-800 text-lg md:text-xl leading-tight">{t.verify.invalidTitle}</p>
                  <p className="text-red-600 text-[17px]">{t.verify.invalidSubtitle}</p>
                </div>
              </div>
              <p className="text-red-600 text-sm">
                <a href="mailto:Enquiries@cynova.life" className="font-semibold underline underline-offset-2 hover:text-red-800 transition-colors">Enquiries@cynova.life</a>
              </p>
              <button onClick={handleReset} className="mt-4 text-sm text-red-500 hover:text-red-700 underline underline-offset-2 transition-colors cursor-pointer bg-transparent border-none p-0">
                {t.verify.tryAgain}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <p className="text-center text-sm text-muted-foreground mt-8">
          {t.verify.poweredBy}{" "}
          <a href="mailto:Enquiries@cynova.life" className="text-primary hover:underline">Enquiries@cynova.life</a>
        </p>
      </motion.div>

      {/* Laser line css animation */}
      <style jsx global>{`
        @keyframes scan-line {
          0% {
            top: 24px;
            opacity: 0.8;
          }
          50% {
            top: calc(100% - 26px);
            opacity: 0.8;
          }
          100% {
            top: 24px;
            opacity: 0.8;
          }
        }
        .scan-line-animation {
          animation: scan-line 2.2s ease-in-out infinite;
        }
      `}</style>
    </main>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-primary animate-spin" />
      </main>
    }>
      <VerifyContent />
    </Suspense>
  );
}
