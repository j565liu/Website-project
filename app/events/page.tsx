import type { Metadata } from "next";
import { CtaSection } from "@/components/CtaSection";
import { EventList } from "@/components/EventList";
import { PageHeader } from "@/components/PageHeader";
import { getUpcomingEvents } from "@/lib/events";

// Re-render hourly so past events drop off without a redeploy.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Events",
  description:
    "Upcoming Ready to Mingle gatherings across Toronto. Locations are shared with registered guests only.",
};

export default function EventsPage() {
  const upcoming = getUpcomingEvents();

  return (
    <>
      <PageHeader
        label="Events"
        title="Forthcoming gatherings"
        intro="A small number of evenings each season, across Toronto’s neighbourhoods. Details and locations are shared with registered guests only. All times are Toronto time."
      />
      <section aria-label="Upcoming events" className="mx-auto max-w-7xl px-6 pb-32 md:px-10 md:pb-44">
        <EventList events={upcoming} />
      </section>
      <CtaSection
        title="Take a seat at the table."
        body="Register your interest with a few details about yourself. Locations are shared with registered guests only."
      />
    </>
  );
}
