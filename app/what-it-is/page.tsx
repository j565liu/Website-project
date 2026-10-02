import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { CtaSection } from "@/components/CtaSection";
import { PageHeader } from "@/components/PageHeader";
import { TextSection } from "@/components/TextSection";

export const metadata: Metadata = pageMetadata({
  title: "What It Is",
  description:
    "What small, hosted gatherings are, what a typical evening looks like, who they suit, and what you need to find or start one.",
  path: "/what-it-is",
});

export default function WhatItIsPage() {
  return (
    <>
      <PageHeader
        label="What It Is"
        title="An evening is only as good as the people in the room."
        intro="Small, hosted gatherings start from a simple observation: the best conversations rarely happen at networking events. They tend to happen over a long dinner, at a bar after the crowd has thinned, in rooms where no one is selling anything."
      />

      <TextSection id="the-idea" label="The Idea" title="Small by design">
        <p>
          These gatherings are deliberately small. A room of people who are glad to be there is
          almost always better than a crowd that is passing through.
        </p>
        <p>
          There are usually no name tags, no panels and no pitches. A host chooses the setting,
          the food and the music with care, then steps back and lets the evening find its own
          shape.
        </p>
      </TextSection>

      <TextSection id="a-typical-evening" label="A Typical Evening" title="What a session looks like">
        <p>
          Guests usually arrive over the first half hour to a drink and a few introductions from
          the host. Then the group settles around whatever anchors the evening, whether that is a
          shared meal, a flight of wines poured in order, or a set of live music.
        </p>
        <p>
          The middle of the evening is mostly conversation. There are no speeches beyond a brief
          welcome. Many evenings end at a sensible hour, and guests who want to keep talking often
          move on somewhere nearby together.
        </p>
        <p>
          Some hosts share the location only with confirmed guests, a few days ahead. That is
          especially common when the gathering is in someone&rsquo;s home.
        </p>
      </TextSection>

      <TextSection id="why-people-enjoy-them" label="Why People Enjoy Them" title="Depth over volume">
        <p>
          People often say they enjoy these evenings because they meet fewer people, and meet
          them properly. With something to gather around, conversation starts easily and no one
          has to perform.
        </p>
        <p>
          For many, they are also a way to see a city differently: a restaurant&rsquo;s kitchen
          up close, a studio they would never have found, a neighbourhood they rarely visit.
        </p>
      </TextSection>

      <TextSection id="who-its-for" label="Who It’s For" title="Curious, more than credentialed">
        <p>
          These gatherings tend to suit people who would rather have one good conversation than
          twenty short ones. Guests often come from very different fields. In a city like Toronto,
          that might mean finance, law, medicine, technology and the arts at a single table. What
          they share is less a job title than a disposition: curiosity about other people and
          generosity in conversation.
        </p>
      </TextSection>

      <TextSection id="getting-started" label="Getting Started" title="What you need">
        <p>
          <span className="text-ivory">A host.</span> One person who chooses the setting, sends
          the invitations and makes introductions on the night.
        </p>
        <p>
          <span className="text-ivory">A handful of guests.</span> Small enough to share a table.
          Many hosts start with people they know and ask each guest to bring someone new.
        </p>
        <p>
          <span className="text-ivory">A setting.</span> A home, a restaurant&rsquo;s private room
          or counter, a gallery or studio, or a quiet bar early in the week.
        </p>
        <p>
          <span className="text-ivory">Something to gather around.</span> A meal, a tasting, an
          exhibition or some music, so the conversation has somewhere to start.
        </p>
        <p>
          <span className="text-ivory">A way to cover costs.</span> Some hosts cover costs
          themselves, others split them evenly among guests. Agreeing on this up front keeps
          things simple.
        </p>
      </TextSection>

      <TextSection id="finding-one" label="Finding One" title="Finding something similar near you">
        <p>
          Search for terms like supper club, tasting evening, listening session or salon,
          together with your city. Restaurants that offer chef&rsquo;s counter seating or private
          dining sometimes host them too, and so do galleries and wine shops.
        </p>
        <p>
          Asking around also works well. People who enjoy these evenings are usually happy to
          bring a friend.
        </p>
        <p>[EXAMPLE: add local listings, community groups or hosts in Toronto that readers could look at.]</p>
      </TextSection>

      <CtaSection
        title="Start one of your own."
        body="A short starter guide covers the basics: choosing a setting, a size and a first guest list. Enter your email and we will send you a link to it."
        secondary={{ href: "/examples", label: "See examples" }}
      />
    </>
  );
}
