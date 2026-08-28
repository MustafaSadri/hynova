import { NextResponse } from "next/server";
import { getSql } from "@/lib/db";
import { normalizeCode, type CodeRow } from "@/lib/codes";

const MAX_CODE_LENGTH = 64;

export async function POST(request: Request) {
  let code: unknown;
  try {
    const body = await request.json();
    code = body?.code;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_request" }, { status: 400 });
  }

  if (typeof code !== "string" || !code.trim() || code.trim().length > MAX_CODE_LENGTH) {
    return NextResponse.json({ ok: false, error: "invalid_code" }, { status: 400 });
  }

  const normalized = normalizeCode(code);

  try {
    const sql = getSql();
    // Atomic UPDATE...RETURNING: bump scan_count, stamp last_scanned_at, and
    // set first_scanned_at only the first time — one round trip, no race
    // between "read to check" and "write the result".
    const rows = (await sql`
      UPDATE codes
      SET scan_count = scan_count + 1,
          last_scanned_at = now(),
          first_scanned_at = COALESCE(first_scanned_at, now())
      WHERE code = ${normalized}
      RETURNING product_group
    `) as Pick<CodeRow, "product_group">[];

    if (rows.length === 0) {
      return NextResponse.json({ ok: true, authentic: false });
    }

    return NextResponse.json({
      ok: true,
      authentic: true,
      productGroup: rows[0].product_group,
    });
  } catch (err) {
    console.error("verify lookup failed:", err);
    return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 });
  }
}
