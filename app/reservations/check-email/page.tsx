import type { Metadata } from "next";
import { StatusMessage } from "@/components/StatusMessage";

export const metadata: Metadata = {
  title: "Check your inbox",
  robots: { index: false, follow: false },
};

export default function ReservationCheckEmailPage() {
  return (
    <StatusMessage label="Almost there" title="Check your inbox." link={{ href: "/events", label: "All gatherings" }}>
      <p>
        We have sent an email to the address you entered. Open it and press the button to confirm
        your place. The link expires in 48 hours.
      </p>
      <p>
        Nothing there after a few minutes? Check your spam or promotions folder, or make sure you
        used the address you registered with.
      </p>
    </StatusMessage>
  );
}
