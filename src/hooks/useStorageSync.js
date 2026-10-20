import { useEffect } from "react";
import { storage } from "../lib/storage";
import { usePortfolioStore } from "../store/usePortfolioStore";
import { BROADCAST_CHANNEL } from "../constants";

/**
 * Синхронизация портфеля между вкладками:
 *  - StorageEvent (кросс-вкладочный)
 *  - BroadcastChannel (мгновенное обновление)
 */
export function useStorageSync() {
  const syncFromStorage = usePortfolioStore((s) => s.syncFromStorage);

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key !== storage.key) return;
      try {
        syncFromStorage(e.newValue ? JSON.parse(e.newValue) : []);
      } catch {
        /* noop */
      }
    };
    window.addEventListener("storage", onStorage);

    let channel = null;
    if (typeof BroadcastChannel !== "undefined") {
      channel = new BroadcastChannel(BROADCAST_CHANNEL);
      channel.onmessage = (ev) => syncFromStorage(ev.data);
    }

    return () => {
      window.removeEventListener("storage", onStorage);
      channel?.close();
    };
  }, [syncFromStorage]);
}
