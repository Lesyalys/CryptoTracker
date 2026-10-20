import { NavLink } from "react-router-dom";
import { useMarketStore } from "../../store/useMarketStore";
import { Spinner } from "../ui/Spinner";

const navClass = ({ isActive }) =>
  `px-3 py-1.5 rounded-lg text-sm ${isActive ? "bg-indigo-600" : "hover:bg-slate-800"}`;

export function Header() {
  const refreshing = useMarketStore((s) => s.refreshing);
  return (
    <header className="sticky top-0 z-30 border-b border-slate-800 bg-slate-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="text-lg font-bold tracking-tight">
            ₿ CryptoTracker
          </span>
          {refreshing && <Spinner />}
        </div>
        <nav className="flex gap-1">
          <NavLink to="/" className={navClass} end>
            Рынок
          </NavLink>
          <NavLink to="/portfolio" className={navClass}>
            Портфель
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
