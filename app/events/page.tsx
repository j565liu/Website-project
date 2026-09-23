import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { CtaSection } from "@/components/CtaSection";
import { EventList } from "@/components/EventList";
import { PageHeader } from "@/components/PageHeader";
import { getUpcomingEvents } from "@/lib/events";

// Re-render hourly so past events drop off without a redeploy.
export const revalidate = 3600;

export const metadata: Metadata = pageMetadata({
  title: "Events",
  description: "Upcoming Ready to Mingle gatherings across Toronto. Locations are shared with registered guests only.",
  path: "/events",
});

export default function EventsPage() {
  const upcoming = getUpcomingEvents();

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
      <CtaSection
        title="Take a seat at the table."
        body="Register your interest with a few details about yourself. Locations are shared with registered guests only."
      />
    </>
  );
}
