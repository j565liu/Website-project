// Teasers only: never add venue names, addresses or prices here.
// `startsAt` must include the Toronto UTC offset: -04:00 until Nov 1, 2026, then -05:00.
// Events disappear from the site automatically once their start time has passed.

export type ClubEvent = {
  id: string;
  title: string;
  startsAt: string;
  neighborhood: string;
};

export const events: ClubEvent[] = [
  {
    id: "autumn-supper-2026",
    title: "An Autumn Supper",
    startsAt: "2026-09-12T19:30:00-04:00",
    neighborhood: "Yorkville",
  },
  {
    id: "natural-wine-evening-2026",
    title: "A Natural Wine Evening",
    startsAt: "2026-10-15T19:00:00-04:00",
    neighborhood: "King West",
  },
  {
    id: "private-viewing-2026",
    title: "A Private Viewing",
    startsAt: "2026-10-29T18:30:00-04:00",
    neighborhood: "Yorkville",
  },
  {
    id: "late-jazz-2026",
    title: "Late Jazz, Low Light",
    startsAt: "2026-11-13T21:00:00-05:00",
    neighborhood: "Distillery District",
  },
  {
    id: "chefs-counter-2026",
    title: "The Chef’s Counter",
    startsAt: "2026-11-27T19:30:00-05:00",
    neighborhood: "Ossington",
  },
  {
    id: "solstice-supper-2026",
    title: "A Solstice Supper",
    startsAt: "2026-12-18T19:00:00-05:00",
    neighborhood: "Rosedale",
  },
];
