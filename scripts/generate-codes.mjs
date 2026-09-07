// Generates unique, secure authentication codes for one product group,
// inserts them into Postgres (Neon), and writes a CSV of code + QR
// verification URL to hand to the sticker manufacturer. The manufacturer
// only ever sees this CSV — they generate the physical QR image and print
// it, they never touch the database.
//
// Requires DATABASE_URL in the environment.
//
// Interactive (prompts for category, count, and output file name):
//   node --env-file=.env.local scripts/generate-codes.mjs
//
// Non-interactive, for scripting/automation:
//   node --env-file=.env.local scripts/generate-codes.mjs --group=<PEN_1|PEN_2|VIAL|TABLET> --count=<n> --out=<file.csv> [--base-url=https://cynapept.com] [--batch=<label>]

import { neon } from "@neondatabase/serverless";
import { randomBytes } from "crypto";
import { writeFile, mkdir } from "fs/promises";
import { dirname } from "path";
import { createInterface } from "readline/promises";

const PRODUCT_GROUPS = ["PEN_1", "PEN_2", "VIAL", "TABLET"];
const PRODUCT_GROUP_LABELS = {
  PEN_1: "Pen 1",
  PEN_2: "Pen 2",
  VIAL: "Vial",
  TABLET: "Tablet",
};

// Mirrors the CodeRow shape in src/lib/codes.ts — kept here (rather than
// imported) since this plain Node script can't import TypeScript sources.
const CREATE_CODES_TABLE_SQL = `
  CREATE TABLE IF NOT EXISTS codes (
    code TEXT PRIMARY KEY,
    product_group TEXT NOT NULL,
    batch_id TEXT,
    serial_number BIGINT GENERATED ALWAYS AS IDENTITY UNIQUE,
    scan_count INTEGER NOT NULL DEFAULT 0,
    first_scanned_at TIMESTAMPTZ,
    last_scanned_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )
`;
const CREATE_CODES_PRODUCT_GROUP_INDEX_SQL = `
  CREATE INDEX IF NOT EXISTS codes_product_group_idx ON codes (product_group)
`;

// Self-healing migration for tables created before serial_number existed
// (safe to run every time — each step only acts if there's something to do).
// Backfills existing rows in creation order, then wires up a sequence so
// every future INSERT gets the next serial automatically, same as a fresh
// GENERATED ALWAYS AS IDENTITY column would.
const MIGRATION_STEPS_SQL = [
  `ALTER TABLE codes ADD COLUMN IF NOT EXISTS serial_number BIGINT`,
  `
    UPDATE codes
    SET serial_number = sub.rn
    FROM (
      SELECT code, ROW_NUMBER() OVER (ORDER BY created_at, code) AS rn
      FROM codes
      WHERE serial_number IS NULL
    ) sub
    WHERE codes.code = sub.code
  `,
  `CREATE SEQUENCE IF NOT EXISTS codes_serial_number_seq OWNED BY codes.serial_number`,
  `SELECT setval('codes_serial_number_seq', COALESCE((SELECT MAX(serial_number) FROM codes), 0))`,
  `ALTER TABLE codes ALTER COLUMN serial_number SET DEFAULT nextval('codes_serial_number_seq')`,
  `ALTER TABLE codes ALTER COLUMN serial_number SET NOT NULL`,
  `
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'codes_serial_number_unique'
      ) THEN
        ALTER TABLE codes ADD CONSTRAINT codes_serial_number_unique UNIQUE (serial_number);
      END IF;
    END $$
  `,
];

// Excludes visually ambiguous characters (0/O, 1/I/L) since customers may
// need to type a code by hand if scanning fails.
const ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";
const SEGMENT_LENGTH = 4;
const SEGMENT_COUNT = 3;

function parseArgs(argv) {
  const args = {};
  for (const arg of argv) {
    const match = /^--([^=]+)=(.*)$/.exec(arg);
    if (match) args[match[1]] = match[2];
  }
  return args;
}

function randomSegment() {
  const bytes = randomBytes(SEGMENT_LENGTH);
  let segment = "";
  for (let i = 0; i < SEGMENT_LENGTH; i++) {
    segment += ALPHABET[bytes[i] % ALPHABET.length];
  }
  return segment;
}

function generateCode() {
  const segments = Array.from({ length: SEGMENT_COUNT }, randomSegment);
  return `CYN-${segments.join("-")}`;
}

function csvEscape(value) {
  return `"${String(value).replace(/"/g, '""')}"`;
}

