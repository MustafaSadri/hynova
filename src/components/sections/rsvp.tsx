"use client";

import { useState, type FormEvent } from "react";
import { CalendarClock, CheckCircle2, Loader2, MapPin, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { useLanguage } from "@/lib/language-context";
import { translations } from "@/lib/translations";

type Status = "idle" | "submitting" | "submitted" | "error";

export function Rsvp() {
  const { language } = useLanguage();
  const t = translations[language].rsvp;

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  const canSubmit = status !== "submitting" && fullName.trim().length > 0 && email.trim().length > 0;

  function reset() {
    setFullName("");
    setEmail("");
    setPhone("");
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
          phone: phone.trim() || undefined,
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
                <input
                  id="rsvp-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={t.phonePlaceholder}
                  autoComplete="tel"
                  className="mt-2 h-14 w-full rounded-full border border-neutral-200 bg-white px-6 text-base text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors focus:border-teal-500"
                />
              </div>

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
