import { LoadingRegion, Skeleton } from "@/components/ui/skeleton";

/** Lesson Flow keeps its three-pane frame while the module loads. */
export default function Loading() {
  return (
    <LoadingRegion label="Loading lesson flow" className="flex h-full">
      {/* Blocks */}
      <div className="hidden w-80 shrink-0 flex-col border-r border-line bg-canvas md:flex">
        <div className="border-b border-line px-5 py-4">
          <Skeleton className="h-5 w-36" />
        </div>
        <div className="space-y-3 p-4">
          {[0, 1, 2, 3].map((index) => (
            <Skeleton key={index} className="h-28 rounded-card" />
          ))}
        </div>
      </div>

      {/* Live student preview */}
      <div className="flex min-w-0 flex-1 flex-col bg-paper">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <Skeleton className="h-3 w-40" />
          <Skeleton className="h-9 w-20 rounded-field" />
        </div>
        <div className="flex-1 px-4 py-8">
          <div className="mx-auto max-w-lg">
            <Skeleton className="mx-auto h-10 w-72 max-w-full rounded-card" />
            <Skeleton className="mx-auto mt-5 h-6 w-56 max-w-full" />
            <div className="mt-8 space-y-5">
              {[0, 1, 2].map((index) => (
                <Skeleton key={index} className="h-32 rounded-card" />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Block settings */}
      <div className="hidden w-80 shrink-0 flex-col border-l border-line bg-paper xl:flex">
        <div className="border-b border-line px-5 py-4">
          <Skeleton className="h-5 w-32" />
        </div>
        <div className="space-y-6 p-5">
          {[0, 1, 2].map((index) => (
            <div key={index}>
              <Skeleton className="h-3 w-24" />
              <Skeleton className="mt-2 h-12" />
            </div>
          ))}
        </div>
      </div>
    </LoadingRegion>
  );
}
