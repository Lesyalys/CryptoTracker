import { useMemo } from "react";
import { useMarketStore } from "../store/useMarketStore";
import { usePortfolioStore } from "../store/usePortfolioStore";
import { buildPricesMap, calculatePortfolio } from "../lib/pnl";
import { PortfolioForm } from "../components/portfolio/PortfolioForm";
import { PortfolioPie } from "../components/portfolio/PortfolioPie";
import { PortfolioStats } from "../components/portfolio/PortfolioStats";
import { EmptyState } from "../components/ui/EmptyState";
import { formatCurrency } from "../lib/format";
import { Button } from "../components/ui/Button";

export function PortfolioPage() {
  const coins = useMarketStore((s) => s.coins);
  const transactions = usePortfolioStore((s) => s.transactions);
  const removeTransaction = usePortfolioStore((s) => s.removeTransaction);

  const summary = useMemo(() => {
    const prices = buildPricesMap(coins);
    return calculatePortfolio(transactions, prices);
  }, [transactions, coins]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Портфель</h1>

      <PortfolioStats summary={summary} />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="md:col-span-1">
          <PortfolioForm />
        </div>
        <div className="md:col-span-2">
          {summary.holdings.length ? (
            <PortfolioPie holdings={summary.holdings} />
          ) : (
            <div className="rounded-xl bg-slate-900 p-4 ring-1 ring-slate-800">
              <EmptyState
                title="Портфель пуст"
                subtitle="Добавьте первую транзакцию, чтобы увидеть распределение"
              />
            </div>
          )}
        </div>
      </div>

      {summary.holdings.length > 0 && (
        <div className="overflow-hidden rounded-xl ring-1 ring-slate-800">
          <table className="w-full text-sm">
            <thead className="bg-slate-900 text-slate-400">
              <tr>
                <th className="px-3 py-2 text-left">Монета</th>
                <th className="px-3 py-2 text-right">Кол-во</th>
                <th className="px-3 py-2 text-right">Цена</th>
                <th className="px-3 py-2 text-right">Стоимость</th>
                <th className="px-3 py-2 text-right">PnL</th>
                <th className="px-3 py-2" />
              </tr>
            </thead>
            <tbody>
              {summary.holdings.map((h) => (
                <tr key={h.coinId} className="border-b border-slate-800/60">
                  <td className="px-3 py-2">
                    {h.coinName}{" "}
                    <span className="text-xs text-slate-400">
                      {h.coinSymbol.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-right tabular-nums">
                    {h.amount}
                  </td>
                  <td className="px-3 py-2 text-right tabular-nums">
                    {formatCurrency(h.currentPrice)}
                  </td>
                  <td className="px-3 py-2 text-right tabular-nums">
                    {formatCurrency(h.currentValue)}
                  </td>
                  <td
                    className={`px-3 py-2 text-right tabular-nums ${
                      h.pnl >= 0 ? "text-up" : "text-down"
                    }`}
                  >
                    {formatCurrency(h.pnl)} ({h.pnlPercent.toFixed(2)}%)
                  </td>
                  <td className="px-3 py-2 text-right">
                    <Button
                      variant="danger"
                      onClick={() =>
                        transactions
                          .filter((t) => t.coinId === h.coinId)
                          .forEach((t) => removeTransaction(t.id))
                      }
                    >
                      Удалить
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
