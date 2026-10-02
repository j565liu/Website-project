import Link from "next/link";
import { GuideLink } from "./GuideLink";
import { Reveal } from "./Reveal";

type Props = {
  title: string;
  body: string;
  secondary?: { href: string; label: string };
};

export function CtaSection({ title, body, secondary }: Props) {
  return (
    <section aria-labelledby="closing-cta" className="border-t border-charcoal">
      <Reveal className="mx-auto flex max-w-3xl flex-col items-center px-6 py-32 text-center md:py-44">
        <div className="h-px w-16 bg-gold" />
        <h2
          id="closing-cta"
          className="mt-12 font-display text-4xl font-normal leading-tight text-ivory md:text-6xl"
        >
          {title}
        </h2>
        <p className="mt-8 max-w-xl leading-relaxed text-muted">{body}</p>
        <GuideLink className="mt-12" />
        {secondary && (
          <Link
            href={secondary.href}
            className="label mt-8 inline-block py-3 text-ivory underline decoration-gold underline-offset-8 transition-colors duration-500 hover:text-gold"
          >
            {secondary.label}
          </Link>
        )}
      </Reveal>
    </section>
  );
}
