// Common dial codes for the RSVP phone fields. Russia first since the
// event is in Moscow, then the company's UAE base, then other common
// codes for an international business-partner audience.
export const COUNTRY_CODES = [
  { code: "+7", label: "Russia (+7)" },
  { code: "+971", label: "UAE (+971)" },
  { code: "+1", label: "US/Canada (+1)" },
  { code: "+44", label: "UK (+44)" },
  { code: "+49", label: "Germany (+49)" },
  { code: "+33", label: "France (+33)" },
  { code: "+966", label: "Saudi Arabia (+966)" },
  { code: "+90", label: "Turkey (+90)" },
  { code: "+380", label: "Ukraine (+380)" },
  { code: "+86", label: "China (+86)" },
  { code: "+91", label: "India (+91)" },
  { code: "+81", label: "Japan (+81)" },
  { code: "+82", label: "South Korea (+82)" },
  { code: "+65", label: "Singapore (+65)" },
  { code: "+61", label: "Australia (+61)" },
] as const;

export const DEFAULT_COUNTRY_CODE = "+7";
