import type { ClubEvent } from "@/content/events";
import { EventTeaser } from "./EventTeaser";
import { Reveal } from "./Reveal";

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
      {events.map((event, index) => (
        <li key={event.id}>
          <Reveal className="h-full" delay={(index % 3) * 0.12}>
            <EventTeaser event={event} />
          </Reveal>
        </li>
      ))}
    </ul>
  );
}
