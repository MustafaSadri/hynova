"use client";

import { useState } from "react";
import { COUNTRY_CODES } from "@/lib/countries";
import type { GuestField } from "@/lib/guest-utils";
import type { translations } from "@/lib/translations";

// Widened to plain strings — the two locales' rsvp objects share these
// keys but TypeScript infers each locale's literal string values, which
// aren't mutually assignable (e.g. "Register" vs "Зарегистрироваться").
type RsvpCopy = { [K in keyof (typeof translations)["en"]["rsvp"]]: string };

interface Props {
  idPrefix: string;
  guestCount: number;
  guests: GuestField[];
  onGuestCountChange: (n: number) => void;
  onGuestChange: (index: number, field: keyof GuestField, value: string) => void;
  t: RsvpCopy;
}

export function GuestFieldsEditor({
  idPrefix,
  guestCount,
  guests,
  onGuestCountChange,
  onGuestChange,
  t,
}: Props) {
  // Mirrors guestCount as a free-typed string rather than binding the input
  // directly to the number — binding directly meant every keystroke (even
  // backspacing to empty) got clamped straight back to 1 before the next
  // digit landed, so typing "2" after clearing the field produced "12".
  // This only clamps (and propagates) on blur or once the typed value is
  // actually valid, so the field can sit empty mid-edit.
  const [rawGuestCount, setRawGuestCount] = useState(String(guestCount));

  function handleGuestCountChange(value: string) {
    setRawGuestCount(value);
    const parsed = Number(value);
    if (value.trim() !== "" && Number.isInteger(parsed) && parsed >= 1 && parsed <= 20) {
      onGuestCountChange(parsed);
    }
  }

  function handleGuestCountBlur() {
    const parsed = Number(rawGuestCount);
    if (rawGuestCount.trim() === "" || !Number.isInteger(parsed) || parsed < 1 || parsed > 20) {
      setRawGuestCount(String(guestCount));
    }
  }

  return (
    <>
      <div>
        <label
          htmlFor={`${idPrefix}-guest-count`}
          className="text-xs font-medium uppercase tracking-widest text-neutral-400"
        >
          {t.guestCountLabel}
        </label>
        <input
          id={`${idPrefix}-guest-count`}
          type="number"
          min={1}
          max={20}
          required
          value={rawGuestCount}
          onChange={(e) => handleGuestCountChange(e.target.value)}
          onBlur={handleGuestCountBlur}
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
            <div key={index} className="rounded-2xl border border-neutral-200 bg-white p-4">
              <p className="text-xs font-medium tracking-wide text-neutral-500">
                {t.guestLabel.replace("{n}", String(index + 2))}
              </p>
              <div className="mt-3 flex flex-col gap-3">
                <input
                  type="text"
                  required
                  value={guest.name}
                  onChange={(e) => onGuestChange(index, "name", e.target.value)}
                  placeholder={t.guestNamePlaceholder}
                  className="h-12 w-full rounded-full border border-neutral-200 bg-white px-5 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors focus:border-teal-500"
                />
                <div className="flex gap-2">
                  <select
                    value={guest.countryCode}
                    onChange={(e) => onGuestChange(index, "countryCode", e.target.value)}
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
                    onChange={(e) => onGuestChange(index, "phone", e.target.value)}
                    placeholder={t.guestPhonePlaceholder}
                    className="h-12 flex-1 rounded-full border border-neutral-200 bg-white px-5 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors focus:border-teal-500"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
