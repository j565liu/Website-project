"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { primaryNav, site } from "@/content/site";

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!open) return;
    firstLinkRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <div className="md:hidden">
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        className="label relative z-50 py-2 text-ivory"
      >
        {open ? "Close" : "Menu"}
      </button>
      <div
        id={panelId}
        hidden={!open}
        className="fixed inset-0 z-40 bg-background px-6 pt-32"
      >
        <nav aria-label="Menu">
          <ul className="space-y-8">
            {primaryNav.map((item, index) => (
              <li key={item.href}>
                <Link
                  ref={index === 0 ? firstLinkRef : undefined}
                  href={item.href}
                  onClick={close}
                  className="font-display text-4xl font-light text-ivory"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="border-t border-charcoal pt-8">
              <Link
                href="/register"
                onClick={close}
                className="label inline-block border border-gold px-8 py-4 text-ivory"
              >
                {site.ctaLabel}
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
