import { Link } from "react-router-dom";
import { formatCompact, formatCurrency, formatPercent } from "../../lib/format";

export function MarketRow({ coin }) {
  const change = coin.price_change_percentage_24h;
  const changeClass =
    change == null ? "text-slate-400" : change >= 0 ? "text-up" : "text-down";

  return (
    <tr className="border-b border-slate-800/60 hover:bg-slate-900/60">
      <td className="px-3 py-2 text-slate-400">
        {coin.market_cap_rank ?? "—"}
      </td>
      <td className="px-3 py-2">
        <Link
          to={`/coin/${coin.id}`}
          className="flex items-center gap-2 hover:underline"
        >
          <img
            src={coin.image}
            alt=""
            width={20}
            height={20}
            className="rounded-full"
          />
          <span className="font-medium">{coin.name}</span>
          <span className="text-xs uppercase text-slate-400">
            {coin.symbol}
          </span>
        </Link>
      </td>
      <td className="px-3 py-2 text-right tabular-nums">
        {formatCurrency(coin.current_price)}
      </td>
      <td className={`px-3 py-2 text-right tabular-nums ${changeClass}`}>
        {formatPercent(change)}
      </td>
      <td className="px-3 py-2 text-right tabular-nums text-slate-300">
        {formatCompact(coin.market_cap)}
      </td>
    </tr>
  );
}
