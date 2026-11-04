import Link from "next/link";
import type { ClubEvent } from "@/content/events";
import { formatEventDate, formatEventTime, formatPastEventDate } from "@/lib/events";

// Upcoming cards are clickable as a whole: the title's link stretches over the card, so the
// link's name is the event title rather than the whole card's text.
export function EventTeaser({ event, past = false }: { event: ClubEvent; past?: boolean }) {
  return (
    <article
      className={`relative flex h-full flex-col border border-charcoal bg-surface p-8 md:p-10 ${
        past
          ? ""
          : "transition-colors duration-700 ease-luxe hover:border-gold/60 has-[a:focus-visible]:outline has-[a:focus-visible]:outline-1 has-[a:focus-visible]:outline-offset-4 has-[a:focus-visible]:outline-gold"
      }`}
    >
      <p className="label text-muted">{event.neighborhood}</p>
      <h3
        className={`mt-6 font-display text-3xl font-medium leading-tight ${past ? "text-muted" : "text-ivory"}`}
      >
        {past ? (
          event.title
        ) : (
          <Link href={`/events/${event.id}`} className="after:absolute after:inset-0 focus-visible:outline-none">
            {event.title}
          </Link>
        )}
      </h3>
      <div className="mt-auto pt-10">
        <div className={`h-px w-10 ${past ? "bg-charcoal" : "bg-gold/70"}`} />
        {past ? (
          <p className="mt-6 text-sm text-muted">
            <time dateTime={event.startsAt}>{formatPastEventDate(event.startsAt)}</time>
          </p>
        ) : (
          <>
            <p className="mt-6 text-sm text-ivory">
              <time dateTime={event.startsAt}>
                {formatEventDate(event.startsAt)}
                <span className="text-muted"> · {formatEventTime(event.startsAt)}</span>
              </time>
            </p>
            <p className="mt-2 text-sm text-muted">
              {event.locationNote ?? "Location shared with registered guests"}
            </p>
            <p aria-hidden="true" className="label mt-8 text-ivory">
              View details and reserve →
            </p>
          </>
        )}
      </div>
    </article>
  );
}
