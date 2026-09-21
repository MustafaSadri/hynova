import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getSql } from "@/lib/db";
import { CURRENT_EVENT_SLUG, normalizeEmail, type Guest } from "@/lib/rsvp";

const NOTIFY_ADDRESS = "info@cynapept.com";
const MAX_FIELD_LENGTH = 300;
const MAX_GUEST_COUNT = 20;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0 && value.length <= MAX_FIELD_LENGTH;
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_request" }, { status: 400 });
  }

  const { fullName, email, phone, guestCount, guests } = (body ?? {}) as Record<string, unknown>;

  if (!isNonEmptyString(fullName)) {
    return NextResponse.json({ ok: false, error: "invalid_name" }, { status: 400 });
  }
  if (typeof email !== "string" || !EMAIL_PATTERN.test(email) || email.length > MAX_FIELD_LENGTH) {
    return NextResponse.json({ ok: false, error: "invalid_email" }, { status: 400 });
  }
  // A contact number is mandatory — this is the one required way to reach
  // the primary registrant, regardless of how many guests they're bringing.
  if (!isNonEmptyString(phone)) {
    return NextResponse.json({ ok: false, error: "invalid_phone" }, { status: 400 });
  }
  if (
    typeof guestCount !== "number" ||
    !Number.isInteger(guestCount) ||
    guestCount < 1 ||
    guestCount > MAX_GUEST_COUNT
  ) {
    return NextResponse.json({ ok: false, error: "invalid_guest_count" }, { status: 400 });
  }

  // Everyone beyond the primary registrant needs a name and phone number —
  // guestCount of N means N-1 additional guest entries are required here.
  const expectedGuests = guestCount - 1;
  let parsedGuests: Guest[] = [];
  if (expectedGuests > 0) {
    if (!Array.isArray(guests) || guests.length !== expectedGuests) {
      return NextResponse.json({ ok: false, error: "invalid_guests" }, { status: 400 });
    }
    for (const guest of guests) {
      if (
        typeof guest !== "object" ||
        guest === null ||
        !isNonEmptyString((guest as Record<string, unknown>).name) ||
        !isNonEmptyString((guest as Record<string, unknown>).phone)
      ) {
        return NextResponse.json({ ok: false, error: "invalid_guests" }, { status: 400 });
      }
    }
    parsedGuests = (guests as { name: string; phone: string }[]).map((g) => ({
      name: g.name.trim(),
      phone: g.phone.trim(),
    }));
  }

  const trimmedName = fullName.trim();
  const normalizedEmail = normalizeEmail(email);
  const trimmedPhone = phone.trim();
  let isNewRegistration = true;

  try {
    const sql = getSql();

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

    // Re-submitting (e.g. to fix a typo'd phone number) updates the existing
    // row instead of erroring or creating a duplicate. `xmax = 0` is the
    // standard Postgres tell for "this row was just inserted" vs "this row
    // already existed and we updated it via the ON CONFLICT path" — lets
    // us tell the registrant which case they're in.
    const upsertResult = (await sql`
      INSERT INTO event_registrations (full_name, email, phone, guest_count, guests, event_slug)
      VALUES (${trimmedName}, ${normalizedEmail}, ${trimmedPhone}, ${guestCount}, ${JSON.stringify(parsedGuests)}, ${CURRENT_EVENT_SLUG})
      ON CONFLICT (event_slug, email)
      DO UPDATE SET
        full_name = EXCLUDED.full_name,
        phone = EXCLUDED.phone,
        guest_count = EXCLUDED.guest_count,
        guests = EXCLUDED.guests,
        updated_at = now()
      RETURNING (xmax = 0) AS inserted
    `) as { inserted: boolean }[];
    isNewRegistration = upsertResult[0]?.inserted ?? true;
  } catch (err) {
    console.error("rsvp: db error:", err);
    return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (apiKey) {
    const resend = new Resend(apiKey);
    const guestListHtml = parsedGuests.length
      ? `<p><strong>Additional guests:</strong></p><ul>${parsedGuests
          .map((g) => `<li>${escapeHtml(g.name)} — ${escapeHtml(g.phone)}</li>`)
          .join("")}</ul>`
      : "";
    const guestSummary =
      guestCount > 1 ? `, along with ${guestCount - 1} additional guest(s)` : "";
    const contactFooter = `
      <p style="color:#666">Any questions or further communication about the event — reach us at
        <a href="mailto:support@cynapept.com">support@cynapept.com</a> or
        <a href="mailto:info@cynapept.com">info@cynapept.com</a>.</p>
    `;

    // Both sends are best-effort — the registration itself is already
    // saved, so a mail hiccup shouldn't fail the whole request. The SDK
    // resolves with { error } rather than throwing on API-level failures,
    // so that has to be checked explicitly or failures go unnoticed.
    try {
      const { error } = isNewRegistration
        ? await resend.emails.send({
            from: "Cynapept Events <noreply@cynapept.com>",
            to: normalizedEmail,
            subject: "Thank you for registering — Cynapept Event Moscow",
            html: `
              <p>Hi ${escapeHtml(trimmedName)},</p>
              <p>Thank you for registering for Cynapept Event Moscow${guestSummary}. We've got you down, and full details (date, time, and venue) will follow separately.</p>
              <p>If anything about your details changes, just fill out the registration form again with the same email and we'll update it.</p>
              <p>— Cynapept</p>
              ${contactFooter}
            `,
          })
        : await resend.emails.send({
            from: "Cynapept Events <noreply@cynapept.com>",
            to: normalizedEmail,
            subject: "You're already registered — Cynapept Event Moscow",
            html: `
              <p>Hi ${escapeHtml(trimmedName)},</p>
              <p>You were already registered for Cynapept Event Moscow — we've updated your details${guestSummary}.</p>
              <p>— Cynapept</p>
              ${contactFooter}
            `,
          });
      if (error) console.error("rsvp: confirmation email failed:", error);
    } catch (err) {
      console.error("rsvp: confirmation email threw:", err);
    }

    try {
      const { error } = await resend.emails.send({
        from: "Cynapept Events <noreply@cynapept.com>",
        to: NOTIFY_ADDRESS,
        subject: `${isNewRegistration ? "New" : "Updated"} event registration — ${trimmedName}`,
        html: `
          <p><strong>Name:</strong> ${escapeHtml(trimmedName)}</p>
          <p><strong>Email:</strong> ${escapeHtml(normalizedEmail)}</p>
          <p><strong>Phone:</strong> ${escapeHtml(trimmedPhone)}</p>
          <p><strong>Guest count:</strong> ${guestCount}</p>
          ${guestListHtml}
        `,
      });
      if (error) console.error("rsvp: notification email failed:", error);
    } catch (err) {
      console.error("rsvp: notification email threw:", err);
    }
  } else {
    console.error("rsvp: missing RESEND_API_KEY, skipped emails");
  }

  return NextResponse.json({ ok: true, alreadyRegistered: !isNewRegistration });
}
