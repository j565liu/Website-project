"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import { site } from "@/content/site";
import { ApplyLink } from "./ApplyLink";

const POSTER = "/images/hero-fallback.jpg";
const ease = [0.22, 1, 0.36, 1] as const;

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
        <motion.p
          className="label text-muted"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease, delay: 0.1 }}
        >
          {site.city} · Membership by application
        </motion.p>
        <motion.h1
          className="mt-6 font-display text-6xl font-light leading-[0.95] tracking-tight text-ivory sm:text-7xl md:text-8xl lg:text-9xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease, delay: 0.25 }}
        >
          {site.name}
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease, delay: 0.5 }}
        >
          <p className="mt-8 max-w-md font-display text-xl italic leading-snug text-ivory/85 md:text-2xl">
            {tagline}
          </p>
          <div className="mt-12 h-px w-16 bg-gold" />
          <ApplyLink className="mt-12" />
        </motion.div>
      </div>
    </section>
  );
}
