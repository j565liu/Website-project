import { mkdtemp, readdir, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { sendEmail } from "@/lib/email/send";

const message = { to: "guest@example.com", subject: "Hello", text: "Hi", html: "<p>Hi</p>" };
const saved = { ...process.env };

afterEach(() => {
  process.env = { ...saved };
});

describe("sendEmail without SMTP settings", () => {
  it("explains what is missing on Vercel instead of trying to write files", async () => {
    delete process.env.SMTP_HOST;
    process.env.VERCEL = "1";
    await expect(sendEmail(message)).rejects.toThrow(/SMTP_HOST is not set/);
  });

  it("saves the email to the outbox folder elsewhere", async () => {
    delete process.env.SMTP_HOST;
    delete process.env.VERCEL;
    const dir = await mkdtemp(path.join(tmpdir(), "outbox-"));
    process.env.EMAIL_OUTBOX_DIR = dir;
    try {
      await sendEmail(message);
      expect(await readdir(dir)).toHaveLength(1);
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });
});
