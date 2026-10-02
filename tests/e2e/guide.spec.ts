import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { expect, test } from "@playwright/test";
import postgres from "postgres";
import { testDatabaseUrl } from "../unit/test-db";

const OUTBOX = ".outbox/e2e";

async function emailsTo(address: string) {
  const files = await readdir(OUTBOX).catch(() => []);
  const messages = await Promise.all(
    files.map(async (file) => JSON.parse(await readFile(path.join(OUTBOX, file), "utf8"))),
  );
  return messages.filter((message) => message.to === address);
}

test("a visitor requests the guide, confirms by email link, and reaches the guide", async ({ page }) => {
  const email = `e2e+${Date.now()}@example.com`;
  const sql = postgres(testDatabaseUrl(), { max: 1, onnotice: () => {} });

  try {
    await page.goto("/guide");
    await expect(page.getByRole("heading", { level: 1, name: "Start your own" })).toBeVisible();

    // Submitting an empty form shows accessible errors and sends nothing.
    await page.getByRole("button", { name: "Send Me the Guide" }).click();
    await expect(page.getByRole("alert").filter({ hasText: "Please review the fields below." })).toBeVisible();
    await expect(page.getByLabel("Email", { exact: true })).toHaveAttribute("aria-invalid", "true");
    await expect(page).toHaveURL(/\/guide$/);

    await page.getByLabel("Preferred name").fill("Jordan");
    await page.getByLabel("Email", { exact: true }).fill(email.toUpperCase());
    await page.getByLabel(/I agree to Ready to Mingle/).check();
    await expect(page.getByLabel("Email", { exact: true })).toHaveAttribute("aria-invalid", "false");

    await page.getByRole("button", { name: "Send Me the Guide" }).click();
    await expect(page).toHaveURL(/\/guide\/check-email$/);
    await expect(page.getByRole("heading", { level: 1, name: "Check your inbox." })).toBeVisible();

    const [row] = await sql`select * from registrations where email = ${email}`;
    expect(row).toMatchObject({ preferred_name: "Jordan", confirmed_at: null });

    // Follow the link from the confirmation email (path only: the build's site URL may differ).
    const [confirmation] = await emailsTo(email);
    expect(confirmation.subject).toBe("Confirm your email for the Ready to Mingle starter guide");
    const link = new URL(confirmation.text.match(/https?:\/\/\S+token=\S+/)![0]);
    await page.goto(link.pathname + link.search);
    await expect(page.getByRole("heading", { level: 1, name: "Confirm your email." })).toBeVisible();

    await page.getByRole("button", { name: "Confirm my email" }).click();
    await expect(page).toHaveURL(/\/guide\/read$/);
    await expect(page.getByRole("heading", { level: 1, name: "Hosting your first gathering" })).toBeVisible();

    const [confirmed] = await sql`select confirmed_at from registrations where email = ${email}`;
    expect(confirmed.confirmed_at).not.toBeNull();
    expect((await emailsTo(email)).map((m) => m.subject)).toContain("Your Ready to Mingle starter guide");

    // Opening the link again is harmless.
    await page.goto(link.pathname + link.search);
    await expect(page.getByRole("heading", { level: 1, name: "You’ve already confirmed." })).toBeVisible();
  } finally {
    await sql`delete from registrations where email = ${email}`;
    await sql.end();
  }
});

test("old club URLs redirect to their new pages", async ({ page }) => {
  await page.goto("/the-club");
  await expect(page).toHaveURL(/\/what-it-is$/);
  await page.goto("/events");
  await expect(page).toHaveURL(/\/examples$/);
  await page.goto("/register");
  await expect(page).toHaveURL(/\/guide$/);
});
