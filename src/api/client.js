import axios from "axios";
import { API_BASE_URL } from "../constants";

export class HttpError extends Error {
  constructor(message, status, kind) {
    super(message);
    this.name = "HttpError";
    this.status = status;
    this.kind = kind; // 'rate-limit' | 'timeout' | 'network' | 'server'
    this.isRateLimit = kind === "rate-limit";
  }
}

export class ApiClient {
  constructor(baseURL) {
    this.http = axios.create({ baseURL, timeout: 15000 });

    this.http.interceptors.response.use(
      (res) => res,
      (err) => {
        const status = err.response?.status ?? 0;

        if (status === 429) {
          return Promise.reject(
            new HttpError(
              "Превышен лимит запросов к API. Попробуйте чуть позже.",
              status,
              "rate-limit",
            ),
          );
        }
        if (err.code === "ECONNABORTED") {
          return Promise.reject(
            new HttpError(
              "Превышено время ожидания ответа сервера.",
              status,
              "timeout",
            ),
          );
        }
        if (!err.response) {
          return Promise.reject(
            new HttpError(
              "Не удалось связаться с сервером. Проверьте интернет.",
              status,
              "network",
            ),
          );
        }
        return Promise.reject(
          new HttpError(
            `Сервер вернул ошибку ${status}. Попробуйте позже.`,
            status,
            "server",
          ),
        );
      },
    );
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
