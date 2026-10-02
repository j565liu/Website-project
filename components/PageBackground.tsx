"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { backgroundFor } from "@/content/backgrounds";

// A fixed, heavily darkened photo behind every page (below the video hero on home). The overlay
// keeps all text well above WCAG AA contrast even over the brightest parts of a photo.
export function PageBackground() {
  const pathname = usePathname();
  const src = backgroundFor(pathname);
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  if (failedSrc === src) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10">
      <Image
        key={src}
        src={src}
        alt=""
        fill
        sizes="100vw"
        quality={60}
        className="object-cover"
        onError={() => setFailedSrc(src)}
      />
      <div className="absolute inset-0 bg-background/85" />
      <div className="absolute inset-0 bg-linear-to-b from-background/60 via-transparent to-background/70" />
    </div>
  );
}
