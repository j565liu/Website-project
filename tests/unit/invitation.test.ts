import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  hasInvitation,
  invitationCookieValue,
  isProtectedPath,
  isValidInvitationCode,
  safeNextPath,
} from "@/lib/invitation";

beforeEach(() => {
  vi.stubEnv("RATE_LIMIT_SECRET", "test-secret");
  vi.stubEnv("INVITATION_CODE", "Autumn2026");
  vi.spyOn(console, "error").mockImplementation(() => {});
});
afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe("invitation code", () => {
  it("accepts the code regardless of case and surrounding spaces", () => {
    expect(isValidInvitationCode("Autumn2026")).toBe(true);
    expect(isValidInvitationCode("  autumn2026 ")).toBe(true);
    expect(isValidInvitationCode("AUTUMN2026")).toBe(true);
  });

  it.each(["", "   ", "autumn", "Autumn2027"])("rejects %j", (input) => {
    expect(isValidInvitationCode(input)).toBe(false);
  });

  it("accepts nothing when no code is configured", () => {
    vi.stubEnv("INVITATION_CODE", "");
    expect(isValidInvitationCode("")).toBe(false);
    expect(isValidInvitationCode("Autumn2026")).toBe(false);
    expect(hasInvitation(undefined)).toBe(false);
  });
});

describe("invitation cookie", () => {
  it("never contains the code itself", () => {
    expect(invitationCookieValue()?.toLowerCase()).not.toContain("autumn2026");
  });

  it("is valid for the current code and stops working once the code changes", () => {
    const cookie = invitationCookieValue()!;
    expect(hasInvitation(cookie)).toBe(true);
    expect(hasInvitation(undefined)).toBe(false);
    expect(hasInvitation("forged")).toBe(false);

    vi.stubEnv("INVITATION_CODE", "Winter2026");
    expect(hasInvitation(cookie)).toBe(false);
  });
});

describe("protected pages", () => {
  it("covers only the events page and the registration form", () => {
    expect(isProtectedPath("/events")).toBe(true);
    expect(isProtectedPath("/register")).toBe(true);
    expect(isProtectedPath("/register/confirm")).toBe(false);
    expect(isProtectedPath("/about")).toBe(false);
  });

  it.each([
    ["/register", "/register"],
    ["/events", "/events"],
    ["/faq", "/events"],
    ["//evil.example", "/events"],
    ["https://evil.example/events", "/events"],
    [undefined, "/events"],
    [["/register"], "/events"],
  ])("sends %j on to %s after the code", (next, expected) => {
    expect(safeNextPath(next)).toBe(expected);
  });
});
