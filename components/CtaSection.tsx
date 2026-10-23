import { site } from "@/content/site";
import { RegisterLink } from "./RegisterLink";
import { Reveal } from "./Reveal";

type Props = {
  title: string;
  body: string;
  // On pages only invited guests can see, link straight to registration instead.
  forInvitedGuests?: boolean;
};

export function CtaSection({ title, body, forInvitedGuests = false }: Props) {
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
        {forInvitedGuests ? (
          <RegisterLink className="mt-12" label={site.registerLabel} />
        ) : (
          <RegisterLink className="mt-12" withNote />
        )}
      </Reveal>
    </section>
  );
}
