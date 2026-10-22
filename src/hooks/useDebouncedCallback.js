import { useEffect, useMemo, useRef } from "react";
import { debounce } from "../lib/debounce";

/**
 * Хук-обёртка над собственной функцией debounce из lib/debounce.js.
 *
 * хук
 *  - React должен уметь отменить таймер при unmount (cleanup);
 *  - ссылка на обёртку должна быть стабильной между рендерами,
 *    иначе debounce будет пересоздаваться и терять таймер.
 *
 * @param {Function} fn — функция, которую нужно дебаунсить
 * @param {number} delay — задержка в мс
 * @returns {Function} стабильная debounced-обёртка
 */
export function useDebouncedCallback(fn, delay = 300) {
  const fnRef = useRef(fn);
  useEffect(() => {
    fnRef.current = fn;
  }, [fn]);

  const debounced = useMemo(
    () => debounce((...args) => fnRef.current(...args), delay),
    [delay],
  );

  useEffect(() => {
    return () => {
      debounced.cancel?.();
    };
  }, [debounced]);

  return debounced;
}
