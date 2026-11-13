import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { registrations } from "@/lib/db/schema";
import {
  deleteRegistration,
  findManagedRegistration,
  isValidManageLink,
  manageUrl,
  startEventEmails,
  stopEventEmails,
} from "@/lib/registration/manage";
import { confirmRegistration, handleSubmission, type SubmissionContext } from "@/lib/registration/service";
import { db, fakeMailer, formData, resetDatabase, tokenFrom, validFields } from "./helpers";

const HOUR = 60 * 60 * 1000;
const BASE = "https://readytomingle.test";

function context(mailer = fakeMailer()) {
  return {
    mailer,
    ctx: {
      db,
      sendEmail: mailer.sendEmail,
      baseUrl: BASE,
      clientKeyHash: "client-manage",
      rateLimit: { limit: 50, windowMs: HOUR },
    } satisfies SubmissionContext,
  };
}

// Registers and confirms a guest, returning the id and signature from the "registered" email.
async function confirmedGuest(fields: Record<string, string> = {}) {
  const { ctx, mailer } = context();
  await handleSubmission(formData({ ...validFields, ...fields }), ctx);
  await confirmRegistration(tokenFrom(mailer.sent[0]), ctx);
  const registered = mailer.sent.at(-1)!;
  const link = new URL(registered.text.match(/https?:\/\/\S+\/register\/manage\?\S+/)![0]);
  return { id: link.searchParams.get("id")!, sig: link.searchParams.get("sig")!, mailer, ctx, registered };
}

beforeEach(resetDatabase);
afterAll(async () => {
  await resetDatabase();
  await db.$client.end();
});

describe("manage links", () => {
  it("are included in the 'registered' email and open the guest's registration", async () => {
    const { id, sig, registered } = await confirmedGuest({ eventEmails: "on", phone: "416-555-0123" });
    expect(registered.html).toContain("Manage my registration");
    expect(registered.text).not.toContain("hello@example.com");
    expect(await findManagedRegistration(id, sig, db)).toEqual({
      status: "found",
      registration: {
        preferredName: "Alex",
        email: "alex.morgan@example.com",
        phone: "416-555-0123",
        ageGroup: "gen_x",
        gender: "woman",
        genderDescription: null,
        eventEmails: true,
      },
    });
  });

  it("are included in the 'already registered' email", async () => {
    const { ctx, mailer } = await confirmedGuest();
    await handleSubmission(formData(validFields), ctx);
    const already = mailer.sent.at(-1)!;
    expect(already.subject).toMatch(/already registered/);
    expect(already.text).toMatch(/\/register\/manage\?id=/);
  });

  it("reject tampered or malformed links", async () => {
    const { id, sig } = await confirmedGuest();
    const otherId = "00000000-0000-0000-0000-000000000000";
    expect(isValidManageLink(id, sig)).toBe(true);
    expect(isValidManageLink(otherId, sig)).toBe(false);
    expect(isValidManageLink(id, `${sig.slice(0, -1)}x`)).toBe(false);
    expect(isValidManageLink("not-a-uuid", sig)).toBe(false);
    expect(isValidManageLink(undefined, undefined)).toBe(false);
    expect(await findManagedRegistration(otherId, sig, db)).toEqual({ status: "invalid" });
    expect(await deleteRegistration(id, "forged", db)).toBe("invalid");
    expect(await db.select().from(registrations)).toHaveLength(1);
  });

  it("are built from the registration id and the site address", () => {
    const url = new URL(manageUrl(BASE, "00000000-0000-0000-0000-000000000000"));
    expect(url.origin + url.pathname).toBe(`${BASE}/register/manage`);
    expect(isValidManageLink(url.searchParams.get("id"), url.searchParams.get("sig"))).toBe(true);
  });
});

describe("managing a registration", () => {
  it("stops emails about gatherings without touching anything else", async () => {
    const { id, sig } = await confirmedGuest({ eventEmails: "on" });
    expect(await stopEventEmails(id, sig, db)).toBe("stopped");
    const [row] = await db.select().from(registrations);
    expect(row.eventEmailsConsentAt).toBeNull();
    expect(row.confirmedAt).not.toBeNull();
  });

  it("turns invitations on, recording when, and keeps the first consent time", async () => {
    const { id, sig, registered } = await confirmedGuest();
    expect(registered.text).toMatch(/turn invitations on/);

    const first = new Date("2026-11-13T15:00:00Z");
    expect(await startEventEmails(id, sig, db, first)).toBe("started");
    expect((await db.select().from(registrations))[0].eventEmailsConsentAt).toEqual(first);

    expect(await startEventEmails(id, sig, db, new Date("2026-11-14T15:00:00Z"))).toBe("started");
    expect((await db.select().from(registrations))[0].eventEmailsConsentAt).toEqual(first);
    expect(await startEventEmails(id, "forged", db)).toBe("invalid");
  });

  it("tells a guest who asked for invitations that they will receive them", async () => {
    const { registered } = await confirmedGuest({ eventEmails: "on" });
    expect(registered.text).toMatch(/We will write to you/);
  });

  it("deletes the registration, after which the link finds nothing", async () => {
    const { id, sig } = await confirmedGuest();
    expect(await deleteRegistration(id, sig, db)).toBe("deleted");
    expect(await db.select().from(registrations)).toHaveLength(0);
    expect(await findManagedRegistration(id, sig, db)).toEqual({ status: "missing" });
    expect(await deleteRegistration(id, sig, db)).toBe("missing");
  });
});
