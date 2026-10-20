export function MetricCard({ label, value, change }) {
  const positive = (change ?? 0) >= 0;
  return (
    <div className="rounded-xl bg-slate-900 p-4 ring-1 ring-slate-800">
      <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1 text-xl font-semibold">{value}</p>
      {change != null && (
        <p className={`mt-1 text-xs ${positive ? "text-up" : "text-down"}`}>
          {positive ? "▲" : "▼"} {Math.abs(change).toFixed(2)}%
        </p>
      )}
    </div>
  );
}
