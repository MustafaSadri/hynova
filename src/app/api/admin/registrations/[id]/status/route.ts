import { NextResponse } from "next/server";
import { getSql } from "@/lib/db";
import { isRegistrationStatus } from "@/lib/rsvp";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const registrationId = Number(id);
  if (!Number.isInteger(registrationId)) {
    return NextResponse.json({ ok: false, error: "invalid_id" }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_request" }, { status: 400 });
  }

  const { status } = (body ?? {}) as Record<string, unknown>;
  if (typeof status !== "string" || !isRegistrationStatus(status)) {
    return NextResponse.json({ ok: false, error: "invalid_status" }, { status: 400 });
  }

  try {
    const sql = getSql();
    await sql`
      UPDATE event_registrations
      SET status = ${status}, updated_at = now()
      WHERE id = ${registrationId}
    `;
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("admin registration status update failed:", err);
    return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 });
  }
}
