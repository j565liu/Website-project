import Link from "next/link";
import { CtaSection } from "@/components/CtaSection";
import { EventList } from "@/components/EventList";
import { Hero } from "@/components/Hero";
import { SectionHeading } from "@/components/SectionHeading";
import { getUpcomingEvents } from "@/lib/events";

// Re-render hourly so past events drop off without a redeploy.
export const revalidate = 3600;

export default function HomePage() {
  const nextEvents = getUpcomingEvents().slice(0, 3);

  return (
    <>
      <Hero tagline="Private gatherings for Toronto’s professionals, in some of the city’s most interesting rooms." />

      <section aria-labelledby="intro" className="mx-auto max-w-7xl px-6 py-32 md:px-10 md:py-44">
        <div className="grid gap-16 md:grid-cols-[1fr_1.4fr] md:gap-24">
          <SectionHeading id="intro" label="The Club" title="Fewer people. Better evenings." />
          <div className="space-y-6 text-lg leading-relaxed text-muted md:pt-12">
            <p>
              Ready to Mingle is a private club for professionals who would rather spend an
              evening in good company than in a crowded room. We host a small number of
              gatherings each season, across Toronto&rsquo;s most interesting neighbourhoods.
            </p>
            <p>
              Register your interest with your email and we will let you know when the next
              gathering is announced. Come curious, and bring your good conversation.
            </p>
            <Link
              href="/the-club"
              className="label inline-block pt-4 text-ivory underline decoration-gold underline-offset-8 transition-colors duration-500 hover:text-gold"
            >
              About the club
            </Link>
          </div>
        </div>
      </section>

      <section aria-labelledby="upcoming" className="border-t border-charcoal">
        <div className="mx-auto max-w-7xl px-6 py-32 md:px-10 md:py-44">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <SectionHeading id="upcoming" label="Upcoming" title="Forthcoming gatherings" />
            <Link
              href="/events"
              className="label self-start text-ivory underline decoration-gold underline-offset-8 transition-colors duration-500 hover:text-gold md:self-auto"
            >
              All events
            </Link>
          </div>
          <div className="mt-16">
            <EventList events={nextEvents} />
          </div>
        </div>
      </section>

      <CtaSection
        title="Be the first to hear."
        body="Leave your email and we will let you know when the next gathering is announced. Locations are shared with registered guests only."
      />
    </>
  );
}
