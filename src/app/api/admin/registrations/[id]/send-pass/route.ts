import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getSql } from "@/lib/db";
import { CURRENT_EVENT_SLUG, type EventRegistrationRow } from "@/lib/rsvp";
import { escapeHtml, generatePassToken } from "@/lib/rsvp-server";
import type { EventDetailsRow } from "@/lib/event-details";
import {
  buildEntryPassPdf,
  DEFAULT_EVENT_DATE,
  DEFAULT_EVENT_NAME,
  DEFAULT_VENUE_ADDRESS,
  DEFAULT_VENUE_NAME,
  resolveBaseUrl,
} from "@/lib/entry-pass-server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const registrationId = Number(id);
  if (!Number.isInteger(registrationId)) {
    return NextResponse.json({ ok: false, error: "invalid_id" }, { status: 400 });
  }

  try {
    const sql = getSql();

    const rows = (await sql`
      SELECT * FROM event_registrations WHERE id = ${registrationId}
    `) as EventRegistrationRow[];
    const registration = rows[0];
    if (!registration) {
      return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
    }
    if (registration.status === "cancelled") {
      return NextResponse.json({ ok: false, error: "cancelled" }, { status: 409 });
    }

    // Reuse an already-issued token on resend — a previously sent pass's QR
    // must keep working, never silently invalidated by a later resend. Only
    // the token is persisted here; pass_sent_at is stamped later, only once
    // the email actually goes out, so a failed send is never shown as sent.
    const passToken = registration.pass_token ?? generatePassToken();
    if (!registration.pass_token) {
      await sql`UPDATE event_registrations SET pass_token = ${passToken} WHERE id = ${registrationId}`;
    }

    const eventDetailsRows = (await sql`
      SELECT * FROM event_details WHERE event_slug = ${CURRENT_EVENT_SLUG}
    `) as EventDetailsRow[];
    const eventDetails = eventDetailsRows[0] ?? null;

    const pdfBytes = await buildEntryPassPdf({
      fullName: registration.full_name,
      organization: registration.organization,
      guestCount: registration.guest_count,
      guests: registration.guests,
      eventName: eventDetails?.event_name || DEFAULT_EVENT_NAME,
      eventDate: eventDetails?.event_date || DEFAULT_EVENT_DATE,
      venueName: eventDetails?.venue_name || DEFAULT_VENUE_NAME,
      venueAddress: eventDetails?.venue_address || DEFAULT_VENUE_ADDRESS,
      passToken,
      baseUrl: resolveBaseUrl(request),
    });

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error("send-pass: missing RESEND_API_KEY");
      return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 });
    }

    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: "Cynapept Events <noreply@cynapept.com>",
      to: registration.email,
      subject: "Ваш входной билет — Cynapept Event Moscow",
      html: `
        <p>Здравствуйте, ${escapeHtml(registration.full_name)}!</p>
        <p>Ваш входной билет на Cynapept Event Moscow приложен в формате PDF. Он допускает вас${
          registration.guest_count > 1 ? " и ещё одного гостя" : ""
        } — пожалуйста, покажите его (в электронном или распечатанном виде) на входе.</p>
        <p>Вопросы? Пишите на support@cynapept.com</p>
        <p>— Cynapept</p>
      `,
      attachments: [
        {
          filename: "cynapept-event-entry-pass.pdf",
          content: Buffer.from(pdfBytes).toString("base64"),
        },
      ],
    });
    if (error) {
      console.error("send-pass: email failed:", error);
      return NextResponse.json(
        { ok: false, error: "send_failed", detail: error.message },
        { status: 502 },
      );
    }

    const updated = (await sql`
      UPDATE event_registrations
      SET pass_sent_at = now()
      WHERE id = ${registrationId}
      RETURNING pass_sent_at
    `) as { pass_sent_at: string }[];

    return NextResponse.json({ ok: true, passSentAt: updated[0].pass_sent_at });
  } catch (err) {
    console.error("send-pass: failed:", err);
    return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 });
  }
}
