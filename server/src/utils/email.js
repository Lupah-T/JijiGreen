import nodemailer from "nodemailer";

const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
const EMAIL_FROM = process.env.EMAIL_FROM || EMAIL_USER || "no-reply@jijigreen.com";

let transporter = null;
const getTransporter = () => {
  if (transporter) return transporter;
  if (EMAIL_USER && EMAIL_PASS) {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: EMAIL_USER, pass: EMAIL_PASS },
    });
    return transporter;
  }

  // fallback: try SMTP env vars
  if (process.env.SMTP_HOST) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: (process.env.SMTP_SECURE || "false") === "true",
      auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
    });
    return transporter;
  }

  return null;
};

export const sendPasswordResetEmail = async (to, resetLink) => {
  const t = getTransporter();
  const subject = "Reset your JijiGreen password";
  const text = `You requested a password reset. Use the link below to reset your password (valid for 15 minutes):\n\n${resetLink}`;
  const html = `<p>You requested a password reset. Use the link below to reset your password (valid for 15 minutes):</p><p><a href="${resetLink}">${resetLink}</a></p>`;

  if (!t) {
    console.log(`No email transporter configured. Reset link for ${to}: ${resetLink}`);
    return { delivered: false, message: "No transporter configured" };
  }

  const info = await t.sendMail({ from: EMAIL_FROM, to, subject, text, html });
  return { delivered: true, info };
};

export const sendPasswordChangedEmail = async (to) => {
  const t = getTransporter();
  const subject = "Your JijiGreen password was changed";
  const text = "Your JijiGreen account password has been changed. If you did not perform this action, contact support.";
  const html = `<p>Your JijiGreen account password has been changed. If you did not perform this action, contact support.</p>`;

  if (!t) {
    console.log(`Password changed notification for ${to}`);
    return { delivered: false, message: "No transporter configured" };
  }

  const info = await t.sendMail({ from: EMAIL_FROM, to, subject, text, html });
  return { delivered: true, info };
};
