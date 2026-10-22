import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { coinGeckoApi } from "../api/coingecko";
import { useMarketStore } from "../store/useMarketStore";
import { notify } from "../store/useNotifyStore";
import { FALLBACK_COINS } from "../constants";
import { formatCurrency, formatPercent } from "../lib/format";
import { PriceChart } from "../components/coin/PriceChart";
import { TimeframeSwitcher } from "../components/coin/TimeframeSwitcher";
import { Converter } from "../components/coin/Converter";
import { CoinFallbackBanner } from "../components/coin/CoinFallbackBanner";
import { BackLink } from "../components/ui/BackLink";

export function CoinPage() {
  const { id } = useParams();
  const coins = useMarketStore((s) => s.coins);
  const coinsFallback = useMarketStore((s) => s.coinsFallback);

  const coin =
    coins.find((c) => c.id === id) ?? FALLBACK_COINS.find((c) => c.id === id);

  const btc =
    coins.find((c) => c.id === "bitcoin") ??
    FALLBACK_COINS.find((c) => c.id === "bitcoin");

  const coinIsFallback = !coins.some((c) => c.id === id);
  const showFallbackBanner = Boolean(coin) && (coinsFallback || coinIsFallback);

  const coinId = coin?.id;
  const coinName = coin?.name;

  const [timeframe, setTimeframe] = useState("7d");
  const [points, setPoints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!coinId) {
      setPoints([]);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);

    coinGeckoApi
      .fetchCoinHistory(coinId, timeframe)
      .then((data) => {
        if (!cancelled) setPoints(data);
      })
      .catch((e) => {
        if (cancelled) return;
        setPoints([]);
        if (!showFallbackBanner) {
          notify.error(
            `Не удалось загрузить график ${coinName ?? coinId}`,
            e?.message ?? "Неизвестная ошибка",
            { key: `chart-error-${coinId}` },
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [coinId, coinName, timeframe]);

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

  const change = coin.price_change_percentage_24h;
  const changeClass =
    change == null ? "text-slate-400" : change >= 0 ? "text-up" : "text-down";

  return (
    <div className="space-y-6">
      {showFallbackBanner && <CoinFallbackBanner />}
      <BackLink />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <img
            src={coin.image}
            alt=""
            width={40}
            height={40}
            className="rounded-full"
          />
          <div>
            <h1 className="text-2xl font-bold">
              {coin.name}{" "}
              <span className="text-slate-400">
                {coin.symbol.toUpperCase()}
              </span>
            </h1>
            <p className="text-sm">
              <span className="text-lg font-semibold">
                {formatCurrency(coin.current_price)}
              </span>{" "}
              <span className={changeClass}>{formatPercent(change)}</span>
            </p>
          </div>
        </div>
        <TimeframeSwitcher value={timeframe} onChange={setTimeframe} />
      </div>

      <PriceChart points={points} loading={loading} />

      <Converter
        priceUsd={coin.current_price ?? 0}
        btcPriceUsd={btc?.current_price ?? 0}
      />
    </div>
  );
}
