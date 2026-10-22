import Link from "next/link";
import { CtaSection } from "@/components/CtaSection";
import { Hero } from "@/components/Hero";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";

export default function HomePage() {
  return (
    <>
      <Hero tagline="Private gatherings for Toronto’s professionals, in some of the city’s most interesting rooms." />
      {/* Blends the hero's solid bottom edge into the background photo below it. */}
      <div aria-hidden="true" className="pointer-events-none relative -mb-48 h-48 bg-linear-to-b from-background to-transparent" />

      <section aria-labelledby="intro" className="mx-auto max-w-7xl px-6 py-32 md:px-10 md:py-44">
        <Reveal className="grid gap-16 lg:grid-cols-[1fr_1.4fr] lg:gap-24">
          <SectionHeading id="intro" label="About" title="Fewer people. Better evenings." />
          <div className="space-y-6 text-lg leading-relaxed text-muted lg:pt-12">
            <p>
              Ready to Mingle hosts private gatherings for professionals who would rather spend
              an evening in good company than in a crowded room. There is no clubhouse: each
              gathering is held somewhere different, across Toronto&rsquo;s most interesting
              neighbourhoods.
            </p>
            <p>
              Every gathering is by invitation. If you have a code, registering takes a minute:
              your name and your email. Come curious, and bring your good conversation.
            </p>
            <Link
              href="/about"
              className="label inline-block py-3 text-ivory underline decoration-gold underline-offset-8 transition-colors duration-500 hover:text-gold"
            >
              More about us
            </Link>
          </div>
        </Reveal>
      </section>

      <section aria-labelledby="upcoming" className="border-t border-charcoal">
        <div className="mx-auto max-w-7xl px-6 py-32 md:px-10 md:py-44">
          <Reveal className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <SectionHeading id="upcoming" label="Upcoming" title="Forthcoming gatherings" />
          </Reveal>
          <Reveal className="mt-16 grid gap-10 border-t border-charcoal pt-10 lg:grid-cols-[1fr_1.4fr] lg:gap-24">
            <p className="font-display text-2xl font-normal text-ivory md:text-3xl">
              Dates and details are shared with invited guests.
            </p>
            <div className="space-y-6 text-lg leading-relaxed text-muted">
              <p>
                A small number of evenings each season, across Toronto&rsquo;s neighbourhoods. Enter
                the code from your invitation to see what is coming up.
              </p>
              <Link
                href="/events"
                className="label inline-block py-3 text-ivory underline decoration-gold underline-offset-8 transition-colors duration-500 hover:text-gold"
              >
                View events
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <CtaSection
        title="Take a seat at the table."
        body="Gatherings are by invitation. With your code, registering takes a minute, and locations are shared with registered guests only."
      />
    </>
  );
}
