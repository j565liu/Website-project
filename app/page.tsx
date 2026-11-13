import Link from "next/link";
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
              Every gathering is by invitation. If you have a code, registering takes a minute.
              Come curious, and bring your good conversation.
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
            <SectionHeading id="upcoming" label="Invitations" title="How you are invited" />
          </Reveal>
          <Reveal className="mt-16 grid gap-10 border-t border-charcoal pt-10 lg:grid-cols-[1fr_1.4fr] lg:gap-24">
            <p className="font-display text-2xl font-normal text-ivory md:text-3xl">
              Invitations are sent personally, by email.
            </p>
            <div className="space-y-6 text-lg leading-relaxed text-muted">
              <p>
                A small number of evenings each season, across Toronto&rsquo;s neighbourhoods. Once
                you have registered with the code from your invitation, we write to you about the
                evenings that suit you, with the date and all the details.
              </p>
              <Link
                href="/register"
                className="label inline-block py-3 text-ivory underline decoration-gold underline-offset-8 transition-colors duration-500 hover:text-gold"
              >
                Register with your code
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
