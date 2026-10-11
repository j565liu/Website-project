import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // URLs from the short-lived explainer version of the site. Query strings carry over,
  // so confirmation links in emails sent from that version still work.
  async redirects() {
    return [
      { source: "/what-it-is", destination: "/the-club", permanent: true },
      { source: "/examples", destination: "/events", permanent: true },
      { source: "/guide", destination: "/register", permanent: true },
      { source: "/guide/check-email", destination: "/register/check-email", permanent: true },
      { source: "/guide/confirm", destination: "/register/confirm", permanent: true },
      { source: "/guide/read", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
