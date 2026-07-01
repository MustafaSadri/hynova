"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Shield, Search, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

type VerifyResult =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "valid"; product: string; category: string; batch: string; manufactured: string; expiry: string }
  | { status: "invalid" };

function VerifyContent() {
  const searchParams = useSearchParams();
  const [code, setCode] = useState("");
  const [result, setResult] = useState<VerifyResult>({ status: "idle" });

  const verify = async (codeToCheck: string) => {
    const trimmed = codeToCheck.trim();
    if (!trimmed) return;

    setResult({ status: "loading" });

    const res = await fetch("/api/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: trimmed }),
    });

    const data = await res.json();

    if (data.valid) {
      setResult({
        status: "valid",
        product: data.product,
        category: data.category,
        batch: data.batch,
        manufactured: data.manufactured,
        expiry: data.expiry,
      });
    } else {
      setResult({ status: "invalid" });
    }
  };

  // Auto-verify if code comes from QR scan (URL param)
  useEffect(() => {
    const urlCode = searchParams.get("code");
    if (urlCode) {
      setCode(urlCode);
      verify(urlCode);
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

  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-16 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      {/* Back to home */}
      <Link
        href="/"
        className="absolute top-6 left-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to CYNOVA.LIFE
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center justify-center mb-6">
            <span className="flex h-3 w-3 rounded-full bg-primary mr-3 shadow-[0_0_10px_rgba(8,145,178,0.5)]" />
            <span className="text-xl font-bold tracking-widest text-foreground">CYNOVA.LIFE</span>
          </Link>

          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Product Verification</h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Enter the code from your product sticker or scan the QR code to confirm authenticity.
          </p>
        </div>

        {/* Input form — always visible so customer can try another code */}
        <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
          <Input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="e.g. CYNOVA-RET-INJ-A1B2C3"
            className="h-12 bg-card border-border/50 focus-visible:ring-primary font-mono text-sm"
            disabled={result.status === "loading"}
          />
          <Button
            type="submit"
            className="h-12 px-4 bg-primary text-primary-foreground hover:bg-primary/90 flex-shrink-0"
            disabled={result.status === "loading" || !code.trim()}
          >
            {result.status === "loading" ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
          </Button>
        </form>

        {/* Result */}
        <AnimatePresence mode="wait">
          {result.status === "valid" && (
            <motion.div
              key="valid"
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.35 }}
              className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6"
            >
              <div className="flex items-center gap-3 mb-5">
                <CheckCircle2 className="w-9 h-9 text-emerald-600 flex-shrink-0" />
                <div>
                  <p className="font-bold text-emerald-800 text-lg leading-tight">Authentic Product ✓</p>
                  <p className="text-emerald-600 text-sm">This product is genuine and verified by CYNOVA.LIFE.</p>
                </div>
              </div>

              <div className="border-t border-emerald-200 pt-4 space-y-3">
                {[
                  ["Product",     result.product],
                  ["Category",    result.category],
                  ["Batch No.",   result.batch],
                  ["Manufactured",result.manufactured],
                  ["Expiry",      result.expiry],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between text-sm">
                    <span className="text-emerald-700 font-medium">{label}</span>
                    <span className="text-emerald-900 font-semibold text-right ml-4">{value}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={handleReset}
                className="mt-5 text-xs text-emerald-600 hover:text-emerald-800 underline underline-offset-2 transition-colors cursor-pointer bg-transparent border-none p-0"
              >
                Verify another code
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
              className="bg-red-50 border border-red-200 rounded-2xl p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <XCircle className="w-9 h-9 text-red-500 flex-shrink-0" />
                <div>
                  <p className="font-bold text-red-800 text-lg leading-tight">Code Not Found</p>
                  <p className="text-red-600 text-sm">
                    This code does not match any product in our system. This product may not be authentic.
                  </p>
                </div>
              </div>
              <p className="text-red-600 text-sm">
                If you believe this is an error, please contact us at{" "}
                <a
                  href="mailto:mustafassadriwala548@gmail.com"
                  className="font-semibold underline underline-offset-2"
                >
                  mustafassadriwala548@gmail.com
                </a>
              </p>
              <button
                onClick={handleReset}
                className="mt-4 text-xs text-red-500 hover:text-red-700 underline underline-offset-2 transition-colors cursor-pointer bg-transparent border-none p-0"
              >
                Try again
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer note */}
        <p className="text-center text-xs text-muted-foreground mt-8">
          Powered by CYNOVA.LIFE Authentication System &mdash; For support contact{" "}
          <a href="mailto:mustafassadriwala548@gmail.com" className="text-primary hover:underline">
            mustafassadriwala548@gmail.com
          </a>
        </p>
      </motion.div>
    </main>
  );
}

export default function VerifyPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-background flex items-center justify-center">
          <Loader2 className="w-6 h-6 text-primary animate-spin" />
        </main>
      }
    >
      <VerifyContent />
    </Suspense>
  );
}
