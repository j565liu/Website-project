import { ApplyLink } from "@/components/ApplyLink";
import { site } from "@/content/site";

export default function HomePage() {
  return (
    <section className="mx-auto flex min-h-dvh max-w-7xl flex-col justify-center gap-10 px-6 md:px-10">
      <p className="label text-muted">{site.city}</p>
      <h1 className="font-display text-5xl font-light md:text-7xl">{site.name}</h1>
      <div>
        <ApplyLink />
      </div>
    </section>
  );
}
