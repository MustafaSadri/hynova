"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import jsQR from "jsqr";
import {
  AlertTriangle,
  Camera,
  CheckCircle2,
  KeyRound,
  Loader2,
  ScanLine,
  ShieldAlert, 
  ShieldCheck,
  Upload,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { useLanguage } from "@/lib/language-context";
import { translations } from "@/lib/translations";

type Mode = "code" | "photo";
type Status =
  | "idle"
  | "submitting"
  | "authentic"
  | "invalid"
  | "error"
  | "decode-error";

// Reads an image file, decodes any QR code in it, and pulls a security code
// out of the payload. Labels may encode the raw code, or a URL that carries
// it as a query param (fwcode/code/sn) or as the last path segment.
function decodeQrFromFile(file: File): Promise<string | null> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(null);
        return;
      }
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const result = jsQR(imageData.data, imageData.width, imageData.height);
      resolve(result?.data ?? null);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(null);
    };
    img.src = url;
  });
}

function extractCodeFromText(text: string): string {
  try {
    const url = new URL(text);
    const param =
      url.searchParams.get("fwcode") ||
      url.searchParams.get("code") ||
      url.searchParams.get("sn");
    if (param) return param;
    const segments = url.pathname.split("/").filter(Boolean);
    if (segments.length) return segments[segments.length - 1];
  } catch {
    // Not a URL — treat the raw decoded text as the code.
  }
  return text.trim();
}

