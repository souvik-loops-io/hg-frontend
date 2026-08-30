import type { Metadata } from "next";
import Link from "next/link";
import { Illustration } from "@/components/deck/illustrations";
import { SchoolMark } from "@/components/deck/school-mark";
import { decks } from "@/lib/data/decks";

export const metadata: Metadata = { title: "Sample Presentations" };

export default function PresentGalleryPage() {
  return (
    <div className="px-6 py-10 sm:px-10 lg:px-16">
      <header className="mx-auto max-w-7xl border-b border-deck-line pb-8">
        <SchoolMark />
      </header>

      <div className="mx-auto max-w-7xl">
        <p className="deck-label mt-10 text-deck-muted">Sample presentations</p>

        <ul className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {decks.map((deck) => (
            <li key={deck.id}>
              <Link
                href={`/present/${deck.id}`}
                className="group flex h-full flex-col rounded-2xl bg-deck-card p-6 shadow-[0_1px_2px_rgba(23,22,26,0.04),0_12px_32px_rgba(23,22,26,0.05)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_2px_6px_rgba(23,22,26,0.06),0_24px_48px_rgba(23,22,26,0.1)]"
              >
                <Illustration
                  name={deck.illustration}
                  className="mx-auto h-56 w-full"
                />
                <p className="deck-label-sm mt-8 text-deck-muted">
                  {deck.subject} · Grade: {deck.grade}
                </p>
                <h2 className="mt-3 text-2xl font-bold leading-tight tracking-[-0.03em] text-deck-ink text-balance transition-colors group-hover:text-deck-accent">
                  {deck.title}
                </h2>
              </Link>
            </li>
          ))}
        </ul>

        <p className="deck-label-sm mt-12 border-t border-deck-line pt-8 text-deck-muted">
          <Link href="/curriculum/flow" className="hover:text-deck-accent">
            ← Back to the planner
          </Link>
        </p>
      </div>
    </div>
  );
}
