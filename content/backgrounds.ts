// Background photo for each page. Put photos in public/images/ and map them here.
// Routes not listed use `default`. A route also covers its sub-pages, e.g. "/guide"
// applies to "/guide/read". On the home page the photo sits below the video hero.
export const pageBackgrounds: Record<string, string> & { default: string } = {
  default: "/images/hero-fallback.jpg",
  "/": "/images/events.jpg",
  // "/what-it-is": "/images/what-it-is.jpg",
  "/examples": "/images/events.jpg",
  // "/guide": "/images/guide.jpg",
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
