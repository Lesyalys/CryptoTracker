import { TIMEFRAMES } from "../../constants";

export function TimeframeSwitcher({ value, onChange }) {
  return (
    <div className="inline-flex gap-1 rounded-lg bg-slate-900 p-1 ring-1 ring-slate-800">
      {TIMEFRAMES.map((tf) => (
        <button
          key={tf.value}
          onClick={() => onChange(tf.value)}
          className={`rounded-md px-3 py-1 text-xs font-medium transition ${
            value === tf.value
              ? "bg-indigo-600 text-white"
              : "text-slate-300 hover:bg-slate-800"
          }`}
        >
          {tf.label}
        </button>
      ))}
    </div>
  );
}
