import { ButtonLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main
      id="main"
      className="flex min-h-dvh flex-col items-center justify-center px-6 text-center"
    >
      <p className="label-caps">404</p>
      <h1 className="mt-4 text-3xl font-bold tracking-[-0.03em] sm:text-4xl">
        We couldn&apos;t find that page.
      </h1>
      <p className="mt-3 max-w-md text-base text-ink-soft">
        That module or block doesn&apos;t exist in your workspace.
      </p>
      <ButtonLink href="/" variant="brand" size="lg" className="mt-8">
        Back to dashboard
      </ButtonLink>
    </main>
  );
}
