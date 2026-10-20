import { RATES_KEY, PATH, TTL, SYMBOLS } from "../constants/index";

/**
 * Клиент курсов валют. Все курсы нормализованы к 1 единице валюты
 * относительно RUB: rate = Value / Nominal (сколько рублей за 1 единицу).
 */
class RatesClient {
  constructor() {
    this._inflight = null;
  }

  async _fetchRates() {
    const response = await fetch(PATH);
    if (!response.ok) {
      throw new Error(`Не удалось загрузить курсы: ${response.status}`);
    }
    const data = await response.json();

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
      return age < TTL ? cached.data : null;
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
      /* localStorage может быть недоступен — не критично */
    }
  }

  /**
   * Возвращает курсы. Кэш (TTL 1ч) → сеть. Параллельные вызовы
   * дедуплицируются: уйдёт только один HTTP-запрос.
   */
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

  /**
   * Конвертирует сумму из одной валюты в другую по курсам ЦБ.
   * @param {number} value
   * @param {string} from — код валюты (USD, EUR, RUB, ...)
   * @param {string} to   — код валюты
   * @param {Record<string, {rate: number}>} rates
   */
  convert(value, from, to, rates) {
    if (!Number.isFinite(value) || value <= 0) return null;
    const f = rates[from];
    const t = rates[to];
    if (!f || !t) return null;
    // rate = рублей за 1 единицу. Значит: value * f.rate — в рублях,
    // делим на t.rate — получаем в целевой валюте.
    return (value * f.rate) / t.rate;
  }
}

export const ratesClient = new RatesClient();
export { SYMBOLS, RATES_KEY };
