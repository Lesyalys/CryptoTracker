import { create } from "zustand";

const generateId = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

const DEFAULT_TIMEOUT = 6000;

export const useNotifyStore = create((set, get) => ({
  notifications: [],

  /**
   * @param {'error'|'warn'|'success'|'info'} type
   * @param {string} title
   * @param {string} [message]
   * @param {{ persistent?: boolean, timeout?: number }} [opts]
   */
  notify: (type, title, message, opts = {}) => {
    const id = generateId();
    const timeout = opts.persistent ? null : (opts.timeout ?? DEFAULT_TIMEOUT);
    const item = { id, type, title, message, createdAt: Date.now() };
    const now = Date.now();
    const duplicate = get().notifications.find(
      (n) =>
        n.type === type &&
        n.title === title &&
        n.message === message &&
        now - n.createdAt < 10_000,
    );
    if (duplicate) return duplicate.id;

    set((s) => ({ notifications: [...s.notifications, item] }));

    if (timeout != null) {
      setTimeout(() => get().dismiss(id), timeout);
    }

    return id;
  },

  dismiss: (id) =>
    set((s) => ({ notifications: s.notifications.filter((n) => n.id !== id) })),

  clear: () => set({ notifications: [] }),
}));

// Удобные хелперы — чтобы не писать notify('error', ...) вручную
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
