import { NextResponse } from "next/server";
import { getSql } from "@/lib/db";
import { CURRENT_EVENT_SLUG } from "@/lib/rsvp";
import { ensureTokensTable, isNonEmptyString, parseRegistrationBody } from "@/lib/rsvp-server";

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

  // The edit form doesn't carry its own email field (it's not editable),
  // so validate everything else via the same shared rules, with a
  // placeholder email that always passes the pattern check.
  const parsed = parseRegistrationBody({
    ...(body as Record<string, unknown>),
    email: "placeholder@placeholder.com",
  });
  if (!parsed.ok) {
    return NextResponse.json({ ok: false, error: parsed.error }, { status: 400 });
  }
  const { fullName, phone, guestCount, guests } = parsed.data;

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

    await sql`
      UPDATE event_registrations
      SET full_name = ${fullName}, phone = ${phone}, guest_count = ${guestCount},
          guests = ${JSON.stringify(guests)}, updated_at = now()
      WHERE email = ${tokenRow.email} AND event_slug = ${CURRENT_EVENT_SLUG}
    `;

    return NextResponse.json({
      ok: true,
      registration: { fullName, email: tokenRow.email, phone, guestCount, guests },
    });
  } catch (err) {
    console.error("rsvp edit: db error:", err);
    return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 });
  }
}
