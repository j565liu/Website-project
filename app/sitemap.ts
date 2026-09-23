import type { MetadataRoute } from "next";
import { publicRoutes } from "@/content/routes";
import { siteUrl } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  return publicRoutes.map((route) => ({
    url: new URL(route.path, siteUrl()).toString(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
