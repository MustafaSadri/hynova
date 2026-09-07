import type { ProductGroup } from "@/lib/product-groups";

export const CODES_TABLE = "codes";

export interface CodeRow {
  code: string;
  product_group: ProductGroup;
  batch_id: string | null;
  serial_number: number;
  scan_count: number;
  first_scanned_at: string | null;
  last_scanned_at: string | null;
  created_at: string;
}

// Codes may come from typed input, a decoded QR, or a scanned URL, so
// normalize whitespace/case before touching the database.
export function normalizeCode(raw: string): string {
  return raw.trim().toUpperCase();
}
