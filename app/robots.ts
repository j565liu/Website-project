import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/register/check-email", "/register/confirm", "/register/confirmed"],
    },
    sitemap: new URL("/sitemap.xml", siteUrl()).toString(),
  };
}