export function Verify({ initialCode }: { initialCode?: string }) {
  const { language } = useLanguage();
  const t = translations[language].verify;

  const [mode, setMode] = useState<Mode>("code");
  const [code, setCode] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>(initialCode ? "submitting" : "idle");
  const [scanning, setScanning] = useState(false);

  const scanInputRef = useRef<HTMLInputElement>(null);
  const uploadInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);

  const canSubmit =
    status !== "submitting" && (mode === "code" ? code.trim().length > 0 : !!file);

  function handleFile(selected: File | null) {
    setFile(selected);
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return selected ? URL.createObjectURL(selected) : null;
    });
  }

  function reset() {
    stopScan();
    setCode("");
    handleFile(null);
    setStatus("idle");
  }

  function stopScan() {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setScanning(false);
  }

  function scanFrame() {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || video.readyState !== video.HAVE_ENOUGH_DATA) {
      rafRef.current = requestAnimationFrame(scanFrame);
      return;
    }
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      rafRef.current = requestAnimationFrame(scanFrame);
      return;
    }
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const result = jsQR(imageData.data, imageData.width, imageData.height);
    if (result?.data) {
      const detected = extractCodeFromText(result.data);
      stopScan();
      setStatus("submitting");
      void verifyCode(detected);
      return;
    }
    rafRef.current = requestAnimationFrame(scanFrame);
  }

  // Live camera scanning needs getUserMedia over a secure context; when it's
  // unavailable or the user declines the permission prompt, fall back to the
  // native camera-capture file input (single photo, decoded on submit).
  async function startScan() {
    if (!navigator.mediaDevices?.getUserMedia) {
      scanInputRef.current?.click();
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      streamRef.current = stream;
      setScanning(true);
    } catch {
      scanInputRef.current?.click();
    }
  }

  useEffect(() => {
    if (!scanning) return;
    const video = videoRef.current;
    const stream = streamRef.current;
    if (!video || !stream) return;
    video.srcObject = stream;
    video.play().catch(() => {});
    rafRef.current = requestAnimationFrame(scanFrame);
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scanning]);

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  async function verifyCode(rawCode: string) {
    try {
      const res = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: rawCode }),
      });
      const data = await res.json();

      if (!res.ok || !data.ok) {
        setStatus("error");
        return;
      }

      setStatus(data.authentic ? "authentic" : "invalid");
    } catch {
      setStatus("error");
    }
  }

  // Arriving via a scanned sticker QR (?code=...) skips the form entirely —
  // the code is already known, so we verify it immediately on load.
  useEffect(() => {
    if (initialCode) {
      void verifyCode(initialCode);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setStatus("submitting");

    if (mode === "photo") {
      if (!file) return;
      const decoded = await decodeQrFromFile(file);
      if (!decoded) {
        setStatus("decode-error");
        return;
      }
      await verifyCode(extractCodeFromText(decoded));
      return;
    }

    await verifyCode(code.trim());
  }

  const resultCopy =
    status === "authentic"
      ? { title: t.resultAuthenticTitle, body: t.resultAuthenticBody }
      : status === "invalid"
        ? { title: t.resultInvalidTitle, body: t.resultInvalidBody }
        : status === "error"
          ? { title: t.resultErrorTitle, body: t.resultErrorBody }
          : status === "decode-error"
            ? { title: t.resultDecodeErrorTitle, body: t.resultDecodeErrorBody }
            : null;

  return (
    <section className="relative px-6 pt-32 pb-24 md:pt-40 md:pb-32">
      <div className="mx-auto max-w-xl">
        <div className="text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl border border-teal-100 bg-teal-50">
            <ShieldCheck className="size-7 text-teal-600" strokeWidth={1.5} />
          </div>
          <h1 className="mt-6 text-4xl font-light tracking-tight text-neutral-900 sm:text-5xl">
            {t.headingPlain}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-600 via-neutral-900 to-cyan-600">
              {t.headingHighlight}
            </span>
          </h1>
          <p className="mt-5 text-base leading-relaxed text-neutral-500">
            {t.subtitle}
          </p>
        </div>

        <div className="mt-10 rounded-3xl border border-neutral-200 bg-white/70 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)] backdrop-blur-sm sm:p-8">
          {resultCopy ? (
            <div className="flex flex-col items-center py-6 text-center">
              <div
                className={cn(
                  "flex size-14 items-center justify-center rounded-full",
                  status === "authentic" && "bg-teal-50",
                  status === "invalid" && "bg-red-50",
                  (status === "error" || status === "decode-error") && "bg-amber-50",
                )}
              >
                {status === "authentic" ? (
                  <CheckCircle2 className="size-7 text-teal-600" strokeWidth={1.5} />
                ) : status === "invalid" ? (
                  <ShieldAlert className="size-7 text-red-600" strokeWidth={1.5} />
                ) : (
                  <AlertTriangle className="size-7 text-amber-600" strokeWidth={1.5} />
                )}
              </div>
              <h2 className="mt-5 text-xl font-medium text-neutral-900">
                {resultCopy.title}
              </h2>
              <p className="mt-2 max-w-sm text-sm leading-relaxed text-neutral-500">
                {resultCopy.body}
              </p>
              <button
                type="button"
                onClick={reset}
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "mt-6 h-11 rounded-full border-neutral-200 px-6 text-neutral-700 hover:bg-neutral-50",
                )}
              >
                {t.resultReset}
              </button>
            </div>
          ) : initialCode ? (
            <div className="flex flex-col items-center py-10 text-center">
              <Loader2 className="size-8 animate-spin text-teal-600" strokeWidth={1.5} />
              <p className="mt-4 text-sm text-neutral-500">{t.autoVerifying}</p>
            </div>
          ) : scanning ? (
            <div className="flex flex-col items-center">
              <div className="relative w-full overflow-hidden rounded-xl bg-black">
                <video
                  ref={videoRef}
                  muted
                  playsInline
                  className="h-72 w-full object-cover"
                />
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <div className="size-44 rounded-2xl border-2 border-white/80" />
                </div>
              </div>
              <canvas ref={canvasRef} className="hidden" />
              <p className="mt-4 text-sm text-neutral-500">{t.scanningHint}</p>
              <button
                type="button"
                onClick={stopScan}
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "mt-4 h-11 rounded-full border-neutral-200 px-6 text-neutral-700 hover:bg-neutral-50",
                )}
              >
                {t.scanCancel}
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-1 rounded-full bg-neutral-100 p-1">
                <button
                  type="button"
                  onClick={() => setMode("code")}
                  className={cn(
                    "flex h-9 items-center justify-center gap-1.5 rounded-full text-sm font-medium transition-colors",
                    mode === "code"
                      ? "bg-white text-neutral-900 shadow-sm"
                      : "text-neutral-500 hover:text-neutral-700",
                  )}
                >
                  <KeyRound className="size-4" />
                  {t.tabCode}
                </button>
                <button
                  type="button"
                  onClick={() => setMode("photo")}
                  className={cn(
                    "flex h-9 items-center justify-center gap-1.5 rounded-full text-sm font-medium transition-colors",
                    mode === "photo"
                      ? "bg-white text-neutral-900 shadow-sm"
                      : "text-neutral-500 hover:text-neutral-700",
                  )}
                >
                  <ScanLine className="size-4" />
                  {t.tabPhoto}
                </button>
              </div>

              <form onSubmit={handleSubmit} className="mt-6">
                {mode === "code" ? (
                  <div key="code-mode">
                    <label
                      htmlFor="verify-code"
                      className="text-xs font-medium uppercase tracking-widest text-neutral-400"
                    >
                      {t.codeLabel}
                    </label>
                    <input
                      id="verify-code"
                      type="text"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      placeholder={t.codePlaceholder}
                      autoComplete="off"
                      className="mt-2 h-12 w-full rounded-xl border border-neutral-200 bg-white px-4 font-mono text-sm tracking-wide text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors focus:border-teal-500"
                    />
                    <p className="mt-2 text-xs text-neutral-400">
                      {t.codeHelper}
                    </p>
                  </div>
                ) : (
                  <div key="photo-mode">
                    <input
                      ref={scanInputRef}
                      type="file"
                      accept="image/*"
                      capture="environment"
                      className="hidden"
                      onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
                    />
                    <input
                      ref={uploadInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
                    />

                    {previewUrl ? (
                      <div className="relative overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={previewUrl}
                          alt="Selected product photo"
                          className="h-56 w-full object-contain p-3"
                        />
                        <button
                          type="button"
                          onClick={() => handleFile(null)}
                          aria-label={t.removePhoto}
                          className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-full bg-white/90 text-neutral-600 shadow-sm backdrop-blur hover:bg-white"
                        >
                          <X className="size-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => void startScan()}
                          className="flex h-32 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-neutral-200 text-neutral-500 transition-colors hover:border-teal-400 hover:text-teal-600"
                        >
                          <Camera className="size-6" strokeWidth={1.5} />
                          <span className="text-sm font-medium">{t.scanPhoto}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => uploadInputRef.current?.click()}
                          className="flex h-32 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-neutral-200 text-neutral-500 transition-colors hover:border-teal-400 hover:text-teal-600"
                        >
                          <Upload className="size-6" strokeWidth={1.5} />
                          <span className="text-sm font-medium">{t.uploadPhoto}</span>
                        </button>
                      </div>
                    )}
                    <p className="mt-2 text-xs text-neutral-400">
                      {t.photoHelper}
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!canSubmit}
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "mt-6 h-12 w-full rounded-full border-0 bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-[0_8px_20px_rgba(13,148,136,0.25)] transition hover:from-teal-400 hover:to-cyan-400 disabled:opacity-40 disabled:shadow-none",
                  )}
                >
                  {status === "submitting" ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      {t.submitting}
                    </>
                  ) : (
                    t.submit
                  )}
                </button>
              </form>
            </>
          )}
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 border-t border-neutral-100 pt-10 sm:grid-cols-3">
          {t.trust.map((item) => (
            <div key={item.title}>
              <p className="text-sm font-medium text-neutral-900">{item.title}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-neutral-500">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
