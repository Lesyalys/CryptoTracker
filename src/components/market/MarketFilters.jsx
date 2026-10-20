import { useEffect, useState } from "react";
import { useMarketStore } from "../../store/useMarketStore";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";
import { DEBOUNCE_DELAY_MS } from "../../constants";

const inputCls =
  "w-full rounded-lg bg-slate-900 px-3 py-2 text-sm ring-1 ring-slate-800 focus:outline-none focus:ring-indigo-500";

export function MarketFilters() {
  const filters = useMarketStore((s) => s.filters);
  const setFilter = useMarketStore((s) => s.setFilter);

  const [search, setSearch] = useState(filters.search);
  const [priceMin, setPriceMin] = useState(filters.priceMin?.toString() ?? "");
  const [priceMax, setPriceMax] = useState(filters.priceMax?.toString() ?? "");

  const debouncedSearch = useDebouncedValue(search, DEBOUNCE_DELAY_MS);
  const debouncedMin = useDebouncedValue(priceMin, DEBOUNCE_DELAY_MS);
  const debouncedMax = useDebouncedValue(priceMax, DEBOUNCE_DELAY_MS);

  useEffect(
    () => setFilter("search", debouncedSearch.trim()),
    [debouncedSearch, setFilter],
  );
  useEffect(
    () => setFilter("priceMin", debouncedMin ? Number(debouncedMin) : null),
    [debouncedMin, setFilter],
  );
  useEffect(
    () => setFilter("priceMax", debouncedMax ? Number(debouncedMax) : null),
    [debouncedMax, setFilter],
  );

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Поиск по названию…"
        className={inputCls}
        type="search"
      />
      <input
        value={priceMin}
        onChange={(e) => setPriceMin(e.target.value.replace(/[^\d.]/g, ""))}
        placeholder="Цена от, $"
        inputMode="decimal"
        className={inputCls}
      />
      <input
        value={priceMax}
        onChange={(e) => setPriceMax(e.target.value.replace(/[^\d.]/g, ""))}
        placeholder="Цена до, $"
        inputMode="decimal"
        className={inputCls}
      />
    </div>
  );
}
