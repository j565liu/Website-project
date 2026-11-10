import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { ReservationForm } from "@/components/ReservationForm";
import { site } from "@/content/site";
import { pageMetadata } from "@/lib/metadata";
import { formatEventDate, formatEventTime, formatPastEventDate, getEventById, hasStarted } from "@/lib/events";

// Re-render hourly so the page stops taking reservations once the evening starts.
export const revalidate = 3600;

export async function generateMetadata({ params }: PageProps<"/events/[id]">): Promise<Metadata> {
  const event = getEventById((await params).id);
  if (!event) return {};
  return {
    ...pageMetadata({
      title: event.title,
      description: "A private Ready to Mingle gathering. Locations are shared with registered guests only.",
      path: `/events/${event.id}`,
    }),
    robots: { index: false, follow: false },
  };
}

export default async function EventPage({ params }: PageProps<"/events/[id]">) {
  const event = getEventById((await params).id);
  if (!event) notFound();

  const past = hasStarted(event);
  const reservations = site.reservationsOpen;
  const details = [
    { term: "Date", value: past ? formatPastEventDate(event.startsAt) : formatEventDate(event.startsAt) },
    { term: "Time", value: formatEventTime(event.startsAt) },
    { term: "Area", value: event.neighborhood },
    // The card's note reads "Location TBD"; under a "Location" heading, "TBD" is enough.
    { term: "Location", value: event.locationNote?.replace(/^Location\s+/i, "") ?? "Shared with registered guests" },
    ...(event.dressCode ? [{ term: "Dress", value: event.dressCode }] : []),
  ];

  return (
    <>
      <PageHeader
        label={event.neighborhood}
        title={event.title}
        intro={
          past
            ? `This gathering took place on ${formatPastEventDate(event.startsAt)}.`
            : `${formatEventDate(event.startsAt)} at ${formatEventTime(event.startsAt)}, Toronto time.`
        }
      />

      <section aria-label="About this evening" className="mx-auto max-w-7xl px-6 pb-32 md:px-10 md:pb-44">
        <div className={reservations ? "grid gap-16 lg:grid-cols-2 lg:gap-24" : "max-w-3xl"}>
          <div className="space-y-10">
            {event.description && (
              <div className="space-y-6 text-lg leading-relaxed text-muted">
                {event.description.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            )}
            <dl className="grid grid-cols-[auto_1fr] gap-x-8 gap-y-4 border-t border-charcoal pt-8">
              {details.map(({ term, value }) => (
                <div key={term} className="contents">
                  <dt className="label pt-1 text-muted">{term}</dt>
                  <dd className="text-ivory">{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {!reservations ? null : past ? (
            <p className="font-display text-2xl font-normal text-muted">
              Reservations for this evening have closed.
            </p>
          ) : (
            <div className="border border-charcoal bg-surface p-8 md:p-10">
              <h2 className="font-display text-3xl font-medium leading-tight text-ivory">Reserve your place</h2>
              <p className="mt-4 text-muted">
                Places are for registered guests. Enter your email and we will send you a link to
                confirm.
              </p>
              <div className="relative mt-10">
                <ReservationForm eventId={event.id} />
              </div>
            </div>
          )}
        </div>

        <Link
          href="/events"
          className="label mt-20 inline-block py-3 text-ivory underline decoration-gold underline-offset-8 transition-colors duration-500 hover:text-gold"
        >
          All gatherings
        </Link>
      </section>
    </>
  );
}
