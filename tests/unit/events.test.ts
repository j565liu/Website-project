import { describe, expect, it } from "vitest";
import type { ClubEvent } from "@/content/events";
import { formatEventDate, formatEventTime, getUpcomingEvents } from "@/lib/events";

const events: ClubEvent[] = [
  { id: "later", title: "Later", startsAt: "2026-11-13T21:00:00-05:00", neighborhood: "Distillery District" },
  { id: "past", title: "Past", startsAt: "2026-09-12T19:30:00-04:00", neighborhood: "Yorkville" },
  { id: "soon", title: "Soon", startsAt: "2026-10-15T19:00:00-04:00", neighborhood: "King West" },
];

describe("events", () => {
  it("hides past events and sorts the rest by start time", () => {
    const upcoming = getUpcomingEvents(new Date("2026-09-23T12:00:00Z"), events);
    expect(upcoming.map((e) => e.id)).toEqual(["soon", "later"]);
  });

  it("hides an event once it has started", () => {
    const upcoming = getUpcomingEvents(new Date("2026-10-15T23:00:00Z"), events);
    expect(upcoming.map((e) => e.id)).toEqual(["later"]);
  });

  it("formats in Toronto time regardless of the server's time zone", () => {
    expect(formatEventDate("2026-11-14T02:00:00Z")).toBe("Friday, November 13");
    expect(formatEventTime("2026-11-14T02:00:00Z")).toBe("9:00 p.m.");
  });
});
