import { afterEach, describe, expect, it } from "vitest";
import { clientIpFrom, hashClientKey } from "@/lib/rate-limit";

describe("client key", () => {
  const original = process.env.RATE_LIMIT_SECRET;
  afterEach(() => {
    process.env.RATE_LIMIT_SECRET = original;
  });

  it("hashes the IP with the secret so raw addresses are never stored", () => {
    process.env.RATE_LIMIT_SECRET = "secret-one";
    const hashed = hashClientKey("203.0.113.7");
    expect(hashed).toMatch(/^[a-f0-9]{64}$/);
    expect(hashed).not.toContain("203.0.113.7");
    expect(hashClientKey("203.0.113.7")).toBe(hashed);

    process.env.RATE_LIMIT_SECRET = "secret-two";
    expect(hashClientKey("203.0.113.7")).not.toBe(hashed);
  });

  it("refuses to run without a secret", () => {
    delete process.env.RATE_LIMIT_SECRET;
    expect(() => hashClientKey("203.0.113.7")).toThrow(/RATE_LIMIT_SECRET/);
  });

  it("uses the first forwarded address", () => {
    expect(clientIpFrom(new Headers({ "x-forwarded-for": "203.0.113.7, 10.0.0.1" }))).toBe("203.0.113.7");
    expect(clientIpFrom(new Headers({ "x-real-ip": "198.51.100.2" }))).toBe("198.51.100.2");
    expect(clientIpFrom(new Headers())).toBe("unknown");
  });
});
