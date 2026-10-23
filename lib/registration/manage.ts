import { createHmac, timingSafeEqual } from "node:crypto";
import { eq } from "drizzle-orm";
import type { Database } from "@/lib/db";
import { registrations } from "@/lib/db/schema";

// Each "Manage my registration" link carries an HMAC of the registration id, so only someone
// with the email can open it. The links don't expire; changing RATE_LIMIT_SECRET revokes them all.
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function sign(id: string): string {
  const secret = process.env.RATE_LIMIT_SECRET;
  if (!secret) throw new Error("RATE_LIMIT_SECRET is not set");
  return createHmac("sha256", secret).update(`manage:${id}`).digest("base64url");
}

export function manageUrl(baseUrl: string, id: string): string {
  const url = new URL("/register/manage", baseUrl);
  url.searchParams.set("id", id);
  url.searchParams.set("sig", sign(id));
  return url.toString();
}

export function isValidManageLink(id: unknown, sig: unknown): id is string {
  if (typeof id !== "string" || typeof sig !== "string" || !UUID.test(id)) return false;
  const expected = Buffer.from(sign(id));
  const given = Buffer.from(sig);
  return expected.length === given.length && timingSafeEqual(expected, given);
}

export type ManagedRegistration = { preferredName: string; email: string; eventEmails: boolean };

export type LookupResult =
  | { status: "invalid" }
  | { status: "missing" }
  | { status: "found"; registration: ManagedRegistration };

export async function findManagedRegistration(id: unknown, sig: unknown, db: Database): Promise<LookupResult> {
  if (!isValidManageLink(id, sig)) return { status: "invalid" };
  const [row] = await db
    .select({
      preferredName: registrations.preferredName,
      email: registrations.email,
      eventEmailsConsentAt: registrations.eventEmailsConsentAt,
    })
    .from(registrations)
    .where(eq(registrations.id, id))
    .limit(1);
  if (!row) return { status: "missing" };
  return {
    status: "found",
    registration: { preferredName: row.preferredName, email: row.email, eventEmails: row.eventEmailsConsentAt !== null },
  };
}

export type ManageOutcome = "invalid" | "missing" | "stopped" | "deleted";

export async function stopEventEmails(id: unknown, sig: unknown, db: Database, now = new Date()): Promise<ManageOutcome> {
  if (!isValidManageLink(id, sig)) return "invalid";
  const updated = await db
    .update(registrations)
    .set({ eventEmailsConsentAt: null, updatedAt: now })
    .where(eq(registrations.id, id))
    .returning({ id: registrations.id });
  return updated.length ? "stopped" : "missing";
}

export async function deleteRegistration(id: unknown, sig: unknown, db: Database): Promise<ManageOutcome> {
  if (!isValidManageLink(id, sig)) return "invalid";
  const deleted = await db.delete(registrations).where(eq(registrations.id, id)).returning({ id: registrations.id });
  return deleted.length ? "deleted" : "missing";
}
