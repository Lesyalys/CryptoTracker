export function Spinner({ size = 16 }) {
  return (
    <span
      className="inline-block animate-spin rounded-full border-2 border-slate-600 border-t-white"
      style={{ width: size, height: size }}
    />
  );
}
