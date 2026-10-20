import { useMemo } from "react";
import { useMarketStore } from "../../store/useMarketStore";
import { TABLE_COLUMNS } from "../../constants";
import { EmptyState } from "../ui/EmptyState";
import { TableSkeleton } from "../ui/Skeleton";
import { MarketRow } from "./MarketRow";

export function MarketTable() {
  const coins = useMarketStore((s) => s.coins);
  const loading = useMarketStore((s) => s.loading);
  const filters = useMarketStore((s) => s.filters);
  const toggleSort = useMarketStore((s) => s.toggleSort);

  const rows = useMemo(() => {
    const search = filters.search.toLowerCase();
    let list = coins.filter((c) => {
      if (
        search &&
        !c.name.toLowerCase().includes(search) &&
        !c.symbol.toLowerCase().includes(search)
      ) {
        return false;
      }
      if (filters.priceMin != null && (c.current_price ?? 0) < filters.priceMin)
        return false;
      if (
        filters.priceMax != null &&
        (c.current_price ?? Infinity) > filters.priceMax
      )
        return false;
      return true;
    });

    const { sortKey, sortDirection } = filters;
    list = [...list].sort((a, b) => {
      const av = a[sortKey] ?? Number.POSITIVE_INFINITY;
      const bv = b[sortKey] ?? Number.POSITIVE_INFINITY;
      const diff = Number(av) - Number(bv);
      return sortDirection === "asc" ? diff : -diff;
    });

    return list;
  }, [coins, filters]);

  if (loading && coins.length === 0) return <TableSkeleton />;

  return (
    <div className="overflow-hidden rounded-xl ring-1 ring-slate-800">
      <table className="w-full text-sm">
        <thead className="bg-slate-900 text-slate-400">
          <tr>
            {TABLE_COLUMNS.map((col) => {
              const active = col.key && filters.sortKey === col.key;
              return (
                <th
                  key={col.label}
                  className={`px-3 py-2 ${
                    col.align === "right" ? "text-right" : "text-left"
                  } ${col.key ? "cursor-pointer select-none hover:text-white" : ""}`}
                  onClick={() => col.key && toggleSort(col.key)}
                >
                  {col.label}
                  {active && (filters.sortDirection === "asc" ? " ▲" : " ▼")}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {rows.map((coin) => (
            <MarketRow key={coin.id} coin={coin} />
          ))}
        </tbody>
      </table>
      {rows.length === 0 && (
        <EmptyState
          title="Ничего не найдено"
          subtitle="Измените параметры поиска или фильтра"
        />
      )}
    </div>
  );
}
