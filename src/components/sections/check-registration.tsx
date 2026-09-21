"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Loader2, Search } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { translations } from "@/lib/translations";
import { COUNTRY_CODES, DEFAULT_COUNTRY_CODE } from "@/lib/countries";
import { resizeGuestFields, splitPhone, type GuestField } from "@/lib/guest-utils";
import { GuestFieldsEditor } from "@/components/sections/guest-fields-editor";

type Step = "closed" | "email" | "otp" | "result" | "edit" | "not-found";

interface RegistrationResult {
  fullName: string;
  email: string;
  phone: string;
  guestCount: number;
  guests: { name: string; phone: string }[];
  status: "registered" | "contacting" | "confirmed" | "cancelled";
}

const STATUS_LABEL_KEY = {
  registered: "checkStatusRegistered",
  contacting: "checkStatusContacting",
  confirmed: "checkStatusConfirmed",
  cancelled: "checkStatusCancelled",
} as const;

export function CheckRegistration({
  trigger,
}: {
  trigger?: { email: string; nonce: number } | null;
}) {
  const { language } = useLanguage();
  const t = translations[language].rsvp;

  const [step, setStep] = useState<Step>("closed");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<RegistrationResult | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  // Edit-mode fields
  const [editName, setEditName] = useState("");
  const [editCountryCode, setEditCountryCode] = useState(DEFAULT_COUNTRY_CODE);
  const [editPhone, setEditPhone] = useState("");
  const [editGuestCount, setEditGuestCount] = useState(1);
  const [editGuests, setEditGuests] = useState<GuestField[]>([]);

  async function requestCodeFor(targetEmail: string) {
    setEmail(targetEmail);
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/rsvp/check/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: targetEmail }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(t.checkError);
        setStep("email");
        return;
      }
      if (!data.found) {
        setStep("not-found");
        return;
      }
      setStep("otp");
    } catch {
      setError(t.checkError);
      setStep("email");
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    if (!trigger) return;
    // Standard "fetch on prop change" effect (React's own docs pattern for
    // this) — requestCodeFor sets loading state as its first step, which
    // this lint rule flags on any effect-triggered async call regardless.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void requestCodeFor(trigger.email);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger?.nonce]);

  async function requestCode(e: FormEvent) {
    e.preventDefault();
    await requestCodeFor(email.trim());
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
      setToken(data.token);
      setStep("result");
    } catch {
      setError(t.checkError);
    } finally {
      setBusy(false);
    }
  }

  function openEdit() {
    if (!result) return;
    setEditName(result.fullName);
    const split = splitPhone(result.phone);
    setEditCountryCode(split.countryCode);
    setEditPhone(split.phone);
    setEditGuestCount(result.guestCount);
    setEditGuests(
      result.guests.map((g) => {
        const gs = splitPhone(g.phone);
        return { name: g.name, countryCode: gs.countryCode, phone: gs.phone };
      }),
    );
    setActionMessage(null);
    setStep("edit");
  }

  async function saveEdit(e: FormEvent) {
    e.preventDefault();
    if (!token) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/rsvp/edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          fullName: editName.trim(),
          phone: `${editCountryCode} ${editPhone.trim()}`,
          guestCount: editGuestCount,
          guests: editGuests.map((g) => ({
            name: g.name.trim(),
            phone: `${g.countryCode} ${g.phone.trim()}`,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(t.checkError);
        return;
      }
      setResult((prev) =>
        prev
          ? {
              ...prev,
              fullName: data.registration.fullName,
              phone: data.registration.phone,
              guestCount: data.registration.guestCount,
              guests: data.registration.guests,
            }
          : prev,
      );
      setActionMessage(t.checkEditSaved);
      setStep("result");
    } catch {
      setError(t.checkError);
    } finally {
      setBusy(false);
    }
  }

  async function cancelRegistration() {
    if (!token) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/rsvp/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(t.checkError);
        return;
      }
      setResult((prev) => (prev ? { ...prev, status: "cancelled" } : prev));
      setActionMessage(t.checkCancelled);
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
    setToken(null);
    setActionMessage(null);
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
            <span
              className={`font-medium ${result.status === "cancelled" ? "text-red-600" : "text-teal-700"}`}
            >
              {t[STATUS_LABEL_KEY[result.status]]}
            </span>
          </p>
          {actionMessage && <p className="text-xs text-teal-700">{actionMessage}</p>}
          {error && <p className="text-xs text-red-600">{error}</p>}

          {result.status !== "cancelled" && (
            <div className="mt-2 flex gap-2">
              <button
                type="button"
                onClick={openEdit}
                className="h-10 flex-1 rounded-full border border-neutral-200 text-sm text-neutral-700 hover:bg-neutral-50"
              >
                {t.checkEdit}
              </button>
              <button
                type="button"
                onClick={cancelRegistration}
                disabled={busy}
                className="h-10 flex-1 rounded-full border border-red-200 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
              >
                {busy ? <Loader2 className="mx-auto size-4 animate-spin" /> : t.checkCancelRegistration}
              </button>
            </div>
          )}
          <button
            type="button"
            onClick={reset}
            className="mt-2 h-10 rounded-full border border-neutral-200 text-sm text-neutral-600 hover:bg-neutral-50"
          >
            {t.checkClose}
          </button>
        </div>
      )}

      {step === "edit" && (
        <form onSubmit={saveEdit} className="flex flex-col gap-3">
          <p className="text-sm font-medium text-neutral-900">{t.checkEdit}</p>
          <input
            type="text"
            required
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            placeholder={t.namePlaceholder}
            className="h-11 w-full rounded-full border border-neutral-200 px-4 text-sm outline-none focus:border-teal-500"
          />
          <div className="flex gap-2">
            <select
              value={editCountryCode}
              onChange={(e) => setEditCountryCode(e.target.value)}
              aria-label={t.countryCodeLabel}
              className="h-11 w-24 shrink-0 rounded-full border border-neutral-200 px-2 text-sm outline-none focus:border-teal-500"
            >
              {COUNTRY_CODES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code}
                </option>
              ))}
            </select>
            <input
              type="tel"
              required
              value={editPhone}
              onChange={(e) => setEditPhone(e.target.value)}
              placeholder={t.phonePlaceholder}
              className="h-11 flex-1 rounded-full border border-neutral-200 px-4 text-sm outline-none focus:border-teal-500"
            />
          </div>

          <GuestFieldsEditor
            idPrefix="check-edit"
            guestCount={editGuestCount}
            guests={editGuests}
            onGuestCountChange={(n) => {
              setEditGuestCount(Math.min(20, Math.max(1, n)));
              setEditGuests((prev) => resizeGuestFields(prev, n));
            }}
            onGuestChange={(index, field, value) =>
              setEditGuests((prev) =>
                prev.map((g, i) => (i === index ? { ...g, [field]: value } : g)),
              )
            }
            t={t}
          />

          {error && <p className="text-xs text-red-600">{error}</p>}
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={busy}
              className="h-10 flex-1 rounded-full bg-neutral-900 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50"
            >
              {busy ? <Loader2 className="mx-auto size-4 animate-spin" /> : t.checkSave}
            </button>
            <button
              type="button"
              onClick={() => setStep("result")}
              className="h-10 rounded-full border border-neutral-200 px-4 text-sm text-neutral-600 hover:bg-neutral-50"
            >
              {t.checkCancel}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
