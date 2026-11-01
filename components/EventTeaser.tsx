import type { ClubEvent } from "@/content/events";
import { formatEventDate, formatEventTime, formatPastEventDate } from "@/lib/events";

export function EventTeaser({ event, past = false }: { event: ClubEvent; past?: boolean }) {
  return (
    <article
      className={`flex h-full flex-col border border-charcoal bg-surface p-8 md:p-10 ${
        past ? "" : "transition-colors duration-700 ease-luxe hover:border-gold/60"
      }`}
    >
      <p className="label text-muted">{event.neighborhood}</p>
      <h3
        className={`mt-6 font-display text-3xl font-medium leading-tight ${past ? "text-muted" : "text-ivory"}`}
      >
        {event.title}
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
          </>
        )}
      </div>
    </article>
  );
}
