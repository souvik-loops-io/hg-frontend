import Link from "next/link";
import { ArrowRightIcon } from "@/components/icons";

/**
 * A shortcut to the pre-built demo lesson ("The Great Pizza Share"), shown on
 * the dashboard next to "Create New Artifact". Opens the student preview so a
 * teacher can see a complete, ready-made lesson without building one.
 */
export function SampleLessonCard() {
  return (
    <Link
      href="/preview"
      className="group flex items-center justify-between gap-4 rounded-panel border border-sky-200 bg-paper p-5 shadow-card transition-colors duration-150 hover:border-sky-300 hover:bg-sky-50/60"
    >
      <span>
        <span className="block text-base font-bold tracking-[-0.02em] text-brand-600">
          View sample lesson
        </span>
        <span className="mt-1 block text-[0.8125rem] leading-relaxed text-ink-soft">
          See a ready-made lesson — no building required.
        </span>
      </span>
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-sky-50 text-brand-600 transition-colors duration-150 group-hover:bg-sky-200">
        <ArrowRightIcon className="size-4" />
      </span>
    </Link>
  );
}
