import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import QRCode from "qrcode";
import type { Guest } from "@/lib/rsvp";

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
const PAGE_HEIGHT = 640;
const MARGIN = 36;
const TEAL = rgb(0.078, 0.58, 0.533); // close to the site's teal-600

// Builds a single-page PDF "entry pass" for one registration — one pass
// admits the whole party (fullName + every entry in `guests`), not one pass
// per person, since door staff only ever scan a single QR per group.
export async function buildEntryPassPdf(input: EntryPassInput): Promise<Uint8Array> {
  const checkInUrl = `${input.baseUrl.replace(/\/$/, "")}/admin/check-in?token=${input.passToken}`;
  const qrPngBytes = await QRCode.toBuffer(checkInUrl, {
    type: "png",
    width: 280,
    margin: 1,
    color: { dark: "#0f172a", light: "#ffffff" },
  });

  const pdf = await PDFDocument.create();
  const page = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const qrImage = await pdf.embedPng(qrPngBytes);

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
      color: options.color ?? rgb(0.1, 0.1, 0.1),
    });
    y -= size + (options.gap ?? 6);
  }

  text("CYNAPEPT", { size: 20, font: bold, color: TEAL, gap: 2 });
  text("ENTRY PASS", { size: 11, font: regular, color: rgb(0.45, 0.45, 0.45), gap: 18 });

  text(input.eventName, { size: 16, font: bold, gap: 4 });
  text(input.eventDate, { size: 11, color: rgb(0.35, 0.35, 0.35), gap: 2 });
  text(input.venueName, { size: 11, color: rgb(0.35, 0.35, 0.35), gap: 2 });
  text(input.venueAddress, { size: 11, color: rgb(0.35, 0.35, 0.35), gap: 18 });

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
    text("Additional guests:", { size: 10, color: rgb(0.45, 0.45, 0.45), gap: 4 });
    for (const guest of input.guests) {
      text(`${guest.name} — ${guest.phone}`, { size: 10, gap: 3 });
    }
    y -= 6;
  }

  const qrSize = 180;
  const qrX = (PAGE_WIDTH - qrSize) / 2;
  y -= qrSize;
  page.drawImage(qrImage, { x: qrX, y, width: qrSize, height: qrSize });
  y -= 16;

  const tokenSize = 8;
  const tokenWidth = regular.widthOfTextAtSize(input.passToken, tokenSize);
  page.drawText(input.passToken, {
    x: (PAGE_WIDTH - tokenWidth) / 2,
    y: y - tokenSize,
    size: tokenSize,
    font: regular,
    color: rgb(0.55, 0.55, 0.55),
  });
  y -= tokenSize + 20;

  const footer = "Present this pass (digital or printed) at entry. Questions? support@cynapept.com";
  const footerSize = 9;
  page.drawText(footer, {
    x: MARGIN,
    y: MARGIN,
    size: footerSize,
    font: regular,
    color: rgb(0.5, 0.5, 0.5),
    maxWidth: PAGE_WIDTH - MARGIN * 2,
  });

  return pdf.save();
}
