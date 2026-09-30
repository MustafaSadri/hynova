// Resets a range of already-printed codes, identified by serial number:
// either clear the product info shown on scan (name/dosage/dates), reset
// scan status (scan_count/first_scanned_at/last_scanned_at) so codes
// register as unscanned again, or both. The serial number itself is never
// touched — it's only ever used to select the range, never written to.
//
// This is production data: every reset shows exactly how many codes it
// will affect and requires a typed "yes" before running. Nothing happens
// on an unseen range.
//
// Requires DATABASE_URL in the environment:
//   node --env-file=.env.local scripts/reset-codes.mjs

import { neon } from "@neondatabase/serverless";
import { createInterface } from "readline/promises";

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

async function askChoice(rl, label, choices) {
  while (true) {
    console.log(label);
    choices.forEach((choice, i) => console.log(`  ${i + 1}. ${choice.label}`));
    const answer = (await rl.question(`Enter a number (1-${choices.length}): `)).trim();
    const selected = choices[Number(answer) - 1];
    if (selected) return selected.value;
    console.log(`Please enter a number between 1 and ${choices.length}.`);
  }
}

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error(
      "Missing DATABASE_URL. Run with: node --env-file=.env.local scripts/reset-codes.mjs",
    );
    process.exit(1);
  }

  const sql = neon(url);
  const rl = createInterface({ input: process.stdin, output: process.stdout });

  try {
    console.log("Which serial number range do you want to reset?");
    const start = await askPositiveInt(rl, "Start serial number");
    const end = await askPositiveInt(rl, "End serial number");

    if (end < start) {
      console.error("End serial number must be greater than or equal to the start.");
      process.exit(1);
    }

    const matched = await sql`
      SELECT serial_number, product_name, scan_count
      FROM codes
      WHERE serial_number BETWEEN ${start} AND ${end}
      ORDER BY serial_number
    `;

    if (matched.length === 0) {
      console.error(`No codes found with serial numbers between ${start} and ${end}.`);
      process.exit(1);
    }

    const withInfo = matched.filter((r) => r.product_name);
    const withScans = matched.filter((r) => r.scan_count > 0);
    const minSerial = matched[0].serial_number;
    const maxSerial = matched[matched.length - 1].serial_number;

    console.log(`\nFound ${matched.length} code(s), serial #${minSerial}-#${maxSerial}.`);
    console.log(`${withInfo.length} of them currently have product info displayed on scan.`);
    console.log(`${withScans.length} of them have a scan count greater than zero.`);

    const what = await askChoice(rl, "\nWhat do you want to reset for this range?", [
      { label: "Displayed product info only (name, dosage, dates)", value: "info" },
      { label: "Scan count/status only", value: "scans" },
      { label: "Both", value: "both" },
    ]);

    const resetInfo = what === "info" || what === "both";
    const resetScans = what === "scans" || what === "both";

    if (resetInfo && withInfo.length === 0) {
      console.log("\nNone of these codes currently have product info set — nothing to clear there.");
    }
    if (resetScans && withScans.length === 0) {
      console.log("\nNone of these codes have been scanned yet — nothing to reset there.");
    }

    const affectedCount = resetInfo && resetScans
      ? matched.length
      : resetInfo
        ? withInfo.length
        : withScans.length;

    if (affectedCount === 0) {
      console.log("\nNothing to do. No changes made.");
      return;
    }

    console.log("\nAbout to reset:");
    console.log(`  Range: serial #${start}-#${end}`);
    if (resetInfo) console.log(`  Clear product info for ${withInfo.length} code(s)`);
    if (resetScans) console.log(`  Reset scan count/status for ${withScans.length} code(s)`);
    console.log("  Serial numbers themselves are never changed.");

    const confirmed = await askYesNo(rl, "\nType yes to apply this reset");
    if (!confirmed) {
      console.log("Cancelled. No changes made.");
      return;
    }

    if (resetInfo) {
      const cleared = await sql`
        UPDATE codes
        SET product_name = NULL,
            dosage = NULL,
            manufacture_date = NULL,
            expiry_date = NULL
        WHERE serial_number BETWEEN ${start} AND ${end}
        RETURNING code
      `;
      console.log(`Cleared product info for ${cleared.length} code(s).`);
    }

    if (resetScans) {
      const reset = await sql`
        UPDATE codes
        SET scan_count = 0,
            first_scanned_at = NULL,
            last_scanned_at = NULL
        WHERE serial_number BETWEEN ${start} AND ${end}
        RETURNING code
      `;
      console.log(`Reset scan count/status for ${reset.length} code(s).`);
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
