type Props = {
  label: string;
  title: string;
  id?: string;
};

export function SectionHeading({ label, title, id }: Props) {
  return (
    <div>
      <p className="label text-muted">{label}</p>
      <h2
        id={id}
        className="mt-5 font-display text-4xl font-light leading-tight text-ivory md:text-5xl"
      >
        {title}
      </h2>
    </div>
  );
}
