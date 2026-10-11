import type { Metadata } from "next";
import { StatusMessage } from "@/components/StatusMessage";

export const metadata: Metadata = {
  title: "Check your inbox",
  robots: { index: false, follow: false },
};

export default function CheckEmailPage() {
  return (
    <StatusMessage label="Almost there" title="Check your inbox." link={{ href: "/", label: "Return home" }}>
      <p>
        We have sent an email to the address you entered. Open it and follow the link to finish
        registering. The link expires in 48 hours.
      </p>
      <p>
        Nothing there after a few minutes? Check your spam or promotions folder, or register again
        with the same email to receive a fresh link.
      </p>
    </StatusMessage>
  );
}
