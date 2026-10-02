import { NextResponse } from "next/server";
import { getSql } from "@/lib/db";
import type { EventRegistrationRow } from "@/lib/rsvp";

// Read-only — looking up a pass must never itself mark someone as checked
// in. Scanning twice (or just previewing before confirming) should be safe.
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_request" }, { status: 400 });
  }

  const { token } = (body ?? {}) as Record<string, unknown>;
  if (typeof token !== "string" || !token.trim()) {
    return NextResponse.json({ ok: false, error: "invalid_token" }, { status: 400 });
  }

  try {
    const sql = getSql();
    const rows = (await sql`
      SELECT * FROM event_registrations WHERE pass_token = ${token.trim()}
    `) as EventRegistrationRow[];

    const registration = rows[0];
    if (!registration) {
      return NextResponse.json({ ok: true, found: false });
    }

    return NextResponse.json({
      ok: true,
      found: true,
      registration: {
        fullName: registration.full_name,
        email: registration.email,
        guestCount: registration.guest_count,
        guests: registration.guests,
        status: registration.status,
        checkinCount: registration.checkin_count,
        firstCheckedInAt: registration.first_checked_in_at,
        lastCheckedInAt: registration.last_checked_in_at,
      },
    });
  } catch (err) {
    console.error("check-in lookup failed:", err);
    return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 });
  }
}
