import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { CtaSection } from "@/components/CtaSection";
import { PageHeader } from "@/components/PageHeader";
import { Reveal } from "@/components/Reveal";
import { TextSection } from "@/components/TextSection";

export const metadata: Metadata = pageMetadata({
  title: "The Club",
  description: "Ready to Mingle hosts a small number of private gatherings each season for Toronto professionals.",
  path: "/the-club",
});

const evenings = [
  {
    neighbourhood: "Ossington",
    title: "Suppers",
    body: "A chef’s counter, a long table, a menu chosen for the evening rather than the crowd.",
  },
  {
    neighbourhood: "Yorkville",
    title: "Private viewings",
    body: "Quiet hours in a gallery, with the artist or curator in the room to talk about the work.",
  },
  {
    neighbourhood: "Distillery District",
    title: "Late evenings",
    body: "Low light and live jazz, for the hour after dinner when the best conversations start.",
  },
] as const;

export default function TheClubPage() {
  return (
    <>
      <PageHeader
        label="The Club"
        title="An evening is only as good as the people in the room."
        intro="Ready to Mingle began with a simple observation: the best conversations rarely happen at networking events. They happen over a long dinner, at a good bar after the crowd has thinned, in rooms where no one is selling anything."
      />

      <TextSection id="philosophy" label="Philosophy" title="Small by design">
        <p>
          We keep our gatherings deliberately small. A room of people who are glad to be there
          will always be better than a crowd that is passing through.
        </p>
        <p>
          There are no name tags, no panels and no pitches. We choose the setting, the food and
          the music with care, and then we step back and let the evening find its own shape.
        </p>
      </TextSection>

      <section aria-labelledby="the-evenings" className="border-t border-charcoal">
        <div className="mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32">
          <Reveal>
            <p className="label text-muted">The Evenings</p>
            <h2
              id="the-evenings"
              className="mt-5 font-display text-3xl font-medium leading-tight text-ivory md:text-4xl"
            >
              What to expect
            </h2>
          </Reveal>
          <ul className="mt-16 grid gap-12 md:grid-cols-3 md:gap-10">
            {evenings.map((evening, index) => (
              <li key={evening.title}>
                <Reveal delay={index * 0.12} className="border-t border-gold/60 pt-8">
                  <p className="label text-muted">{evening.neighbourhood}</p>
                  <h3 className="mt-4 font-display text-3xl font-medium text-ivory">{evening.title}</h3>
                  <p className="mt-4 text-lg leading-relaxed text-muted">{evening.body}</p>
                </Reveal>
              </li>
            ))}
          </ul>
          <Reveal className="mt-16 max-w-3xl">
            <p className="text-lg leading-relaxed text-muted">
              Each gathering is different, but all of them are unhurried, well hosted and held
              somewhere worth the trip. Every gathering is by invitation, and locations are shared
              with registered guests only, a few days before each evening. We never publish them,
              which keeps the rooms relaxed and the company genuine.
            </p>
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="who-its-for" className="border-t border-charcoal">
        <Reveal className="mx-auto flex max-w-4xl flex-col items-center px-6 py-24 text-center md:py-36">
          <p className="label text-muted">Who It&rsquo;s For</p>
          <h2 id="who-its-for" className="sr-only">
            Accomplished, and curious
          </h2>
          <blockquote className="mt-10">
            <p className="font-display text-4xl font-normal leading-tight text-ivory md:text-5xl">
              &ldquo;What our guests share is less a job title than a disposition.&rdquo;
            </p>
          </blockquote>
          <div className="mt-10 h-px w-16 bg-gold" />
          <div className="mt-10 max-w-2xl space-y-6 text-lg leading-relaxed text-muted">
            <p>
              Our guests are Toronto professionals across finance, law, medicine, technology, the
              arts and their own ventures. They are curious about other people, generous in
              conversation, and prefer depth over volume.
            </p>
            <p>
              Invitations are shared personally. If someone has passed this site on to you, we
              would be glad to have your name.
            </p>
          </div>
        </Reveal>
      </section>

      <CtaSection
        title="Take a seat at the table."
        body="Gatherings are by invitation. With your code, registering takes a minute, and locations are shared with registered guests only."
      />
    </>
  );
}
