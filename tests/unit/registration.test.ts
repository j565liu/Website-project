import { eq } from "drizzle-orm";
import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { rateLimitHits, registrations } from "@/lib/db/schema";
import {
  confirmRegistration,
  getTokenStatus,
  handleSubmission,
  type SubmissionContext,
} from "@/lib/registration/service";
import { db, fakeMailer, formData, resetDatabase, tokenFrom, validFields } from "./helpers";

const HOUR = 60 * 60 * 1000;
const baseNow = new Date("2026-10-01T12:00:00Z");

function context(mailer = fakeMailer(), overrides: Partial<SubmissionContext> = {}) {
  return {
    mailer,
    ctx: {
      db,
      sendEmail: mailer.sendEmail,
      baseUrl: "https://readytomingle.test",
      clientKeyHash: "client-a",
      rateLimit: { limit: 5, windowMs: HOUR },
      now: baseNow,
      ...overrides,
    } satisfies SubmissionContext,
  };
}

const allRows = () => db.select().from(registrations);

beforeEach(resetDatabase);
afterAll(async () => {
  await resetDatabase();
  await db.$client.end();
});

describe("honeypot", () => {
  it("pretends to succeed but stores and sends nothing", async () => {
    const { ctx, mailer } = context();
    const result = await handleSubmission(formData({ ...validFields, company_website: "http://spam.example" }), ctx);

    expect(result).toEqual({ kind: "accepted" });
    expect(await allRows()).toHaveLength(0);
    expect(mailer.sent).toHaveLength(0);
    expect(await db.select().from(rateLimitHits)).toHaveLength(0);
  });
});

describe("new registration", () => {
  it("stores the registration unconfirmed and emails a confirmation link", async () => {
    const { ctx, mailer } = context();
    expect(await handleSubmission(formData(validFields), ctx)).toEqual({ kind: "accepted" });

    const [row] = await allRows();
    expect(row).toMatchObject({
      preferredName: "Alex",
      email: "alex.morgan@example.com",
      industry: "Law",
      howDidYouHear: "LinkedIn",
      confirmedAt: null,
      consentAcceptedAt: baseNow,
      confirmationExpiresAt: new Date(baseNow.getTime() + 48 * HOUR),
    });

    expect(mailer.sent).toHaveLength(1);
    expect(mailer.sent[0].to).toBe("alex.morgan@example.com");
    expect(mailer.sent[0].subject).toMatch(/Confirm your email/);
    expect(mailer.sent[0].html).toContain("https://readytomingle.test/register/confirm?token=");

    // Only a hash of the token is stored.
    const token = tokenFrom(mailer.sent[0]);
    expect(row.confirmationTokenHash).not.toContain(token);
  });

  it("returns field errors and stores nothing for invalid input", async () => {
    const { ctx, mailer } = context();
    const result = await handleSubmission(formData({ ...validFields, email: "nope" }), ctx);
    expect(result).toMatchObject({ kind: "invalid", errors: { email: expect.any(String) } });
    expect(await allRows()).toHaveLength(0);
    expect(mailer.sent).toHaveLength(0);
  });
});

describe("duplicate email", () => {
  it("re-sends a fresh link for an unconfirmed email without creating a second row", async () => {
    const { ctx, mailer } = context();
    await handleSubmission(formData(validFields), ctx);
    const firstToken = tokenFrom(mailer.sent[0]);

    const later = new Date(baseNow.getTime() + HOUR);
    const result = await handleSubmission(
      formData({ ...validFields, email: "ALEX.MORGAN@example.com", preferredName: "Alexandra" }),
      { ...ctx, now: later },
    );

    expect(result).toEqual({ kind: "accepted" });
    const rows = await allRows();
    expect(rows).toHaveLength(1);
    expect(rows[0].preferredName).toBe("Alexandra");
    expect(mailer.sent).toHaveLength(2);

    const secondToken = tokenFrom(mailer.sent[1]);
    expect(secondToken).not.toBe(firstToken);
    expect(await getTokenStatus(firstToken, { db, now: later })).toBe("invalid");
    expect(await getTokenStatus(secondToken, { db, now: later })).toBe("pending");
  });

  it("looks identical to the visitor for a confirmed email, and sends an 'already registered' email", async () => {
    const { ctx, mailer } = context();
    await handleSubmission(formData(validFields), ctx);
    await confirmRegistration(tokenFrom(mailer.sent[0]), ctx);
    const [before] = await allRows();

    const result = await handleSubmission(
      formData({ ...validFields, email: "alex.morgan@EXAMPLE.com", preferredName: "Someone Else" }),
      ctx,
    );

    expect(result).toEqual({ kind: "accepted" });
    const rows = await allRows();
    expect(rows).toHaveLength(1);
    expect(rows[0]).toEqual(before);
    const last = mailer.sent.at(-1)!;
    expect(last.subject).toMatch(/already registered/);
    expect(last.text).toContain("Hello Alex,");
    expect(last.text).not.toMatch(/token=/);
  });
});

