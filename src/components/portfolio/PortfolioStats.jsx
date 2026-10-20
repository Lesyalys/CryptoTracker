import { formatCurrency, formatPercent } from "../../lib/format";

export function PortfolioStats({ summary }) {
  const positive = summary.totalPnl >= 0;
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
      <div className="rounded-xl bg-slate-900 p-4 ring-1 ring-slate-800">
        <p className="text-xs uppercase tracking-wide text-slate-400">
          Текущая стоимость
        </p>
        <p className="mt-1 text-xl font-semibold">
          {formatCurrency(summary.totalValue)}
        </p>
      </div>
      <div className="rounded-xl bg-slate-900 p-4 ring-1 ring-slate-800">
        <p className="text-xs uppercase tracking-wide text-slate-400">
          Инвестировано
        </p>
        <p className="mt-1 text-xl font-semibold">
          {formatCurrency(summary.totalInvested)}
        </p>
      </div>
      <div className="rounded-xl bg-slate-900 p-4 ring-1 ring-slate-800">
        <p className="text-xs uppercase tracking-wide text-slate-400">PnL</p>
        <p
          className={`mt-1 text-xl font-semibold ${positive ? "text-up" : "text-down"}`}
        >
          {formatCurrency(summary.totalPnl)} (
          {formatPercent(summary.totalPnlPercent)})
        </p>
      </div>
    </div>
  );
}
