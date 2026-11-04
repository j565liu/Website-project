import { eq } from "drizzle-orm";
import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";
import type { ClubEvent } from "@/content/events";
import { eventReservations, registrations } from "@/lib/db/schema";
import type { EmailMessage } from "@/lib/email/send";
import { parseCancelLink, parseConfirmLink } from "@/lib/reservations/links";
import {
  cancelReservation,
  confirmReservation,
  countPlaces,
  getCancelStatus,
  getConfirmStatus,
  requestReservation,
  type ReservationDeps,
} from "@/lib/reservations/service";
import { confirmRegistration, handleSubmission } from "@/lib/registration/service";
import { db, fakeMailer, formData, resetDatabase, tokenFrom, validFields } from "./helpers";

const HOUR = 60 * 60 * 1000;
const now = new Date("2026-11-01T12:00:00Z");
const event: ClubEvent = {
  id: "evening-downtown",
  title: "An Evening Downtown",
  startsAt: "2026-11-26T18:30:00-05:00",
  neighborhood: "Downtown Toronto",
};

vi.stubEnv("RATE_LIMIT_SECRET", "test-secret");

function deps(overrides: Partial<ReservationDeps> = {}) {
  const mailer = fakeMailer();
  return {
    mailer,
    deps: {
      db,
      sendEmail: mailer.sendEmail,
      baseUrl: "https://readytomingle.test",
      now,
      notifyEmail: "organiser@example.com",
      ...overrides,
    } satisfies ReservationDeps,
  };
}

async function registeredGuest(fields: Record<string, string> = {}, { confirm = true } = {}) {
  const mailer = fakeMailer();
  const ctx = {
    db,
    sendEmail: mailer.sendEmail,
    baseUrl: "https://readytomingle.test",
    clientKeyHash: `client-${Math.random()}`,
    rateLimit: { limit: 100, windowMs: HOUR },
    now,
  };
  await handleSubmission(formData({ ...validFields, ...fields }), ctx);
  if (confirm) await confirmRegistration(tokenFrom(mailer.sent[0]), ctx);
}

function linkParams(message: EmailMessage, path: string) {
  const match = message.text.match(new RegExp(`https?://\\S+${path}\\?\\S+`));
  if (!match) throw new Error(`No ${path} link in email`);
  return Object.fromEntries(new URL(match[0]).searchParams);
}

// Requests a place and returns the parsed link from the "confirm your place" email.
async function requestedLink(email = validFields.email) {
  const { deps: d, mailer } = deps();
  await requestReservation(event, email.toLowerCase(), d);
  return parseConfirmLink(linkParams(mailer.sent[0], "/reservations/confirm"));
}

const reservations = () => db.select().from(eventReservations);

beforeEach(resetDatabase);
afterAll(async () => {
  await resetDatabase();
  await db.$client.end();
});

describe("asking for a place", () => {
  it("asks someone without a registration to register first, and stores nothing", async () => {
    const { deps: d, mailer } = deps();
    await requestReservation(event, "stranger@example.com", d);

    expect(mailer.sent).toHaveLength(1);
    expect(mailer.sent[0].to).toBe("stranger@example.com");
    expect(mailer.sent[0].text).toContain("https://readytomingle.test/register");
    expect(mailer.sent[0].text).not.toMatch(/reservations\/confirm/);
    expect(await reservations()).toHaveLength(0);
  });

  it("treats an unconfirmed registration like no registration", async () => {
    await registeredGuest({}, { confirm: false });
    const { deps: d, mailer } = deps();
    await requestReservation(event, "alex.morgan@example.com", d);
    expect(mailer.sent[0].subject).toBe("Your request for An Evening Downtown");
  });

  it("emails a registered guest a link to confirm their place", async () => {
    await registeredGuest();
    const { deps: d, mailer } = deps();
    await requestReservation(event, "alex.morgan@example.com", d);

    expect(mailer.sent[0].subject).toBe("Confirm your place at An Evening Downtown");
    expect(mailer.sent[0].text).toContain("Thursday, November 26 at 6:30 p.m.");
    const link = parseConfirmLink(linkParams(mailer.sent[0], "/reservations/confirm"));
    expect(link?.expiresAt).toEqual(new Date(now.getTime() + 48 * HOUR));
    expect(await getConfirmStatus(link, event, d)).toBe("pending");
    expect(await reservations()).toHaveLength(0);
  });

  it("never lets a link outlive the start of the evening", async () => {
    await registeredGuest();
    const { deps: d, mailer } = deps({ now: new Date("2026-11-26T12:00:00Z") });
    await requestReservation(event, "alex.morgan@example.com", d);
    const link = parseConfirmLink(linkParams(mailer.sent[0], "/reservations/confirm"));
    expect(link?.expiresAt).toEqual(new Date(event.startsAt));
  });
});

