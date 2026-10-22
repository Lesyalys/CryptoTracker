import { Link } from "react-router-dom";

export function BackLink({ to = "/", children = "← На главную" }) {
  return (
    <Link
      to={to}
      className="inline-block text-sm text-indigo-400 hover:underline"
    >
      {children}
    </Link>
  );
}
