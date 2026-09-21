"use client";

import { useState, type FormEvent } from "react";
import { CalendarClock, CheckCircle2, Loader2, MapPin, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { useLanguage } from "@/lib/language-context";
import { translations } from "@/lib/translations";
import { COUNTRY_CODES, DEFAULT_COUNTRY_CODE } from "@/lib/countries";
import { resizeGuestFields, type GuestField } from "@/lib/guest-utils";
import type { EventDetailsRow } from "@/lib/event-details";
import { CheckRegistration } from "@/components/sections/check-registration";
import { GuestFieldsEditor } from "@/components/sections/guest-fields-editor";

type Status = "idle" | "submitting" | "otp" | "verifying" | "submitted" | "error";
type ErrorType = "already_registered" | "invalid_otp" | "generic" | null;

export function Rsvp({ eventDetails }: { eventDetails: EventDetailsRow | null }) {
  const { language } = useLanguage();
  const t = translations[language].rsvp;

  const displayEventName = eventDetails?.event_name || t.eventName;
  const displayEventDate = eventDetails?.event_date || t.eventDate;
  const displayVenueName = eventDetails?.venue_name || t.eventVenue;
  const displayVenueAddress = eventDetails?.venue_address || t.eventAddress;
  const venuePhotos = eventDetails?.venue_photos ?? [];

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [countryCode, setCountryCode] = useState(DEFAULT_COUNTRY_CODE);
  const [phone, setPhone] = useState("");
  const [guestCount, setGuestCount] = useState(1);
  const [guests, setGuests] = useState<GuestField[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [errorType, setErrorType] = useState<ErrorType>(null);
  const [otp, setOtp] = useState("");
  const [checkTrigger, setCheckTrigger] = useState<{ email: string; nonce: number } | null>(null);

  const additionalGuestsValid = guests.every(
    (g) => g.name.trim().length > 0 && g.phone.trim().length > 0,
  );
  const canSubmit =
    status !== "submitting" &&
    fullName.trim().length > 0 &&
    email.trim().length > 0 &&
    phone.trim().length > 0 &&
    additionalGuestsValid;

  function reset() {
    setFullName("");
    setEmail("");
    setCountryCode(DEFAULT_COUNTRY_CODE);
    setPhone("");
    setGuestCount(1);
    setGuests([]);
    setOtp("");
    setErrorType(null);
    setStatus("idle");
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setStatus("submitting");
    setErrorType(null);

    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: fullName.trim(),
          email: email.trim(),
          phone: `${countryCode} ${phone.trim()}`,
          guestCount,
          guests: guests.map((g) => ({
            name: g.name.trim(),
            phone: `${g.countryCode} ${g.phone.trim()}`,
          })),
        }),
      });
      const data = await res.json();

      if (!res.ok || !data.ok) {
        if (data.error === "already_registered") {
          setErrorType("already_registered");
          // Hands off straight into the check-status flow, pre-filled and
          // already requesting a code, instead of leaving them stuck.
          setCheckTrigger({ email: email.trim(), nonce: Date.now() });
        } else {
          setErrorType("generic");
        }
        setStatus("error");
        return;
      }
      setStatus("otp");
    } catch {
      setErrorType("generic");
      setStatus("error");
    }
  }

  async function handleVerifyOtp(e: FormEvent) {
    e.preventDefault();
    setStatus("verifying");
    setErrorType(null);

    try {
      const res = await fetch("/api/rsvp/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), otp: otp.trim() }),
      });
      const data = await res.json();

      if (!res.ok || !data.ok) {
        setErrorType("invalid_otp");
        setStatus("otp");
        return;
      }
      setStatus("submitted");
    } catch {
      setErrorType("invalid_otp");
      setStatus("otp");
    }
  }

  return (
    <section className="relative px-6 pt-32 pb-24 md:pt-40 md:pb-32">
      <div className="mx-auto max-w-xl">
        <div className="text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-teal-100 bg-teal-50 px-3 py-1 text-sm tracking-wide text-teal-700">
            <Sparkles className="size-3.5" />
            {t.eyebrow}
          </span>
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
          <div className="rounded-2xl border border-neutral-100 bg-neutral-50 p-5">
            <p className="text-sm font-medium text-neutral-900">{displayEventName}</p>
            <div className="mt-3 flex items-start gap-2 text-sm text-neutral-600">
              <CalendarClock className="mt-0.5 size-4 shrink-0 text-teal-600" />
              <div>
                <p className="text-xs tracking-wide text-neutral-400 uppercase">
                  {t.eventDateLabel}
                </p>
                <p>{displayEventDate}</p>
              </div>
            </div>
            <div className="mt-3 flex items-start gap-2 text-sm text-neutral-600">
              <MapPin className="mt-0.5 size-4 shrink-0 text-teal-600" />
              <div>
                <p className="text-xs tracking-wide text-neutral-400 uppercase">
                  {t.eventVenueLabel}
                </p>
                <p>{displayVenueName}</p>
                <p>{displayVenueAddress}</p>
              </div>
            </div>
            {venuePhotos.length > 0 && (
              <div className="mt-4 flex gap-2 overflow-x-auto">
                {venuePhotos.map((src, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={i}
                    src={src}
                    alt={`${displayVenueName} ${i + 1}`}
                    className="h-20 w-28 shrink-0 rounded-lg object-cover"
                  />
                ))}
              </div>
            )}
          </div>

          {status === "submitted" ? (
            <div className="flex flex-col items-center py-6 text-center">
              <div className="flex size-14 items-center justify-center rounded-full bg-teal-50">
                <CheckCircle2 className="size-7 text-teal-600" strokeWidth={1.5} />
              </div>
              <h2 className="mt-5 text-xl font-medium text-neutral-900">
                {t.confirmationTitle}
              </h2>
              <p className="mt-2 max-w-sm text-sm leading-relaxed text-neutral-500">
                {t.confirmationBody}
              </p>
              <p className="mt-4 text-xs text-neutral-400">{t.contactFooter}</p>
              <button
                type="button"
                onClick={reset}
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "mt-6 h-11 rounded-full border-neutral-200 px-6 text-neutral-700 hover:bg-neutral-50",
                )}
              >
                {t.confirmationReset}
              </button>
            </div>
          ) : status === "otp" || status === "verifying" ? (
            <form onSubmit={handleVerifyOtp} className="mt-6 flex flex-col gap-4">
              <p className="text-sm text-neutral-600">
                {t.registerOtpPrompt.replace("{email}", email.trim())}
              </p>
              <input
                type="text"
                required
                inputMode="numeric"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                placeholder="000000"
                className="h-14 w-full rounded-full border border-neutral-200 bg-white px-6 text-center text-lg tracking-[0.3em] text-neutral-900 outline-none transition-colors focus:border-teal-500"
              />
              {errorType === "invalid_otp" && (
                <p className="text-sm text-red-600">{t.checkInvalidOtp}</p>
              )}
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={status === "verifying"}
                  className="h-14 flex-1 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 text-base font-medium text-white shadow-[0_8px_20px_rgba(13,148,136,0.25)] transition hover:from-teal-400 hover:to-cyan-400 disabled:opacity-40"
                >
                  {status === "verifying" ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="size-4 animate-spin" />
                      {t.submitting}
                    </span>
                  ) : (
                    t.checkVerify
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setStatus("idle")}
                  className="h-14 rounded-full border border-neutral-200 px-6 text-sm text-neutral-600 hover:bg-neutral-50"
                >
                  {t.checkCancel}
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
              <div>
                <label
                  htmlFor="rsvp-name"
                  className="text-xs font-medium uppercase tracking-widest text-neutral-400"
                >
                  {t.nameLabel}
                </label>
                <input
                  id="rsvp-name"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={t.namePlaceholder}
                  autoComplete="name"
                  className="mt-2 h-14 w-full rounded-full border border-neutral-200 bg-white px-6 text-base text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors focus:border-teal-500"
                />
              </div>

              <div>
                <label
                  htmlFor="rsvp-email"
                  className="text-xs font-medium uppercase tracking-widest text-neutral-400"
                >
                  {t.emailLabel}
                </label>
                <input
                  id="rsvp-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.emailPlaceholder}
                  autoComplete="email"
                  className="mt-2 h-14 w-full rounded-full border border-neutral-200 bg-white px-6 text-base text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors focus:border-teal-500"
                />
              </div>

              <div>
                <label
                  htmlFor="rsvp-phone"
                  className="text-xs font-medium uppercase tracking-widest text-neutral-400"
                >
                  {t.phoneLabel}
                </label>
                <div className="mt-2 flex gap-2">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    aria-label={t.countryCodeLabel}
                    className="h-14 w-28 shrink-0 rounded-full border border-neutral-200 bg-white px-3 text-base text-neutral-900 outline-none transition-colors focus:border-teal-500"
                  >
                    {COUNTRY_CODES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.code}
                      </option>
                    ))}
                  </select>
                  <input
                    id="rsvp-phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={t.phonePlaceholder}
                    autoComplete="tel"
                    className="h-14 flex-1 rounded-full border border-neutral-200 bg-white px-6 text-base text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors focus:border-teal-500"
                  />
                </div>
              </div>

              <GuestFieldsEditor
                idPrefix="rsvp"
                guestCount={guestCount}
                guests={guests}
                onGuestCountChange={(n) => {
                  setGuestCount(Math.min(20, Math.max(1, n)));
                  setGuests((prev) => resizeGuestFields(prev, n));
                }}
                onGuestChange={(index, field, value) =>
                  setGuests((prev) =>
                    prev.map((g, i) => (i === index ? { ...g, [field]: value } : g)),
                  )
                }
                t={t}
              />

              {status === "error" && errorType === "already_registered" && (
                <p className="text-sm text-amber-700">{t.alreadyRegisteredBlockedMessage}</p>
              )}
              {status === "error" && errorType === "generic" && (
                <p className="text-sm text-red-600">{t.errorMessage}</p>
              )}

              <button
                type="submit"
                disabled={!canSubmit}
                className="mt-2 h-14 w-full rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 text-base font-medium text-white shadow-[0_8px_20px_rgba(13,148,136,0.25)] transition hover:from-teal-400 hover:to-cyan-400 disabled:opacity-40 disabled:shadow-none"
              >
                {status === "submitting" ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="size-4 animate-spin" />
                    {t.submitting}
                  </span>
                ) : (
                  t.submit
                )}
              </button>
            </form>
          )}
        </div>

        {status !== "submitted" && (
          <div className="mt-6 text-center">
            <CheckRegistration trigger={checkTrigger} />
          </div>
        )}
      </div>
    </section>
  );
}
