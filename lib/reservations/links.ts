import { createHmac, timingSafeEqual } from "node:crypto";

// Reservation links carry an HMAC instead of a stored token: only the person who received the
// email can use them. Changing RATE_LIMIT_SECRET revokes every link.
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const EVENT_ID = /^[a-z0-9-]{1,100}$/;

export const RESERVATION_LINK_TTL_MS = 48 * 60 * 60 * 1000;

function sign(payload: string): string {
  const secret = process.env.RATE_LIMIT_SECRET;
  if (!secret) throw new Error("RATE_LIMIT_SECRET is not set");
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

function verify(payload: string, sig: unknown): boolean {
  if (typeof sig !== "string") return false;
  const expected = Buffer.from(sign(payload));
  const given = Buffer.from(sig);
  return expected.length === given.length && timingSafeEqual(expected, given);
}

function ids(eventId: unknown, registrationId: unknown): { eventId: string; registrationId: string } | null {
  if (typeof eventId !== "string" || typeof registrationId !== "string") return null;
  if (!EVENT_ID.test(eventId) || !UUID.test(registrationId)) return null;
  return { eventId, registrationId };
}

export type ConfirmLink = { eventId: string; registrationId: string; expiresAt: Date };
export type CancelLink = { eventId: string; registrationId: string };
type Params = Record<string, string | string[] | undefined>;

export function confirmReservationUrl(baseUrl: string, link: ConfirmLink): string {
  const expires = String(link.expiresAt.getTime());
  const url = new URL("/reservations/confirm", baseUrl);
  url.searchParams.set("e", link.eventId);
  url.searchParams.set("r", link.registrationId);
  url.searchParams.set("x", expires);
  url.searchParams.set("sig", sign(`reserve:${link.eventId}:${link.registrationId}:${expires}`));
  return url.toString();
}

export function parseConfirmLink({ e, r, x, sig }: Params): ConfirmLink | null {
  const parsed = ids(e, r);
  if (!parsed || typeof x !== "string" || !/^\d{1,15}$/.test(x)) return null;
  if (!verify(`reserve:${parsed.eventId}:${parsed.registrationId}:${x}`, sig)) return null;
  return { ...parsed, expiresAt: new Date(Number(x)) };
}

export function cancelReservationUrl(baseUrl: string, link: CancelLink): string {
  const url = new URL("/reservations/cancel", baseUrl);
  url.searchParams.set("e", link.eventId);
  url.searchParams.set("r", link.registrationId);
  url.searchParams.set("sig", sign(`cancel:${link.eventId}:${link.registrationId}`));
  return url.toString();
}

export function parseCancelLink({ e, r, sig }: Params): CancelLink | null {
  const parsed = ids(e, r);
  if (!parsed || !verify(`cancel:${parsed.eventId}:${parsed.registrationId}`, sig)) return null;
  return parsed;
}
