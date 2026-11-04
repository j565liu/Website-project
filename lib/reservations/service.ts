import { and, count, eq, isNotNull, isNull, sql } from "drizzle-orm";
import type { ClubEvent } from "@/content/events";
import type { Database } from "@/lib/db";
import { eventReservations, registrations, type RegistrationRow } from "@/lib/db/schema";
import type { SendEmail } from "@/lib/email/send";
import {
  alreadyReservedEmail,
  confirmReservationEmail,
  registerFirstEmail,
  reservationNotice,
  reservedEmail,
  type PlaceCounts,
} from "@/lib/email/templates";
import { hasStarted } from "@/lib/events";
import {
  cancelReservationUrl,
  confirmReservationUrl,
  RESERVATION_LINK_TTL_MS,
  type CancelLink,
  type ConfirmLink,
} from "./links";

export type ReservationDeps = {
  db: Database;
  sendEmail: SendEmail;
  baseUrl: string;
  now?: Date;
  // Organiser address(es), comma-separated, told about each reservation and cancellation. Optional.
  notifyEmail?: string;
};

async function findRegistrationByEmail(db: Database, email: string): Promise<RegistrationRow | undefined> {
  const [row] = await db
    .select()
    .from(registrations)
    .where(sql`lower(${registrations.email}) = ${email.toLowerCase()}`)
    .limit(1);
  return row;
}

async function findRegistration(db: Database, id: string): Promise<RegistrationRow | undefined> {
  const [row] = await db.select().from(registrations).where(eq(registrations.id, id)).limit(1);
  return row;
}

async function findReservation(db: Database, eventId: string, registrationId: string) {
  const [row] = await db
    .select()
    .from(eventReservations)
    .where(and(eq(eventReservations.eventId, eventId), eq(eventReservations.registrationId, registrationId)))
    .limit(1);
  return row;
}

export async function countPlaces(db: Database, eventId: string): Promise<PlaceCounts> {
  const rows = await db
    .select({ gender: registrations.gender, places: count() })
    .from(eventReservations)
    .innerJoin(registrations, eq(eventReservations.registrationId, registrations.id))
    .where(and(eq(eventReservations.eventId, eventId), isNull(eventReservations.cancelledAt)))
    .groupBy(registrations.gender);
  const counts: PlaceCounts = { women: 0, men: 0, other: 0 };
  for (const { gender, places } of rows) {
    if (gender === "woman") counts.women += places;
    else if (gender === "man") counts.men += places;
    else counts.other += places;
  }
  return counts;
}

async function notifyOrganiser(
  kind: "reserved" | "cancelled",
  registration: RegistrationRow,
  event: ClubEvent,
  deps: ReservationDeps,
) {
  const to = deps.notifyEmail?.trim();
  if (!to) return;
  try {
    const counts = await countPlaces(deps.db, event.id);
    await deps.sendEmail(reservationNotice(to, kind, registration, event, counts));
  } catch (error) {
    console.error("[reservations] Failed to send organiser notice", error);
  }
}

// The page always says "check your inbox"; only the email differs, so the form never reveals
// who has registered.
export async function requestReservation(event: ClubEvent, email: string, deps: ReservationDeps): Promise<void> {
  const now = deps.now ?? new Date();
  const registration = await findRegistrationByEmail(deps.db, email);

  if (!registration?.confirmedAt) {
    await deps.sendEmail(registerFirstEmail(email, event, new URL("/register", deps.baseUrl).toString()));
    return;
  }

  const link = { eventId: event.id, registrationId: registration.id };
  const existing = await findReservation(deps.db, event.id, registration.id);
  if (existing && !existing.cancelledAt) {
    await deps.sendEmail(
      alreadyReservedEmail(registration.email, registration.preferredName, event, cancelReservationUrl(deps.baseUrl, link)),
    );
    return;
  }

  const expiresAt = new Date(Math.min(now.getTime() + RESERVATION_LINK_TTL_MS, new Date(event.startsAt).getTime()));
  await deps.sendEmail(
    confirmReservationEmail(
      registration.email,
      registration.preferredName,
      event,
      confirmReservationUrl(deps.baseUrl, { ...link, expiresAt }),
    ),
  );
}

