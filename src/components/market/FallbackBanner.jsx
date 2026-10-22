import { useMarketStore } from "../../store/useMarketStore";

export function FallbackBanner() {
  const coinsFallback = useMarketStore((s) => s.coinsFallback);
  const refreshing = useMarketStore((s) => s.refreshing);
  const refreshSilently = useMarketStore((s) => s.refreshSilently);

  if (!coinsFallback) return null;

  return (
    <div
      role="alert"
      className="flex items-center justify-between rounded-xl border border-amber-500/50 bg-amber-950/60 px-4 py-3 text-sm text-amber-100"
    >
      <p>⚠ Показаны офлайн-данные. Цены и изменения могут быть устаревшими.</p>
      <button
        onClick={() => void refreshSilently()}
        disabled={refreshing}
        className="rounded-lg bg-amber-500/20 px-3 py-1 text-xs font-medium hover:bg-amber-500/30 disabled:opacity-50"
      >
        {refreshing ? "Обновление…" : "Обновить"}
      </button>
    </div>
  );
}
