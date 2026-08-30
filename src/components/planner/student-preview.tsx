"use client";

import { PencilIcon, PizzaIcon, RulerIcon, SparkleIcon } from "@/components/icons";
import { cn } from "@/lib/cn";
import type { LessonBlock, LessonModule } from "@/lib/types";

export type Viewport = "desktop" | "mobile";

/** The mark shown beside a block title in the student view. */
function BlockMark({ block }: { block: LessonBlock }) {
  const isInteractive = block.kind === "interactive";
  const Icon = isInteractive ? RulerIcon : PizzaIcon;

  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex size-11 shrink-0 items-center justify-center rounded-full",
        isInteractive ? "bg-sky-300 text-brand-700" : "bg-leaf-100 text-leaf-600",
      )}
    >
      <Icon className="size-5" />
    </span>
  );
}

function PreviewBlock({
  block,
  isActive,
  onEdit,
}: {
  block: LessonBlock;
  isActive: boolean;
  onEdit: () => void;
}) {
  const representation = block.representation;

  return (
    <article
      className={cn(
        "relative rounded-card border-2 bg-paper p-5",
        isActive ? "border-brand-600" : "border-leaf-100",
      )}
    >
      {isActive ? (
        <span className="absolute -top-3.5 right-4 inline-flex items-center gap-1.5 rounded-field bg-sun-400 px-3 py-1.5 text-[0.6875rem] font-bold uppercase tracking-[0.08em] text-sun-600">
          <PencilIcon className="size-3" />
          Editing
        </span>
      ) : null}

      <div className="flex items-start gap-4">
        <BlockMark block={block} />
        <div className="min-w-0">
          <h3
            className={cn(
              "text-xl font-bold tracking-[-0.02em]",
              isActive ? "text-brand-600" : "text-ink",
            )}
          >
            {block.title}
          </h3>
          <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-soft">
            {block.instruction}
          </p>
        </div>
      </div>

      {representation ? (
        <div className="mt-5 rounded-block bg-canvas p-5 text-center">
          {representation.status === "updating" ? (
            <>
              <span className="mx-auto flex size-12 items-center justify-center rounded-full border-2 border-sky-300 text-brand-600 animate-breathe">
                <SparkleIcon className="size-5" />
              </span>
              <p className="mt-3 font-semibold text-brand-600 animate-breathe">
                {representation.statusLabel ?? representation.name}
              </p>
            </>
          ) : (
            <p className="font-semibold text-ink-soft">{representation.name}</p>
          )}

          <button
            type="button"
            onClick={onEdit}
            className="mt-4 inline-flex rounded-field bg-sky-300 px-4 py-2 text-[0.8125rem] font-semibold text-brand-700 transition-colors hover:bg-sky-400"
          >
            Open in editor
          </button>
        </div>
      ) : null}
    </article>
  );
}

interface StudentPreviewBodyProps {
  module: LessonModule;
  /** Live block list — owned by the workspace, not the module fixture. */
  blocks: LessonBlock[];
  activeBlockId: string;
  viewport: Viewport;
  onEditBlock: (id: string) => void;
}

/** What the class actually sees, at the size they see it. */
export function StudentPreviewBody({
  module,
  blocks,
  activeBlockId,
  viewport,
  onEditBlock,
}: StudentPreviewBodyProps) {
  const words = module.headline.split(" ");

  return (
    <div className="scroll-slim h-full overflow-y-auto bg-gradient-to-b from-paper to-canvas px-4 py-8">
      <div
        className={cn(
          "mx-auto transition-[max-width] duration-200",
          viewport === "desktop" ? "max-w-lg" : "max-w-[22rem]",
        )}
      >
        <div className="text-center">
          <h3 className="text-3xl font-bold leading-tight tracking-[-0.03em] text-balance sm:text-4xl">
            {words.slice(0, -1).join(" ")}{" "}
            <span className="relative inline-block text-brand-600">
              {words.at(-1)}
              <span
                aria-hidden="true"
                className="absolute -bottom-1 left-0 h-1.5 w-full rounded-field bg-sun-400"
              />
            </span>
          </h3>
          <p className="mt-5 text-xl leading-snug text-ink-soft text-balance">
            {module.subheadline}
          </p>
        </div>

        <div className="mt-8 space-y-5">
          {blocks.map((block) => (
            <PreviewBlock
              key={block.id}
              block={block}
              isActive={block.id === activeBlockId}
              onEdit={() => onEditBlock(block.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
