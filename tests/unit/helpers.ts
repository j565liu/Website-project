import { createDb } from "@/lib/db";
import { rateLimitHits, registrations } from "@/lib/db/schema";
import type { EmailMessage, SendEmail } from "@/lib/email/send";
import { testDatabaseUrl } from "./test-db";

export const db = createDb(testDatabaseUrl(), { max: 1, onnotice: () => {} });

export async function resetDatabase() {
  await db.delete(registrations);
  await db.delete(rateLimitHits);
}

export function fakeMailer() {
  const sent: EmailMessage[] = [];
  const sendEmail: SendEmail = async (message) => {
    sent.push(message);
  };
  return { sent, sendEmail };
}

export function tokenFrom(message: EmailMessage): string {
  const match = message.text.match(/token=([A-Za-z0-9_-]+)/);
  if (!match) throw new Error("No confirmation link in email");
  return match[1];
}

export function formData(fields: Record<string, string>): FormData {
  const data = new FormData();
  for (const [key, value] of Object.entries(fields)) data.set(key, value);
  return data;
}

export const validFields = {
  preferredName: "Alex",
  email: "Alex.Morgan@Example.com",
  industry: "Law",
  howDidYouHear: "LinkedIn",
  whyJoin: "I would love more evenings of real conversation.",
  consent: "on",
};
