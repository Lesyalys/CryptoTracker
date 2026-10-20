import { useState } from "react";
import { useMarketStore } from "../../store/useMarketStore";
import { usePortfolioStore } from "../../store/usePortfolioStore";
import { Button } from "../ui/Button";

export function PortfolioForm() {
  const coins = useMarketStore((s) => s.coins);
  const addTransaction = usePortfolioStore((s) => s.addTransaction);

  const [coinId, setCoinId] = useState("");
  const [amount, setAmount] = useState("");
  const [buyPrice, setBuyPrice] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const coin = coins.find((c) => c.id === coinId);
    const numAmount = Number(amount);
    const numPrice = Number(buyPrice);
    if (!coin || !numAmount || !numPrice) return;

    addTransaction({
      coinId: coin.id,
      coinName: coin.name,
      coinSymbol: coin.symbol,
      amount: numAmount,
      buyPrice: numPrice,
    });
    setAmount("");
    setBuyPrice("");
  };

  const inputCls =
    "w-full rounded-lg bg-slate-800 px-3 py-2 text-sm ring-1 ring-slate-700 focus:outline-none focus:ring-indigo-500";

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3 rounded-xl bg-slate-900 p-4 ring-1 ring-slate-800"
    >
      <p className="text-sm font-medium">Добавить транзакцию</p>
      <select
        value={coinId}
        onChange={(e) => setCoinId(e.target.value)}
        className={inputCls}
      >
        <option value="">Выберите монету…</option>
        {coins.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name} ({c.symbol.toUpperCase()})
          </option>
        ))}
      </select>
      <input
        value={amount}
        onChange={(e) => setAmount(e.target.value.replace(/[^\d.]/g, ""))}
        placeholder="Количество"
        inputMode="decimal"
        className={inputCls}
      />
      <input
        value={buyPrice}
        onChange={(e) => setBuyPrice(e.target.value.replace(/[^\d.]/g, ""))}
        placeholder="Цена покупки, $"
        inputMode="decimal"
        className={inputCls}
      />
      <Button
        type="submit"
        className="w-full"
        disabled={!coinId || !amount || !buyPrice}
      >
        Добавить
      </Button>
    </form>
  );
}
