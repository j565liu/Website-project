import { afterEach, describe, expect, it } from "vitest";
import { siteUrl } from "@/lib/site-url";

const saved = { ...process.env };
afterEach(() => {
  process.env = { ...saved };
});

describe("siteUrl", () => {
  it("uses NEXT_PUBLIC_SITE_URL when set", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://www.readytomingle.ca";
    process.env.VERCEL_PROJECT_PRODUCTION_URL = "example.vercel.app";
    expect(siteUrl()).toBe("https://www.readytomingle.ca");
  });

  it("falls back to Vercel's production domain instead of localhost", () => {
    delete process.env.NEXT_PUBLIC_SITE_URL;
    process.env.VERCEL_PROJECT_PRODUCTION_URL = "www.readytomingle.ca";
    expect(siteUrl()).toBe("https://www.readytomingle.ca");
  });

  it("uses localhost only for local development", () => {
    delete process.env.NEXT_PUBLIC_SITE_URL;
    delete process.env.VERCEL_PROJECT_PRODUCTION_URL;
    expect(siteUrl()).toBe("http://localhost:3000");
  });
});
