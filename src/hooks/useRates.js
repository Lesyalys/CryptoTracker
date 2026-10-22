import { useEffect, useRef, useState } from "react";
import { ratesClient, RateError } from "../lib/rates";
import { CURRENCIES } from "../constants";
import { notify } from "../store/useNotifyStore";

let fallbackNotified = false;

function fallbackMessage(e) {
  if (e instanceof RateError) {
    if (e.kind === "rate-limit") {
      return "Превышен лимит запросов к ЦБ. Показываем офлайн-курсы.";
    }
    if (e.kind === "network") {
      return "Нет связи с сервером ЦБ. Показываем офлайн-курсы.";
    }
    if (e.kind === "server") {
      return "Сервер ЦБ недоступен. Показываем офлайн-курсы.";
    }
  }
  return "Курсы недоступны. Показываем офлайн-курсы.";
}

export function useRates() {
  const [rates, setRates] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFallback, setIsFallback] = useState(false);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;

    ratesClient
      .load()
      .then((data) => {
        if (!mounted.current) return;
        setRates(data);
        setIsFallback(false);
        fallbackNotified = false;
      })
      .catch((e) => {
        if (!mounted.current) return;
        setRates(CURRENCIES);
        setIsFallback(true);

        if (!fallbackNotified) {
          fallbackNotified = true;
          notify.warn("Курсы валют недоступны", fallbackMessage(e), {
            key: "rates-fallback",
          });
        }
      })
      .finally(() => {
        if (mounted.current) setLoading(false);
      });

    return () => {
      mounted.current = false;
    };
  }, []);

  return { rates, loading, isFallback };
}
