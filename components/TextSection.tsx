import { Reveal } from "./Reveal";

type Props = {
  id: string;
  label: string;
  title: string;
  children: React.ReactNode;
};

export function TextSection({ id, label, title, children }: Props) {
  return (
    <section aria-labelledby={id} className="border-t border-charcoal">
      <Reveal className="mx-auto grid max-w-7xl gap-10 px-6 py-24 lg:grid-cols-[1fr_1.4fr] lg:gap-24 md:px-10 md:py-32">
        <div>
          <p className="label text-muted">{label}</p>
          <h2
            id={id}
            className="mt-5 font-display text-3xl font-light leading-tight text-ivory md:text-4xl"
          >
            {title}
          </h2>
        </div>
        <div className="space-y-6 text-lg leading-relaxed text-muted">{children}</div>
      </Reveal>
    </section>
  );
}
