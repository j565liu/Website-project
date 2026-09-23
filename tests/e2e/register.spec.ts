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

test("a visitor registers, confirms by email link, and is registered", async ({ page }) => {
  const email = `e2e+${Date.now()}@example.com`;
  const sql = postgres(testDatabaseUrl(), { max: 1, onnotice: () => {} });

  try {
    await page.goto("/register");
    await expect(page.getByRole("heading", { level: 1, name: "Register your interest" })).toBeVisible();

    // Submitting an empty form shows accessible errors and sends nothing.
    await page.getByRole("button", { name: "Register Your Interest" }).click();
    await expect(page.getByRole("alert").filter({ hasText: "Please review the fields below." })).toBeVisible();
    await expect(page.getByLabel("Email", { exact: true })).toHaveAttribute("aria-invalid", "true");
    await expect(page).toHaveURL(/\/register$/);

    await page.getByLabel("Preferred name").fill("Jordan");
    await page.getByLabel("Email", { exact: true }).fill(email.toUpperCase());
    await page.getByLabel("Industry").selectOption("Technology");
    await page.getByLabel(/How did you hear about us/).selectOption("Instagram");
    await page.getByLabel("Why you are interested").fill("Good company and better conversation.");
    await expect(page.getByText("37 / 500 characters")).toBeVisible();
    await page.getByLabel(/I agree to Ready to Mingle/).check();
    await expect(page.getByLabel("Email", { exact: true })).toHaveAttribute("aria-invalid", "false");

    await page.getByRole("button", { name: "Register Your Interest" }).click();
    await expect(page).toHaveURL(/\/register\/check-email$/);
    await expect(page.getByRole("heading", { level: 1, name: "Check your inbox." })).toBeVisible();

    const [row] = await sql`select * from registrations where email = ${email}`;
    expect(row).toMatchObject({ preferred_name: "Jordan", industry: "Technology", confirmed_at: null });

    // Follow the link from the confirmation email (path only: the build's site URL may differ).
    const [confirmation] = await emailsTo(email);
    expect(confirmation.subject).toBe("Confirm your email for Ready to Mingle");
    const link = new URL(confirmation.text.match(/https?:\/\/\S+token=\S+/)![0]);
    await page.goto(link.pathname + link.search);
    await expect(page.getByRole("heading", { level: 1, name: "Confirm your email." })).toBeVisible();

    await page.getByRole("button", { name: "Confirm my email" }).click();
    await expect(page).toHaveURL(/\/register\/confirmed$/);
    await expect(page.getByRole("heading", { level: 1, name: "You’re registered." })).toBeVisible();

    const [confirmed] = await sql`select confirmed_at from registrations where email = ${email}`;
    expect(confirmed.confirmed_at).not.toBeNull();
    expect((await emailsTo(email)).map((m) => m.subject)).toContain("You're registered with Ready to Mingle");

    // Opening the link again is harmless.
    await page.goto(link.pathname + link.search);
    await expect(page.getByRole("heading", { level: 1, name: "You’re already registered." })).toBeVisible();
  } finally {
    await sql`delete from registrations where email = ${email}`;
    await sql.end();
  }
});
