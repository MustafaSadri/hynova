import { readFileSync } from "fs";
import path from "path";
import { PDFDocument, rgb } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import QRCode from "qrcode";
import type { Guest } from "@/lib/rsvp";

// pdf-lib's built-in standard fonts only support WinAnsi encoding (Latin),
// so any Cyrillic text — guest names, Russian event/venue details, since
// the site defaults to Russian — throws ("WinAnsi cannot encode ..."). A
// real embedded Unicode font is required for any non-Latin script; DejaVu
// Sans has broad Cyrillic (and Latin) coverage and ships as plain .ttf
// files via this dependency, so it can be read and embedded directly.
const FONTS_DIR = path.join(process.cwd(), "node_modules/dejavu-fonts-ttf/ttf");
const REGULAR_FONT_BYTES = readFileSync(path.join(FONTS_DIR, "DejaVuSans.ttf"));
const BOLD_FONT_BYTES = readFileSync(path.join(FONTS_DIR, "DejaVuSans-Bold.ttf"));

// pdf-lib can only embed a raster image, not the site's SVG logo — this is
// a pre-rendered PNG of that same logo (see assets/pdf/README for how it
// was generated), committed once rather than rasterized on every request.
const LOGO_PNG_BYTES = readFileSync(path.join(process.cwd(), "assets/pdf/cynapept-logo.png"));

export interface EntryPassInput {
  fullName: string;
  guestCount: number;
  guests: Guest[];
  eventName: string;
  eventDate: string;
  venueName: string;
  venueAddress: string;
  passToken: string;
  baseUrl: string;
}

// Shared between every caller that builds a pass (automatic send on
// registration, admin resend) so the fallback copy and base-URL logic
// can't drift between them.
export const DEFAULT_EVENT_NAME = "Cynapept Event Moscow";
export const DEFAULT_EVENT_DATE = "Details to follow";
export const DEFAULT_VENUE_NAME = "Venue to be confirmed";
export const DEFAULT_VENUE_ADDRESS = "";

export function resolveBaseUrl(request: Request): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL;
  if (configured) return configured.replace(/\/$/, "");
  return new URL(request.url).origin;
}

const PAGE_WIDTH = 420;
const MARGIN = 40;
const LOGO_HEIGHT = 26;
const QR_SIZE = 170;
const TEAL = rgb(0.078, 0.58, 0.533); // close to the site's teal-600
const GRAY = rgb(0.4, 0.4, 0.4);
const DARK = rgb(0.1, 0.1, 0.1);

// Pure arithmetic mirror of the vertical space buildEntryPassPdf's drawing
// pass below actually consumes — kept in sync with it so the page is
// always sized to exactly fit its content. A guest list long enough to
// run past a fixed page height would otherwise push the QR (and the
// manual-entry code under it) off the bottom of the page entirely.
function computeContentHeight(input: EntryPassInput): number {
  let height = LOGO_HEIGHT + 22;
  height += 16 + 3; // event name
  height += 11 + 2; // event date
  height += 11 + 2; // venue name
  if (input.venueAddress) height += 11 + 2;
  height += 12; // gap before divider
  height += 18; // gap after divider
  height += 15 + 4; // registrant name
  height += 11 + 10; // "Admits N guests"
  if (input.guests.length > 0) {
    height += input.guests.length * (10 + 3);
    height += 6;
  }
  height += QR_SIZE;
  height += 18; // gap after QR
  height += 9; // pass code line
  return height;
}

// Builds a single, simple PDF "entry pass" for one registration — logo,
// event date/time and location (as set on the admin page), the registrant
// and guest names, a QR code, and the same code printed below it for
// manual entry on /admin/check-in if the QR can't be scanned. One pass per
// registration (admits the whole party), not one per person — scanning it
// is what shows the "genuine, admit this many people" result.
export async function buildEntryPassPdf(input: EntryPassInput): Promise<Uint8Array> {
  const checkInUrl = `${input.baseUrl.replace(/\/$/, "")}/admin/check-in?token=${input.passToken}`;
  const qrPngBytes = await QRCode.toBuffer(checkInUrl, {
    type: "png",
    width: 260,
    margin: 1,
    color: { dark: "#0f172a", light: "#ffffff" },
  });

  const pageHeight = MARGIN * 2 + computeContentHeight(input);

  const pdf = await PDFDocument.create();
  pdf.registerFontkit(fontkit);
  const page = pdf.addPage([PAGE_WIDTH, pageHeight]);
  const regular = await pdf.embedFont(REGULAR_FONT_BYTES);
  const bold = await pdf.embedFont(BOLD_FONT_BYTES);
  const qrImage = await pdf.embedPng(qrPngBytes);
  const logoImage = await pdf.embedPng(LOGO_PNG_BYTES);

  let y = pageHeight - MARGIN;

  function text(
    value: string,
    options: { size?: number; font?: typeof regular; color?: ReturnType<typeof rgb>; gap?: number } = {},
  ) {
    const size = options.size ?? 11;
    const font = options.font ?? regular;
    page.drawText(value, {
      x: MARGIN,
      y: y - size,
      size,
      font,
      color: options.color ?? DARK,
    });
    y -= size + (options.gap ?? 6);
  }

  // Logo, centered.
  const logoWidth = (logoImage.width / logoImage.height) * LOGO_HEIGHT;
  page.drawImage(logoImage, {
    x: (PAGE_WIDTH - logoWidth) / 2,
    y: y - LOGO_HEIGHT,
    width: logoWidth,
    height: LOGO_HEIGHT,
  });
  y -= LOGO_HEIGHT + 22;

  text(input.eventName, { size: 16, font: bold, gap: 3 });
  text(input.eventDate, { size: 11, color: GRAY, gap: 2 });
  text(input.venueName, { size: 11, color: GRAY, gap: 2 });
  if (input.venueAddress) {
    text(input.venueAddress, { size: 11, color: GRAY, gap: 2 });
  }
  y -= 12;

  page.drawLine({
    start: { x: MARGIN, y },
    end: { x: PAGE_WIDTH - MARGIN, y },
    thickness: 1,
    color: rgb(0.9, 0.9, 0.9),
  });
  y -= 18;

  text(input.fullName, { size: 15, font: bold, gap: 4 });
  text(`Admits ${input.guestCount} guest${input.guestCount === 1 ? "" : "s"}`, {
    size: 11,
    color: TEAL,
    font: bold,
    gap: 10,
  });

  if (input.guests.length > 0) {
    for (const guest of input.guests) {
      text(guest.name, { size: 10, gap: 3 });
    }
    y -= 6;
  }

  const qrX = (PAGE_WIDTH - QR_SIZE) / 2;
  y -= QR_SIZE;
  page.drawImage(qrImage, { x: qrX, y, width: QR_SIZE, height: QR_SIZE });
  y -= 18;

  // Printed fallback for /admin/check-in's manual-entry field, in case the
  // QR itself can't be scanned (damaged print, camera issue, etc.).
  const codeText = `Pass code: ${input.passToken}`;
  const codeSize = 9;
  const codeWidth = regular.widthOfTextAtSize(codeText, codeSize);
  page.drawText(codeText, {
    x: (PAGE_WIDTH - codeWidth) / 2,
    y: y - codeSize,
    size: codeSize,
    font: regular,
    color: GRAY,
  });

  return pdf.save();
}
