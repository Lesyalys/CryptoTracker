export const formatCurrency = (value, currency = "USD") => {
  if (value == null || Number.isNaN(value)) return "—";
  const fractionDigits = value < 1 ? 6 : value < 100 ? 2 : 0;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: fractionDigits,
  }).format(value);
};

export const formatPercent = (value) => {
  if (value == null || Number.isNaN(value)) return "—";
  return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
};

export const formatCompact = (value) => {
  if (value == null) return "—";
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(value);
};
