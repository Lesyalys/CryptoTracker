import { useMarketPolling } from "../hooks/useMarketPolling";
import { GlobalMetrics } from "../components/market/GlobalMetrics";
import { MarketFilters } from "../components/market/MarketFilters";
import { MarketTable } from "../components/market/MarketTable";

export function HomePage() {
  useMarketPolling();

  return (
    <div className="space-y-6">
      <GlobalMetrics />
      <MarketFilters />
      <MarketTable />
    </div>
  );
}
