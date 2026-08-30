"use client";

import { useRef, useState } from "react";
import { UploadFileIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

/**
 * Drop target for worksheets and reference images.
 *
 * Files are held in component state only — uploading them needs a real
 * endpoint (`NEXT_PUBLIC_API_URL`), so nothing leaves the browser yet.
 */
export function MaterialDropzone() {
  const [isOver, setIsOver] = useState(false);
  const [files, setFiles] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  function accept(list: FileList | null) {
    if (!list?.length) return;
    setFiles((current) => [
      ...current,
      ...Array.from(list).map((file) => file.name),
    ]);
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
        Drag and drop materials here
      </h2>
      <p className="mx-auto mt-2 max-w-sm text-[0.9375rem] leading-relaxed text-ink-soft">
        Upload worksheets, reference images, or previous lesson plans to inform
        your new module.
      </p>

      <input
        ref={inputRef}
        type="file"
        multiple
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

      {files.length > 0 ? (
        <ul className="mx-auto mt-6 flex max-w-md flex-wrap justify-center gap-2">
          {files.map((name) => (
            <li
              key={name}
              className="rounded-field bg-surface px-3 py-1.5 text-[0.8125rem] text-ink-soft"
            >
              {name}
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
