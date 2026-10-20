import { useEffect } from "react";
import { useMarketStore } from "../store/useMarketStore";
// import { POLL_INTERVAL_MS } from "../constants";
import { useRef } from "react";

/**
 * Инициирует первую загрузку и периодическое автообновление каждые N мс.
 */
export function useMarketPolling() {
  const loadInitial = useMarketStore((s) => s.loadInitial);
  const refreshSilently = useMarketStore((s) => s.refreshSilently);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return; // Предотвращаем двойной запуск в StrictMode
    started.current = true;

    void loadInitial();
    const id = setInterval(() => void refreshSilently(), 60_000); // Изменено на 60 секунд
    return () => clearInterval(id);
  }, [loadInitial, refreshSilently]);
}
