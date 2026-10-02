import Link from "next/link";
import { footerNav, site } from "@/content/site";
import { GuideLink } from "./GuideLink";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-charcoal">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-[1fr_auto] md:items-end md:px-10">
        <div className="space-y-6">
          <p className="font-display text-3xl text-ivory">{site.name}</p>
          <p className="max-w-sm text-sm leading-relaxed text-muted">
            A look at small, hosted gatherings: what they involve, why people enjoy them, and how to find or start one.
          </p>
          <GuideLink size="sm" />
        </div>
        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-8 gap-y-1">
            {footerNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="label inline-block py-3 text-muted transition-colors duration-500 hover:text-ivory"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="border-t border-charcoal">
        <p className="label mx-auto max-w-7xl px-6 py-6 text-muted md:px-10">
          &copy; {year} {site.name}.
        </p>
      </div>
    </footer>
  );
}
