import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { PageHeader } from "@/components/PageHeader";
import { site } from "@/content/site";

export const metadata: Metadata = pageMetadata({
  title: "Privacy Policy",
  description: "How Ready to Mingle collects, uses and protects your personal information.",
  path: "/privacy",
});

const sections: { id: string; title: string; body: React.ReactNode }[] = [
  {
    id: "who-we-are",
    title: "Who we are",
    body: (
      <p>
        {site.name} (&ldquo;we&rdquo;, &ldquo;us&rdquo;) is a private events club in Toronto,
        Ontario. We are responsible for the personal information described here and handle it in
        accordance with Canada&rsquo;s <em>Personal Information Protection and Electronic
        Documents Act</em> (PIPEDA). [Legal entity name and mailing address to be added.]
      </p>
    ),
  },
  {
    id: "what-we-collect",
    title: "What we collect",
    body: (
      <>
        <p>When you register, we collect only:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>your preferred name and email address;</li>
          <li>your industry;</li>
          <li>how you heard about us (optional);</li>
          <li>a short note on why you are interested; and</li>
          <li>the date and time you gave consent and confirmed your email.</li>
        </ul>
        <p>
          To protect the form from abuse, we briefly keep a scrambled (one-way hashed) version of
          the internet address your request came from. It cannot be turned back into your address
          and is deleted within 24 hours. We do not use advertising or analytics cookies.
        </p>
      </>
    ),
  },
  {
    id: "why",
    title: "Why we collect it",
    body: (
      <p>
        To confirm that your email address belongs to you, to register you as a guest, and to
        understand who our guests are so we can plan gatherings that suit them. We do not sell,
        rent or trade your information, and we do not use it for advertising.
      </p>
    ),
  },
  {
    id: "consent",
    title: "Consent",
    body: (
      <p>
        We ask for your consent when you register. You may withdraw it at any time by writing to
        us; we will then delete your registration.
      </p>
    ),
  },
  {
    id: "emails",
    title: "Emails we send",
    body: (
      <p>
        The website sends only transactional emails: a link to confirm your address, a note once
        you are registered, and, if you register again with an email we already have, a short
        reminder that you are already registered. We do not send newsletters from this website.
      </p>
    ),
  },
  {
    id: "storage",
    title: "Where it is stored",
    body: (
      <p>
        Your information is stored in a secured database operated by our hosting providers
        [provider names to be added], and our emails are delivered through an email service
        provider. These providers may store or process data outside Canada, including in the
        United States, where it may be accessible to authorities under local law. Access to
        registration data is limited to the people who run the club.
      </p>
    ),
  },
  {
    id: "retention",
    title: "How long we keep it",
    body: (
      <p>
        If you do not confirm your email, your registration is deleted automatically after seven
        days. Confirmed registrations are kept while the club is active, or until you ask us to
        delete them.
      </p>
    ),
  },
  {
    id: "your-rights",
    title: "Your rights",
    body: (
      <p>
        You may ask to see the information we hold about you, correct it, or have it deleted. If
        you have a concern we cannot resolve, you may contact the Office of the Privacy
        Commissioner of Canada.
      </p>
    ),
  },
  {
    id: "contact",
    title: "Contact",
    body: (
      <p>
        Questions and requests go to our privacy contact at{" "}
        <a
          href={`mailto:${site.contactEmail}`}
          className="text-ivory underline decoration-gold underline-offset-4"
        >
          {site.contactEmail}
        </a>
        . We will respond within 30 days.
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <>
      <PageHeader label="Privacy" title="Privacy policy" />
      <div className="mx-auto max-w-7xl px-6 pb-32 md:px-10 md:pb-44">
        <div className="max-w-3xl">
          <p role="note" className="border border-gold/60 bg-surface p-6 text-sm leading-relaxed text-ivory">
            <span className="label block text-gold">Draft</span>
            <span className="mt-3 block">
              This policy is a working draft and has not been reviewed by a lawyer. It must be
              reviewed by qualified legal counsel, and the bracketed details completed, before
              this website launches.
            </span>
          </p>
          <p className="label mt-12 text-muted">Last updated: [date of legal review]</p>
          <div className="mt-4">
            {sections.map((section) => (
              <section key={section.id} aria-labelledby={section.id} className="border-b border-charcoal py-12">
                <h2 id={section.id} className="font-display text-3xl font-light text-ivory">
                  {section.title}
                </h2>
                <div className="mt-6 space-y-4 leading-relaxed text-muted">{section.body}</div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
