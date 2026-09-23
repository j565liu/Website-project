import { RegisterLink } from "./RegisterLink";

type Props = {
  title: string;
  body: string;
};

export function CtaSection({ title, body }: Props) {
  return (
    <section aria-labelledby="closing-cta" className="border-t border-charcoal">
      <div className="mx-auto flex max-w-3xl flex-col items-center px-6 py-32 text-center md:py-44">
        <div className="h-px w-16 bg-gold" />
        <h2
          id="closing-cta"
          className="mt-12 font-display text-4xl font-light leading-tight text-ivory md:text-6xl"
        >
          {title}
        </h2>
        <p className="mt-8 max-w-xl leading-relaxed text-muted">{body}</p>
        <RegisterLink className="mt-12" />
      </div>
    </section>
  );
}
