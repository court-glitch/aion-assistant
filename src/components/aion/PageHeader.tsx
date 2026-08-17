export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <header className="mb-6">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-violet">{eyebrow}</p>
      <h1 className="mt-2 font-sans text-3xl font-bold text-foreground sm:text-4xl">{title}</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{description}</p>
    </header>
  );
}
