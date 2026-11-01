// Teasers only: never add venue names, addresses or prices here.
// `startsAt` must include the Toronto UTC offset: -04:00 until Nov 1, 2026, then -05:00.
// Events move to "Past gatherings" once they start; keep past events in this list.

export type ClubEvent = {
  id: string;
  title: string;
  startsAt: string;
  neighborhood: string;
  // Shown under the date. Defaults to "Location shared with registered guests".
  locationNote?: string;
};

export const events: ClubEvent[] = [
  {
    id: "evening-downtown-2026-11",
    title: "An Evening Downtown",
    startsAt: "2026-11-26T18:30:00-05:00",
    neighborhood: "Downtown Toronto",
    locationNote: "Location TBD",
  },
];
