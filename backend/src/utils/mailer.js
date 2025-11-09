import nodemailer from "nodemailer";

let transporter;

// 🔍 Detect environment
const isProduction = process.env.NODE_ENV === "production";

// ✅ Gmail for local development
if (!isProduction) {
  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER, // your Gmail address
      pass: process.env.EMAIL_PASS, // your Gmail App Password
    },
  });

  console.log("📬 Mailer initialized with Gmail (development mode)");
}

// ✅ SendGrid for production (Render, Vercel, etc.)
else {
  transporter = nodemailer.createTransport({
    service: "SendGrid",
    auth: {
      user: "apikey",
      pass: process.env.SENDGRID_API_KEY, // set this in Render
    },
  });

  console.log("📦 Mailer initialized with SendGrid (production mode)");
}

/**
 * Send an email with both text and HTML support
 * @param {Object} options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Subject line
 * @param {string} options.text - Plain text version
 * @param {string} options.html - HTML version
 */
export const sendMail = async ({ to, subject, text, html }) => {
  try {
    await transporter.sendMail({
      from: `"Zilla Panchayat" <${process.env.EMAIL_USER || "no-reply@zillapanchayat.gov"}>`,
      to,
      subject,
      text,
      html,
    });
    console.log(`✅ Mail successfully sent to ${to}`);
  } catch (err) {
    console.error("⚠️ Email sending failed:", err);
  }
};