// Prompts for category, count, and output file name when the script is run
// with no flags — the flag-based path above stays available for scripting.
async function promptForOptions() {
  const rl = createInterface({ input: process.stdin, output: process.stdout });

  console.log("Which product group are these codes for?");
  PRODUCT_GROUPS.forEach((group, i) => {
    console.log(`  ${i + 1}. ${PRODUCT_GROUP_LABELS[group]}`);
  });

  let group;
  while (!group) {
    const answer = (await rl.question(`Enter a number (1-${PRODUCT_GROUPS.length}): `)).trim();
    const selected = PRODUCT_GROUPS[Number(answer) - 1];
    if (selected) group = selected;
    else console.log(`Please enter a number between 1 and ${PRODUCT_GROUPS.length}.`);
  }

  let count;
  while (!count) {
    const answer = (await rl.question("How many codes to generate? ")).trim();
    const n = Number(answer);
    if (Number.isInteger(n) && n > 0) count = n;
    else console.log("Please enter a positive whole number.");
  }

  const defaultFileName = `${group.toLowerCase().replace("_", "-")}-${count}`;
  let fileName = (
    await rl.question(`Output file name, without .csv [${defaultFileName}]: `)
  ).trim();
  if (!fileName) fileName = defaultFileName;
  fileName = fileName.replace(/\.csv$/i, "");

  const defaultBaseUrl = "https://cynapept.com";
  let baseUrl = (
    await rl.question(`Verification site base URL [${defaultBaseUrl}]: `)
  ).trim();
  if (!baseUrl) baseUrl = defaultBaseUrl;

  const defaultBatch = `${group}-${new Date().toISOString().slice(0, 10)}`;
  let batchId = (await rl.question(`Batch label [${defaultBatch}]: `)).trim();
  if (!batchId) batchId = defaultBatch;

  rl.close();

  return {
    group,
    count,
    outPath: `out/${fileName}.csv`,
    baseUrl: baseUrl.replace(/\/$/, ""),
    batchId,
  };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const interactive = !args.group && !args.count;

  const { group, count, outPath, baseUrl, batchId } = interactive
    ? await promptForOptions()
    : {
        group: args.group,
        count: Number(args.count),
        outPath: args.out,
        baseUrl: (args["base-url"] || "https://cynapept.com").replace(/\/$/, ""),
        batchId: args.batch || null,
      };

  if (!group || !PRODUCT_GROUPS.includes(group)) {
    console.error(`--group must be one of: ${PRODUCT_GROUPS.join(", ")}`);
    process.exit(1);
  }
  if (!Number.isInteger(count) || count <= 0) {
    console.error("--count must be a positive integer");
    process.exit(1);
  }
  if (!outPath) {
    console.error("--out is required, e.g. --out=out/pen-1.csv");
    process.exit(1);
  }
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error(
      "Missing DATABASE_URL. Run with: node --env-file=.env.local scripts/generate-codes.mjs ...",
    );
    process.exit(1);
  }

  const sql = neon(url);
  await sql.query(CREATE_CODES_TABLE_SQL);
  await sql.query(CREATE_CODES_PRODUCT_GROUP_INDEX_SQL);
  for (const step of MIGRATION_STEPS_SQL) {
    await sql.query(step);
  }

  console.log(`Generating ${count} codes for ${group}...`);

  const codes = new Set();
  while (codes.size < count) {
    codes.add(generateCode());
  }
  const codeList = [...codes];

  // Only codes actually confirmed inserted (via RETURNING) ever make it into
  // the CSV — this way, even if a chunk fails after all retries, the file we
  // write always matches exactly what's really in the database. Losing the
  // CSV for codes that *are* live would mean unprintable, unaccountable
  // codes sitting in the system with no record of what they are.
  const insertedCodes = [];

  const BATCH_SIZE = 250;
  const MAX_ATTEMPTS = 4;

  async function insertChunkWithRetry(chunk) {
    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      try {
        return await sql.transaction(
          chunk.map(
            (code) => sql`
              INSERT INTO codes (code, product_group, batch_id)
              VALUES (${code}, ${group}, ${batchId})
              ON CONFLICT (code) DO NOTHING
              RETURNING code
            `,
          ),
        );
      } catch (err) {
        if (attempt === MAX_ATTEMPTS) throw err;
        const delayMs = 1000 * 2 ** (attempt - 1);
        console.warn(
          `\nChunk failed (attempt ${attempt}/${MAX_ATTEMPTS}): ${err.message}. Retrying in ${delayMs}ms...`,
        );
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }
  }

  // The product group is tracked in our database, not in the exported file —
  // the stickers are generic and can be applied to any product, so the CSV
  // handed to the manufacturer only ever carries code + QR URL. The file
  // name is what tells you (internally) which group a batch belongs to.
  async function writeCsv() {
    const header = "code,qrUrl\n";
    const rows = insertedCodes
      .map((code) => {
        const qrUrl = `${baseUrl}/verify?code=${code}`;
        return [csvEscape(code), csvEscape(qrUrl)].join(",");
      })
      .join("\n");
    await mkdir(dirname(outPath), { recursive: true });
    await writeFile(outPath, header + (rows ? rows + "\n" : ""), "utf8");
  }

  try {
    for (let i = 0; i < codeList.length; i += BATCH_SIZE) {
      const chunk = codeList.slice(i, i + BATCH_SIZE);
      const results = await insertChunkWithRetry(chunk);
      results.forEach((rows, idx) => {
        if (rows.length > 0) insertedCodes.push(chunk[idx]);
      });
      process.stdout.write(
        `\rInserted ${Math.min(i + BATCH_SIZE, codeList.length)}/${codeList.length}`,
      );
    }
  } catch (err) {
    console.error(
      `\n\nStopped after inserting ${insertedCodes.length}/${codeList.length} codes: ${err.message}`,
    );
    await writeCsv();
    console.error(
      `Wrote the ${insertedCodes.length} confirmed codes to ${outPath} so nothing is undocumented. ` +
        `Re-run with a different --batch label (or answer differently at the prompt) to generate the remaining ${codeList.length - insertedCodes.length}.`,
    );
    process.exit(1);
  }

  console.log(`\nInserted ${insertedCodes.length} new codes into Postgres.`);

  await writeCsv();
  console.log(`Wrote ${insertedCodes.length} rows to ${outPath}`);
  console.log(
    "This file contains every valid code for this batch — treat it as a secret, share it with the manufacturer over a secure channel only.",
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
