import { useEffect, useRef, useState } from "react";
import { ratesClient } from "../lib/rates";
import { CURRENCIES } from "../constants";
import { notify } from "../store/useNotifyStore";

// Флаг на уровне модуля — один раз за сессию
let fallbackNotified = false;

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
      })
      .catch((e) => {
        if (!mounted.current) return;
        setRates(CURRENCIES);
        setIsFallback(true);

        if (!fallbackNotified) {
          fallbackNotified = true;
          notify.warn(
            "Курсы валют недоступны",
            `${e?.message ?? "Ошибка"} Используются приблизительные офлайн-курсы.`,
          );
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
