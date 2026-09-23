import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { CtaSection } from "@/components/CtaSection";
import { PageHeader } from "@/components/PageHeader";
import { TextSection } from "@/components/TextSection";

export const metadata: Metadata = pageMetadata({
  title: "The Club",
  description: "Ready to Mingle hosts a small number of private gatherings each season for Toronto professionals.",
  path: "/the-club",
});

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

      <TextSection id="the-evenings" label="The Evenings" title="What to expect">
        <p>
          A supper at a chef&rsquo;s counter in Ossington. A private viewing in Yorkville.
          Late jazz in the Distillery District. Each gathering is different, but all of them are
          unhurried, well hosted and held somewhere worth the trip.
        </p>
        <p>
          Locations are shared with registered guests only, a few days before each evening.
          We never publish them, which keeps the rooms relaxed and the company genuine.
        </p>
      </TextSection>

      <TextSection id="who-its-for" label="Who It’s For" title="Accomplished, and curious">
        <p>
          Our guests are Toronto professionals across finance, law, medicine, technology, the
          arts and their own ventures. What they share is less a job title than a disposition:
          curiosity about other people, generosity in conversation, and a preference for depth
          over volume.
        </p>
        <p>
          If an evening like that sounds right to you, we would be glad to have your name.
        </p>
      </TextSection>

      <CtaSection
        title="Take a seat at the table."
        body="Register your interest with a few details about yourself. Locations are shared with registered guests only."
      />
    </>
  );
}
