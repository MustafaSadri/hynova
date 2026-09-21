import { COUNTRY_CODES, DEFAULT_COUNTRY_CODE } from "@/lib/countries";

export interface GuestField {
  name: string;
  countryCode: string;
  phone: string;
}

export function emptyGuestField(): GuestField {
  return { name: "", countryCode: DEFAULT_COUNTRY_CODE, phone: "" };
}

// Resizes a guest-fields array to match "guestCount - 1" (the primary
// registrant is guest 1 and isn't in this array), preserving already-typed
// entries when the count grows or shrinks.
export function resizeGuestFields(
  guests: GuestField[],
  guestCount: number,
  maxGuestCount = 20,
): GuestField[] {
  const needed = Math.max(0, Math.min(maxGuestCount, Math.max(1, guestCount)) - 1);
  if (needed === guests.length) return guests;
  if (needed < guests.length) return guests.slice(0, needed);
  return [...guests, ...Array.from({ length: needed - guests.length }, emptyGuestField)];
}

// Splits a stored "+7 900 123-45-67" style phone back into the country
// code and local number, for re-populating the two-part editor. Falls back
// to the default code with the whole string as the local part if no known
// code prefixes it (still fully editable, just not pre-split).
export function splitPhone(fullPhone: string): { countryCode: string; phone: string } {
  const sorted = [...COUNTRY_CODES].sort((a, b) => b.code.length - a.code.length);
  for (const c of sorted) {
    if (fullPhone.startsWith(c.code)) {
      return { countryCode: c.code, phone: fullPhone.slice(c.code.length).trim() };
    }
  }
  return { countryCode: DEFAULT_COUNTRY_CODE, phone: fullPhone };
}
