import { create } from "zustand";
import { coinGeckoApi } from "../api/coingecko";
import { HttpError } from "../api/client";
import { DEFAULT_FILTERS, FALLBACK_COINS, FALLBACK_GLOBAL } from "../constants";
import { notify } from "./useNotifyStore";

function kindOf(e) {
  return e instanceof HttpError ? e.kind : "server";
}

export const useMarketStore = create((set, get) => ({
  coins: [],
  global: null,
  loading: true,
  refreshing: false,
  lastUpdated: null,
  coinsFallback: false,
  globalFallback: false,
  lastErrorKind: null,
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

    const [coinsRes, globalRes] = await Promise.allSettled([
      coinGeckoApi.fetchTopCoins(),
      coinGeckoApi.fetchGlobal(),
    ]);

    const coinsErr = coinsRes.status === "rejected" ? coinsRes.reason : null;
    const globalErr = globalRes.status === "rejected" ? globalRes.reason : null;

    const isRateLimit =
      (coinsErr instanceof HttpError && coinsErr.kind === "rate-limit") ||
      (globalErr instanceof HttpError && globalErr.kind === "rate-limit");

    if (coinsRes.status === "fulfilled") {
      set({ coins: coinsRes.value, coinsFallback: false });
    } else {
      set({
        coins: FALLBACK_COINS,
        coinsFallback: true,
        lastErrorKind: kindOf(coinsErr),
      });
    }

    if (globalRes.status === "fulfilled") {
      set({ global: globalRes.value, globalFallback: false });
    } else {
      set({ global: FALLBACK_GLOBAL, globalFallback: true });
    }

    if (isRateLimit) {
      notify.warn(
        "Лимит запросов CoinGecko",
        "Превышен лимит. Показываем офлайн-данные, обновление замедлено.",
        { key: "rate-limit" },
      );
    } else {
      if (coinsErr) {
        notify.error(
          "Не удалось загрузить список монет",
          coinsErr.message ?? "Неизвестная ошибка",
          { key: "coins-error" },
        );
      }
      if (globalErr) {
        notify.error(
          "Не удалось загрузить метрики рынка",
          globalErr.message ?? "Неизвестная ошибка",
          { key: "global-error" },
        );
      }
    }

    set({ loading: false, lastUpdated: Date.now() });
  },

  refreshSilently: async () => {
    if (get().refreshing) return;
    set({ refreshing: true });
    try {
      // монеты, и метрики
      const [coins, global] = await Promise.all([
        coinGeckoApi.fetchTopCoins(),
        coinGeckoApi.fetchGlobal(),
      ]);
      set({
        coins,
        global,
        refreshing: false,
        coinsFallback: false,
        globalFallback: false,
        lastErrorKind: null,
        lastUpdated: Date.now(),
      });
    } catch (e) {
      const kind = kindOf(e);
      set({ refreshing: false, lastErrorKind: kind });

      if (kind === "rate-limit") {
        notify.warn(
          "Лимит запросов CoinGecko",
          "Превышен лимит. Обновление замедлено.",
          { key: "rate-limit" },
        );
      } else {
        notify.error(
          "Автообновление не удалось",
          e?.message ?? "Неизвестная ошибка",
          { key: "refresh-error" },
        );
      }
    }
  },
}));
