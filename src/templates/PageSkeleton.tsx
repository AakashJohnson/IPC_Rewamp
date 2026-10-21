/** Placeholder with the same proportions as an interior page, so the footer does not jump while loading. */
export function PageSkeleton() {
  return (
    <div aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading page…</span>
      <div className="border-b border-line bg-paper">
        <div className="container-page pb-14 pt-8">
          <div className="h-3 w-48 rounded-xs bg-line" />
          <div className="mt-12 h-10 w-full max-w-2xl rounded-xs bg-line/80" />
          <div className="mt-4 h-4 w-40 rounded-xs bg-line/70" />
        </div>
      </div>
      <div className="container-page grid gap-10 py-12 lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-8 lg:col-start-4">
          {[100, 92, 96, 70, 88, 60].map((w, i) => (
            <div key={i} className="h-4 rounded-xs bg-line/70" style={{ width: `${w}%` }} />
          ))}
        </div>
      </div>
    </div>
  );
}
