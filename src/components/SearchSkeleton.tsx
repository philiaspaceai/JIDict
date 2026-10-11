/** Skeleton berbentuk card hasil — meniru layout final (anti layout-shift). */
export function SearchSkeleton() {
  return (
    <div aria-hidden className="space-y-2">
      {[0, 1, 2].map((i) => (
        <div key={i} className="rounded-card border bg-[var(--card)] p-4">
          <div className="h-6 w-2/5 overflow-hidden rounded-md bg-[var(--muted)]">
            <div className="h-full w-full bg-[var(--border)]" style={{ animation: "shimmer-slide 1.2s infinite" }} />
          </div>
          <div className="mt-2 h-4 w-1/4 overflow-hidden rounded-md bg-[var(--muted)]">
            <div className="h-full w-full bg-[var(--border)]" style={{ animation: "shimmer-slide 1.2s 0.15s infinite" }} />
          </div>
          <div className="mt-3 h-4 w-4/5 overflow-hidden rounded-md bg-[var(--muted)]">
            <div className="h-full w-full bg-[var(--border)]" style={{ animation: "shimmer-slide 1.2s 0.3s infinite" }} />
          </div>
        </div>
      ))}
    </div>
  );
}
