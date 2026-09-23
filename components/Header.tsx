import Link from "next/link";
import { primaryNav, site } from "@/content/site";
import { ApplyLink } from "./ApplyLink";
import { MobileMenu } from "./MobileMenu";

export function Header() {
  return (
    <header className="absolute inset-x-0 top-0 z-30">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-6 md:px-10 md:py-8">
        <Link
          href="/"
          className="relative z-50 font-display text-2xl tracking-wide text-ivory md:text-[1.75rem]"
        >
          {site.name}
        </Link>
        <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
          <ul className="flex items-center gap-8">
            {primaryNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="label text-muted transition-colors duration-500 hover:text-ivory"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <ApplyLink size="sm" />
        </nav>
        <MobileMenu />
      </div>
    </header>
  );
}
