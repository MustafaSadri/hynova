import { NextResponse } from "next/server";
import { getSql } from "@/lib/db";
import { CURRENT_EVENT_SLUG } from "@/lib/rsvp";
import { ensureTokensTable, isNonEmptyString } from "@/lib/rsvp-server";

interface TokenRow {
  email: string;
  expires_at: string;
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_request" }, { status: 400 });
  }

  const { token } = (body ?? {}) as Record<string, unknown>;
  if (!isNonEmptyString(token)) {
    return NextResponse.json({ ok: false, error: "invalid_token" }, { status: 400 });
  }

  try {
    const sql = getSql();
    await ensureTokensTable(sql);

    const tokenRows = (await sql`
      SELECT email, expires_at FROM event_registration_tokens
      WHERE token = ${token} AND event_slug = ${CURRENT_EVENT_SLUG}
    `) as TokenRow[];

    const tokenRow = tokenRows[0];
    if (!tokenRow || new Date(tokenRow.expires_at) < new Date()) {
      return NextResponse.json({ ok: false, error: "invalid_token" }, { status: 401 });
    }

    // Soft-delete only — the row (and its history) stays in the database
    // and visible in the admin dashboard, just marked cancelled.
    await sql`
      UPDATE event_registrations
      SET status = 'cancelled', updated_at = now()
      WHERE email = ${tokenRow.email} AND event_slug = ${CURRENT_EVENT_SLUG}
    `;

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("rsvp cancel: db error:", err);
    return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 });
  }
}
