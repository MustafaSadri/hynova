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

const PAGE_WIDTH = 420;
const PAGE_HEIGHT = 560;
const MARGIN = 40;
const TEAL = rgb(0.078, 0.58, 0.533); // close to the site's teal-600
const GRAY = rgb(0.4, 0.4, 0.4);
const DARK = rgb(0.1, 0.1, 0.1);

// Builds a single, simple PDF "entry pass" for one registration — logo,
// event date/time and location (as set on the admin page), the registrant
// and guest names, and a QR code. One pass per registration (admits the
// whole party), not one per person — scanning it on /admin/check-in is
// what shows the "genuine, admit this many people" result.
export async function buildEntryPassPdf(input: EntryPassInput): Promise<Uint8Array> {
  const checkInUrl = `${input.baseUrl.replace(/\/$/, "")}/admin/check-in?token=${input.passToken}`;
  const qrPngBytes = await QRCode.toBuffer(checkInUrl, {
    type: "png",
    width: 260,
    margin: 1,
    color: { dark: "#0f172a", light: "#ffffff" },
  });

  const pdf = await PDFDocument.create();
  pdf.registerFontkit(fontkit);
  const page = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  const regular = await pdf.embedFont(REGULAR_FONT_BYTES);
  const bold = await pdf.embedFont(BOLD_FONT_BYTES);
  const qrImage = await pdf.embedPng(qrPngBytes);
  const logoImage = await pdf.embedPng(LOGO_PNG_BYTES);

  let y = PAGE_HEIGHT - MARGIN;

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
  const logoHeight = 26;
  const logoWidth = (logoImage.width / logoImage.height) * logoHeight;
  page.drawImage(logoImage, {
    x: (PAGE_WIDTH - logoWidth) / 2,
    y: y - logoHeight,
    width: logoWidth,
    height: logoHeight,
  });
  y -= logoHeight + 22;

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

  const qrSize = 170;
  const qrX = (PAGE_WIDTH - qrSize) / 2;
  y -= qrSize;
  page.drawImage(qrImage, { x: qrX, y, width: qrSize, height: qrSize });

  return pdf.save();
}
