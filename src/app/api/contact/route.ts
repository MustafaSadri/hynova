import { NextResponse } from "next/server";
import { Resend } from "resend";

const TO_ADDRESS = "info@cynapept.com";
const MAX_FIELD_LENGTH = 5000;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_request" }, { status: 400 });
  }

  const { email, interest, message } = (body ?? {}) as Record<string, unknown>;

  if (
    typeof email !== "string" ||
    !EMAIL_PATTERN.test(email) ||
    email.length > MAX_FIELD_LENGTH
  ) {
    return NextResponse.json({ ok: false, error: "invalid_email" }, { status: 400 });
  }
  if (typeof interest !== "string" || !interest.trim() || interest.length > MAX_FIELD_LENGTH) {
    return NextResponse.json({ ok: false, error: "invalid_interest" }, { status: 400 });
  }
  if (message !== undefined && message !== null) {
    if (typeof message !== "string" || message.length > MAX_FIELD_LENGTH) {
      return NextResponse.json({ ok: false, error: "invalid_message" }, { status: 400 });
    }
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("contact form: missing RESEND_API_KEY");
    return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 });
  }

  const trimmedMessage = typeof message === "string" ? message.trim() : "";

  try {
    const resend = new Resend(apiKey);
    // reply-to is the customer's own address, so hitting "Reply" in the
    // inbox goes straight back to them.
    const { error } = await resend.emails.send({
      from: "Cynapept Website <noreply@cynapept.com>",
      to: TO_ADDRESS,
      replyTo: email,
      subject: `Cynapept contact form — ${interest}`,
      html: `
        <p><strong>From:</strong> ${escapeHtml(email)}</p>
        <p><strong>Interested in:</strong> ${escapeHtml(interest)}</p>
        ${trimmedMessage ? `<p><strong>Message:</strong></p><p>${escapeHtml(trimmedMessage).replace(/\n/g, "<br>")}</p>` : ""}
      `,
    });

    if (error) {
      console.error("contact form: resend error:", error);
      return NextResponse.json({ ok: false, error: "send_failed" }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("contact form: unexpected error:", err);
    return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 });
  }
}
