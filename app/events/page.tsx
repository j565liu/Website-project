import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { CtaSection } from "@/components/CtaSection";
import { EventList } from "@/components/EventList";
import { PageHeader } from "@/components/PageHeader";
import { Reveal } from "@/components/Reveal";
import { getPastEvents, getUpcomingEvents } from "@/lib/events";

// Re-render hourly so events move to "Past gatherings" without a redeploy.
export const revalidate = 3600;

export const metadata: Metadata = pageMetadata({
  title: "Events",
  description: "Upcoming Ready to Mingle gatherings across Toronto. Locations are shared with registered guests only.",
  path: "/events",
});

export default function EventsPage() {
  const now = new Date();
  const upcoming = getUpcomingEvents(now);
  const past = getPastEvents(now);

  return (
    <>
      <PageHeader
        label="Events"
        title="Forthcoming gatherings"
        intro="A small number of evenings each season, across Toronto’s neighbourhoods. Details and locations are shared with registered guests only. All times are Toronto time."
      />
      <section aria-labelledby="upcoming-events" className="mx-auto max-w-7xl px-6 pb-32 md:px-10 md:pb-44">
        <h2 id="upcoming-events" className="sr-only">
          Upcoming events
        </h2>
        <EventList events={upcoming} />
      </section>
      {past.length > 0 && (
        <section aria-labelledby="past-events" className="border-t border-charcoal">
          <div className="mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32">
            <Reveal>
              <h2
                id="past-events"
                className="font-display text-3xl font-medium leading-tight text-ivory md:text-4xl"
              >
                Past gatherings
              </h2>
            </Reveal>
            <div className="mt-12">
              <EventList events={past} past />
            </div>
          </div>
        </section>
      )}
      <CtaSection
        title="Take a seat at the table."
        body="Register with your preferred name and email. Locations are shared with registered guests only."
        forInvitedGuests
      />
    </>
  );
}