export type ConfirmStatus = "pending" | "reserved" | "expired" | "past" | "invalid";

export async function getConfirmStatus(
  link: ConfirmLink | null,
  event: ClubEvent | undefined,
  { db, now = new Date() }: Pick<ReservationDeps, "db" | "now">,
): Promise<ConfirmStatus> {
  if (!link || !event || event.id !== link.eventId) return "invalid";
  if (hasStarted(event, now)) return "past";
  const registration = await findRegistration(db, link.registrationId);
  if (!registration?.confirmedAt) return "invalid";
  const existing = await findReservation(db, event.id, registration.id);
  if (existing && !existing.cancelledAt) return "reserved";
  return link.expiresAt > now ? "pending" : "expired";
}

export async function confirmReservation(
  link: ConfirmLink | null,
  event: ClubEvent | undefined,
  deps: ReservationDeps,
): Promise<ConfirmStatus> {
  const status = await getConfirmStatus(link, event, deps);
  if (status !== "pending" || !link || !event) return status;
  const now = deps.now ?? new Date();

  // A cancelled place is reopened; an active one is left alone (two clicks racing).
  const [row] = await deps.db
    .insert(eventReservations)
    .values({ eventId: event.id, registrationId: link.registrationId, reservedAt: now, createdAt: now, updatedAt: now })
    .onConflictDoUpdate({
      target: [eventReservations.eventId, eventReservations.registrationId],
      set: { reservedAt: now, cancelledAt: null, updatedAt: now },
      setWhere: isNotNull(eventReservations.cancelledAt),
    })
    .returning({ id: eventReservations.id });
  if (!row) return "reserved";

  const registration = await findRegistration(deps.db, link.registrationId);
  if (!registration) return "reserved";
  try {
    await deps.sendEmail(
      reservedEmail(
        registration.email,
        registration.preferredName,
        event,
        cancelReservationUrl(deps.baseUrl, { eventId: event.id, registrationId: registration.id }),
      ),
    );
  } catch (error) {
    // The place is reserved either way; a missing courtesy email shouldn't undo it.
    console.error("[reservations] Failed to send reserved email", error);
  }
  await notifyOrganiser("reserved", registration, event, deps);
  return "reserved";
}

export type CancelStatus = "active" | "cancelled" | "past" | "invalid";

export async function getCancelStatus(
  link: CancelLink | null,
  event: ClubEvent | undefined,
  { db, now = new Date() }: Pick<ReservationDeps, "db" | "now">,
): Promise<CancelStatus> {
  if (!link || !event || event.id !== link.eventId) return "invalid";
  const reservation = await findReservation(db, event.id, link.registrationId);
  if (!reservation) return "invalid";
  if (hasStarted(event, now)) return "past";
  return reservation.cancelledAt ? "cancelled" : "active";
}

export async function cancelReservation(
  link: CancelLink | null,
  event: ClubEvent | undefined,
  deps: ReservationDeps,
): Promise<CancelStatus> {
  const status = await getCancelStatus(link, event, deps);
  if (status !== "active" || !link || !event) return status;
  const now = deps.now ?? new Date();

  const [row] = await deps.db
    .update(eventReservations)
    .set({ cancelledAt: now, updatedAt: now })
    .where(
      and(
        eq(eventReservations.eventId, event.id),
        eq(eventReservations.registrationId, link.registrationId),
        isNull(eventReservations.cancelledAt),
      ),
    )
    .returning({ id: eventReservations.id });
  if (!row) return "cancelled";

  const registration = await findRegistration(deps.db, link.registrationId);
  if (registration) await notifyOrganiser("cancelled", registration, event, deps);
  return "cancelled";
}
