import Link from "next/link";

type Props = {
  label: string;
  title: string;
  children: React.ReactNode;
  link?: { href: string; label: string };
};

export function StatusMessage({ label, title, children, link }: Props) {
  return (
    <section className="mx-auto flex min-h-[80svh] max-w-7xl flex-col justify-center px-6 pb-24 pt-40 md:px-10">
      <div className="max-w-2xl">
        <p className="label text-muted">{label}</p>
        <h1 className="mt-6 font-display text-5xl font-light leading-[1.05] text-ivory md:text-6xl">{title}</h1>
        <div className="mt-8 space-y-4 text-lg leading-relaxed text-muted">{children}</div>
        <div className="mt-12 h-px w-16 bg-gold" />
        {link && (
          <Link
            href={link.href}
            className="label mt-12 inline-block text-ivory underline decoration-gold underline-offset-8 transition-colors duration-500 hover:text-gold"
          >
            {link.label}
          </Link>
        )}
      </div>
    </section>
  );
}
