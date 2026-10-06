"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
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

// No more "how many guests" number field — just a single yes/no toggle for
// one optional companion (the hard cap is 1 registrant + 1 companion, see
// MAX_GUEST_COUNT in rsvp-server.ts). Ticking it on is what reveals the
// companion's fields; only their name is required, phone is optional.
export function GuestFieldsEditor({ idPrefix, guestCount, guests, onGuestCountChange, onGuestChange, t }: Props) {
  const hasCompanion = guestCount >= 2;
  const companion = guests[0];

  return (
    <>
      <button
        type="button"
        id={`${idPrefix}-bring-companion`}
        onClick={() => onGuestCountChange(hasCompanion ? 1 : 2)}
        aria-pressed={hasCompanion}
        className={cn(
          "flex w-full items-center justify-between rounded-2xl border px-5 py-4 text-left transition-colors",
          hasCompanion ? "border-teal-500 bg-teal-50" : "border-neutral-200 bg-white hover:border-neutral-300",
        )}
      >
        <span className="text-sm font-medium text-neutral-900">{t.bringCompanionLabel}</span>
        <span
          className={cn(
            "flex size-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
            hasCompanion ? "border-teal-500 bg-teal-500" : "border-neutral-300 bg-white",
          )}
        >
          {hasCompanion && <Check className="size-3.5 text-white" strokeWidth={3} />}
        </span>
      </button>

      {hasCompanion && companion && (
        <div className="rounded-2xl border border-neutral-200 bg-white p-4">
          <div className="flex flex-col gap-3">
            <input
              type="text"
              required
              value={companion.name}
              onChange={(e) => onGuestChange(0, "name", e.target.value)}
              placeholder={t.companionNamePlaceholder}
              className="h-12 w-full rounded-full border border-neutral-200 bg-white px-5 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors focus:border-teal-500"
            />
            <div className="flex gap-2">
              <select
                value={companion.countryCode}
                onChange={(e) => onGuestChange(0, "countryCode", e.target.value)}
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
                value={companion.phone}
                onChange={(e) => onGuestChange(0, "phone", e.target.value)}
                placeholder={t.companionPhonePlaceholder}
                className="h-12 flex-1 rounded-full border border-neutral-200 bg-white px-5 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors focus:border-teal-500"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
