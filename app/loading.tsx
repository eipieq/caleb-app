export default function Loading() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-8 flex flex-col gap-4">
      {/* stats skeleton */}
      <div className="flex gap-4">
        <div className="h-3 w-24 bg-muted rounded animate-pulse" />
        <div className="h-3 w-32 bg-muted rounded animate-pulse" />
      </div>

      {/* day group skeleton */}
      <div className="flex flex-col gap-2 mt-4">
        <div className="flex items-center gap-3 py-1">
          <div className="h-2 w-10 bg-muted rounded animate-pulse" />
          <div className="flex-1 h-px bg-border/30" />
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-14 rounded-lg bg-muted/40 animate-pulse" />
        ))}
      </div>
    </div>
  );
}
