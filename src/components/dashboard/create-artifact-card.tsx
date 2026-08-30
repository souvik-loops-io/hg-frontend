import Link from "next/link";
import { PlusIcon } from "@/components/icons";

export function CreateArtifactCard() {
  return (
    <Link
      href="/curriculum"
      className="group flex min-h-56 flex-col items-center justify-center rounded-panel border-2 border-dashed border-sky-200 bg-sky-50/40 p-8 text-center transition-colors duration-150 hover:border-sky-300 hover:bg-sky-50"
    >
      <span className="flex size-16 items-center justify-center rounded-full bg-paper text-brand-600 shadow-card transition-colors duration-150 group-hover:bg-sky-300 group-hover:text-brand-700">
        <PlusIcon className="size-7" />
      </span>
      <span className="mt-5 text-lg font-bold tracking-[-0.02em] text-brand-600">
        Create New Artifact
      </span>
      <span className="mt-2 max-w-[26ch] text-[0.875rem] leading-relaxed text-ink-soft">
        Design a new lesson, quiz, or interactive module.
      </span>
    </Link>
  );
}
