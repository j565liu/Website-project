// Background photo for each page except the home page (which has the video hero).
// Put photos in public/images/ and map them here. Routes not listed use `default`.
// A route also covers its sub-pages, e.g. "/register" applies to "/register/confirmed".
export const pageBackgrounds = {
  default: "/images/hero-fallback.jpg",
  // "/the-club": "/images/the-club.jpg",
  // "/events": "/images/events.jpg",
  // "/register": "/images/register.jpg",
  // "/faq": "/images/faq.jpg",
  // "/privacy": "/images/privacy.jpg",
} satisfies Record<string, string> & { default: string };

export function backgroundFor(pathname: string): string | null {
  if (pathname === "/") return null;
  const routes = Object.keys(pageBackgrounds).filter((route) => route !== "default") as (keyof typeof pageBackgrounds)[];
  const match = routes
    .filter((route) => pathname === route || pathname.startsWith(`${route}/`))
    .sort((a, b) => b.length - a.length)[0];
  return pageBackgrounds[match ?? "default"];
}
