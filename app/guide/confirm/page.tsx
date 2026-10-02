import type { Metadata } from "next";
import { ConfirmForm } from "@/components/ConfirmForm";
import { StatusMessage } from "@/components/StatusMessage";
import { getDb } from "@/lib/db";
import { getTokenStatus, type TokenStatus } from "@/lib/registration/service";

export const metadata: Metadata = {
  title: "Confirm your email",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

export default async function ConfirmPage({ searchParams }: PageProps<"/guide/confirm">) {
  const { token } = await searchParams;

  let status: TokenStatus | "error";
  try {
    status = await getTokenStatus(token, { db: getDb() });
  } catch (error) {
    console.error("[guide] Could not check confirmation token", error);
    status = "error";
  }

  switch (status) {
    case "pending":
      return (
        <StatusMessage label="One last step" title="Confirm your email.">
          <p>Press the button below to confirm your email address and open the starter guide.</p>
          <div className="pt-6">
            <ConfirmForm token={token as string} />
          </div>
        </StatusMessage>
      );
    case "confirmed":
      return (
        <StatusMessage label="Confirmed" title="You’ve already confirmed." link={{ href: "/guide/read", label: "Read the guide" }}>
          <p>This email address has already been confirmed, so the guide is ready for you.</p>
        </StatusMessage>
      );
    case "expired":
      return (
        <StatusMessage label="Link expired" title="This link has expired." link={{ href: "/guide", label: "Request the guide again" }}>
          <p>Confirmation links last 48 hours. Request the guide again with the same email and we will send you a fresh one.</p>
        </StatusMessage>
      );
    case "invalid":
      return (
        <StatusMessage label="Link not recognised" title="We couldn’t find that link." link={{ href: "/guide", label: "Request the guide again" }}>
          <p>
            The link may be incomplete or already replaced by a newer one. Please use the most recent
            email we sent, or request the guide again to receive a fresh link.
          </p>
        </StatusMessage>
      );
    case "error":
      return (
        <StatusMessage label="Please try again" title="Something went wrong." link={{ href: "/", label: "Return home" }}>
          <p>We couldn’t check your link just now. Please try again in a few minutes.</p>
        </StatusMessage>
      );
  }
}
