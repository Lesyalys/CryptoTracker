export const API_BASE_URL = "https://api.coingecko.com/api/v3";

export const RATES_KEY = "rates";
export const RATES_URL = "https://www.cbr-xml-daily.ru/daily_json.js";
export const RATES_TTL = 60 * 60 * 1000; // 1 час

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

export const POLL_INTERVAL_MS = 60_000;
export const POLL_INTERVAL_RATE_LIMIT_MS = 300_000;

export const DEBOUNCE_DELAY_MS = 300;

export const STORAGE_KEY = "crypto-portfolio-v1";
export const BROADCAST_CHANNEL = "portfolio-sync";

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

export const FALLBACK_COINS = [
  {
    id: "bitcoin",
    symbol: "btc",
    name: "Bitcoin",
    image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
    current_price: 60000,
    market_cap: 1_180_000_000_000,
    market_cap_rank: 1,
    price_change_percentage_24h: 0,
  },
  {
    id: "ethereum",
    symbol: "eth",
    name: "Ethereum",
    image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
    current_price: 3000,
    market_cap: 360_000_000_000,
    market_cap_rank: 2,
    price_change_percentage_24h: 0,
  },
  {
    id: "tether",
    symbol: "usdt",
    name: "Tether",
    image: "https://assets.coingecko.com/coins/images/325/large/Tether.png",
    current_price: 1,
    market_cap: 110_000_000_000,
    market_cap_rank: 3,
    price_change_percentage_24h: 0,
  },
  {
    id: "bnb",
    symbol: "bnb",
    name: "BNB",
    image:
      "https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png",
    current_price: 600,
    market_cap: 90_000_000_000,
    market_cap_rank: 4,
    price_change_percentage_24h: 0,
  },
  {
    id: "solana",
    symbol: "sol",
    name: "Solana",
    image: "https://assets.coingecko.com/coins/images/4128/large/solana.png",
    current_price: 150,
    market_cap: 70_000_000_000,
    market_cap_rank: 5,
    price_change_percentage_24h: 0,
  },
  {
    id: "usd-coin",
    symbol: "usdc",
    name: "USDC",
    image: "https://assets.coingecko.com/coins/images/6319/large/usdc.png",
    current_price: 1,
    market_cap: 40_000_000_000,
    market_cap_rank: 6,
    price_change_percentage_24h: 0,
  },
  {
    id: "xrp",
    symbol: "xrp",
    name: "XRP",
    image:
      "https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png",
    current_price: 0.5,
    market_cap: 28_000_000_000,
    market_cap_rank: 7,
    price_change_percentage_24h: 0,
  },
  {
    id: "dogecoin",
    symbol: "doge",
    name: "Dogecoin",
    image: "https://assets.coingecko.com/coins/images/5/large/dogecoin.png",
    current_price: 0.15,
    market_cap: 22_000_000_000,
    market_cap_rank: 8,
    price_change_percentage_24h: 0,
  },
  {
    id: "cardano",
    symbol: "ada",
    name: "Cardano",
    image: "https://assets.coingecko.com/coins/images/975/large/cardano.png",
    current_price: 0.4,
    market_cap: 14_000_000_000,
    market_cap_rank: 9,
    price_change_percentage_24h: 0,
  },
  {
    id: "tron",
    symbol: "trx",
    name: "TRON",
    image: "https://assets.coingecko.com/coins/images/1094/large/tron-logo.png",
    current_price: 0.12,
    market_cap: 11_000_000_000,
    market_cap_rank: 10,
    price_change_percentage_24h: 0,
  },
];

export const FALLBACK_GLOBAL = {
  totalMarketCap: 2_300_000_000_000,
  totalVolume: 95_000_000_000,
  btcDominance: 52.4,
  marketCapChange24h: 0,
};
