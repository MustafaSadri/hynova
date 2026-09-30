// Attaches product info (name, dosage, manufacturing date, validity/expiry
// date) to a range of already-printed codes, identified by serial number —
// and shown on the verify page the next time each code is scanned. Can also
// reset scan status for a range so codes register as unscanned again.
//
// This is production data: every step that would overwrite existing info or
// reset scan history shows exactly what it's about to touch and requires a
// typed "yes" before running. Nothing destructive happens on an unseen range.
//
// Requires DATABASE_URL in the environment:
//   node --env-file=.env.local scripts/set-product-details.mjs

import { neon } from "@neondatabase/serverless";
import { createInterface } from "readline/promises";

const MIGRATION_SQL = `
  ALTER TABLE codes
    ADD COLUMN IF NOT EXISTS product_name TEXT,
    ADD COLUMN IF NOT EXISTS dosage TEXT,
    ADD COLUMN IF NOT EXISTS manufacture_date DATE,
    ADD COLUMN IF NOT EXISTS expiry_date DATE
`;

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function isValidDate(value) {
  if (!DATE_RE.test(value)) return false;
  const d = new Date(value);
  return !Number.isNaN(d.getTime());
}

async function askYesNo(rl, question) {
  const answer = (await rl.question(`${question} (yes/no): `)).trim().toLowerCase();
  return answer === "yes" || answer === "y";
}

async function askPositiveInt(rl, label) {
  while (true) {
    const answer = (await rl.question(`${label}: `)).trim();
    const n = Number(answer);
    if (Number.isInteger(n) && n > 0) return n;
    console.log("Please enter a positive whole number.");
  }
}

async function askOptionalDate(rl, label) {
  while (true) {
    const answer = (await rl.question(`${label} (YYYY-MM-DD, leave blank for none): `)).trim();
    if (!answer) return null;
    if (isValidDate(answer)) return answer;
    console.log("Please enter a date as YYYY-MM-DD, e.g. 2026-03-05, or leave blank.");
  }
}

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error(
      "Missing DATABASE_URL. Run with: node --env-file=.env.local scripts/set-product-details.mjs",
    );
    process.exit(1);
  }

  const sql = neon(url);
  await sql.query(MIGRATION_SQL);

  const rl = createInterface({ input: process.stdin, output: process.stdout });

  try {
    console.log("Which serial number range are you setting product info for?");
    const start = await askPositiveInt(rl, "Start serial number");
    const end = await askPositiveInt(rl, "End serial number");

    if (end < start) {
      console.error("End serial number must be greater than or equal to the start.");
      process.exit(1);
    }

    const matched = await sql`
      SELECT code, serial_number, product_name, scan_count
      FROM codes
      WHERE serial_number BETWEEN ${start} AND ${end}
      ORDER BY serial_number
    `;

    if (matched.length === 0) {
      console.error(`No codes found with serial numbers between ${start} and ${end}.`);
      process.exit(1);
    }

    const alreadySet = matched.filter((r) => r.product_name);
    const alreadyScanned = matched.filter((r) => r.scan_count > 0);
    const minSerial = matched[0].serial_number;
    const maxSerial = matched[matched.length - 1].serial_number;

    console.log(`\nFound ${matched.length} code(s), serial #${minSerial}-#${maxSerial}.`);
    console.log(`${alreadyScanned.length} of them have been scanned at least once.`);

    if (alreadySet.length > 0) {
      const distinctNames = [...new Set(alreadySet.map((r) => r.product_name))].slice(0, 5);
      console.log(
        `\n${alreadySet.length} of them already have product info set, and would be OVERWRITTEN:`,
      );
      distinctNames.forEach((name) => console.log(`  - "${name}"`));
      const confirmOverwrite = await askYesNo(
        rl,
        "\nType yes to continue and overwrite this existing info, or anything else to cancel",
      );
      if (!confirmOverwrite) {
        console.log("Cancelled. No changes made.");
        return;
      }
    }

    console.log("\nEnter the product info to apply to all of these codes:");
    let productName = "";
    while (!productName) {
      productName = (await rl.question("Product name (required): ")).trim();
      if (!productName) console.log("Product name can't be blank.");
    }
    const dosage = (await rl.question("Dosage, free text (leave blank for none): ")).trim() || null;
    const manufactureDate = await askOptionalDate(rl, "Manufacturing date");
    const expiryDate = await askOptionalDate(rl, "Validity / expiry date");

    if (manufactureDate && expiryDate && expiryDate < manufactureDate) {
      const proceedAnyway = await askYesNo(
        rl,
        `\nExpiry date (${expiryDate}) is before the manufacturing date (${manufactureDate}). Use these values anyway?`,
      );
      if (!proceedAnyway) {
        console.log("Cancelled. No changes made.");
        return;
      }
    }

    console.log("\nAbout to apply:");
    console.log(`  Range:        serial #${start}-#${end} (${matched.length} code(s))`);
    console.log(`  Product name: ${productName}`);
    console.log(`  Dosage:       ${dosage ?? "(none)"}`);
    console.log(`  Manufactured: ${manufactureDate ?? "(none)"}`);
    console.log(`  Valid until:  ${expiryDate ?? "(none)"}`);

    const confirmApply = await askYesNo(rl, `\nType yes to apply this to ${matched.length} code(s)`);
    if (!confirmApply) {
      console.log("Cancelled. No changes made.");
      return;
    }

    const updated = await sql`
      UPDATE codes
      SET product_name = ${productName},
          dosage = ${dosage},
          manufacture_date = ${manufactureDate},
          expiry_date = ${expiryDate}
      WHERE serial_number BETWEEN ${start} AND ${end}
      RETURNING code
    `;
    console.log(`\nUpdated ${updated.length} code(s) with the new product info.`);

    const resetScans = await askYesNo(
      rl,
      "\nReset scan status for these codes so they register as unscanned again?",
    );
    if (resetScans) {
      if (alreadyScanned.length === 0) {
        console.log("None of these codes have been scanned yet — nothing to reset.");
      } else {
        console.log(`\n${alreadyScanned.length} code(s) in this range have scan_count > 0.`);
        const confirmReset = await askYesNo(
          rl,
          `Type yes to reset scan_count, first_scanned_at, and last_scanned_at for ${alreadyScanned.length} code(s)`,
        );
        if (confirmReset) {
          const reset = await sql`
            UPDATE codes
            SET scan_count = 0,
                first_scanned_at = NULL,
                last_scanned_at = NULL
            WHERE serial_number BETWEEN ${start} AND ${end}
            RETURNING code
          `;
          console.log(`Reset scan status for ${reset.length} code(s).`);
        } else {
          console.log("Skipped resetting scan status.");
        }
      }
    }

    console.log("\nDone.");
  } finally {
    rl.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
