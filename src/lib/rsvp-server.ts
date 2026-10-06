import { randomBytes } from "crypto";
import type { NeonQueryFunction } from "@neondatabase/serverless";
import type { Guest } from "@/lib/rsvp";

export const MAX_FIELD_LENGTH = 300;
// 1 (the registrant) + 1 companion, max — no one can register themselves
// plus an open-ended party.
export const MAX_GUEST_COUNT = 2;
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const OTP_TTL_MINUTES = 10;
export const EDIT_TOKEN_TTL_MINUTES = 30;

type Sql = NeonQueryFunction<false, false>;

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0 && value.length <= MAX_FIELD_LENGTH;
}

// A companion's phone number is optional — only their name is required to
// identify them on the entry pass.
export function isOptionalString(value: unknown): boolean {
  return value === undefined || value === null || value === "" || isNonEmptyString(value);
}

export function generateOtp(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export function generateToken(): string {
  return randomBytes(24).toString("base64url");
}

// Separate from generateToken() even though it's the same shape — pass
// tokens and edit/cancel tokens are conceptually distinct (one identifies a
// registration for check-in indefinitely, the other is a short-lived
// self-service credential) and shouldn't be swapped by accident.
export function generatePassToken(): string {
  return randomBytes(24).toString("base64url");
}

export async function ensureRegistrationsTable(sql: Sql) {
  await sql.query(`
    CREATE TABLE IF NOT EXISTS event_registrations (
      id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      full_name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      guest_count INTEGER NOT NULL DEFAULT 1,
      guests JSONB NOT NULL DEFAULT '[]'::jsonb,
      status TEXT NOT NULL DEFAULT 'registered',
      event_slug TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      UNIQUE (event_slug, email)
    )
  `);
  // Self-healing for a table created before guest_count/guests/status existed.
  await sql.query(`ALTER TABLE event_registrations ADD COLUMN IF NOT EXISTS guest_count INTEGER NOT NULL DEFAULT 1`);
  await sql.query(`ALTER TABLE event_registrations ADD COLUMN IF NOT EXISTS guests JSONB NOT NULL DEFAULT '[]'::jsonb`);
  await sql.query(`ALTER TABLE event_registrations ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'registered'`);
  // Self-healing for the entry-pass/check-in columns added after the above.
  await sql.query(`ALTER TABLE event_registrations ADD COLUMN IF NOT EXISTS pass_token TEXT`);
  await sql.query(`ALTER TABLE event_registrations ADD COLUMN IF NOT EXISTS pass_sent_at TIMESTAMPTZ`);
  await sql.query(`ALTER TABLE event_registrations ADD COLUMN IF NOT EXISTS checkin_count INTEGER NOT NULL DEFAULT 0`);
  await sql.query(`ALTER TABLE event_registrations ADD COLUMN IF NOT EXISTS first_checked_in_at TIMESTAMPTZ`);
  await sql.query(`ALTER TABLE event_registrations ADD COLUMN IF NOT EXISTS last_checked_in_at TIMESTAMPTZ`);
  await sql.query(`ALTER TABLE event_registrations ADD COLUMN IF NOT EXISTS organization TEXT`);
  await sql.query(`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'event_registrations_pass_token_key'
      ) THEN
        ALTER TABLE event_registrations ADD CONSTRAINT event_registrations_pass_token_key UNIQUE (pass_token);
      END IF;
    END $$
  `);
}

export async function ensurePendingTable(sql: Sql) {
  await sql.query(`
    CREATE TABLE IF NOT EXISTS event_registration_pending (
      email TEXT NOT NULL,
      event_slug TEXT NOT NULL,
      payload JSONB NOT NULL,
      otp TEXT NOT NULL,
      expires_at TIMESTAMPTZ NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      PRIMARY KEY (email, event_slug)
    )
  `);
}

export async function ensureOtpTable(sql: Sql) {
  await sql.query(`
    CREATE TABLE IF NOT EXISTS event_registration_otps (
      email TEXT NOT NULL,
      event_slug TEXT NOT NULL,
      otp TEXT NOT NULL,
      expires_at TIMESTAMPTZ NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      PRIMARY KEY (email, event_slug)
    )
  `);
}

export async function ensureTokensTable(sql: Sql) {
  await sql.query(`
    CREATE TABLE IF NOT EXISTS event_registration_tokens (
      token TEXT PRIMARY KEY,
      email TEXT NOT NULL,
      event_slug TEXT NOT NULL,
      expires_at TIMESTAMPTZ NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `);
}

export interface ParsedRegistrationPayload {
  fullName: string;
  email: string;
  phone: string;
  organization: string | null;
  guestCount: number;
  guests: Guest[];
}

// Shared validation for the registration form's fields — used both when a
// brand-new registration is first submitted and when an existing one is
// edited, so the rules can't drift between the two paths.
export function parseRegistrationBody(
  body: unknown,
): { ok: true; data: ParsedRegistrationPayload } | { ok: false; error: string } {
  const { fullName, email, phone, organization, guestCount, guests } = (body ?? {}) as Record<
    string,
    unknown
  >;

  if (!isNonEmptyString(fullName)) {
    return { ok: false, error: "invalid_name" };
  }
  if (typeof email !== "string" || !EMAIL_PATTERN.test(email) || email.length > MAX_FIELD_LENGTH) {
    return { ok: false, error: "invalid_email" };
  }
  if (!isNonEmptyString(phone)) {
    return { ok: false, error: "invalid_phone" };
  }
  // Organization is optional — just who they're with, not required to register.
  if (!isOptionalString(organization)) {
    return { ok: false, error: "invalid_organization" };
  }
  if (
    typeof guestCount !== "number" ||
    !Number.isInteger(guestCount) ||
    guestCount < 1 ||
    guestCount > MAX_GUEST_COUNT
  ) {
    return { ok: false, error: "invalid_guest_count" };
  }

  const expectedGuests = guestCount - 1;
  let parsedGuests: Guest[] = [];
  if (expectedGuests > 0) {
    if (!Array.isArray(guests) || guests.length !== expectedGuests) {
      return { ok: false, error: "invalid_guests" };
    }
    for (const guest of guests) {
      if (
        typeof guest !== "object" ||
        guest === null ||
        !isNonEmptyString((guest as Record<string, unknown>).name) ||
        !isOptionalString((guest as Record<string, unknown>).phone)
      ) {
        return { ok: false, error: "invalid_guests" };
      }
    }
    parsedGuests = (guests as { name: string; phone?: string | null }[]).map((g) => ({
      name: g.name.trim(),
      phone: (g.phone ?? "").trim(),
    }));
  }

  return {
    ok: true,
    data: {
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      organization: typeof organization === "string" && organization.trim() ? organization.trim() : null,
      guestCount,
      guests: parsedGuests,
    },
  };
}
