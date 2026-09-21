import { NextResponse } from "next/server";
import { getSql } from "@/lib/db";
import { CURRENT_EVENT_SLUG } from "@/lib/rsvp";
import { MAX_PHOTO_BYTES, MAX_VENUE_PHOTOS, type EventDetailsRow } from "@/lib/event-details";

const MAX_TEXT_LENGTH = 500;

async function ensureTable() {
  const sql = getSql();
  await sql.query(`
    CREATE TABLE IF NOT EXISTS event_details (
      event_slug TEXT PRIMARY KEY,
      event_name TEXT,
      event_date TEXT,
      venue_name TEXT,
      venue_address TEXT,
      venue_photos JSONB NOT NULL DEFAULT '[]'::jsonb,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `);
  return sql;
}

export async function GET() {
  try {
    const sql = await ensureTable();
    const rows = (await sql`
      SELECT * FROM event_details WHERE event_slug = ${CURRENT_EVENT_SLUG}
    `) as EventDetailsRow[];
    return NextResponse.json({ ok: true, details: rows[0] ?? null });
  } catch (err) {
    console.error("admin event-details GET failed:", err);
    return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 });
  }
}

function isOptionalText(value: unknown): value is string | null | undefined {
  return value === undefined || value === null || (typeof value === "string" && value.length <= MAX_TEXT_LENGTH);
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_request" }, { status: 400 });
  }

  const { eventName, eventDate, venueName, venueAddress, venuePhotos } =
    (body ?? {}) as Record<string, unknown>;

  if (
    !isOptionalText(eventName) ||
    !isOptionalText(eventDate) ||
    !isOptionalText(venueName) ||
    !isOptionalText(venueAddress)
  ) {
    return NextResponse.json({ ok: false, error: "invalid_text_field" }, { status: 400 });
  }

  if (venuePhotos !== undefined) {
    if (!Array.isArray(venuePhotos) || venuePhotos.length > MAX_VENUE_PHOTOS) {
      return NextResponse.json({ ok: false, error: "invalid_photos" }, { status: 400 });
    }
    for (const photo of venuePhotos) {
      if (typeof photo !== "string" || !photo.startsWith("data:image/")) {
        return NextResponse.json({ ok: false, error: "invalid_photos" }, { status: 400 });
      }
      // Rough size check on the base64 payload (~4/3 the byte size).
      if (photo.length > (MAX_PHOTO_BYTES * 4) / 3) {
        return NextResponse.json({ ok: false, error: "photo_too_large" }, { status: 400 });
      }
    }
  }

  try {
    const sql = await ensureTable();
    await sql`
      INSERT INTO event_details (event_slug, event_name, event_date, venue_name, venue_address, venue_photos, updated_at)
      VALUES (
        ${CURRENT_EVENT_SLUG},
        ${eventName ?? null},
        ${eventDate ?? null},
        ${venueName ?? null},
        ${venueAddress ?? null},
        ${venuePhotos !== undefined ? JSON.stringify(venuePhotos) : "[]"},
        now()
      )
      ON CONFLICT (event_slug) DO UPDATE SET
        event_name = COALESCE(EXCLUDED.event_name, event_details.event_name),
        event_date = COALESCE(EXCLUDED.event_date, event_details.event_date),
        venue_name = COALESCE(EXCLUDED.venue_name, event_details.venue_name),
        venue_address = COALESCE(EXCLUDED.venue_address, event_details.venue_address),
        venue_photos = CASE WHEN ${venuePhotos !== undefined} THEN EXCLUDED.venue_photos ELSE event_details.venue_photos END,
        updated_at = now()
    `;
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("admin event-details POST failed:", err);
    return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 });
  }
}
