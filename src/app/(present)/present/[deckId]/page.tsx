import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DeckSectionView } from "@/components/deck/deck-sections";
import { DeckShell } from "@/components/deck/deck-shell";
import { decks, getDeck } from "@/lib/data/decks";

interface PageProps {
  params: Promise<{ deckId: string }>;
}

/** Decks are fixtures today, so every one can be prerendered. */
export function generateStaticParams() {
  return decks.map((deck) => ({ deckId: deck.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { deckId } = await params;
  const deck = getDeck(deckId);
  return { title: deck?.title ?? "Presentation" };
}

export default async function DeckPage({ params }: PageProps) {
  const { deckId } = await params;
  const deck = getDeck(deckId);

  if (!deck) notFound();

  return (
    <DeckShell sections={deck.sections} exitHref="/present" exitLabel="All decks">
      {deck.sections.map((section, index) => (
        <DeckSectionView key={section.id} section={section} index={index} />
      ))}
    </DeckShell>
  );
}
