import Link from "next/link";
import { CtaSection } from "@/components/CtaSection";
import { ExampleList } from "@/components/ExampleList";
import { Hero } from "@/components/Hero";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { TextSection } from "@/components/TextSection";
import { formats } from "@/content/examples";

export default function HomePage() {
  return (
    <>
      <Hero tagline="Small, hosted evenings for people who prefer conversation to crowds: what they are, and how to find or start one." />
      {/* Blends the hero's solid bottom edge into the background photo below it. */}
      <div aria-hidden="true" className="pointer-events-none relative -mb-48 h-48 bg-linear-to-b from-background to-transparent" />

      <section aria-labelledby="intro" className="mx-auto max-w-7xl px-6 py-32 md:px-10 md:py-44">
        <Reveal className="grid gap-16 lg:grid-cols-[1fr_1.4fr] lg:gap-24">
          <SectionHeading id="intro" label="What It Is" title="Fewer people. Better evenings." />
          <div className="space-y-6 text-lg leading-relaxed text-muted lg:pt-12">
            <p>
              In many cities, people are trading large networking events for something smaller: a
              supper for a few guests, a tasting around one table, an evening of music in a quiet
              room. Some are run by hosts who do it regularly. Many are started by someone who simply
              invited a few people they wanted to know better.
            </p>
            <p>
              This site looks at what those gatherings involve and why people enjoy them, using
              Toronto as an example city, so you can find one near you or start your own.
            </p>
            <Link
              href="/what-it-is"
              className="label inline-block py-3 text-ivory underline decoration-gold underline-offset-8 transition-colors duration-500 hover:text-gold"
            >
              Learn more
            </Link>
          </div>
        </Reveal>
      </section>

      <TextSection id="why-people-enjoy-them" label="Why People Enjoy Them" title="Depth over volume">
        <p>
          A small room changes how people talk. With fewer guests, conversations last longer, and
          people tend to leave having properly met two or three others rather than having
          exchanged cards with twenty.
        </p>
        <p>
          There is usually something to gather around, like a meal, a wine or a piece of music,
          so no one has to perform. People often say the evening felt more like a dinner with
          friends than an event.
        </p>
      </TextSection>

      <section aria-labelledby="examples" className="border-t border-charcoal">
        <div className="mx-auto max-w-7xl px-6 py-32 md:px-10 md:py-44">
          <Reveal className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <SectionHeading id="examples" label="Examples" title="A few common formats" />
            <Link
              href="/examples"
              className="label inline-block self-start py-3 text-ivory underline decoration-gold underline-offset-8 transition-colors duration-500 hover:text-gold md:self-auto"
            >
              See all examples
            </Link>
          </Reveal>
          <div className="mt-16">
            <ExampleList formats={formats.slice(0, 3)} />
          </div>
        </div>
      </section>

      <CtaSection
        title="Start one of your own."
        body="A short starter guide covers the basics: choosing a setting, a size and a first guest list. Enter your email and we will send you a link to it."
        secondary={{ href: "/what-it-is#finding-one", label: "Find something similar near you" }}
      />
    </>
  );
}
