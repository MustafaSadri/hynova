import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

// Requires DATABASE_URL to be set in .env.local — not checked at import
// time, so the rest of the site keeps working before the database is
// provisioned. Neon's driver queries over HTTP (stateless per call), so
// unlike a TCP driver there's no connection to pool, cache across Hot
// Module Reload, or leak under load.
let sql: NeonQueryFunction<false, false> | undefined;

export function getSql(): NeonQueryFunction<false, false> {
  if (!sql) {
    const url = process.env.DATABASE_URL;
    if (!url) {
      throw new Error("Missing DATABASE_URL environment variable");
    }
    sql = neon(url);
  }
  return sql;
}
