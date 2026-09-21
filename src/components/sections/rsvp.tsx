"use client";

import { useState, type FormEvent } from "react";
import { CalendarClock, CheckCircle2, Loader2, MapPin, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { useLanguage } from "@/lib/language-context";
import { translations } from "@/lib/translations";
import { COUNTRY_CODES, DEFAULT_COUNTRY_CODE } from "@/lib/countries";

type Status = "idle" | "submitting" | "submitted" | "error";

interface GuestField {
  name: string;
  countryCode: string;
  phone: string;
}

function emptyGuest(): GuestField {
  return { name: "", countryCode: DEFAULT_COUNTRY_CODE, phone: "" };
}

export function Rsvp() {
  const { language } = useLanguage();
  const t = translations[language].rsvp;

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [countryCode, setCountryCode] = useState(DEFAULT_COUNTRY_CODE);
  const [phone, setPhone] = useState("");
  const [guestCount, setGuestCount] = useState(1);
  const [guests, setGuests] = useState<GuestField[]>([]);
  const [status, setStatus] = useState<Status>("idle");

  function setGuestCountAndResize(n: number) {
    const clamped = Math.min(20, Math.max(1, n));
    setGuestCount(clamped);
    setGuests((prev) => {
      const needed = clamped - 1;
      if (needed === prev.length) return prev;
      if (needed < prev.length) return prev.slice(0, needed);
      return [...prev, ...Array.from({ length: needed - prev.length }, emptyGuest)];
    });
  }

  function updateGuest(index: number, field: keyof GuestField, value: string) {
    setGuests((prev) =>
      prev.map((g, i) => (i === index ? { ...g, [field]: value } : g)),
    );
  }

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
    setStatus("idle");
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setStatus("submitting");

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
        setStatus("error");
        return;
      }
      setStatus("submitted");
    } catch {
      setStatus("error");
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
            <p className="text-sm font-medium text-neutral-900">{t.eventName}</p>
            <div className="mt-3 flex items-start gap-2 text-sm text-neutral-600">
              <CalendarClock className="mt-0.5 size-4 shrink-0 text-teal-600" />
              <div>
                <p className="text-xs tracking-wide text-neutral-400 uppercase">
                  {t.eventDateLabel}
                </p>
                <p>{t.eventDate}</p>
              </div>
            </div>
            <div className="mt-3 flex items-start gap-2 text-sm text-neutral-600">
              <MapPin className="mt-0.5 size-4 shrink-0 text-teal-600" />
              <div>
                <p className="text-xs tracking-wide text-neutral-400 uppercase">
                  {t.eventVenueLabel}
                </p>
                <p>{t.eventVenue}</p>
                <p>{t.eventAddress}</p>
              </div>
            </div>
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

              <div>
                <label
                  htmlFor="rsvp-guest-count"
                  className="text-xs font-medium uppercase tracking-widest text-neutral-400"
                >
                  {t.guestCountLabel}
                </label>
                <input
                  id="rsvp-guest-count"
                  type="number"
                  min={1}
                  max={20}
                  required
                  value={guestCount}
                  onChange={(e) => setGuestCountAndResize(Number(e.target.value))}
                  className="mt-2 h-14 w-full rounded-full border border-neutral-200 bg-white px-6 text-base text-neutral-900 outline-none transition-colors focus:border-teal-500"
                />
                <p className="mt-2 text-xs text-neutral-400">{t.guestCountHelper}</p>
              </div>

              {guests.length > 0 && (
                <div className="flex flex-col gap-4">
                  <p className="text-xs font-medium uppercase tracking-widest text-neutral-400">
                    {t.additionalGuestsHeading}
                  </p>
                  {guests.map((guest, index) => (
                    <div
                      key={index}
                      className="rounded-2xl border border-neutral-200 bg-white p-4"
                    >
                      <p className="text-xs font-medium tracking-wide text-neutral-500">
                        {t.guestLabel.replace("{n}", String(index + 2))}
                      </p>
                      <div className="mt-3 flex flex-col gap-3">
                        <input
                          type="text"
                          required
                          value={guest.name}
                          onChange={(e) => updateGuest(index, "name", e.target.value)}
                          placeholder={t.guestNamePlaceholder}
                          className="h-12 w-full rounded-full border border-neutral-200 bg-white px-5 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors focus:border-teal-500"
                        />
                        <div className="flex gap-2">
                          <select
                            value={guest.countryCode}
                            onChange={(e) => updateGuest(index, "countryCode", e.target.value)}
                            aria-label={t.countryCodeLabel}
                            className="h-12 w-24 shrink-0 rounded-full border border-neutral-200 bg-white px-3 text-sm text-neutral-900 outline-none transition-colors focus:border-teal-500"
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
                            value={guest.phone}
                            onChange={(e) => updateGuest(index, "phone", e.target.value)}
                            placeholder={t.guestPhonePlaceholder}
                            className="h-12 flex-1 rounded-full border border-neutral-200 bg-white px-5 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors focus:border-teal-500"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {status === "error" && (
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
      </div>
    </section>
  );
}
