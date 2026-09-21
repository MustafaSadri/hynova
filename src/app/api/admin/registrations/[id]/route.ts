import { NextResponse } from "next/server";
import { getSql } from "@/lib/db";

// Hard delete — distinct from the guest's own self-service "cancel" (a
// soft-delete that keeps the row visible with status='cancelled'). This is
// for admin cleanup of test entries, spam, or duplicates.
export async function DELETE(
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
    await sql`DELETE FROM event_registrations WHERE id = ${registrationId}`;
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("admin registration delete failed:", err);
    return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 });
  }
}
