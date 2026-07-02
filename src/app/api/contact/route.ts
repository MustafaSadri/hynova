import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, company, message } = body;

    // Simple validation
    if (!firstName || !email || !message) {
      return NextResponse.json(
        { error: "Required fields are missing: firstName, email, message" },
        { status: 400 }
      );
    }

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    const host = process.env.SMTP_HOST;
    const port = parseInt(process.env.SMTP_PORT || "587", 10);
    const secure = process.env.SMTP_SECURE === "true";
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const from = process.env.SMTP_FROM || `"CYNOVA Website" <support@cynova.life>`;
    const receiver = process.env.CONTACT_RECEIVER || "support@cynova.life";

    // If SMTP details are not configured, log it and return simulation success
    // to allow front-end testing when environment variables are not yet loaded.
    if (!host || !user || !pass) {
      console.warn("⚠️ SMTP environment variables are not fully configured. Simulating email delivery.");
      console.log("Simulated Contact Form Submission:", {
        to: receiver,
        from: email,
        name: `${firstName} ${lastName || ""}`.trim(),
        company: company || "N/A",
        message: message,
      });

      return NextResponse.json({
        success: true,
        simulated: true,
        message: "SMTP not configured, simulated sending.",
      });
    }

    // Configure transporter
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: {
        user,
        pass,
      },
    });

    const mailOptions = {
      from,
      replyTo: `"${firstName} ${lastName || ""}" <${email}>`,
      to: receiver,
      subject: `New CYNOVA Contact Inquiry from ${firstName} ${lastName || ""}`,
      text: `
Name: ${firstName} ${lastName || ""}
Email: ${email}
Company: ${company || "Not Specified"}
Message:
${message}
      `,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #0e7490; border-bottom: 2px solid #0e7490; padding-bottom: 10px; margin-top: 0;">New CYNOVA Contact Form Submission</h2>
          
          <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; width: 120px; color: #475569;">First Name:</td>
              <td style="padding: 8px 0; color: #0f172a;">${firstName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #475569;">Last Name:</td>
              <td style="padding: 8px 0; color: #0f172a;">${lastName || "N/A"}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #475569;">Email:</td>
              <td style="padding: 8px 0; color: #0f172a;"><a href="mailto:${email}">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #475569;">Company:</td>
              <td style="padding: 8px 0; color: #0f172a;">${company || "N/A"}</td>
            </tr>
          </table>
          
          <div style="margin-top: 20px; padding: 15px; background-color: #f8fafc; border-radius: 6px; border-left: 4px solid #0e7490;">
            <h4 style="margin-top: 0; margin-bottom: 8px; color: #475569;">Message:</h4>
            <p style="color: #0f172a; white-space: pre-wrap; margin: 0; line-height: 1.5;">${message}</p>
          </div>
          
          <p style="margin-top: 30px; font-size: 11px; color: #94a3b8; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 15px;">
            This email was generated automatically by the CYNOVA.LIFE website contact form.
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error sending contact email via Nodemailer:", error);
    return NextResponse.json(
      { error: "Internal server error occurred while sending the email." },
      { status: 500 }
    );
  }
}
