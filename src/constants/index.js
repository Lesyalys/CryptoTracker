// export const API_BASE_URL = "https://api.coingecko.com/api/v3";
export const API_BASE_URL = "/api";

export const POLL_INTERVAL_MS = 40_000;

export const DEBOUNCE_DELAY_MS = 300;

export const STORAGE_KEY = "crypto-portfolio-v1";

export const BROADCAST_CHANNEL = "portfolio-sync";

//rates
export const RATES_KEY = "rates";
export const PATH = "https://www.cbr-xml-daily.ru/daily_json.js";
export const TTL = 60 * 60 * 1000; // 1 час

export const SYMBOLS = {
  RUB: "₽",
  USD: "$",
  EUR: "€",
  GBP: "£",
  JPY: "¥",
  CNY: "¥",
  KZT: "₸",
  UAH: "₴",
  TRY: "₺",
  BYN: "Br",
};

export const TIMEFRAME_DAYS = {
  "1d": 1,
  "7d": 7,
  "30d": 30,
  "365d": 365,
};

export const TIMEFRAMES = [
  { value: "1d", label: "1 день" },
  { value: "7d", label: "7 дней" },
  { value: "30d", label: "30 дней" },
  { value: "365d", label: "1 год" },
];

export const DEFAULT_FILTERS = {
  search: "",
  priceMin: null,
  priceMax: null,
  sortKey: "market_cap_rank",
  sortDirection: "asc",
};

export const TABLE_COLUMNS = [
  { key: null, label: "#" },
  { key: null, label: "Название" },
  { key: "current_price", label: "Цена", align: "right" },
  { key: "price_change_percentage_24h", label: "24ч", align: "right" },
  { key: "market_cap", label: "Капитализация", align: "right" },
];

export const CURRENCIES = {
  RUB: { name: "Российский рубль", symbol: "₽", rate: 1 },
  USD: { name: "Доллар США", symbol: "$", rate: 90 },
  EUR: { name: "Евро", symbol: "€", rate: 98 },
  GBP: { name: "Фунт стерлингов", symbol: "£", rate: 115 },
  JPY: { name: "Японская йена", symbol: "¥", rate: 0.6 },
  CNY: { name: "Китайский юань", symbol: "¥", rate: 12.5 },
  KZT: { name: "Казахстанский тенге", symbol: "₸", rate: 0.18 },
  UAH: { name: "Украинская гривна", symbol: "₴", rate: 2.2 },
  TRY: { name: "Турецкая лира", symbol: "₺", rate: 2.6 },
  BYN: { name: "Белорусский рубль", symbol: "Br", rate: 27 },
};
