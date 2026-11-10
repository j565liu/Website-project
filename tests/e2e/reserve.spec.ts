import { randomBytes } from "node:crypto";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { expect, test } from "@playwright/test";
import postgres from "postgres";
import { site } from "@/content/site";
import { getUpcomingEvents } from "@/lib/events";
import { testDatabaseUrl } from "../unit/test-db";

const OUTBOX = ".outbox/e2e";
const [event] = getUpcomingEvents();

async function emailTo(address: string, subject: string) {
  const files = await readdir(OUTBOX).catch(() => []);
  for (const file of files) {
    const message = JSON.parse(await readFile(path.join(OUTBOX, file), "utf8"));
    if (message.to === address && message.subject === subject) return message as { text: string };
  }
  throw new Error(`No "${subject}" email to ${address}`);
}

function linkIn(message: { text: string }, pathname: string): string {
  const url = new URL(message.text.match(new RegExp(`https?://\\S+${pathname}\\?\\S+`))![0]);
  return url.pathname + url.search;
}

// Runs against the real events in content/events.ts, so it needs at least one upcoming evening.
test.skip(!event, "No upcoming events");

test("the event page shows the evening's details, with the reservation form only when open", async ({ page }) => {
  await page.goto(`/events/${event.id}`);
  await page.getByLabel("Invitation code").fill("E2E-INVITE");
  await page.getByRole("button", { name: "Continue" }).click();
  await expect(page.getByRole("heading", { level: 1, name: event.title })).toBeVisible();
  await expect(page.getByRole("button", { name: "Reserve My Place" })).toHaveCount(site.reservationsOpen ? 1 : 0);
});

test("a registered guest reserves a place from the event page, then cancels", async ({ page }) => {
  test.skip(!site.reservationsOpen, "Reservations are switched off in content/site.ts");
  const email = `e2e-reserve+${Date.now()}@example.com`;
  const sql = postgres(testDatabaseUrl(), { max: 1, onnotice: () => {} });

  try {
    await sql`
      insert into registrations (preferred_name, email, age_group, gender, consent_accepted_at, confirmed_at,
        confirmation_token_hash, confirmation_expires_at)
      values ('Sam', ${email}, 'gen_x', 'man', now(), now(), ${randomBytes(16).toString("hex")}, now())`;

    // The event page needs the code, and the guest comes straight back to it afterwards.
    await page.goto(`/events/${event.id}`);
    await expect(page).toHaveURL(new RegExp(`/invitation\\?next=%2Fevents%2F${event.id}$`));
    await page.getByLabel("Invitation code").fill("E2E-INVITE");
    await page.getByRole("button", { name: "Continue" }).click();
    await expect(page.getByRole("heading", { level: 1, name: event.title })).toBeVisible();

    // The card on the events page leads to the same page.
    await page.goto("/events");
    await page.getByRole("link", { name: event.title }).click();
    await expect(page).toHaveURL(new RegExp(`/events/${event.id}$`));

    await page.getByLabel("Email").fill("not-an-email");
    await page.getByRole("button", { name: "Reserve My Place" }).click();
    await expect(page.getByRole("alert").filter({ hasText: "valid email" })).toBeVisible();

    await page.getByLabel("Email").fill(email.toUpperCase());
    await page.getByRole("button", { name: "Reserve My Place" }).click();
    await expect(page).toHaveURL(/\/reservations\/check-email$/);

    await page.goto(linkIn(await emailTo(email, `Confirm your place at ${event.title}`), "/reservations/confirm"));
    await expect(page.getByRole("heading", { level: 1, name: "Confirm your place." })).toBeVisible();
    await page.getByRole("button", { name: "Confirm my place" }).click();
    await expect(page).toHaveURL(/\/reservations\/confirmed\?e=/);
    await expect(page.getByRole("heading", { level: 1, name: "You’re on the list." })).toBeVisible();

    const [reserved] = await sql`
      select r.cancelled_at from event_reservations r join registrations g on g.id = r.registration_id
      where g.email = ${email} and r.event_id = ${event.id}`;
    expect(reserved.cancelled_at).toBeNull();

    await page.goto(linkIn(await emailTo(email, `You're on the list for ${event.title}`), "/reservations/cancel"));
    await page.getByRole("button", { name: "Cancel my place" }).click();
    await expect(page.getByText("Your place has been cancelled.")).toBeVisible();

    const [cancelled] = await sql`
      select r.cancelled_at from event_reservations r join registrations g on g.id = r.registration_id
      where g.email = ${email}`;
    expect(cancelled.cancelled_at).not.toBeNull();
  } finally {
    await sql`delete from registrations where email = ${email}`;
    await sql.end();
  }
});
