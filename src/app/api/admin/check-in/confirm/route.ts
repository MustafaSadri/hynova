import { NextResponse } from "next/server";
import { getSql } from "@/lib/db";
import type { EventRegistrationRow } from "@/lib/rsvp";

// The actual admit action — deliberately separate from lookup (see that
// route) so door staff always see who they're admitting before this runs.
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

    // Checked separately (not just left to the UI) so a cancelled
    // registration can never be admitted even via a direct API call.
    const existing = (await sql`
      SELECT status FROM event_registrations WHERE pass_token = ${token.trim()}
    `) as { status: string }[];
    if (existing.length === 0) {
      return NextResponse.json({ ok: true, found: false });
    }
    if (existing[0].status === "cancelled") {
      return NextResponse.json({ ok: true, found: true, blocked: true });
    }

    const rows = (await sql`
      UPDATE event_registrations
      SET checkin_count = checkin_count + 1,
          first_checked_in_at = COALESCE(first_checked_in_at, now()),
          last_checked_in_at = now()
      WHERE pass_token = ${token.trim()}
      RETURNING *
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
        guestCount: registration.guest_count,
        guests: registration.guests,
        status: registration.status,
        checkinCount: registration.checkin_count,
        firstCheckedInAt: registration.first_checked_in_at,
        lastCheckedInAt: registration.last_checked_in_at,
      },
    });
  } catch (err) {
    console.error("check-in confirm failed:", err);
    return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 });
  }
}
