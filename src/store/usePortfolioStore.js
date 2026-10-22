import { create } from "zustand";
import { storage } from "../lib/storage";
import { notify } from "./useNotifyStore";
import { BROADCAST_CHANNEL } from "../constants";

const generateId = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

function safeSave(txs) {
  try {
    storage.save(txs);
    return true;
  } catch (e) {
    notify.error(
      "Не удалось сохранить портфель",
      e?.message ?? "Хранилище браузера недоступно.",
      { key: "portfolio-save-error" },
    );
    return false;
  }
}

function broadcast(txs) {
  if (typeof BroadcastChannel === "undefined") return;
  try {
    const ch = new BroadcastChannel(BROADCAST_CHANNEL);
    ch.postMessage(txs);
    ch.close();
  } catch {
    /* noop */
  }
}

export const usePortfolioStore = create((set, get) => ({
  transactions: storage.load(),

  addTransaction: (partial) => {
    const tx = { ...partial, id: generateId(), createdAt: Date.now() };
    const next = [...get().transactions, tx];
    if (!safeSave(next)) return;
    set({ transactions: next });
    broadcast(next);
    notify.success("Транзакция добавлена", `${tx.coinName} · ${tx.amount}`, {
      key: `tx-added-${tx.id}`,
    });
  },

  removeTransaction: (id) => {
    const next = get().transactions.filter((t) => t.id !== id);
    if (!safeSave(next)) return;
    set({ transactions: next });
    broadcast(next);
  },

  removeByCoinId: (coinId) => {
    const next = get().transactions.filter((t) => t.coinId !== coinId);
    if (!safeSave(next)) return;
    set({ transactions: next });
    broadcast(next);
  },

  syncFromStorage: (txs) => set({ transactions: txs }),
}));
