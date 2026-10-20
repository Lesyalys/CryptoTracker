import { create } from "zustand";
import { coinGeckoApi } from "../api/coingecko";
import { HttpError } from "../api/client";
import { DEFAULT_FILTERS } from "../constants";
import { notify } from "./useNotifyStore";

function reportError(e, context) {
  if (e instanceof HttpError) {
    if (e.kind === "rate-limit") {
      notify.warn("Лимит запросов CoinGecko", e.message);
    } else if (e.kind === "network" || e.kind === "timeout") {
      notify.error(`Сеть: ${context}`, e.message);
    } else {
      notify.error(`Ошибка API: ${context}`, e.message);
    }
  } else {
    notify.error(
      `Ошибка: ${context}`,
      e instanceof Error ? e.message : "Неизвестная ошибка",
    );
  }
}

export const useMarketStore = create((set, get) => ({
  coins: [],
  global: null,
  loading: true,
  refreshing: false,
  lastUpdated: null,
  filters: { ...DEFAULT_FILTERS },

  setFilter: (key, value) =>
    set((s) => ({ filters: { ...s.filters, [key]: value } })),

  toggleSort: (key) =>
    set((s) => ({
      filters: {
        ...s.filters,
        sortKey: key,
        sortDirection:
          s.filters.sortKey === key && s.filters.sortDirection === "asc"
            ? "desc"
            : "asc",
      },
    })),

  loadInitial: async () => {
    set({ loading: true });

    // Загружаем параллельно, но ошибки обрабатываем независимо
    const [coinsRes, globalRes] = await Promise.allSettled([
      coinGeckoApi.fetchTopCoins(),
      coinGeckoApi.fetchGlobal(),
    ]);

    if (coinsRes.status === "fulfilled") {
      set({ coins: coinsRes.value });
    } else {
      notify.error(
        "Не удалось загрузить список монет",
        coinsRes.reason?.message ?? "Неизвестная ошибка",
      );
    }

    if (globalRes.status === "fulfilled") {
      set({ global: globalRes.value });
    } else {
      notify.error(
        "Не удалось загрузить метрики рынка",
        globalRes.reason?.message ?? "Неизвестная ошибка",
      );
    }

    set({ loading: false, lastUpdated: Date.now() });
  },

  refreshSilently: async () => {
    if (get().refreshing) return;
    set({ refreshing: true });
    try {
      const coins = await coinGeckoApi.fetchTopCoins();
      set({ coins, refreshing: false, lastUpdated: Date.now() });
    } catch (e) {
      set({ refreshing: false });
      reportError(e, "автообновление");
    }
  },
}));
