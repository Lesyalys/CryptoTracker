import { useNotifyStore } from "../../store/useNotifyStore";

const STYLES = {
  error: "border-red-500/50 bg-red-950/80 text-red-100",
  warn: "border-amber-500/50 bg-amber-950/80 text-amber-100",
  success: "border-emerald-500/50 bg-emerald-950/80 text-emerald-100",
  info: "border-slate-500/50 bg-slate-900/90 text-slate-100",
};

const ICONS = {
  error: "✕",
  warn: "⚠",
  success: "✓",
  info: "ℹ",
};

export function Toaster() {
  const notifications = useNotifyStore((s) => s.notifications);
  const dismiss = useNotifyStore((s) => s.dismiss);

  if (!notifications.length) return null;

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-50 flex w-full max-w-sm flex-col gap-2">
      {notifications.map((n) => (
        <div
          key={n.id}
          className={`pointer-events-auto flex items-start gap-3 rounded-xl border p-3 shadow-2xl backdrop-blur ${
            STYLES[n.type] ?? STYLES.info
          }`}
        >
          <span className="mt-0.5 text-lg leading-none">
            {ICONS[n.type] ?? "ℹ"}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold">{n.title}</p>
            {n.message && (
              <p className="mt-1 break-words text-xs opacity-80">{n.message}</p>
            )}
          </div>
          <button
            onClick={() => dismiss(n.id)}
            className="shrink-0 rounded p-1 text-xs opacity-60 hover:opacity-100"
            aria-label="Закрыть уведомление"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
