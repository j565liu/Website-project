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
  // Off while places are booked elsewhere (Eventbrite). Turning it back on restores the
  // "Reserve My Place" form on event pages; links already emailed keep working either way.
  reservationsOpen: false as boolean,
  // Off while invitations go out by email to registered guests only: /events and each event page
  // redirect home and drop out of the menus. The pages and content/events.ts are kept.
  eventsPublished: false as boolean,
} as const;

// Where "back" links on the registration and reservation pages lead.
export const afterRegistrationLink = site.eventsPublished
  ? { href: "/events", label: "See forthcoming gatherings" }
  : { href: "/", label: "Return home" };

// Pages where the site-wide "Have an Invitation?" button is hidden: the visitor is already
// entering their code, registering, or (on /events) has the code.
export function showsInvitationButton(pathname: string): boolean {
  return !["/invitation", "/register", "/events"].some((path) => pathname === path || pathname.startsWith(`${path}/`));
}

const eventsNav = site.eventsPublished ? [{ href: "/events", label: "Events" }] : [];

export const primaryNav = [{ href: "/about", label: "About" }, ...eventsNav];

export const footerNav = [
  { href: "/about", label: "About" },
  ...eventsNav,
  { href: "/faq", label: "FAQ" },
  { href: "/privacy", label: "Privacy" },
];