describe("confirming a place", () => {
  it("reserves the place once, emails the guest a cancel link and tells the organiser", async () => {
    await registeredGuest({ gender: "man", phone: "416-555-0123" });
    const link = await requestedLink();
    const { deps: d, mailer } = deps();

    expect(await confirmReservation(link, event, d)).toBe("reserved");
    const [row] = await reservations();
    expect(row).toMatchObject({ eventId: "evening-downtown", reservedAt: now, cancelledAt: null });

    const [guest, notice] = mailer.sent;
    expect(guest.subject).toBe("You're on the list for An Evening Downtown");
    expect(guest.text).toMatch(/\/reservations\/cancel\?/);
    expect(notice.to).toBe("organiser@example.com");
    expect(notice.subject).toBe("New reservation: Alex for An Evening Downtown");
    expect(notice.text).toContain("Gender: Man");
    expect(notice.text).toContain("Phone: 416-555-0123");
    expect(notice.text).toContain("Places now: 0 women, 1 man (1 in total)");

    expect(await confirmReservation(link, event, d)).toBe("reserved");
    expect(mailer.sent).toHaveLength(2);
    expect(await reservations()).toHaveLength(1);
  });

  it("sends no organiser notice when none is configured", async () => {
    await registeredGuest();
    const { deps: d, mailer } = deps({ notifyEmail: "" });
    await confirmReservation(await requestedLink(), event, d);
    expect(mailer.sent.map((m) => m.to)).toEqual(["alex.morgan@example.com"]);
  });

  it("refuses tampered, mismatched, expired and past links", async () => {
    await registeredGuest();
    const link = await requestedLink();
    const { deps: d } = deps();

    const params = { e: link!.eventId, r: link!.registrationId, x: String(link!.expiresAt.getTime()) };
    expect(parseConfirmLink({ ...params, sig: "forged" })).toBeNull();
    expect(parseConfirmLink({ ...params, x: String(link!.expiresAt.getTime() + HOUR), sig: "x" })).toBeNull();
    expect(await confirmReservation(link, { ...event, id: "another-evening" }, d)).toBe("invalid");
    expect(await confirmReservation(link, event, { ...d, now: new Date(now.getTime() + 49 * HOUR) })).toBe("expired");
    expect(await confirmReservation(link, event, { ...d, now: new Date("2026-11-27T12:00:00Z") })).toBe("past");
    expect(await reservations()).toHaveLength(0);
  });

  it("tells a guest who already has a place, with a link to cancel", async () => {
    await registeredGuest();
    await confirmReservation(await requestedLink(), event, deps().deps);

    const { deps: d, mailer } = deps();
    await requestReservation(event, "alex.morgan@example.com", d);
    expect(mailer.sent[0].subject).toBe("You already have a place at An Evening Downtown");
    expect(mailer.sent[0].text).toMatch(/\/reservations\/cancel\?/);
  });

  it("removes places when the guest deletes their registration", async () => {
    await registeredGuest();
    await confirmReservation(await requestedLink(), event, deps().deps);
    await db.delete(registrations).where(eq(registrations.email, "alex.morgan@example.com"));
    expect(await reservations()).toHaveLength(0);
  });
});

describe("cancelling a place", () => {
  async function reservedGuest() {
    await registeredGuest();
    const { deps: d, mailer } = deps();
    await confirmReservation(await requestedLink(), event, d);
    return parseCancelLink(linkParams(mailer.sent[0], "/reservations/cancel"));
  }

  it("cancels once and tells the organiser", async () => {
    const link = await reservedGuest();
    const { deps: d, mailer } = deps();

    expect(await getCancelStatus(link, event, d)).toBe("active");
    expect(await cancelReservation(link, event, d)).toBe("cancelled");
    expect((await reservations())[0].cancelledAt).toEqual(now);
    expect(mailer.sent).toHaveLength(1);
    expect(mailer.sent[0].subject).toBe("Cancelled: Alex for An Evening Downtown");
    expect(mailer.sent[0].text).toContain("(0 in total)");

    expect(await cancelReservation(link, event, d)).toBe("cancelled");
    expect(mailer.sent).toHaveLength(1);
  });

  it("lets a guest who cancelled reserve again", async () => {
    const cancel = await reservedGuest();
    await cancelReservation(cancel, event, deps().deps);

    expect(await confirmReservation(await requestedLink(), event, deps().deps)).toBe("reserved");
    const rows = await reservations();
    expect(rows).toHaveLength(1);
    expect(rows[0].cancelledAt).toBeNull();
  });

  it("refuses forged links and evenings that have started", async () => {
    const link = await reservedGuest();
    const { deps: d } = deps();
    expect(parseCancelLink({ e: link!.eventId, r: link!.registrationId, sig: "forged" })).toBeNull();
    expect(await cancelReservation(link, event, { ...d, now: new Date("2026-11-27T12:00:00Z") })).toBe("past");
    expect((await reservations())[0].cancelledAt).toBeNull();
  });
});

describe("counting places", () => {
  it("counts active places by gender", async () => {
    const guests: Record<string, string>[] = [
      { email: "w1@example.com", gender: "woman" },
      { email: "w2@example.com", gender: "woman" },
      { email: "m1@example.com", gender: "man" },
      { email: "o1@example.com", gender: "self_described", genderDescription: "Non-binary" },
    ];
    for (const guest of guests) {
      await registeredGuest(guest);
      await confirmReservation(await requestedLink(guest.email), event, deps().deps);
    }
    expect(await countPlaces(db, event.id)).toEqual({ women: 2, men: 1, other: 1 });
    expect(await countPlaces(db, "another-evening")).toEqual({ women: 0, men: 0, other: 0 });
  });
});
