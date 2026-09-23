import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[80svh] max-w-7xl flex-col justify-center px-6 pt-32 md:px-10">
      <p className="label text-muted">Not found</p>
      <h1 className="mt-6 font-display text-5xl font-light text-ivory md:text-7xl">
        This room is empty.
      </h1>
      <p className="mt-8 max-w-md text-lg leading-relaxed text-muted">
        The page you were looking for has moved or never existed.
      </p>
      <Link
        href="/"
        className="label mt-12 self-start text-ivory underline decoration-gold underline-offset-8 transition-colors duration-500 hover:text-gold"
      >
        Return home
      </Link>
    </section>
  );
}
