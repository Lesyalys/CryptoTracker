import { useMarketStore } from "../../store/useMarketStore";
import { formatCompact, formatCurrency } from "../../lib/format";
import { MetricCard } from "./MetricCard";
import { Skeleton } from "../ui/Skeleton";

export function GlobalMetrics() {
  const global = useMarketStore((s) => s.global);
  const globalFallback = useMarketStore((s) => s.globalFallback);
  const loading = useMarketStore((s) => s.loading);

  // Скелетоны — только если данных ещё нет вообще
  if (loading && !global) {
    return (
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    );
  }

  if (!global) return null;

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <MetricCard
          label="Капитализация"
          value={formatCurrency(global.totalMarketCap)}
          change={global.marketCapChange24h}
        />
        <MetricCard
          label="Объём 24ч"
          value={formatCompact(global.totalVolume)}
        />
        <MetricCard
          label="Доминация BTC"
          value={`${global.btcDominance.toFixed(1)}%`}
        />
        <MetricCard
          label="Изменение 24ч"
          value={`${global.marketCapChange24h >= 0 ? "+" : ""}${global.marketCapChange24h.toFixed(2)}%`}
          change={global.marketCapChange24h}
        />
      </div>

      {globalFallback && (
        <p role="status" className="text-xs text-amber-300/80">
          ⚠ Метрики рынка — офлайн-снапшот. Значения могут быть устаревшими.
        </p>
      )}
    </div>
  );
}
