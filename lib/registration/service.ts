import { and, eq, gt, isNull, lt, sql } from "drizzle-orm";
import type { Database } from "@/lib/db";
import { registrations, type RegistrationRow } from "@/lib/db/schema";
import type { SendEmail } from "@/lib/email/send";
import { alreadyRegisteredEmail, confirmationEmail, registeredEmail } from "@/lib/email/templates";
import { consumeRateLimit } from "@/lib/rate-limit";
import {
  formDataToInput,
  HONEYPOT_FIELD,
  validateRegistration,
  type FieldErrors,
  type Registration,
} from "@/lib/validation/registration";
import { createToken, hashToken, isWellFormedToken } from "./tokens";

const HOUR_MS = 60 * 60 * 1000;
export const CONFIRMATION_TTL_MS = 48 * HOUR_MS;
export const UNCONFIRMED_RETENTION_MS = 7 * 24 * HOUR_MS;

export type RegistrationDeps = {
  db: Database;
  sendEmail: SendEmail;
  baseUrl: string;
  now?: Date;
};

export type SubmissionContext = RegistrationDeps & {
  clientKeyHash: string;
  rateLimit: { limit: number; windowMs: number };
};

export type SubmissionResult =
  | { kind: "accepted" }
  | { kind: "invalid"; errors: FieldErrors }
  | { kind: "rate_limited" };

export async function handleSubmission(
  formData: FormData,
  ctx: SubmissionContext,
): Promise<SubmissionResult> {
  // Bots that fill the hidden field get the normal success response so they learn nothing.
  const honeypot = formData.get(HONEYPOT_FIELD);
  if (typeof honeypot === "string" && honeypot.trim() !== "") return { kind: "accepted" };

  const validation = validateRegistration(formDataToInput(formData));
  if (!validation.success) return { kind: "invalid", errors: validation.errors };

  const allowed = await consumeRateLimit(ctx.db, ctx.clientKeyHash, { ...ctx.rateLimit, now: ctx.now });
  if (!allowed) return { kind: "rate_limited" };

  await registerInterest(validation.data, ctx);
  return { kind: "accepted" };
}

async function findByEmail(db: Database, email: string): Promise<RegistrationRow | undefined> {
  const [row] = await db
    .select()
    .from(registrations)
    .where(sql`lower(${registrations.email}) = ${email.toLowerCase()}`)
    .limit(1);
  return row;
}

function isUniqueViolation(error: unknown): boolean {
  const code = (error as { code?: string; cause?: { code?: string } })?.code
    ?? (error as { cause?: { code?: string } })?.cause?.code;
  return code === "23505";
}

// Every outcome looks identical to the visitor; only the email they receive differs.
export async function registerInterest(
  data: Registration,
  deps: RegistrationDeps,
  attempt = 1,
): Promise<void> {
  const { db, sendEmail, baseUrl } = deps;
  const now = deps.now ?? new Date();

  await db
    .delete(registrations)
    .where(
      and(
        isNull(registrations.confirmedAt),
        lt(registrations.createdAt, new Date(now.getTime() - UNCONFIRMED_RETENTION_MS)),
      ),
    );

  const existing = await findByEmail(db, data.email);
  if (existing?.confirmedAt) {
    await sendEmail(alreadyRegisteredEmail(existing.email, existing.preferredName));
    return;
  }

  const token = createToken();
  const fields = {
    preferredName: data.preferredName,
    email: data.email,
    industry: data.industry,
    howDidYouHear: data.howDidYouHear ?? null,
    whyJoin: data.whyJoin,
    consentAcceptedAt: now,
    confirmationTokenHash: hashToken(token),
    confirmationExpiresAt: new Date(now.getTime() + CONFIRMATION_TTL_MS),
  };

  if (existing) {
    await db.update(registrations).set({ ...fields, updatedAt: now }).where(eq(registrations.id, existing.id));
  } else {
    try {
      await db.insert(registrations).values({ ...fields, createdAt: now, updatedAt: now });
    } catch (error) {
      // Two submissions for the same email raced; the second one takes the "existing" path.
      if (isUniqueViolation(error) && attempt === 1) return registerInterest(data, deps, 2);
      throw error;
    }
  }

  const confirmUrl = new URL("/register/confirm", baseUrl);
  confirmUrl.searchParams.set("token", token);
  await sendEmail(confirmationEmail(data.email, data.preferredName, confirmUrl.toString()));
}

export type TokenStatus = "pending" | "confirmed" | "expired" | "invalid";

export async function getTokenStatus(
  token: unknown,
  { db, now = new Date() }: Pick<RegistrationDeps, "db" | "now">,
): Promise<TokenStatus> {
  if (!isWellFormedToken(token)) return "invalid";
  const [row] = await db
    .select({ confirmedAt: registrations.confirmedAt, expiresAt: registrations.confirmationExpiresAt })
    .from(registrations)
    .where(eq(registrations.confirmationTokenHash, hashToken(token)))
    .limit(1);
  if (!row) return "invalid";
  if (row.confirmedAt) return "confirmed";
  return row.expiresAt > now ? "pending" : "expired";
}

export async function confirmRegistration(token: unknown, deps: RegistrationDeps): Promise<TokenStatus> {
  if (!isWellFormedToken(token)) return "invalid";
  const now = deps.now ?? new Date();

  const [row] = await deps.db
    .update(registrations)
    .set({ confirmedAt: now, updatedAt: now })
    .where(
      and(
        eq(registrations.confirmationTokenHash, hashToken(token)),
        isNull(registrations.confirmedAt),
        gt(registrations.confirmationExpiresAt, now),
      ),
    )
    .returning({ email: registrations.email, preferredName: registrations.preferredName });

  if (!row) return getTokenStatus(token, deps);

  try {
    await deps.sendEmail(registeredEmail(row.email, row.preferredName));
  } catch (error) {
    // The registration is confirmed either way; a missing courtesy email shouldn't undo it.
    console.error("[registration] Failed to send registered email", error);
  }
  return "confirmed";
}
