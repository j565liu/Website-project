// Illustrative formats, not scheduled events: never add dates, venue names, addresses or prices.
// Where a real gathering, host or listing would go, use an "[EXAMPLE: …]" placeholder.

export type GatheringFormat = {
  id: string;
  // Short category shown above the title, e.g. "Around the table".
  kind: string;
  title: string;
  // What the format involves, in one or two sentences.
  summary: string;
  // How people commonly vary it.
  variations: string;
};

export const formats: GatheringFormat[] = [
  {
    id: "seasonal-supper",
    kind: "Around the table",
    title: "A Seasonal Supper",
    summary:
      "A long dinner for a small group, often built around what is in season. Courses arrive slowly and the conversation does most of the work.",
    variations: "Held at home, in a restaurant’s private room, or as a shared table where each guest brings a course.",
  },
  {
    id: "tasting-evening",
    kind: "Tasting",
    title: "A Natural Wine Evening",
    summary:
      "A handful of bottles poured in a set order, with someone on hand to say a little about each. The food is simple and the pace unhurried.",
    variations: "Wine, sake, whisky, tea or coffee all work. Some groups take turns choosing the theme.",
  },
  {
    id: "private-viewing",
    kind: "Art & ideas",
    title: "A Private Viewing",
    summary:
      "A small group visits an exhibition or studio, sometimes outside regular hours, then carries the conversation on over a drink nearby.",
    variations: "A studio visit, an architecture walk, or a reading followed by questions.",
  },
  {
    id: "late-music",
    kind: "Music",
    title: "Late Jazz, Low Light",
    summary:
      "Live music in a quiet room, with seating close enough that conversation picks up between sets.",
    variations: "A records-only listening evening, a small acoustic set at home, or a chamber group.",
  },
  {
    id: "chefs-counter",
    kind: "Food & craft",
    title: "The Chef’s Counter",
    summary:
      "A group takes the counter seats at a restaurant and watches the kitchen at work, often with the chef describing each dish as it arrives.",
    variations: "A hands-on cooking class, a bakery visit before opening, or a shared tasting menu.",
  },
  {
    id: "seasonal-marker",
    kind: "Marking the season",
    title: "A Solstice Supper",
    summary:
      "An evening timed to a moment in the year: the longest night, the first warm evening, the end of the harvest.",
    variations: "A rooftop evening in summer, a fireside table in winter, or a harvest meal in autumn.",
  },
];
