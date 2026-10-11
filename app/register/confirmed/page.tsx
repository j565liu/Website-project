import type { Metadata } from "next";
import { StatusMessage } from "@/components/StatusMessage";

export const metadata: Metadata = {
  title: "You're registered",
  robots: { index: false, follow: false },
};

export default function ConfirmedPage() {
  return (
    <StatusMessage label="Confirmed" title="You’re registered." link={{ href: "/events", label: "See forthcoming gatherings" }}>
      <p>
        Thank you for confirming your email. Locations for our gatherings are shared with
        registered guests only.
      </p>
    </StatusMessage>
  );
}
