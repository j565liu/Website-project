import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Old URLs: the short-lived explainer version of the site, and /the-club (renamed to /about
  // so the site doesn't read as a club with a venue). Query strings carry over, so confirmation
  // links in emails sent from the explainer version still work.
  async redirects() {
    return [
      { source: "/what-it-is", destination: "/about", permanent: true },
      { source: "/the-club", destination: "/about", permanent: true },
      { source: "/examples", destination: "/events", permanent: true },
      { source: "/guide", destination: "/register", permanent: true },
      { source: "/guide/check-email", destination: "/register/check-email", permanent: true },
      { source: "/guide/confirm", destination: "/register/confirm", permanent: true },
      { source: "/guide/read", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
