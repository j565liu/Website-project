import type { GatheringFormat } from "@/content/examples";

export function ExampleCard({ format }: { format: GatheringFormat }) {
  return (
    <article className="flex h-full flex-col border border-charcoal bg-surface p-8 transition-colors duration-700 ease-luxe hover:border-gold/60 md:p-10">
      <p className="label text-muted">{format.kind}</p>
      <h3 className="mt-6 font-display text-3xl font-medium leading-tight text-ivory">
        {format.title}
      </h3>
      <p className="mt-6 leading-relaxed text-muted">{format.summary}</p>
      <div className="mt-auto pt-10">
        <div className="h-px w-10 bg-gold/70" />
        <p className="mt-6 text-ivory">Variations</p>
        <p className="mt-2 leading-relaxed text-muted">{format.variations}</p>
      </div>
    </article>
  );
}
