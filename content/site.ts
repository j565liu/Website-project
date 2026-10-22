export const site = {
  name: "Ready to Mingle",
  city: "Toronto",
  description:
    "Private, invitation-only gatherings for Toronto professionals. Small rooms, good company, and evenings worth leaving the house for.",
  // The site-wide button. It leads to /register, which asks for the code first if needed.
  ctaLabel: "Have an Invitation?",
  // Shown under the large buttons so visitors without a code know what to do.
  noInvitationNote: "No invitation yet? Ask a guest who has attended.",
  // The registration form's own submit button, once the guest is past the code.
  registerLabel: "Register Your Interest",
  // Placeholder: replace with the real inbox before launch (shown on FAQ and Privacy pages).
  contactEmail: "hello@example.com",
} as const;

export const primaryNav = [
  { href: "/the-club", label: "The Club" },
  { href: "/events", label: "Events" },
] as const;

export const footerNav = [
  { href: "/the-club", label: "The Club" },
  { href: "/events", label: "Events" },
  { href: "/faq", label: "FAQ" },
  { href: "/privacy", label: "Privacy" },
] as const;
