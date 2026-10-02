export const site = {
  name: "Ready to Mingle",
  // Used as the example city in copy, not as the location of a venue.
  city: "Toronto",
  description:
    "What small, hosted gatherings are, what a typical evening involves, why people enjoy them, and how to find or start one of your own.",
  ctaLabel: "Start Your Own",
  // Placeholder: replace with the real inbox before launch (shown on FAQ and Privacy pages).
  contactEmail: "hello@example.com",
} as const;

export const primaryNav = [
  { href: "/what-it-is", label: "What It Is" },
  { href: "/examples", label: "Examples" },
] as const;

export const footerNav = [
  { href: "/what-it-is", label: "What It Is" },
  { href: "/examples", label: "Examples" },
  { href: "/faq", label: "FAQ" },
  { href: "/privacy", label: "Privacy" },
] as const;
