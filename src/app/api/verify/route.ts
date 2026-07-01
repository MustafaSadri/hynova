import { NextRequest, NextResponse } from "next/server";

// ─── PROTOTYPE: hardcoded codes ───────────────────────────────────────────────
// Replace this object with a real database query when scaling up.
// Key  = the code printed on the sticker (case-insensitive match below)
// Value = product info shown to the customer on successful verification
const VALID_CODES: Record<string, {
  product: string;
  category: string;
  batch: string;
  manufactured: string;
  expiry: string;
}> = {
  // ── Retatrutide Injection ──────────────────────────────────────────────────
  "CYNOVA-RET-INJ-A1B2C3": {
    product: "Retatrutide Injection",
    category: "Injectable Peptide",
    batch: "BATCH-RET-001",
    manufactured: "January 2025",
    expiry: "January 2027",
  },
  "CYNOVA-RET-INJ-P7Q8R9": {
    product: "Retatrutide Injection",
    category: "Injectable Peptide",
    batch: "BATCH-RET-002",
    manufactured: "April 2025",
    expiry: "April 2027",
  },

  // ── Retatrutide Powder ─────────────────────────────────────────────────────
  "CYNOVA-RET-POW-D4E5F6": {
    product: "Retatrutide Powder",
    category: "Lyophilized Peptide",
    batch: "BATCH-RET-001",
    manufactured: "January 2025",
    expiry: "January 2027",
  },
  "CYNOVA-RET-POW-X2Y3Z4": {
    product: "Retatrutide Powder",
    category: "Lyophilized Peptide",
    batch: "BATCH-RET-002",
    manufactured: "April 2025",
    expiry: "April 2027",
  },

  // ── Tirzepatide Injection ──────────────────────────────────────────────────
  "CYNOVA-TIR-INJ-G7H8I9": {
    product: "Tirzepatide Injection",
    category: "Injectable Peptide",
    batch: "BATCH-TIR-001",
    manufactured: "February 2025",
    expiry: "February 2027",
  },
  "CYNOVA-TIR-INJ-S1T2U3": {
    product: "Tirzepatide Injection",
    category: "Injectable Peptide",
    batch: "BATCH-TIR-002",
    manufactured: "April 2025",
    expiry: "April 2027",
  },

  // ── Tirzepatide Powder ─────────────────────────────────────────────────────
  "CYNOVA-TIR-POW-J1K2L3": {
    product: "Tirzepatide Powder",
    category: "Lyophilized Peptide",
    batch: "BATCH-TIR-001",
    manufactured: "February 2025",
    expiry: "February 2027",
  },
  "CYNOVA-TIR-POW-W5X6Y7": {
    product: "Tirzepatide Powder",
    category: "Lyophilized Peptide",
    batch: "BATCH-TIR-002",
    manufactured: "April 2025",
    expiry: "April 2027",
  },

  // ── Orforglipron Tablets ───────────────────────────────────────────────────
  "CYNOVA-ORF-TAB-M4N5O6": {
    product: "Orforglipron Tablets",
    category: "Oral Non-peptide",
    batch: "BATCH-ORF-001",
    manufactured: "March 2025",
    expiry: "March 2027",
  },
  "CYNOVA-ORF-TAB-V4W5X6": {
    product: "Orforglipron Tablets",
    category: "Oral Non-peptide",
    batch: "BATCH-ORF-002",
    manufactured: "May 2025",
    expiry: "May 2027",
  },
};
// ─────────────────────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const raw: string = body?.code ?? "";
  const code = raw.trim().toUpperCase();

  if (!code) {
    return NextResponse.json({ valid: false, reason: "no_code" }, { status: 400 });
  }

  const info = VALID_CODES[code];

  if (!info) {
    return NextResponse.json({ valid: false, reason: "not_found" });
  }

  return NextResponse.json({ valid: true, ...info });
}
