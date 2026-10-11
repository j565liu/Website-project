import { createHmac, timingSafeEqual } from "node:crypto";

export const INVITATION_COOKIE = "rtm_invitation";
export const INVITATION_MAX_AGE_SECONDS = 30 * 24 * 60 * 60;

// Pages that need an invitation code. The confirmation pages stay open: the emailed token
// is proof enough, and guests often confirm on a different device.
const PROTECTED_PATHS = ["/events", "/register"] as const;
const DEFAULT_NEXT = "/events";

export function isProtectedPath(pathname: string): boolean {
  return (PROTECTED_PATHS as readonly string[]).includes(pathname);
}

// Only ever redirect to a protected page, so the `next` parameter can't send visitors elsewhere.
export function safeNextPath(value: unknown): string {
  return typeof value === "string" && isProtectedPath(value) ? value : DEFAULT_NEXT;
}

function normalise(code: string): string {
  return code.trim().toUpperCase();
}

function sign(code: string): string | null {
  const secret = process.env.RATE_LIMIT_SECRET;
  if (!secret) {
    console.error("[invitation] RATE_LIMIT_SECRET is not set");
    return null;
  }
  return createHmac("sha256", secret).update(`invitation:${normalise(code)}`).digest("hex");
}

// The cookie holds a signature of the current code rather than the code itself, so changing
// INVITATION_CODE immediately locks out everyone who entered the old one.
export function invitationCookieValue(): string | null {
  const code = process.env.INVITATION_CODE;
  if (!code?.trim()) {
    console.error("[invitation] INVITATION_CODE is not set, so no code will be accepted");
    return null;
  }
  return sign(code);
}

function matches(value: string, expected: string): boolean {
  const a = Buffer.from(value);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function hasInvitation(cookieValue: string | undefined): boolean {
  const expected = invitationCookieValue();
  return Boolean(cookieValue && expected && matches(cookieValue, expected));
}

export function isValidInvitationCode(input: string): boolean {
  const expected = invitationCookieValue();
  const signed = input.trim() ? sign(input) : null;
  return Boolean(expected && signed && matches(signed, expected));
}
