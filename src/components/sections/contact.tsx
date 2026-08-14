"use client";

import { useState, type FormEvent } from "react";
import { ChevronDown } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { translations } from "@/lib/translations";

export function Contact() {
  const { language } = useLanguage();
  const t = translations[language].contact;

  const [email, setEmail] = useState("");
  const [interest, setInterest] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Interest options are language-specific strings; drop a stale selection
  // if the language changes mid-form. Adjusted during render (React's
  // recommended pattern for this) rather than in an effect, so it takes
  // effect in the same render instead of causing an extra one.
  const [interestLanguage, setInterestLanguage] = useState(language);
  if (language !== interestLanguage) {
    setInterestLanguage(language);
    setInterest("");
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email || !interest) return;
    setSubmitted(true);
  }

  return (
    <section
      id="contact"
      className="relative px-6 pt-8 pb-24 md:pt-12 md:pb-32"
    >
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-4xl font-light tracking-tight text-neutral-900 sm:text-5xl">
          {t.headingPlain}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-600 via-neutral-900 to-cyan-600">
            {t.headingHighlight}
          </span>
        </h2>
        <p className="mt-5 text-base leading-relaxed text-neutral-500">
          {t.subtitle}
        </p>

        {submitted ? (
          <div className="mt-10 rounded-2xl border border-teal-200 bg-teal-50 px-6 py-5 text-sm text-teal-800">
            {t.confirmationPrefix} <span className="font-medium">{email}</span>{" "}
            {t.confirmationMiddle} {interest.toLowerCase()}.
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mt-10 flex flex-col gap-3 sm:flex-row"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.emailPlaceholder}
              aria-label={t.emailLabel}
              className="h-12 flex-1 rounded-full border border-neutral-200 bg-white px-5 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors focus:border-teal-500"
            />

            <div className="relative">
              <select
                value={interest}
                onChange={(e) => setInterest(e.target.value)}
                required
                aria-label={t.interestLabel}
                className="h-12 w-full appearance-none rounded-full border border-neutral-200 bg-white px-5 pr-10 text-sm text-neutral-900 outline-none transition-colors focus:border-teal-500 sm:w-56"
              >
                <option value="" disabled>
                  {t.interestPlaceholder}
                </option>
                {t.interests.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
            </div>

            <button
              type="submit"
              className="h-12 shrink-0 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 px-7 text-sm font-medium text-white shadow-[0_8px_20px_rgba(13,148,136,0.25)] transition hover:from-teal-400 hover:to-cyan-400"
            >
              {t.submit}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
