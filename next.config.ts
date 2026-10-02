import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Pages renamed when the site became an explainer rather than a club site.
  // Query strings carry over, so confirmation links in older emails keep working.
  async redirects() {
    return [
      { source: "/the-club", destination: "/what-it-is", permanent: true },
      { source: "/events", destination: "/examples", permanent: true },
      { source: "/register", destination: "/guide", permanent: true },
      { source: "/register/check-email", destination: "/guide/check-email", permanent: true },
      { source: "/register/confirm", destination: "/guide/confirm", permanent: true },
      { source: "/register/confirmed", destination: "/guide/read", permanent: true },
    ];
  },
};

export default nextConfig;
