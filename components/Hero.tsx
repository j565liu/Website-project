"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { site } from "@/content/site";
import { RegisterLink } from "./RegisterLink";

const POSTER = "/images/hero-fallback.jpg";

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState<boolean | null>(null);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return reduced;
}

export function Hero({ tagline }: { tagline: string }) {
  const reducedMotion = usePrefersReducedMotion();
  const [videoFailed, setVideoFailed] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [posterFailed, setPosterFailed] = useState(false);

  // The video is only mounted on the client once we know motion is allowed,
  // so the static image is always the first thing painted.
  const showVideo = reducedMotion === false && !videoFailed;

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
            onError={() => setVideoFailed(true)}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1200ms] ease-out ${
              videoPlaying ? "opacity-100" : "opacity-0"
            }`}
          >
            <source src="/videos/hero.webm" type="video/webm" />
            {/* Errors on the last <source> mean no format could be loaded. */}
            <source
              src="/videos/hero.mp4"
              type="video/mp4"
              onError={() => setVideoFailed(true)}
            />
          </video>
        )}
        <div className="absolute inset-0 bg-linear-to-t from-background via-background/70 to-background/30" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-6 pb-20 pt-40 md:px-10 md:pb-28">
        <p className="label rise-in text-muted" style={{ animationDelay: "0.1s" }}>
          {site.city} · Private gatherings
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
          <RegisterLink className="mt-12" />
        </div>
      </div>
    </section>
  );
}
