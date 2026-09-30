import { NextResponse } from "next/server";
import { getSql } from "@/lib/db";
import { normalizeCode, type CodeRow } from "@/lib/codes";
import type { NeonQueryFunction } from "@neondatabase/serverless";

const MAX_CODE_LENGTH = 64;

// Self-healing migration for the product-detail columns added after the
// original `codes` table — safe to run every time (each ADD COLUMN is a
// no-op once it exists), but cached per server instance so a hot path
// (every scan) doesn't pay for it on every request.
let productColumnsEnsured = false;
async function ensureProductColumns(sql: NeonQueryFunction<false, false>) {
  if (productColumnsEnsured) return;
  await sql.query(`
    ALTER TABLE codes
      ADD COLUMN IF NOT EXISTS product_name TEXT,
      ADD COLUMN IF NOT EXISTS dosage TEXT,
      ADD COLUMN IF NOT EXISTS manufacture_date DATE,
      ADD COLUMN IF NOT EXISTS expiry_date DATE
  `);
  productColumnsEnsured = true;
}

type VerifyRow = Pick<CodeRow, "product_group" | "scan_count" | "batch_id" | "product_name" | "dosage"> & {
  manufacture_date: string | null;
  expiry_date: string | null;
};

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
    await ensureProductColumns(sql);

    // Atomic UPDATE...RETURNING: bump scan_count, stamp last_scanned_at, and
    // set first_scanned_at only the first time — one round trip, no race
    // between "read to check" and "write the result". Dates are cast to
    // text so the JSON response carries a plain YYYY-MM-DD string rather
    // than a Date object serialized as a full ISO datetime.
    const rows = (await sql`
      UPDATE codes
      SET scan_count = scan_count + 1,
          last_scanned_at = now(),
          first_scanned_at = COALESCE(first_scanned_at, now())
      WHERE code = ${normalized}
      RETURNING
        product_group,
        scan_count,
        batch_id,
        product_name,
        dosage,
        manufacture_date::text,
        expiry_date::text
    `) as VerifyRow[];

    if (rows.length === 0) {
      return NextResponse.json({ ok: true, authentic: false });
    }

    // scan_count was just incremented, so 1 means this was the first time
    // this code has ever been checked; anything higher means it's been
    // scanned before.
    const row = rows[0];
    return NextResponse.json({
      ok: true,
      authentic: true,
      alreadyScanned: row.scan_count > 1,
      scanCount: row.scan_count,
      productGroup: row.product_group,
      batchId: row.batch_id,
      productName: row.product_name,
      dosage: row.dosage,
      manufactureDate: row.manufacture_date,
      expiryDate: row.expiry_date,
    });
  } catch (err) {
    console.error("verify lookup failed:", err);
    return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 });
  }
}
