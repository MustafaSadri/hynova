import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getSql } from "@/lib/db";
import { CURRENT_EVENT_SLUG, normalizeEmail } from "@/lib/rsvp";

const OTP_TTL_MINUTES = 10;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function generateOtp(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_request" }, { status: 400 });
  }

  const { email } = (body ?? {}) as Record<string, unknown>;
  if (typeof email !== "string" || !EMAIL_PATTERN.test(email)) {
    return NextResponse.json({ ok: false, error: "invalid_email" }, { status: 400 });
  }
  const normalizedEmail = normalizeEmail(email);

  try {
    const sql = getSql();

    const existing = (await sql`
      SELECT id FROM event_registrations
      WHERE email = ${normalizedEmail} AND event_slug = ${CURRENT_EVENT_SLUG}
    `) as { id: number }[];

    if (existing.length === 0) {
      // Not registered — say so plainly. This is a low-stakes event RSVP
      // lookup, not a sensitive account system, so there's no need to
      // obscure whether an email is registered.
      return NextResponse.json({ ok: true, found: false });
    }

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

    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000).toISOString();

    await sql`
      INSERT INTO event_registration_otps (email, event_slug, otp, expires_at, created_at)
      VALUES (${normalizedEmail}, ${CURRENT_EVENT_SLUG}, ${otp}, ${expiresAt}, now())
      ON CONFLICT (email, event_slug) DO UPDATE SET
        otp = EXCLUDED.otp, expires_at = EXCLUDED.expires_at, created_at = now()
    `;

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error("rsvp check: missing RESEND_API_KEY");
      return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 });
    }

    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: "Cynapept Events <noreply@cynapept.com>",
      to: normalizedEmail,
      subject: "Your verification code — Cynapept Event Moscow",
      html: `
        <p>Your verification code is:</p>
        <p style="font-size:28px;font-weight:600;letter-spacing:4px">${otp}</p>
        <p>This code expires in ${OTP_TTL_MINUTES} minutes.</p>
      `,
    });
    if (error) {
      console.error("rsvp check: otp email failed:", error);
      return NextResponse.json({ ok: false, error: "send_failed" }, { status: 502 });
    }

    return NextResponse.json({ ok: true, found: true });
  } catch (err) {
    console.error("rsvp check request: db error:", err);
    return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 });
  }
}
