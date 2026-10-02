import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { TextSection } from "@/components/TextSection";

// Linked from the guide email and shown after confirming. Kept out of search and the sitemap.
export const metadata: Metadata = {
  title: "Starter guide",
  robots: { index: false, follow: false },
};

export default function GuideReadPage() {
  return (
    <>
      <PageHeader
        label="Starter Guide"
        title="Hosting your first gathering"
        intro="Your email is confirmed. This guide walks through the basics of a first small gathering. Bookmark this page, or keep the email we sent, to come back to it."
      />

      <TextSection id="choose-a-format" label="Step One" title="Choose a format">
        <p>
          Start with something you already enjoy: a meal you like to cook, a wine you want to
          share, an exhibition you have been meaning to see. The{" "}
          <Link href="/examples" className="text-ivory underline decoration-gold underline-offset-4">
            examples
          </Link>{" "}
          are a good place to start.
        </p>
        <p>[EXAMPLE: guide content on choosing a format.]</p>
      </TextSection>

      <TextSection id="choose-a-size" label="Step Two" title="Decide on a size">
        <p>
          Small enough to share one conversation, or a few. Many first gatherings are smaller
          than the host expected, and better for it.
        </p>
        <p>[EXAMPLE: guide content on group size.]</p>
      </TextSection>

      <TextSection id="choose-a-setting" label="Step Three" title="Find a setting">
        <p>
          A home, a restaurant&rsquo;s private room or counter, a gallery or studio, or a quiet
          bar early in the week.
        </p>
        <p>[EXAMPLE: guide content on finding and booking a setting.]</p>
      </TextSection>

      <TextSection id="first-guest-list" label="Step Four" title="Put together a first guest list">
        <p>
          Mix people who do not already know each other, and ask each guest to bring someone new.
        </p>
        <p>[EXAMPLE: guide content on invitations and guest lists.]</p>
      </TextSection>

      <TextSection id="on-the-night" label="Step Five" title="On the night">
        <p>
          A brief welcome, a few introductions, then step back. Agree on costs ahead of time so
          no one has to think about them on the night.
        </p>
        <p>[EXAMPLE: guide content on hosting the evening and following up.]</p>
      </TextSection>
    </>
  );
}
