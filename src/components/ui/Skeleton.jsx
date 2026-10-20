export function Skeleton({ className = "" }) {
  return <div className={`animate-pulse rounded bg-slate-800 ${className}`} />;
}

export function TableSkeleton({ rows = 8 }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-12 w-full" />
      ))}
    </div>
  );
}
