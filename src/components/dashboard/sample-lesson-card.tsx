import Link from "next/link";
import { ArrowRightIcon } from "@/components/icons";

/**
 * Shortcuts to the pre-built demo lessons, shown on the dashboard next to
 * "Create New Artifact". Each opens the student preview so a teacher can see a
 * complete, ready-made lesson without building one — no engine required.
 */

const SAMPLES = [
  { href: "/preview", title: "Tectonic Plates", meta: "Science · Grade 6" },
  { href: "/preview?sample=pizza", title: "The Pizza Problem", meta: "Math · Grade 4" },
];

export function SampleLessonCard() {
  return (
    <div className="rounded-panel border border-sky-200 bg-paper p-5 shadow-card">
      <p className="mb-3 text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-ink-muted">
        Sample lessons
      </p>
      <ul className="space-y-1.5">
        {SAMPLES.map((sample) => (
          <li key={sample.href}>
            <Link
              href={sample.href}
              className="group flex items-center justify-between gap-3 rounded-card px-3 py-2.5 transition-colors duration-150 hover:bg-sky-50"
            >
              <span>
                <span className="block text-[0.9375rem] font-bold tracking-[-0.01em] text-brand-600">
                  {sample.title}
                </span>
                <span className="mt-0.5 block text-[0.75rem] text-ink-soft">
                  {sample.meta} · ready-made
                </span>
              </span>
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-sky-50 text-brand-600 transition-colors duration-150 group-hover:bg-sky-200">
                <ArrowRightIcon className="size-4" />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
