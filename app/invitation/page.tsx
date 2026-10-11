import type { Metadata } from "next";
import { InvitationForm } from "@/components/InvitationForm";
import { PageHeader } from "@/components/PageHeader";
import { safeNextPath } from "@/lib/invitation";

export const metadata: Metadata = {
  title: "By invitation",
  robots: { index: false, follow: false },
};

export default async function InvitationPage({ searchParams }: PageProps<"/invitation">) {
  const { next } = await searchParams;

  return (
    <>
      <PageHeader
        label="By Invitation"
        title="Enter your invitation code"
        intro="Our gatherings and registration are open to invited guests. Enter the code from your invitation to continue. You will only need to do this once on each device."
      />
      <section aria-label="Enter your code" className="mx-auto max-w-7xl px-6 pb-32 md:px-10 md:pb-44">
        <div className="max-w-xl">
          <InvitationForm next={safeNextPath(next)} />
          <p className="mt-16 leading-relaxed text-muted">
            Don&rsquo;t have a code? Invitations are shared personally. If someone passed this site
            on to you, they can give you the code.
          </p>
        </div>
      </section>
    </>
  );
}
