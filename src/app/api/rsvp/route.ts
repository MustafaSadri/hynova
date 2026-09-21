import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getSql } from "@/lib/db";
import { CURRENT_EVENT_SLUG } from "@/lib/rsvp";
import {
  ensurePendingTable,
  ensureRegistrationsTable,
  generateOtp,
  OTP_TTL_MINUTES,
  parseRegistrationBody,
} from "@/lib/rsvp-server";

// Step 1 of registration: validate the form, hold it as "pending" (not yet
// a real registration), and email an OTP. The row only becomes a real
// registration once /api/rsvp/confirm verifies that code — see that file
// for why.
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_request" }, { status: 400 });
  }

  const parsed = parseRegistrationBody(body);
  if (!parsed.ok) {
    return NextResponse.json({ ok: false, error: parsed.error }, { status: 400 });
  }
  const { fullName, email, phone, guestCount, guests } = parsed.data;

  try {
    const sql = getSql();
    await ensureRegistrationsTable(sql);
    await ensurePendingTable(sql);

    // Registering is blocked only while an *active* registration already
    // exists — a previously cancelled one doesn't count, so someone who
    // cancelled can register again from scratch.
    const active = (await sql`
      SELECT id FROM event_registrations
      WHERE email = ${email} AND event_slug = ${CURRENT_EVENT_SLUG} AND status != 'cancelled'
    `) as { id: number }[];
    if (active.length > 0) {
      return NextResponse.json({ ok: false, error: "already_registered" }, { status: 409 });
    }

    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000).toISOString();

    await sql`
      INSERT INTO event_registration_pending (email, event_slug, payload, otp, expires_at, created_at)
      VALUES (
        ${email}, ${CURRENT_EVENT_SLUG},
        ${JSON.stringify({ fullName, phone, guestCount, guests })},
        ${otp}, ${expiresAt}, now()
      )
      ON CONFLICT (email, event_slug) DO UPDATE SET
        payload = EXCLUDED.payload, otp = EXCLUDED.otp, expires_at = EXCLUDED.expires_at, created_at = now()
    `;

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error("rsvp: missing RESEND_API_KEY");
      return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 });
    }

    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: "Cynapept Events <noreply@cynapept.com>",
      to: email,
      subject: "Verify your email — Cynapept Event Moscow",
      html: `
        <p>Enter this code to confirm your registration for Cynapept Event Moscow:</p>
        <p style="font-size:28px;font-weight:600;letter-spacing:4px">${otp}</p>
        <p>This code expires in ${OTP_TTL_MINUTES} minutes.</p>
      `,
    });
    if (error) {
      console.error("rsvp: otp email failed:", error);
      return NextResponse.json({ ok: false, error: "send_failed" }, { status: 502 });
    }

    return NextResponse.json({ ok: true, requiresOtp: true });
  } catch (err) {
    console.error("rsvp: db error:", err);
    return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 });
  }
}
