import type { GatheringFormat } from "@/content/examples";
import { ExampleCard } from "./ExampleCard";
import { Reveal } from "./Reveal";

export function ExampleList({ formats }: { formats: readonly GatheringFormat[] }) {
  return (
    <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {formats.map((format, index) => (
        <li key={format.id}>
          <Reveal className="h-full" delay={(index % 3) * 0.12}>
            <ExampleCard format={format} />
          </Reveal>
        </li>
      ))}
    </ul>
  );
}
