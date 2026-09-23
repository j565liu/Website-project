export const site = {
  name: "Ready to Mingle",
  city: "Toronto",
  description:
    "A private, membership-by-application club for Toronto professionals. Considered gatherings, a carefully curated membership.",
  applyLabel: "Apply for Membership",
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
