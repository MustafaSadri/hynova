export const EVENT_REGISTRATIONS_TABLE = "event_registrations";

// The event this build is for. Bump this (and re-point the QR/link) when
// setting up a future event, without touching old registrations.
export const CURRENT_EVENT_SLUG = "moscow-private-event";

export interface Guest {
  name: string;
  phone: string;
}

export const REGISTRATION_STATUSES = ["registered", "contacting", "confirmed"] as const;
export type RegistrationStatus = (typeof REGISTRATION_STATUSES)[number];

export function isRegistrationStatus(value: string): value is RegistrationStatus {
  return (REGISTRATION_STATUSES as readonly string[]).includes(value);
}

export interface EventRegistrationRow {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  guest_count: number;
  guests: Guest[];
  status: RegistrationStatus;
  event_slug: string;
  created_at: string;
  updated_at: string;
}

export function normalizeEmail(raw: string): string {
  return raw.trim().toLowerCase();
}
