"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendVerificationEmail = sendVerificationEmail;
const resend_1 = require("resend");
function getResendClient() {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
        throw new Error("Email service is not configured. Missing RESEND_API_KEY.");
    }
    return new resend_1.Resend(apiKey);
}
function getSenderEmail() {
    const senderEmail = process.env.RESEND_FROM_EMAIL;
    if (!senderEmail) {
        throw new Error("Email service is not configured. Missing RESEND_FROM_EMAIL.");
    }
    return senderEmail;
}
async function sendVerificationEmail(email, verificationUrl) {
    const resend = getResendClient();
    const from = getSenderEmail();
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
    await resend.emails.send({
        from,
        to: email,
        subject,
        html,
        text,
    });
}
