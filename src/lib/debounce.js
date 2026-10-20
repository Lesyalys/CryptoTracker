/**
 * Возвращает обёрнутую функцию, которая выполнится не раньше,
 * чем через delay мс после последнего вызова.
 */
export function debounce(fn, delay) {
  let timer = null;
  return (...args) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
