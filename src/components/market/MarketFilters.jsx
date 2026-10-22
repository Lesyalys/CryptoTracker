import { useState } from "react";
import { useMarketStore } from "../../store/useMarketStore";
import { useDebouncedCallback } from "../../hooks/useDebouncedCallback";

export function MarketFilters() {
  const filters = useMarketStore((s) => s.filters);
  const setFilter = useMarketStore((s) => s.setFilter);

  const [search, setSearch] = useState(filters.search);
  const [priceMin, setPriceMin] = useState(filters.priceMin?.toString() ?? "");
  const [priceMax, setPriceMax] = useState(filters.priceMax?.toString() ?? "");

  // Своя функция debounce из lib/debounce.js, обёрнутая в хук
  const commitSearch = useDebouncedCallback((q) => {
    setFilter("search", q.trim());
  }, 300);

  const commitPriceMin = useDebouncedCallback((v) => {
    setFilter("priceMin", v ? Number(v) : null);
  }, 300);

  const commitPriceMax = useDebouncedCallback((v) => {
    setFilter("priceMax", v ? Number(v) : null);
  }, 300);

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
      <input
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          commitSearch(e.target.value);
        }}
        placeholder="Поиск по названию…"
        className="..."
        type="search"
      />
      <input
        value={priceMin}
        onChange={(e) => {
          const v = e.target.value.replace(/[^\d.]/g, "");
          setPriceMin(v);
          commitPriceMin(v);
        }}
        placeholder="Цена от, $"
        inputMode="decimal"
        className="..."
      />
      <input
        value={priceMax}
        onChange={(e) => {
          const v = e.target.value.replace(/[^\d.]/g, "");
          setPriceMax(v);
          commitPriceMax(v);
        }}
        placeholder="Цена до, $"
        inputMode="decimal"
        className="..."
      />
    </div>
  );
}
