import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { PageHeader } from "@/components/PageHeader";
import { RegistrationForm } from "@/components/RegistrationForm";

export const metadata: Metadata = pageMetadata({
  title: "Register Your Interest",
  description: "Register your interest in Ready to Mingle, private gatherings for Toronto professionals.",
  path: "/register",
});

export default function RegisterPage() {
  return (
    <>
      <PageHeader
        label="Register"
        title="Register your interest"
        intro="It takes about a minute. We will email you a link to confirm your address, and once you confirm, you are registered."
      />
      <section aria-label="Registration form" className="mx-auto max-w-7xl px-6 pb-32 md:px-10 md:pb-44">
        <div className="relative max-w-2xl">
          <RegistrationForm />
        </div>
      </section>
    </>
  );
}
