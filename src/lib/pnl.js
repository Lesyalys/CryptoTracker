export function calculatePortfolio(transactions, prices) {
  const grouped = new Map();

  for (const tx of transactions) {
    const existing = grouped.get(tx.coinId);
    if (existing) {
      existing.amount += tx.amount;
      existing.invested += tx.amount * tx.buyPrice;
    } else {
      grouped.set(tx.coinId, {
        amount: tx.amount,
        invested: tx.amount * tx.buyPrice,
        tx,
      });
    }
  }

  const holdings = [];
  let totalValue = 0;
  let totalInvested = 0;

  for (const [coinId, { amount, invested, tx }] of grouped) {
    const price = prices[coinId];
    const hasPrice = price != null;
    const currentPrice = hasPrice ? price : invested / amount;
    const currentValue = amount * currentPrice;

    totalValue += currentValue;
    totalInvested += invested;

    holdings.push({
      coinId,
      coinName: tx.coinName,
      coinSymbol: tx.coinSymbol,
      amount,
      invested,
      currentPrice,
      currentValue,
      hasPrice,
      pnl: currentValue - invested,
      pnlPercent: invested ? ((currentValue - invested) / invested) * 100 : 0,
    });
  }

  const totalPnl = totalValue - totalInvested;

  return {
    holdings: holdings.sort((a, b) => b.currentValue - a.currentValue),
    totalValue,
    totalInvested,
    totalPnl,
    totalPnlPercent: totalInvested ? (totalPnl / totalInvested) * 100 : 0,
  };
}

export const buildPricesMap = (coins) =>
  coins.reduce((acc, c) => {
    if (c.current_price != null) acc[c.id] = c.current_price;
    return acc;
  }, {});
