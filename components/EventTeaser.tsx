import type { ClubEvent } from "@/content/events";
import { formatEventDate, formatEventTime } from "@/lib/events";

export function EventTeaser({ event }: { event: ClubEvent }) {
  return (
    <article className="flex h-full flex-col border border-charcoal bg-surface p-8 transition-colors duration-700 ease-luxe hover:border-gold/60 md:p-10">
      <p className="label text-muted">{event.neighborhood}</p>
      <h3 className="mt-6 font-display text-3xl font-light leading-tight text-ivory">
        {event.title}
      </h3>
      <div className="mt-auto pt-10">
        <div className="h-px w-10 bg-gold/70" />
        <p className="mt-6 text-sm text-ivory">
          <time dateTime={event.startsAt}>
            {formatEventDate(event.startsAt)}
            <span className="text-muted"> · {formatEventTime(event.startsAt)}</span>
          </time>
        </p>
        <p className="mt-2 text-sm italic text-muted">Location disclosed to approved members</p>
      </div>
    </article>
  );
}
