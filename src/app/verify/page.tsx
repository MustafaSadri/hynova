"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Shield, Search, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

type VerifyResult =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "valid"; product: string; category: string; batch: string; manufactured: string; expiry: string }
  | { status: "invalid" };

// Prototype hardcoded codes — replace with database lookup when scaling up
const VALID_CODES: Record<string, { product: string; category: string; batch: string; manufactured: string; expiry: string }> = {
  "CYNOVA-RET-INJ-A1B2C3": { product: "Retatrutide Injection", category: "Injectable Peptide", batch: "BATCH-RET-001", manufactured: "January 2025", expiry: "January 2027" },
  "CYNOVA-RET-INJ-P7Q8R9": { product: "Retatrutide Injection", category: "Injectable Peptide", batch: "BATCH-RET-002", manufactured: "April 2025", expiry: "April 2027" },
  "CYNOVA-RET-POW-D4E5F6": { product: "Retatrutide Powder", category: "Lyophilized Peptide", batch: "BATCH-RET-001", manufactured: "January 2025", expiry: "January 2027" },
  "CYNOVA-RET-POW-X2Y3Z4": { product: "Retatrutide Powder", category: "Lyophilized Peptide", batch: "BATCH-RET-002", manufactured: "April 2025", expiry: "April 2027" },
  "CYNOVA-TIR-INJ-G7H8I9": { product: "Tirzepatide Injection", category: "Injectable Peptide", batch: "BATCH-TIR-001", manufactured: "February 2025", expiry: "February 2027" },
  "CYNOVA-TIR-INJ-S1T2U3": { product: "Tirzepatide Injection", category: "Injectable Peptide", batch: "BATCH-TIR-002", manufactured: "April 2025", expiry: "April 2027" },
  "CYNOVA-TIR-POW-J1K2L3": { product: "Tirzepatide Powder", category: "Lyophilized Peptide", batch: "BATCH-TIR-001", manufactured: "February 2025", expiry: "February 2027" },
  "CYNOVA-TIR-POW-W5X6Y7": { product: "Tirzepatide Powder", category: "Lyophilized Peptide", batch: "BATCH-TIR-002", manufactured: "April 2025", expiry: "April 2027" },
  "CYNOVA-ORF-TAB-M4N5O6": { product: "Orforglipron Tablets", category: "Oral Non-peptide", batch: "BATCH-ORF-001", manufactured: "March 2025", expiry: "March 2027" },
  "CYNOVA-ORF-TAB-V4W5X6": { product: "Orforglipron Tablets", category: "Oral Non-peptide", batch: "BATCH-ORF-002", manufactured: "May 2025", expiry: "May 2027" },
};

function VerifyContent() {
  const searchParams = useSearchParams();
  const { t } = useLanguage();
  const [code, setCode] = useState("");
  const [result, setResult] = useState<VerifyResult>({ status: "idle" });

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
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <Link href="/" className="absolute top-6 left-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
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
          <Link href="/" className="inline-flex items-center justify-center mb-6">
            <span className="flex h-3 w-3 rounded-full bg-primary mr-3 shadow-[0_0_10px_rgba(8,145,178,0.5)]" />
            <span className="text-xl font-bold tracking-widest text-foreground">CYNOVA.LIFE</span>
          </Link>
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">{t.verify.title}</h1>
          <p className="text-muted-foreground text-sm leading-relaxed">{t.verify.subtitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
          <Input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder={t.verify.placeholder}
            className="h-12 bg-card border-border/50 focus-visible:ring-primary font-mono text-sm"
            disabled={result.status === "loading"}
          />
          <Button
            type="submit"
            className="h-12 px-4 bg-primary text-primary-foreground hover:bg-primary/90 flex-shrink-0"
            disabled={result.status === "loading" || !code.trim()}
          >
            {result.status === "loading" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          </Button>
        </form>

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
                  <p className="font-bold text-emerald-800 text-lg leading-tight">{t.verify.validTitle}</p>
                  <p className="text-emerald-600 text-sm">{t.verify.validSubtitle}</p>
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
                  <div key={label} className="flex justify-between text-sm">
                    <span className="text-emerald-700 font-medium">{label}</span>
                    <span className="text-emerald-900 font-semibold text-right ml-4">{value}</span>
                  </div>
                ))}
              </div>
              <button onClick={handleReset} className="mt-5 text-xs text-emerald-600 hover:text-emerald-800 underline underline-offset-2 transition-colors cursor-pointer bg-transparent border-none p-0">
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
              className="bg-red-50 border border-red-200 rounded-2xl p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <XCircle className="w-9 h-9 text-red-500 flex-shrink-0" />
                <div>
                  <p className="font-bold text-red-800 text-lg leading-tight">{t.verify.invalidTitle}</p>
                  <p className="text-red-600 text-sm">{t.verify.invalidSubtitle}</p>
                </div>
              </div>
              <p className="text-red-600 text-sm">
                <a href="mailto:mustafassadriwala548@gmail.com" className="font-semibold underline underline-offset-2">mustafassadriwala548@gmail.com</a>
              </p>
              <button onClick={handleReset} className="mt-4 text-xs text-red-500 hover:text-red-700 underline underline-offset-2 transition-colors cursor-pointer bg-transparent border-none p-0">
                {t.verify.tryAgain}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <p className="text-center text-xs text-muted-foreground mt-8">
          {t.verify.poweredBy}{" "}
          <a href="mailto:mustafassadriwala548@gmail.com" className="text-primary hover:underline">mustafassadriwala548@gmail.com</a>
        </p>
      </motion.div>
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
