/**
 * Lightweight loading skeletons (Prompt 54B Part 0.4) — dependency-free shimmer
 * placeholders used while a list/thread loads, replacing blank-screen flashes.
 */

export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-zinc-800/70 ${className}`} />;
}

/** A column of fake email-list rows shown while a folder/search loads. */
export function EmailListSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <div className="divide-y divide-zinc-800/60" aria-hidden="true" data-testid="email-list-skeleton">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 px-4 py-3">
          <Skeleton className="h-4 w-4 shrink-0 rounded-full" />
          <div className="min-w-0 flex-1 space-y-1.5">
            <Skeleton className="h-3 w-1/3" />
            <Skeleton className="h-3 w-2/3" />
          </div>
          <Skeleton className="h-3 w-10 shrink-0" />
        </div>
      ))}
    </div>
  );
}
