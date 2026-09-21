import { NextResponse } from "next/server";
import { getSql } from "@/lib/db";
import { CURRENT_EVENT_SLUG, type EventRegistrationRow } from "@/lib/rsvp";

function csvEscape(value: string) {
  return `"${value.replace(/"/g, '""')}"`;
}

export async function GET() {
  let rows: EventRegistrationRow[] = [];
  try {
    const sql = getSql();
    rows = (await sql`
      SELECT * FROM event_registrations
      WHERE event_slug = ${CURRENT_EVENT_SLUG}
      ORDER BY created_at DESC
    `) as EventRegistrationRow[];
  } catch {
    rows = [];
  }

  const header = "full_name,email,phone,guest_count,additional_guests,status,registered_at\n";
  const body = rows
    .map((r) =>
      [
        csvEscape(r.full_name),
        csvEscape(r.email),
        csvEscape(r.phone),
        csvEscape(String(r.guest_count)),
        csvEscape(r.guests.map((g) => `${g.name} (${g.phone})`).join("; ")),
        csvEscape(r.status),
        csvEscape(new Date(r.created_at).toISOString()),
      ].join(","),
    )
    .join("\n");

  return new NextResponse(header + body + "\n", {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${CURRENT_EVENT_SLUG}-registrations.csv"`,
    },
  });
}
