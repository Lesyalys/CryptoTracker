import { useMemo } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const COLORS = [
  "#6366f1",
  "#22d3ee",
  "#f59e0b",
  "#ef4444",
  "#10b981",
  "#a855f7",
  "#eab308",
  "#14b8a6",
];

export function PortfolioPie({ holdings }) {
  const data = useMemo(
    () => ({
      labels: holdings.map((h) => h.coinSymbol.toUpperCase()),
      datasets: [
        {
          data: holdings.map((h) => h.currentValue),
          backgroundColor: holdings.map((_, i) => COLORS[i % COLORS.length]),
          borderWidth: 0,
        },
      ],
    }),
    [holdings],
  );

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "bottom", labels: { color: "#cbd5e1" } },
    },
  };

  return (
    <div className="h-72 rounded-xl bg-slate-900 p-3 ring-1 ring-slate-800">
      <Pie data={data} options={options} />
    </div>
  );
}
