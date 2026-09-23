type Props = {
  label: string;
  title: string;
  intro?: string;
};

export function PageHeader({ label, title, intro }: Props) {
  return (
    <header className="mx-auto max-w-7xl px-6 pb-20 pt-44 md:px-10 md:pb-28 md:pt-56">
      <p className="label text-muted">{label}</p>
      <h1 className="mt-6 max-w-4xl font-display text-5xl font-light leading-[1.05] text-ivory md:text-7xl">
        {title}
      </h1>
      {intro && (
        <p className="mt-10 max-w-2xl text-lg leading-relaxed text-muted">{intro}</p>
      )}
      <div className="mt-14 h-px w-16 bg-gold" />
    </header>
  );
}
