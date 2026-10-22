import { useEffect, useRef } from "react";
import { useMarketStore } from "../store/useMarketStore";
import { POLL_INTERVAL_MS, POLL_INTERVAL_RATE_LIMIT_MS } from "../constants";

/**
 * Автообновление рыночных данных.
 *
 * Две независимые задачи:
 *  1. Первая загрузка (loadInitial) — один раз за жизнь компонента.
 *     Защита от двойного запуска в StrictMode через useRef.
 *  2. Периодический refreshSilently — интервал адаптируется:
 *     обычный режим — 60 сек; после 429 — 5 минут
 */
export function useMarketPolling() {
  const loadInitial = useMarketStore((s) => s.loadInitial);
  const refreshSilently = useMarketStore((s) => s.refreshSilently);
  const lastErrorKind = useMarketStore((s) => s.lastErrorKind);

  const started = useRef(false);

  // 1. Стартовая загрузка — ровно один раз
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    void loadInitial();
    return () => {
      started.current = false;
    };
  }, [loadInitial]);

  // 2. Таймер автообновления — пересоздаётся при смене интервала
  useEffect(() => {
    const interval =
      lastErrorKind === "rate-limit"
        ? POLL_INTERVAL_RATE_LIMIT_MS
        : POLL_INTERVAL_MS;

    const id = setInterval(() => void refreshSilently(), interval);
    return () => clearInterval(id);
  }, [refreshSilently, lastErrorKind]);
}
