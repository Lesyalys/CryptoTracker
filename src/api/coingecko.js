import { apiClient } from "./client";
import { TIMEFRAME_DAYS } from "../constants";

/**
 * Обёртка над CoinGecko API. Возвращает уже нормализованные данные.
 * Все методы async — UI не знает о деталях HTTP.
 */
class CoinGeckoApi {
  async fetchTopCoins(perPage = 100) {
    const { data } = await apiClient.http.get("/coins/markets", {
      params: {
        vs_currency: "usd",
        order: "market_cap_desc",
        per_page: perPage,
        page: 1,
        sparkline: false,
        price_change_percentage: "24h",
      },
    });
    return data;
  }

  async fetchGlobal() {
    const { data } = await apiClient.http.get("/global");
    const d = data.data;
    return {
      totalMarketCap: d.total_market_cap.usd,
      totalVolume: d.total_volume.usd,
      btcDominance: d.market_cap_percentage.btc,
      marketCapChange24h: d.market_cap_change_percentage_24h_usd,
    };
  }

  async fetchCoinHistory(coinId, timeframe) {
    const days = TIMEFRAME_DAYS[timeframe] ?? 1;
    const { data } = await apiClient.http.get(
      `/coins/${encodeURIComponent(coinId)}/market_chart`,
      { params: { vs_currency: "usd", days } },
    );
    return data.prices.map(([timestamp, price]) => ({ timestamp, price }));
  }

  async fetchCoinById(coinId) {
    const { data } = await apiClient.http.get("/coins/markets", {
      params: { vs_currency: "usd", ids: coinId, sparkline: false },
    });
    if (!data.length) throw new Error("Монета не найдена");
    return data[0];
  }
}

export const coinGeckoApi = new CoinGeckoApi();
