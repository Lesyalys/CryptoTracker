/**
 * Возвращает обёрнутую функцию, которая выполнится не раньше,
 * чем через delay мс после последнего вызова.
 *
 * У обёртки есть метод cancel() — отменяет запланированный вызов.
 * Нужен для cleanup в React (useEffect) и в любом месте,
 * где жизненный цикл контролируется вручную.
 */
export function debounce(fn, delay) {
  let timer = null;

  const wrapped = (...args) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      fn(...args);
    }, delay);
  };

  wrapped.cancel = () => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  };

  return wrapped;
}
