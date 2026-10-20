export function EmptyState({ title, subtitle }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
      <span className="text-3xl">🔍</span>
      <p className="text-lg font-medium">{title}</p>
      {subtitle && <p className="text-sm text-slate-400">{subtitle}</p>}
    </div>
  );
}
