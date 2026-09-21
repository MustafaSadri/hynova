"use client";

import { useState, type FormEvent } from "react";
import { Loader2, Search } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { translations } from "@/lib/translations";

type Step = "closed" | "email" | "otp" | "result" | "not-found";

interface RegistrationResult {
  fullName: string;
  email: string;
  phone: string;
  guestCount: number;
  guests: { name: string; phone: string }[];
  status: "registered" | "contacting" | "confirmed";
}

const STATUS_LABEL_KEY = {
  registered: "checkStatusRegistered",
  contacting: "checkStatusContacting",
  confirmed: "checkStatusConfirmed",
} as const;

export function CheckRegistration() {
  const { language } = useLanguage();
  const t = translations[language].rsvp;

  const [step, setStep] = useState<Step>("closed");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<RegistrationResult | null>(null);

  async function requestCode(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/rsvp/check/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(t.checkError);
        return;
      }
      if (!data.found) {
        setStep("not-found");
        return;
      }
      setStep("otp");
    } catch {
      setError(t.checkError);
    } finally {
      setBusy(false);
    }
  }

  async function verifyCode(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/rsvp/check/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), otp: otp.trim() }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(t.checkInvalidOtp);
        return;
      }
      setResult(data.registration);
      setStep("result");
    } catch {
      setError(t.checkError);
    } finally {
      setBusy(false);
    }
  }

  function reset() {
    setStep("closed");
    setEmail("");
    setOtp("");
    setError(null);
    setResult(null);
  }

  if (step === "closed") {
    return (
      <button
        type="button"
        onClick={() => setStep("email")}
        className="mx-auto flex items-center gap-1.5 text-sm text-neutral-500 underline-offset-4 hover:text-teal-600 hover:underline"
      >
        <Search className="size-4" />
        {t.checkToggle}
      </button>
    );
  }

  return (
    <div className="mx-auto mt-4 w-full max-w-sm rounded-2xl border border-neutral-200 bg-white p-5 text-left">
      {step === "email" && (
        <form onSubmit={requestCode} className="flex flex-col gap-3">
          <p className="text-sm font-medium text-neutral-900">{t.checkEmailPrompt}</p>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t.emailPlaceholder}
            className="h-11 w-full rounded-full border border-neutral-200 px-4 text-sm outline-none focus:border-teal-500"
          />
          {error && <p className="text-xs text-red-600">{error}</p>}
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={busy}
              className="h-10 flex-1 rounded-full bg-neutral-900 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50"
            >
              {busy ? <Loader2 className="mx-auto size-4 animate-spin" /> : t.checkSendCode}
            </button>
            <button
              type="button"
              onClick={reset}
              className="h-10 rounded-full border border-neutral-200 px-4 text-sm text-neutral-600 hover:bg-neutral-50"
            >
              {t.checkCancel}
            </button>
          </div>
        </form>
      )}

      {step === "not-found" && (
        <div className="flex flex-col gap-3 text-center">
          <p className="text-sm text-neutral-600">{t.checkNotFound}</p>
          <button
            type="button"
            onClick={reset}
            className="mx-auto text-sm text-teal-600 underline-offset-4 hover:underline"
          >
            {t.checkCancel}
          </button>
        </div>
      )}

      {step === "otp" && (
        <form onSubmit={verifyCode} className="flex flex-col gap-3">
          <p className="text-sm font-medium text-neutral-900">{t.checkOtpPrompt}</p>
          <input
            type="text"
            required
            inputMode="numeric"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            placeholder="000000"
            className="h-11 w-full rounded-full border border-neutral-200 px-4 text-center text-lg tracking-[0.3em] outline-none focus:border-teal-500"
          />
          {error && <p className="text-xs text-red-600">{error}</p>}
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={busy}
              className="h-10 flex-1 rounded-full bg-neutral-900 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50"
            >
              {busy ? <Loader2 className="mx-auto size-4 animate-spin" /> : t.checkVerify}
            </button>
            <button
              type="button"
              onClick={reset}
              className="h-10 rounded-full border border-neutral-200 px-4 text-sm text-neutral-600 hover:bg-neutral-50"
            >
              {t.checkCancel}
            </button>
          </div>
        </form>
      )}

      {step === "result" && result && (
        <div className="flex flex-col gap-2 text-sm">
          <p className="font-medium text-neutral-900">{result.fullName}</p>
          <p className="text-neutral-500">{result.email}</p>
          <p className="text-neutral-500">{result.phone}</p>
          <p className="mt-1">
            <span className="text-neutral-400">{t.checkGuestCountLabel}:</span>{" "}
            <span className="font-medium text-neutral-900">{result.guestCount}</span>
          </p>
          <p>
            <span className="text-neutral-400">{t.checkStatusLabel}:</span>{" "}
            <span className="font-medium text-teal-700">
              {t[STATUS_LABEL_KEY[result.status]]}
            </span>
          </p>
          <button
            type="button"
            onClick={reset}
            className="mt-2 h-10 rounded-full border border-neutral-200 text-sm text-neutral-600 hover:bg-neutral-50"
          >
            {t.checkCancel}
          </button>
        </div>
      )}
    </div>
  );
}
