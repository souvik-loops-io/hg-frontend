"use client";

import { useRef, useState } from "react";
import { CloseIcon, UploadFileIcon } from "@/components/icons";
import { useMaterials } from "@/components/planner/materials-context";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

/**
 * Drop target for the teaching material a lesson is grounded in.
 *
 * Files land in the shared `MaterialsProvider` as real `File` objects; the
 * foundation form ingests them (`/ingest`) at submit, then generates. The
 * engine accepts `.txt`, `.md` and `.pdf`.
 */
export function MaterialDropzone() {
  const { materials, addFiles, removeFile } = useMaterials();
  const [isOver, setIsOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function accept(list: FileList | null) {
    if (list?.length) addFiles(list);
  }

  return (
    <section
      onDragOver={(event) => {
        event.preventDefault();
        setIsOver(true);
      }}
      onDragLeave={() => setIsOver(false)}
      onDrop={(event) => {
        event.preventDefault();
        setIsOver(false);
        accept(event.dataTransfer.files);
      }}
      className={cn(
        "rounded-panel border-2 border-dashed px-6 py-12 text-center transition-colors duration-150",
        isOver
          ? "border-sky-400 bg-sky-50"
          : "border-sky-200 bg-paper/50 hover:border-sky-300",
      )}
    >
      <span
        aria-hidden="true"
        className="mx-auto flex size-16 items-center justify-center rounded-full bg-sky-300 text-brand-700"
      >
        <UploadFileIcon className="size-7" />
      </span>

      <h2 className="mt-6 text-xl font-bold tracking-[-0.02em]">
        Add materials (optional)
      </h2>
      <p className="mx-auto mt-2 max-w-sm text-[0.9375rem] leading-relaxed text-ink-soft">
        Add a worksheet, chapter or past plan for extra context, or continue
        without one. <span className="font-medium text-ink">.txt, .md or .pdf</span>.
      </p>

      <input
        ref={inputRef}
        type="file"
        multiple
        accept=".txt,.md,.pdf"
        className="sr-only"
        aria-label="Choose materials to upload"
        onChange={(event) => accept(event.target.files)}
      />
      <Button
        variant="outline"
        className="mt-6"
        onClick={() => inputRef.current?.click()}
      >
        Browse Files
      </Button>

      {materials.length > 0 ? (
        <ul className="mx-auto mt-6 flex max-w-md flex-wrap justify-center gap-2">
          {materials.map((material) => (
            <li
              key={material.name}
              className="flex items-center gap-1.5 rounded-field bg-surface px-3 py-1.5 text-[0.8125rem] text-ink-soft"
            >
              <span className="max-w-[14rem] truncate">{material.name}</span>
              <button
                type="button"
                aria-label={`Remove ${material.name}`}
                onClick={() => removeFile(material.name)}
                className="text-ink-muted transition-colors hover:text-danger-500"
              >
                <CloseIcon className="size-3.5" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
