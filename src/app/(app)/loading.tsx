import { Page } from "@/components/shell/app-shell";
import { LoadingRegion, Skeleton } from "@/components/ui/skeleton";

/**
 * Default skeleton for every screen inside the planner shell. The sidebar and
 * top bar live in the layout, so they stay put — only the main pane swaps.
 */
export default function Loading() {
  return (
    <Page>
      <LoadingRegion label="Loading page">
        <div className="mb-8">
          <Skeleton className="h-11 w-3/4 max-w-md rounded-card" />
          <Skeleton className="mt-4 h-5 w-1/2 max-w-sm" />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
          <Skeleton className="h-64 rounded-panel" />
          <Skeleton className="h-56 rounded-panel" />
        </div>

        <div className="mt-12">
          <Skeleton className="h-8 w-56 rounded-card" />
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {[0, 1, 2].map((index) => (
              <Skeleton key={index} className="h-56 rounded-panel" />
            ))}
          </div>
        </div>
      </LoadingRegion>
    </Page>
  );
}
