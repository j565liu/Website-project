"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { site } from "@/content/site";
import { GuideLink } from "./GuideLink";

const POSTER = "/images/hero-fallback.jpg";

type VideoSource = { src: string; type: string };

const DESKTOP_SOURCES: VideoSource[] = [
  { src: "/videos/hero.webm", type: "video/webm" },
  { src: "/videos/hero.mp4", type: "video/mp4" },
];

// Smaller 720p files first on phones and tablets; the full-size files are a fallback if they're missing.
const MOBILE_SOURCES: VideoSource[] = [
  { src: "/videos/hero-mobile.webm", type: "video/webm" },
  { src: "/videos/hero-mobile.mp4", type: "video/mp4" },
  ...DESKTOP_SOURCES,
];

// Decides which video to play only after the page has finished loading, so the video never
// competes with the first paint. Returns null for reduced motion or data-saver visitors.
function useHeroVideoSources(): VideoSource[] | null {
  const [sources, setSources] = useState<VideoSource[] | null>(null);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    let idleId: number | undefined;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const start = () => {
      if (reducedMotion.matches || connection?.saveData) return;
      const smallScreen = window.matchMedia("(max-width: 1023px)").matches;
      setSources(smallScreen ? MOBILE_SOURCES : DESKTOP_SOURCES);
    };
    const schedule = () => {
      if ("requestIdleCallback" in window) idleId = window.requestIdleCallback(start, { timeout: 2000 });
      else timeoutId = setTimeout(start, 500);
    };
    const onMotionChange = () => {
      if (reducedMotion.matches) setSources(null);
    };

    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });
    reducedMotion.addEventListener("change", onMotionChange);

    return () => {
      window.removeEventListener("load", schedule);
      if (idleId !== undefined) window.cancelIdleCallback(idleId);
      if (timeoutId !== undefined) clearTimeout(timeoutId);
      reducedMotion.removeEventListener("change", onMotionChange);
    };
  }, []);

  return sources;
}

export function Hero({ tagline }: { tagline: string }) {
  const sources = useHeroVideoSources();
  const [videoFailed, setVideoFailed] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [posterFailed, setPosterFailed] = useState(false);

  // The still image is always painted first; the video fades in over it once it plays.
  const showVideo = sources !== null && !videoFailed;

  return (
    <section className="relative flex min-h-svh items-end overflow-hidden bg-surface">
      <div aria-hidden="true" className="absolute inset-0">
        {!posterFailed && (
          <Image
            src={POSTER}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
            onError={() => setPosterFailed(true)}
          />
        )}
        {showVideo && (
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster={posterFailed ? undefined : POSTER}
            onPlaying={() => setVideoPlaying(true)}
            // React bubbles <source> errors up to here; only react to errors from the video itself.
            onError={(event) => {
              if (event.target === event.currentTarget) setVideoFailed(true);
            }}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1200ms] ease-out ${
              videoPlaying ? "opacity-100" : "opacity-0"
            }`}
          >
            {sources.map((source, index) => (
              <source
                key={source.src}
                src={source.src}
                type={source.type}
                // An error on the last <source> means no file could be loaded.
                onError={index === sources.length - 1 ? () => setVideoFailed(true) : undefined}
              />
            ))}
          </video>
        )}
        <div className="absolute inset-0 bg-linear-to-t from-background via-background/70 to-background/40" />
        {/* Keeps the header readable over bright footage. */}
        <div className="absolute inset-x-0 top-0 h-48 bg-linear-to-b from-background/85 to-transparent" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-6 pb-20 pt-40 md:px-10 md:pb-28">
        <p className="label rise-in text-muted" style={{ animationDelay: "0.1s" }}>
          Small gatherings, explained
        </p>
        <h1
          className="rise-in mt-6 font-display text-6xl font-light leading-[0.95] tracking-tight text-ivory sm:text-7xl md:text-8xl lg:text-9xl"
          style={{ animationDelay: "0.15s" }}
        >
          {site.name}
        </h1>
        <div className="rise-in" style={{ animationDelay: "0.45s" }}>
          <p className="mt-8 max-w-md font-display text-xl italic leading-snug text-ivory/85 md:text-2xl">
            {tagline}
          </p>
          <div className="mt-12 h-px w-16 bg-gold" />
          <GuideLink className="mt-12" />
        </div>
      </div>
    </section>
  );
}
