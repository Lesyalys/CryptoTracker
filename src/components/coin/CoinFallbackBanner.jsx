export function CoinFallbackBanner() {
  return (
    <div
      role="alert"
      className="rounded-xl border border-amber-500/50 bg-amber-950/60 px-4 py-3 text-sm text-amber-100"
    >
      ⚠ Данные офлайн-снапшота. Цена и изменение могут быть устаревшими.
    </div>
  );
}
