import { Page } from "@/components/shell/app-shell";
import { LoadingRegion, Skeleton } from "@/components/ui/skeleton";

/** Setup & Planning: form card and dropzone on the left, tip rail on the right. */
export default function Loading() {
  return (
    <Page>
      <LoadingRegion label="Loading setup and planning">
        <div className="mb-8">
          <Skeleton className="h-11 w-80 max-w-full rounded-card" />
          <Skeleton className="mt-4 h-5 w-96 max-w-full" />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.8fr)_minmax(0,1fr)] lg:items-start">
          <div className="space-y-6">
            <div className="rounded-panel bg-paper p-6 shadow-card sm:p-8">
              <Skeleton className="h-6 w-48 rounded-card" />
              <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
                {[0, 1].map((index) => (
                  <div key={index}>
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="mt-2 h-12" />
                  </div>
                ))}
              </div>
              {[0, 1].map((index) => (
                <div key={index} className="mt-5">
                  <Skeleton className="h-3 w-28" />
                  <Skeleton className="mt-2 h-12" />
                </div>
              ))}
            </div>

            <Skeleton className="h-72 rounded-panel" />
          </div>

          <div className="space-y-6">
            <Skeleton className="h-80 rounded-panel" />
            <Skeleton className="h-40 rounded-panel" />
          </div>
        </div>
      </LoadingRegion>
    </Page>
  );
}
