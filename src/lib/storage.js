import { STORAGE_KEY } from "../constants";

export const storage = {
  load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },
  save(txs) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(txs));
  },
  key: STORAGE_KEY,
};
