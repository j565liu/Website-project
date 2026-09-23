import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import nodemailer, { type Transporter } from "nodemailer";

export type EmailMessage = {
  to: string;
  subject: string;
  text: string;
  html: string;
};

export type SendEmail = (message: EmailMessage) => Promise<void>;

let transporter: Transporter | undefined;

function getTransporter(): Transporter {
  if (!transporter) {
    const port = Number(process.env.SMTP_PORT || 465);
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      // Port 465 uses TLS from the start; 587 and 25 upgrade with STARTTLS.
      secure: port === 465,
      auth: process.env.SMTP_USER
        ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD }
        : undefined,
    });
  }
  return transporter;
}

function sender(): string {
  const from = process.env.EMAIL_FROM;
  if (!from) throw new Error("EMAIL_FROM is not set");
  return from;
}

// Without SMTP_HOST, emails are saved to the outbox folder instead of sent (development and tests).
async function writeToOutbox(message: EmailMessage) {
  // The outbox is a dev/test-only location; the ignore comment stops Next tracing the whole project.
  const dir = path.resolve(/* turbopackIgnore: true */ process.cwd(), process.env.EMAIL_OUTBOX_DIR || ".outbox");
  await mkdir(dir, { recursive: true });
  const safeTo = message.to.replace(/[^a-z0-9@._-]/gi, "_");
  const file = path.join(/* turbopackIgnore: true */ dir, `${Date.now()}-${safeTo}.json`);
  await writeFile(file, JSON.stringify({ from: process.env.EMAIL_FROM ?? null, ...message }, null, 2));
  console.info(`[email] Saved "${message.subject}" for ${message.to} to ${file}`);
}

export const sendEmail: SendEmail = async (message) => {
  if (!process.env.SMTP_HOST) {
    await writeToOutbox(message);
    return;
  }
  await getTransporter().sendMail({ from: sender(), ...message });
};
