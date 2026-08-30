interface PageHeaderProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
}

export function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <header className="mb-8">
      <h1 className="text-3xl font-bold tracking-[-0.03em] text-balance sm:text-4xl lg:text-5xl">
        {title}
      </h1>
      {subtitle ? (
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-ink-soft">
          {subtitle}
        </p>
      ) : null}
    </header>
  );
}
