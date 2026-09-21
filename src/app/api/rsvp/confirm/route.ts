import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getSql } from "@/lib/db";
import { CURRENT_EVENT_SLUG, normalizeEmail } from "@/lib/rsvp";
import {
  EDIT_TOKEN_TTL_MINUTES,
  EMAIL_PATTERN,
  ensureRegistrationsTable,
  ensureTokensTable,
  escapeHtml,
  generateToken,
} from "@/lib/rsvp-server";

const NOTIFY_ADDRESS = "info@cynapept.com";
const OTP_PATTERN = /^\d{6}$/;

interface PendingPayload {
  fullName: string;
  phone: string;
  guestCount: number;
  guests: { name: string; phone: string }[];
}

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
    await ensureRegistrationsTable(sql);
    await ensureTokensTable(sql);

    const pendingRows = (await sql`
      SELECT payload, otp, expires_at FROM event_registration_pending
      WHERE email = ${normalizedEmail} AND event_slug = ${CURRENT_EVENT_SLUG}
    `) as { payload: PendingPayload; otp: string; expires_at: string }[];

    const pending = pendingRows[0];
    const expired = !pending || new Date(pending.expires_at) < new Date();
    if (!pending || pending.otp !== otp || expired) {
      return NextResponse.json({ ok: false, error: "invalid_otp" }, { status: 400 });
    }

    const { fullName, phone, guestCount, guests } = pending.payload;

    // Upsert rather than a plain insert: if this email previously cancelled,
    // the row already exists (soft-deleted, not removed), so registering
    // again needs to reactivate that same row rather than conflict.
    await sql`
      INSERT INTO event_registrations (full_name, email, phone, guest_count, guests, status, event_slug)
      VALUES (${fullName}, ${normalizedEmail}, ${phone}, ${guestCount}, ${JSON.stringify(guests)}, 'registered', ${CURRENT_EVENT_SLUG})
      ON CONFLICT (event_slug, email) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        phone = EXCLUDED.phone,
        guest_count = EXCLUDED.guest_count,
        guests = EXCLUDED.guests,
        status = 'registered',
        updated_at = now()
    `;

    await sql`
      DELETE FROM event_registration_pending
      WHERE email = ${normalizedEmail} AND event_slug = ${CURRENT_EVENT_SLUG}
    `;

    // A short-lived token so the confirmation screen (or a later visit,
    // within the window) can offer an immediate edit/cancel link without
    // asking for another OTP right away.
    const token = generateToken();
    const tokenExpiresAt = new Date(Date.now() + EDIT_TOKEN_TTL_MINUTES * 60 * 1000).toISOString();
    await sql`
      INSERT INTO event_registration_tokens (token, email, event_slug, expires_at)
      VALUES (${token}, ${normalizedEmail}, ${CURRENT_EVENT_SLUG}, ${tokenExpiresAt})
    `;

    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey) {
      const resend = new Resend(apiKey);
      const guestSummary = guestCount > 1 ? `, along with ${guestCount - 1} additional guest(s)` : "";
      const guestListHtml = guests.length
        ? `<p><strong>Additional guests:</strong></p><ul>${guests
            .map((g) => `<li>${escapeHtml(g.name)} — ${escapeHtml(g.phone)}</li>`)
            .join("")}</ul>`
        : "";

      try {
        const { error } = await resend.emails.send({
          from: "Cynapept Events <noreply@cynapept.com>",
          to: normalizedEmail,
          subject: "Thank you for registering — Cynapept Event Moscow",
          html: `
            <p>Hi ${escapeHtml(fullName)},</p>
            <p>Thank you for registering for Cynapept Event Moscow${guestSummary}.</p>
            <p>If there are any changes — including to the date or time — we'll notify you via support@cynapept.com.</p>
            <p>— Cynapept</p>
          `,
        });
        if (error) console.error("rsvp confirm: confirmation email failed:", error);
      } catch (err) {
        console.error("rsvp confirm: confirmation email threw:", err);
      }

      try {
        const { error } = await resend.emails.send({
          from: "Cynapept Events <noreply@cynapept.com>",
          to: NOTIFY_ADDRESS,
          subject: `New event registration — ${fullName}`,
          html: `
            <p><strong>Name:</strong> ${escapeHtml(fullName)}</p>
            <p><strong>Email:</strong> ${escapeHtml(normalizedEmail)}</p>
            <p><strong>Phone:</strong> ${escapeHtml(phone)}</p>
            <p><strong>Guest count:</strong> ${guestCount}</p>
            ${guestListHtml}
          `,
        });
        if (error) console.error("rsvp confirm: notification email failed:", error);
      } catch (err) {
        console.error("rsvp confirm: notification email threw:", err);
      }
    } else {
      console.error("rsvp confirm: missing RESEND_API_KEY, skipped emails");
    }

    return NextResponse.json({
      ok: true,
      token,
      registration: { fullName, email: normalizedEmail, phone, guestCount, guests, status: "registered" },
    });
  } catch (err) {
    console.error("rsvp confirm: db error:", err);
    return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 });
  }
}
