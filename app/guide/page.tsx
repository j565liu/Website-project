import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { GuideRequestForm } from "@/components/GuideRequestForm";
import { PageHeader } from "@/components/PageHeader";

export const metadata: Metadata = pageMetadata({
  title: "Start Your Own",
  description: "Request a short starter guide to hosting a first small gathering: the setting, the size and the guest list.",
  path: "/guide",
});

export default function GuidePage() {
  return (
    <>
      <PageHeader
        label="Starter Guide"
        title="Start your own"
        intro="A short guide to hosting a first small gathering: choosing a setting, deciding on a size, and putting together a first guest list. Enter your name and email, and we will send you a link to confirm your address, then a link to the guide. Nothing else is sent."
      />
      <section aria-label="Starter guide request form" className="mx-auto max-w-7xl px-6 pb-32 md:px-10 md:pb-44">
        <div className="relative max-w-2xl">
          <GuideRequestForm />
        </div>
      </section>
    </>
  );
}
