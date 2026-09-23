export const site = {
  name: "Ready to Mingle",
  city: "Toronto",
  description:
    "Private gatherings for Toronto professionals. Small rooms, good company, and evenings worth leaving the house for.",
  ctaLabel: "Register Your Interest",
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
