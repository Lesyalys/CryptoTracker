import { useMemo } from "react";
import { Line } from "react-chartjs-2";
import { EmptyState } from "../ui/EmptyState";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
);

export function PriceChart({ points, loading }) {
  const data = useMemo(() => {
    const labels = points.map((p) =>
      new Date(p.timestamp).toLocaleString("ru-RU", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      }),
    );
    const values = points.map((p) => p.price);
    return {
      labels,
      datasets: [
        {
          label: "Цена, USD",
          data: values,
          borderColor: "#6366f1",
          backgroundColor: "rgba(99,102,241,0.15)",
          fill: true,
          tension: 0.25,
          pointRadius: 0,
        },
      ],
    };
  }, [points]);

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: {
          ticks: { color: "#64748b", maxTicksLimit: 8 },
          grid: { display: false },
        },
        y: {
          ticks: { color: "#64748b" },
          grid: { color: "rgba(148,163,184,0.1)" },
        },
      },
    }),
    [],
  );

  return (
    <div className="h-80 w-full rounded-xl bg-slate-900 p-3 ring-1 ring-slate-800">
      {loading ? (
        <div className="flex h-full items-center justify-center text-slate-400">
          Загрузка…
        </div>
      ) : points.length === 0 ? (
        <EmptyState
          title="Нет данных за выбранный период"
          subtitle="Попробуйте другой таймфрейм"
        />
      ) : (
        <Line data={data} options={options} />
      )}
    </div>
  );
}