describe("confirmation", () => {
  it("confirms a valid link once and sends a 'registered' email", async () => {
    const { ctx, mailer } = context();
    await handleSubmission(formData(validFields), ctx);
    const token = tokenFrom(mailer.sent[0]);

    expect(await confirmRegistration(token, ctx)).toBe("confirmed");
    const [row] = await allRows();
    expect(row.confirmedAt).toEqual(baseNow);
    expect(mailer.sent.at(-1)!.subject).toMatch(/You're registered/);

    expect(await confirmRegistration(token, ctx)).toBe("confirmed");
    expect(mailer.sent).toHaveLength(2);
  });

  it("refuses an expired link", async () => {
    const { ctx, mailer } = context();
    await handleSubmission(formData(validFields), ctx);
    const token = tokenFrom(mailer.sent[0]);

    const tooLate = new Date(baseNow.getTime() + 49 * HOUR);
    expect(await confirmRegistration(token, { ...ctx, now: tooLate })).toBe("expired");
    expect((await allRows())[0].confirmedAt).toBeNull();
  });

  it.each([undefined, "", "short", "x".repeat(43), ["array"]])("rejects an unknown token (%s)", async (token) => {
    const { ctx } = context();
    expect(await confirmRegistration(token, ctx)).toBe("invalid");
  });

  it("still confirms when the 'registered' email fails to send", async () => {
    const { ctx, mailer } = context();
    await handleSubmission(formData(validFields), ctx);
    const failing = async () => {
      throw new Error("SMTP down");
    };
    const status = await confirmRegistration(tokenFrom(mailer.sent[0]), { ...ctx, sendEmail: failing });
    expect(status).toBe("confirmed");
  });
});

describe("clean-up", () => {
  it("deletes unconfirmed registrations older than 7 days, keeping confirmed ones", async () => {
    const old = context();
    await handleSubmission(formData({ ...validFields, email: "stale@example.com" }), old.ctx);
    await handleSubmission(formData({ ...validFields, email: "kept@example.com" }), old.ctx);
    await confirmRegistration(tokenFrom(old.mailer.sent[1]), old.ctx);

    const { ctx } = context(fakeMailer(), {
      now: new Date(baseNow.getTime() + 8 * 24 * HOUR),
      clientKeyHash: "client-b",
    });
    await handleSubmission(formData({ ...validFields, email: "new@example.com" }), ctx);

    const emails = (await allRows()).map((row) => row.email).sort();
    expect(emails).toEqual(["kept@example.com", "new@example.com"]);
  });
});

describe("rate limiting", () => {
  it("blocks a client after the limit, per hashed key, and resets after the window", async () => {
    const { ctx } = context(fakeMailer(), { rateLimit: { limit: 2, windowMs: HOUR } });
    const submit = (email: string, overrides: Partial<SubmissionContext> = {}) =>
      handleSubmission(formData({ ...validFields, email }), { ...ctx, ...overrides });

    expect(await submit("a@example.com")).toEqual({ kind: "accepted" });
    expect(await submit("b@example.com")).toEqual({ kind: "accepted" });
    expect(await submit("c@example.com")).toEqual({ kind: "rate_limited" });
    expect(await submit("c@example.com", { clientKeyHash: "client-b" })).toEqual({ kind: "accepted" });
    expect(await submit("d@example.com", { now: new Date(baseNow.getTime() + HOUR + 1) })).toEqual({
      kind: "accepted",
    });

    const stored = await db.select().from(rateLimitHits).where(eq(rateLimitHits.keyHash, "client-a"));
    expect(stored.every((hit) => hit.keyHash === "client-a")).toBe(true);
  });

  it("does not count invalid submissions", async () => {
    const { ctx } = context(fakeMailer(), { rateLimit: { limit: 1, windowMs: HOUR } });
    await handleSubmission(formData({ ...validFields, email: "bad" }), ctx);
    expect(await handleSubmission(formData(validFields), ctx)).toEqual({ kind: "accepted" });
  });

  it("purges hits older than 24 hours", async () => {
    const { ctx } = context();
    await handleSubmission(formData(validFields), ctx);
    await handleSubmission(formData({ ...validFields, email: "later@example.com" }), {
      ...ctx,
      now: new Date(baseNow.getTime() + 25 * HOUR),
    });
    const hits = await db.select().from(rateLimitHits);
    expect(hits).toHaveLength(1);
  });
});
