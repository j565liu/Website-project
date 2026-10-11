// Background photo for each page. Put photos in public/images/ and map them here.
// Routes not listed use `default`. A route also covers its sub-pages, e.g. "/register"
// applies to "/register/confirmed". On the home page the photo sits below the video hero.
export const pageBackgrounds: Record<string, string> & { default: string } = {
  default: "/images/hero-fallback.jpg",
  "/": "/images/events.jpg",
  // "/the-club": "/images/the-club.jpg",
  "/events": "/images/events.jpg",
  // "/register": "/images/register.jpg",
  // "/faq": "/images/faq.jpg",
  // "/privacy": "/images/privacy.jpg",
};

export function backgroundFor(pathname: string): string {
  // "/" only matches the home page itself, never as a prefix of other routes.
  if (pathname === "/") return pageBackgrounds["/"] ?? pageBackgrounds.default;
  const match = Object.keys(pageBackgrounds)
    .filter((route) => route !== "default" && route !== "/")
    .filter((route) => pathname === route || pathname.startsWith(`${route}/`))
    .sort((a, b) => b.length - a.length)[0];
  return pageBackgrounds[match ?? "default"];
}
