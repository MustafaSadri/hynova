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
  generatePassToken,
  generateToken,
} from "@/lib/rsvp-server";
import type { EventDetailsRow } from "@/lib/event-details";
import {
  buildEntryPassPdf,
  DEFAULT_EVENT_DATE,
  DEFAULT_EVENT_NAME,
  DEFAULT_VENUE_ADDRESS,
  DEFAULT_VENUE_NAME,
  resolveBaseUrl,
} from "@/lib/entry-pass-server";

const NOTIFY_ADDRESS = "info@cynapept.com";
const OTP_PATTERN = /^\d{6}$/;

interface PendingPayload {
  fullName: string;
  phone: string;
  organization: string | null;
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

    const { fullName, phone, organization, guestCount, guests } = pending.payload;

    // Upsert rather than a plain insert: if this email previously cancelled,
    // the row already exists (soft-deleted, not removed), so registering
    // again needs to reactivate that same row rather than conflict.
    const upserted = (await sql`
      INSERT INTO event_registrations (full_name, email, phone, organization, guest_count, guests, status, event_slug)
      VALUES (${fullName}, ${normalizedEmail}, ${phone}, ${organization}, ${guestCount}, ${JSON.stringify(guests)}, 'registered', ${CURRENT_EVENT_SLUG})
      ON CONFLICT (event_slug, email) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        phone = EXCLUDED.phone,
        organization = EXCLUDED.organization,
        guest_count = EXCLUDED.guest_count,
        guests = EXCLUDED.guests,
        status = 'registered',
        updated_at = now()
      RETURNING id, pass_token
    `) as { id: number; pass_token: string | null }[];
    const registrationId = upserted[0].id;

    // Reuse an already-issued token on re-registration (e.g. cancel then
    // sign up again) — a previously sent pass's QR must keep working.
    let passToken = upserted[0].pass_token;
    if (!passToken) {
      passToken = generatePassToken();
      await sql`UPDATE event_registrations SET pass_token = ${passToken} WHERE id = ${registrationId}`;
    }

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
      const guestSummary = guestCount > 1 ? ", а также с одним гостем" : "";
      const guestListHtml = guests.length
        ? `<p><strong>Additional guests:</strong></p><ul>${guests
            .map(
              (g) =>
                `<li>${escapeHtml(g.name)}${g.phone ? ` — ${escapeHtml(g.phone)}` : ""}</li>`,
            )
            .join("")}</ul>`
        : "";

      // Entry pass is attached right here, automatically, the moment
      // registration is confirmed — not a separate admin-triggered step.
      // Built fresh each time from whatever's currently saved in Event
      // Details, so the venue/date on the pass always matches the latest
      // admin edit, not whatever was true when the token was first issued.
      let passPdfBase64: string | null = null;
      try {
        const eventDetailsRows = (await sql`
          SELECT * FROM event_details WHERE event_slug = ${CURRENT_EVENT_SLUG}
        `) as EventDetailsRow[];
        const eventDetails = eventDetailsRows[0] ?? null;

        const pdfBytes = await buildEntryPassPdf({
          fullName,
          organization,
          guestCount,
          guests,
          eventName: eventDetails?.event_name || DEFAULT_EVENT_NAME,
          eventDate: eventDetails?.event_date || DEFAULT_EVENT_DATE,
          venueName: eventDetails?.venue_name || DEFAULT_VENUE_NAME,
          venueAddress: eventDetails?.venue_address || DEFAULT_VENUE_ADDRESS,
          passToken,
          baseUrl: resolveBaseUrl(request),
        });
        passPdfBase64 = Buffer.from(pdfBytes).toString("base64");
      } catch (err) {
        console.error("rsvp confirm: entry pass build failed:", err);
      }

      try {
        const { error } = await resend.emails.send({
          from: "Cynapept Events <noreply@cynapept.com>",
          to: normalizedEmail,
          subject: "Спасибо за регистрацию — Cynapept Event Moscow",
          html: `
            <p>Здравствуйте, ${escapeHtml(fullName)}!</p>
            <p>Спасибо за регистрацию на Cynapept Event Moscow${guestSummary}.</p>
            ${
              passPdfBase64
                ? `<p>Ваш входной билет приложен в формате PDF — пожалуйста, покажите его (в электронном или распечатанном виде) на входе.</p>`
                : `<p>Ваш входной билет будет отправлен отдельным письмом.</p>`
            }
            <p>Если будут какие-либо изменения — включая дату или время — или возникнут вопросы, пишите нам на support@cynapept.com.</p>
            <p>— Cynapept</p>
          `,
          attachments: passPdfBase64
            ? [{ filename: "cynapept-event-entry-pass.pdf", content: passPdfBase64 }]
            : undefined,
        });
        if (error) console.error("rsvp confirm: confirmation email failed:", error);
        else if (passPdfBase64) {
          await sql`UPDATE event_registrations SET pass_sent_at = now() WHERE id = ${registrationId}`;
        }
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
            ${organization ? `<p><strong>Organization:</strong> ${escapeHtml(organization)}</p>` : ""}
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
      registration: {
        fullName,
        email: normalizedEmail,
        phone,
        organization,
        guestCount,
        guests,
        status: "registered",
      },
    });
  } catch (err) {
    console.error("rsvp confirm: db error:", err);
    return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 });
  }
}
