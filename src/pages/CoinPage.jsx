import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { coinGeckoApi } from "../api/coingecko";
import { useMarketStore } from "../store/useMarketStore";
import { notify } from "../store/useNotifyStore";
// import { formatCurrency, formatPercent } from "../lib/format";
import { PriceChart } from "../components/coin/PriceChart";
// import { TimeframeSwitcher } from "../components/coin/TimeframeSwitcher";
import { Converter } from "../components/coin/Converter";

export function CoinPage() {
  const { id } = useParams();
  const coins = useMarketStore((s) => s.coins);
  const coin = coins.find((c) => c.id === id);
  const btc = coins.find((c) => c.id === "bitcoin");

  const [timeframe, setTimeframe] = useState("7d");
  const [points, setPoints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!coin) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);

    coinGeckoApi
      .fetchCoinHistory(coin.id, timeframe)
      .then((data) => {
        if (!cancelled) setPoints(data);
      })
      .catch((e) => {
        if (cancelled) return;
        setPoints([]);
        notify.error(
          `Не удалось загрузить график ${coin.name}`,
          e?.message ?? "Неизвестная ошибка",
        );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [coin, timeframe]);

  if (!coin) {
    return (
      <div className="rounded-xl bg-slate-900 p-6 ring-1 ring-slate-800">
        <p className="text-slate-300">
          Монета <code className="rounded bg-slate-800 px-1">{id}</code> не
          найдена.
        </p>
        <Link
          to="/"
          className="mt-2 inline-block text-indigo-400 hover:underline"
        >
          ← На главную
        </Link>
      </div>
    );
  }

  // const change = coin.price_change_percentage_24h;
  // const changeClass =
  //   change == null ? "text-slate-400" : change >= 0 ? "text-up" : "text-down";

  return (
    <div className="space-y-6">
      {/* ... шапка и график — без изменений ... */}
      <PriceChart points={points} loading={loading} />
      <Converter
        priceUsd={coin.current_price ?? 0}
        btcPriceUsd={btc?.current_price ?? 0}
      />
    </div>
  );
}
