import Link from "next/link";
import { CtaSection } from "@/components/CtaSection";
import { EventList } from "@/components/EventList";
import { Hero } from "@/components/Hero";
import { Reveal } from "@/components/Reveal";
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
        <Reveal className="grid gap-16 lg:grid-cols-[1fr_1.4fr] lg:gap-24">
          <SectionHeading id="intro" label="The Club" title="Fewer people. Better evenings." />
          <div className="space-y-6 text-lg leading-relaxed text-muted lg:pt-12">
            <p>
              Ready to Mingle is a private club for professionals who would rather spend an
              evening in good company than in a crowded room. We host a small number of
              gatherings each season, across Toronto&rsquo;s most interesting neighbourhoods.
            </p>
            <p>
              Registering takes a minute: your name, your email and a little about you.
              Come curious, and bring your good conversation.
            </p>
            <Link
              href="/the-club"
              className="label inline-block pt-4 text-ivory underline decoration-gold underline-offset-8 transition-colors duration-500 hover:text-gold"
            >
              About the club
            </Link>
          </div>
        </Reveal>
      </section>

      <section aria-labelledby="upcoming" className="border-t border-charcoal">
        <div className="mx-auto max-w-7xl px-6 py-32 md:px-10 md:py-44">
          <Reveal className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <SectionHeading id="upcoming" label="Upcoming" title="Forthcoming gatherings" />
            <Link
              href="/events"
              className="label self-start text-ivory underline decoration-gold underline-offset-8 transition-colors duration-500 hover:text-gold md:self-auto"
            >
              All events
            </Link>
          </Reveal>
          <div className="mt-16">
            <EventList events={nextEvents} />
          </div>
        </div>
      </section>

      <CtaSection
        title="Take a seat at the table."
        body="Register your interest with a few details about yourself. Locations are shared with registered guests only."
      />
    </>
  );
}
