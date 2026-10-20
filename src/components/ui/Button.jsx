const STYLES = {
  primary: "bg-indigo-600 hover:bg-indigo-500 text-white",
  ghost: "bg-slate-800 hover:bg-slate-700 text-slate-100",
  danger: "bg-red-600/20 text-red-300 hover:bg-red-600/30",
};

export function Button({ variant = "primary", className = "", ...props }) {
  return (
    <button
      {...props}
      className={`rounded-lg px-3 py-2 text-sm font-medium transition disabled:opacity-50 ${STYLES[variant]} ${className}`}
    />
  );
}
