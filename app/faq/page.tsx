import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { faq } from "@/content/faq";
import { site } from "@/content/site";

export const metadata: Metadata = pageMetadata({
  title: "FAQ",
  description: "Answers to common questions about Ready to Mingle, registration and our events.",
  path: "/faq",
});

export default function FaqPage() {
  return (
    <>
      <PageHeader label="FAQ" title="Questions, answered" />
      <section aria-label="Frequently asked questions" className="mx-auto max-w-7xl px-6 pb-32 md:px-10 md:pb-44">
        <div className="max-w-4xl">
          <div className="border-t border-charcoal">
            {faq.map((item) => (
              <details key={item.question} className="group border-b border-charcoal">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-8 font-display text-2xl font-light text-ivory transition-colors duration-500 hover:text-gold md:text-3xl [&::-webkit-details-marker]:hidden">
                  {item.question}
                  <span
                    aria-hidden="true"
                    className="shrink-0 font-sans text-xl font-light text-gold transition-transform duration-700 ease-luxe group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <div className="space-y-4 pb-10 pr-10 text-lg leading-relaxed text-muted">
                  {item.answer.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </details>
            ))}
          </div>
          <p className="mt-16 leading-relaxed text-muted">
            Something else? Write to us at{" "}
            <a href={`mailto:${site.contactEmail}`} className="text-ivory underline decoration-gold underline-offset-4">
              {site.contactEmail}
            </a>
            , or read our{" "}
            <Link href="/privacy" className="text-ivory underline decoration-gold underline-offset-4">
              privacy policy
            </Link>
            .
          </p>
        </div>
      </section>
    </>
  );
}
