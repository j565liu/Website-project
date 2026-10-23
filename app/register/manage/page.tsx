import type { Metadata } from "next";
import { ManageRegistration } from "@/components/ManageRegistration";
import { StatusMessage } from "@/components/StatusMessage";
import { getDb } from "@/lib/db";
import { findManagedRegistration, type LookupResult } from "@/lib/registration/manage";

export const metadata: Metadata = {
  title: "Manage your registration",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

export default async function ManagePage({ searchParams }: PageProps<"/register/manage">) {
  const { id, sig } = await searchParams;

  let result: LookupResult | { status: "error" };
  try {
    result = await findManagedRegistration(id, sig, getDb());
  } catch (error) {
    console.error("[manage] Could not look up registration", error);
    result = { status: "error" };
  }

  if (result.status === "found") {
    const { preferredName, email, phone, eventEmails } = result.registration;
    return (
      <StatusMessage label="Your registration" title="Manage your registration">
        <p>These are the details we hold for you:</p>
        <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2">
          <dt>Name</dt>
          <dd className="text-ivory">{preferredName}</dd>
          <dt>Email</dt>
          <dd className="break-all text-ivory">{email}</dd>
          <dt>Phone</dt>
          <dd className="text-ivory">{phone ?? "Not given"}</dd>
        </dl>
        <div className="pt-8">
          <ManageRegistration id={id as string} sig={sig as string} eventEmails={eventEmails} />
        </div>
      </StatusMessage>
    );
  }

  if (result.status === "error") {
    return (
      <StatusMessage label="Please try again" title="Something went wrong." link={{ href: "/", label: "Return home" }}>
        <p>We couldn&rsquo;t open your registration just now. Please try again in a few minutes.</p>
      </StatusMessage>
    );
  }

  return (
    <StatusMessage label="Link not recognised" title="We couldn’t find that registration." link={{ href: "/", label: "Return home" }}>
      <p>
        The link may be incomplete, or the registration may already have been removed. Please use the
        link from the most recent email we sent you.
      </p>
    </StatusMessage>
  );
}
