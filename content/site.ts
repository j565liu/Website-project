export const site = {
  name: "Ready to Mingle",
  city: "Toronto",
  description:
    "Private, invitation-only gatherings for Toronto professionals, held somewhere different each time. Good company, and evenings worth leaving the house for.",
  // The site-wide button. It leads to /register, which asks for the code first if needed.
  ctaLabel: "Have an Invitation?",
  // Shown under the large buttons so visitors without a code know what to do.
  noInvitationNote: "No invitation yet? Ask a guest who has attended.",
  // The registration form's own submit button, once the guest is past the code.
  registerLabel: "Register Your Interest",
  // Placeholder: replace with the real inbox before launch (shown on FAQ and Privacy pages).
  contactEmail: "hello@example.com",
} as const;

// Pages where the site-wide "Have an Invitation?" button is hidden: the visitor is already
// entering their code, registering, or (on /events) has the code.
export function showsInvitationButton(pathname: string): boolean {
  return !["/invitation", "/register", "/events"].some((path) => pathname === path || pathname.startsWith(`${path}/`));
}

export const primaryNav = [
  { href: "/about", label: "About" },
  { href: "/events", label: "Events" },
] as const;

export const footerNav = [
  { href: "/about", label: "About" },
  { href: "/events", label: "Events" },
  { href: "/faq", label: "FAQ" },
  { href: "/privacy", label: "Privacy" },
] as const;
