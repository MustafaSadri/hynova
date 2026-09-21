import { NextResponse } from "next/server";
import { getSql } from "@/lib/db";
import { CURRENT_EVENT_SLUG, normalizeEmail, type EventRegistrationRow } from "@/lib/rsvp";
import {
  EDIT_TOKEN_TTL_MINUTES,
  EMAIL_PATTERN,
  ensureTokensTable,
  generateToken,
} from "@/lib/rsvp-server";

const OTP_PATTERN = /^\d{6}$/;

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_request" }, { status: 400 });
  }

  const { email, otp } = (body ?? {}) as Record<string, unknown>;
  if (typeof email !== "string" || !EMAIL_PATTERN.test(email)) {
    return NextResponse.json({ ok: false, error: "invalid_email" }, { status: 400 });
  }
  if (typeof otp !== "string" || !OTP_PATTERN.test(otp)) {
    return NextResponse.json({ ok: false, error: "invalid_otp" }, { status: 400 });
  }
  const normalizedEmail = normalizeEmail(email);

  try {
    const sql = getSql();
    await ensureTokensTable(sql);

    const otpRows = (await sql`
      SELECT otp, expires_at FROM event_registration_otps
      WHERE email = ${normalizedEmail} AND event_slug = ${CURRENT_EVENT_SLUG}
    `) as { otp: string; expires_at: string }[];

    const stored = otpRows[0];
    const expired = !stored || new Date(stored.expires_at) < new Date();
    if (!stored || stored.otp !== otp || expired) {
      return NextResponse.json({ ok: false, error: "invalid_otp" }, { status: 400 });
    }

    // Single-use — remove it once it's been spent successfully.
    await sql`
      DELETE FROM event_registration_otps
      WHERE email = ${normalizedEmail} AND event_slug = ${CURRENT_EVENT_SLUG}
    `;

    const rows = (await sql`
      SELECT * FROM event_registrations
      WHERE email = ${normalizedEmail} AND event_slug = ${CURRENT_EVENT_SLUG}
    `) as EventRegistrationRow[];

    if (rows.length === 0) {
      return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
    }

    // Issues a short-lived token so the guest can edit or cancel their
    // registration in this session without re-verifying by email again.
    const token = generateToken();
    const tokenExpiresAt = new Date(Date.now() + EDIT_TOKEN_TTL_MINUTES * 60 * 1000).toISOString();
    await sql`
      INSERT INTO event_registration_tokens (token, email, event_slug, expires_at)
      VALUES (${token}, ${normalizedEmail}, ${CURRENT_EVENT_SLUG}, ${tokenExpiresAt})
    `;

    const r = rows[0];
    return NextResponse.json({
      ok: true,
      token,
      registration: {
        fullName: r.full_name,
        email: r.email,
        phone: r.phone,
        guestCount: r.guest_count,
        guests: r.guests,
        status: r.status,
        registeredAt: r.created_at,
      },
    });
  } catch (err) {
    console.error("rsvp check verify: db error:", err);
    return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 });
  }
}
