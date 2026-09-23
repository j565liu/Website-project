import type { ClubEvent } from "@/content/events";
import { EventTeaser } from "./EventTeaser";

export function EventList({ events }: { events: ClubEvent[] }) {
  if (events.length === 0) {
    return (
      <p className="border-t border-charcoal pt-10 font-display text-2xl font-light italic text-muted">
        New gatherings will be announced soon.
      </p>
    );
  }

  return (
    <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => (
        <li key={event.id}>
          <EventTeaser event={event} />
        </li>
      ))}
    </ul>
  );
}
