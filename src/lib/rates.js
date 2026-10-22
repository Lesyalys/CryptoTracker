import { RATES_KEY, RATES_URL, RATES_TTL, SYMBOLS } from "../constants";

export class RateError extends Error {
  constructor(message, status, kind) {
    super(message);
    this.name = "RateError";
    this.status = status;
    this.kind = kind; // 'rate-limit' | 'network' | 'server'
  }
}

/**
 * Клиент курсов валют. Все курсы нормализованы к 1 единице валюты
 * относительно RUB: rate = Value / Nominal (сколько рублей за 1 единицу).
 */
class RatesClient {
  constructor() {
    this._inflight = null;
  }

  async _fetchRates() {
    let response;
    try {
      response = await fetch(RATES_URL);
    } catch {
      throw new RateError(
        "Не удалось связаться с сервером ЦБ. Проверьте интернет.",
        0,
        "network",
      );
    }

    if (!response.ok) {
      const kind = response.status === 429 ? "rate-limit" : "server";
      throw new RateError(
        response.status === 429
          ? "Превышен лимит запросов к ЦБ. Попробуйте позже."
          : `Сервер ЦБ вернул ошибку ${response.status}.`,
        response.status,
        kind,
      );
    }

    const data = await response.json();
    if (!data || typeof data !== "object" || !data.Valute) {
      throw new RateError(
        "Некорректный ответ от сервера ЦБ.",
        response.status,
        "server",
      );
    }

    const result = {
      RUB: { name: "Российский рубль", symbol: "₽", rate: 1 },
    };

    for (const code in data.Valute) {
      const v = data.Valute[code];
      result[code] = {
        name: v.Name,
        symbol: SYMBOLS[code] || code,
        rate: v.Value / v.Nominal,
      };
    }

    return result;
  }

  _readCache() {
    try {
      const raw = localStorage.getItem(RATES_KEY);
      if (!raw) return null;
      const cached = JSON.parse(raw);
      if (!cached?.data || !cached?.timestamp) return null;
      const age = Date.now() - cached.timestamp;
      return age < RATES_TTL ? cached.data : null;
    } catch {
      return null;
    }
  }

  _writeCache(data) {
    try {
      localStorage.setItem(
        RATES_KEY,
        JSON.stringify({ data, timestamp: Date.now() }),
      );
    } catch {
      /* noop */
    }
  }

  async load() {
    const cached = this._readCache();
    if (cached) return cached;

    if (this._inflight) return this._inflight;

    this._inflight = this._fetchRates()
      .then((data) => {
        this._writeCache(data);
        return data;
      })
      .finally(() => {
        this._inflight = null;
      });

    return this._inflight;
  }

  convert(value, from, to, rates) {
    if (!Number.isFinite(value) || value <= 0) return null;
    const f = rates[from];
    const t = rates[to];
    if (!f || !t) return null;
    return (value * f.rate) / t.rate;
  }
}

export const ratesClient = new RatesClient();
