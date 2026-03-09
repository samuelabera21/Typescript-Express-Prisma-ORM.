import { Resend } from "resend";
import nodemailer from "nodemailer";

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    throw new Error("Email service is not configured. Missing RESEND_API_KEY.");
  }

  return new Resend(apiKey);
}

function getSenderEmail() {
  const senderEmail = process.env.RESEND_FROM_EMAIL;

  if (!senderEmail) {
    throw new Error("Email service is not configured. Missing RESEND_FROM_EMAIL.");
  }

  return senderEmail;
}

type SmtpConfig = {
  host: string;
  port: number;
  user: string;
  pass: string;
  from: string;
};

function getSmtpConfig(): SmtpConfig | null {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.MAIL_FROM;

  const hasAnySmtpValue = Boolean(host || port || user || pass || from);

  if (!hasAnySmtpValue) {
    return null;
  }

  if (!host || !port || !user || !pass || !from) {
    throw new Error(
      "SMTP is partially configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, and MAIL_FROM."
    );
  }

  const normalizedPass = pass.replace(/\s+/g, "").trim();
  const parsedPort = Number(port);

  if (Number.isNaN(parsedPort)) {
    throw new Error("Invalid SMTP_PORT. It must be a number.");
  }

  return {
    host,
    port: parsedPort,
    user,
    pass: normalizedPass,
    from,
  };
}

async function sendWithSmtp(
  email: string,
  subject: string,
  html: string,
  text: string,
  smtp: SmtpConfig
) {
  const transporter = nodemailer.createTransport({
    host: smtp.host,
    port: smtp.port,
    secure: smtp.port === 465,
    auth: {
      user: smtp.user,
      pass: smtp.pass,
    },
  });

  await transporter.sendMail({
    from: smtp.from,
    to: email,
    subject,
    html,
    text,
  });
}

export async function sendVerificationEmail(
  email: string,
  verificationUrl: string
) {
  const subject = "Verify your email to activate your account";

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1f1f1f;">
      <h2 style="margin-bottom: 8px;">Verify your email</h2>
      <p style="margin-top: 0;">Thanks for signing up. Confirm your email to finish account setup.</p>
      <p>
        <a href="${verificationUrl}" style="display: inline-block; background: #0f7a6e; color: #ffffff; text-decoration: none; padding: 10px 16px; border-radius: 8px; font-weight: 600;">
          Verify Email
        </a>
      </p>
      <p>If the button does not work, copy this link into your browser:</p>
      <p><a href="${verificationUrl}">${verificationUrl}</a></p>
      <p>This link expires in 24 hours.</p>
    </div>
  `;

  const text = `Verify your email: ${verificationUrl}\n\nThis link expires in 24 hours.`;

  const smtpConfig = getSmtpConfig();

  if (smtpConfig) {
    await sendWithSmtp(email, subject, html, text, smtpConfig);
    return;
  }

  const resend = getResendClient();
  const from = getSenderEmail();

  const { error } = await resend.emails.send({
    from,
    to: email,
    subject,
    html,
    text,
  });

  if (error) {
    throw new Error(`Resend email send failed: ${error.message}`);
  }
}
