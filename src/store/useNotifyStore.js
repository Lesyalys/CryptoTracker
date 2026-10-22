import { create } from "zustand";

const generateId = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
const DEFAULT_TIMEOUT = 6000;
const DEFAULT_DEDUPE_WINDOW = 10_000;

const timers = new Map();

export const useNotifyStore = create((set, get) => ({
  notifications: [],

  notify: (type, title, message, opts = {}) => {
    const now = Date.now();
    const key = opts.key ?? `${type}:${title}:${message}`;
    const window = opts.dedupeWindow ?? DEFAULT_DEDUPE_WINDOW;

    const duplicate = get().notifications.find(
      (n) => n.key === key && now - n.createdAt < window,
    );
    if (duplicate) return duplicate.id;

    const id = generateId();
    const timeout = opts.persistent ? null : (opts.timeout ?? DEFAULT_TIMEOUT);
    const item = { id, key, type, title, message, createdAt: now };

    set((s) => ({ notifications: [...s.notifications, item] }));

    if (timeout != null) {
      const timerId = setTimeout(() => {
        get().dismiss(id);
        timers.delete(id);
      }, timeout);
      timers.set(id, timerId);
    }

    return id;
  },

  dismiss: (id) => {
    const timerId = timers.get(id);
    if (timerId) {
      clearTimeout(timerId);
      timers.delete(id);
    }
    set((s) => ({ notifications: s.notifications.filter((n) => n.id !== id) }));
  },

  clear: () => {
    for (const timerId of timers.values()) clearTimeout(timerId);
    timers.clear();
    set({ notifications: [] });
  },
}));

export const notify = {
  error: (title, message, opts) =>
    useNotifyStore.getState().notify("error", title, message, opts),
  warn: (title, message, opts) =>
    useNotifyStore.getState().notify("warn", title, message, opts),
  success: (title, message, opts) =>
    useNotifyStore.getState().notify("success", title, message, opts),
  info: (title, message, opts) =>
    useNotifyStore.getState().notify("info", title, message, opts),
};
