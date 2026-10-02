import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { CtaSection } from "@/components/CtaSection";
import { ExampleList } from "@/components/ExampleList";
import { PageHeader } from "@/components/PageHeader";
import { TextSection } from "@/components/TextSection";
import { formats } from "@/content/examples";

export const metadata: Metadata = pageMetadata({
  title: "Examples",
  description:
    "Common formats for small, hosted gatherings, including suppers, tastings, private viewings and evenings of music, and how people vary them.",
  path: "/examples",
});

export default function ExamplesPage() {
  return (
    <>
      <PageHeader
        label="Examples"
        title="A few ways people do it"
        intro="There is no single format. These are common variations, described in general terms. Real gatherings mix and adapt them freely."
      />
      <section aria-labelledby="formats" className="mx-auto max-w-7xl px-6 pb-32 md:px-10 md:pb-44">
        <h2 id="formats" className="sr-only">
          Gathering formats
        </h2>
        <ExampleList formats={formats} />
      </section>
      <TextSection id="real-examples" label="In Practice" title="Real gatherings">
        <p>
          [EXAMPLE: add short descriptions of, or links to, real gatherings or hosts, with their
          permission.]
        </p>
      </TextSection>
      <CtaSection
        title="Start one of your own."
        body="A short starter guide covers the basics: choosing a setting, a size and a first guest list. Enter your email and we will send you a link to it."
        secondary={{ href: "/what-it-is#finding-one", label: "Find something similar near you" }}
      />
    </>
  );
}
