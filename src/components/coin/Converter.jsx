import { useMemo, useState } from "react";
import { useRates } from "../../hooks/useRates";
import { ratesClient } from "../../lib/rates";

const BTC_CODE = "BTC";

export function Converter({ priceUsd, btcPriceUsd }) {
  const { rates, loading, isFallback } = useRates();
  const [amount, setAmount] = useState("1");
  const [currency, setCurrency] = useState("USD");

  const currencyOptions = useMemo(() => {
    if (!rates) return [];
    const list = Object.entries(rates).map(([code, info]) => ({
      code,
      label: `${code} — ${info.name}`,
      symbol: info.symbol,
    }));
    list.push({ code: BTC_CODE, label: "BTC — Bitcoin", symbol: "₿" });
    return list;
  }, [rates]);

  const result = useMemo(() => {
    if (!rates) return null;
    const value = Number(amount);
    if (!Number.isFinite(value) || value <= 0) return null;

    const valueUsd = value * priceUsd;
    if (!Number.isFinite(valueUsd) || valueUsd <= 0) return null;

    if (currency === BTC_CODE) {
      if (!btcPriceUsd) return null;
      return valueUsd / btcPriceUsd;
    }
    return ratesClient.convert(valueUsd, "USD", currency, rates);
  }, [amount, currency, priceUsd, btcPriceUsd, rates]);

  const inputCls =
    "rounded-lg bg-slate-800 px-3 py-2 text-sm ring-1 ring-slate-700 focus:outline-none focus:ring-indigo-500";

  if (loading) {
    return (
      <div className="rounded-xl bg-slate-900 p-4 ring-1 ring-slate-800">
        <p className="text-xs uppercase tracking-wide text-slate-400">
          Конвертер
        </p>
        <p className="mt-2 text-sm text-slate-400">Загрузка курсов…</p>
      </div>
    );
  }

  const selected = currencyOptions.find((o) => o.code === currency);

  return (
    <div className="rounded-xl bg-slate-900 p-4 ring-1 ring-slate-800">
      <p className="mb-2 text-xs uppercase tracking-wide text-slate-400">
        Конвертер
      </p>
      <div className="flex gap-2">
        <input
          type="number"
          min="0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className={`w-32 ${inputCls}`}
        />
        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          className={inputCls}
        >
          {currencyOptions.map((opt) => (
            <option key={opt.code} value={opt.code}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      <p className="mt-3 text-lg font-semibold">
        {result == null
          ? "—"
          : currency === BTC_CODE
            ? `${result.toFixed(8)} BTC`
            : `${selected?.symbol ?? ""} ${result.toFixed(2)}`.trim()}
      </p>
      <p className="mt-1 text-xs text-slate-500">
        {isFallback
          ? "⚠ Офлайн-курсы (ЦБ РФ недоступен)"
          : `Курсы ЦБ РФ · ${currencyOptions.length - 1} валют + BTC`}
      </p>
    </div>
  );
}
