import type { Metadata } from "next";
import { site } from "@/content/site";

const shareImage = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: `${site.name}: private gatherings for Toronto professionals`,
};

const sharedOpenGraph = {
  type: "website",
  locale: "en_CA",
  siteName: site.name,
} as const;

export const rootMetadata = {
  title: `${site.name} · Private gatherings in ${site.city}`,
  description: site.description,
};

// Next replaces (rather than merges) `openGraph` per page, so every page builds the full object here.
export function pageMetadata({
  title,
  description,
  path,
}: {
  title?: string;
  description: string;
  path: string;
}): Metadata {
  const fullTitle = title ? `${title} · ${site.name}` : rootMetadata.title;
  return {
    ...(title ? { title } : {}),
    description,
    alternates: { canonical: path },
    openGraph: { ...sharedOpenGraph, title: fullTitle, description, url: path, images: [shareImage] },
    twitter: { card: "summary_large_image", title: fullTitle, description, images: [shareImage] },
  };
}
