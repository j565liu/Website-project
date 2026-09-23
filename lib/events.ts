import { events as allEvents, type ClubEvent } from "@/content/events";

export const TIME_ZONE = "America/Toronto";

export function getUpcomingEvents(
  now: Date = new Date(),
  events: readonly ClubEvent[] = allEvents,
): ClubEvent[] {
  return events
    .filter((event) => new Date(event.startsAt).getTime() > now.getTime())
    .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());
}

const dateFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: TIME_ZONE,
  weekday: "long",
  month: "long",
  day: "numeric",
});

const timeFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: TIME_ZONE,
  hour: "numeric",
  minute: "2-digit",
});

export function formatEventDate(startsAt: string): string {
  return dateFormatter.format(new Date(startsAt));
}

export function formatEventTime(startsAt: string): string {
  return timeFormatter.format(new Date(startsAt));
}
