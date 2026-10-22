import { GlobalMetrics } from "../components/market/GlobalMetrics";
import { MarketFilters } from "../components/market/MarketFilters";
import { MarketTable } from "../components/market/MarketTable";
import { FallbackBanner } from "../components/market/FallbackBanner";

export function HomePage() {
  return (
    <div className="space-y-6">
      <FallbackBanner />
      <GlobalMetrics />
      <MarketFilters />
      <MarketTable />
    </div>
  );
}
