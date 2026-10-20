import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Toaster } from "../ui/Toaster";
import { useStorageSync } from "../../hooks/useStorageSync";

export function Layout() {
  useStorageSync();
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">
        <Outlet />
      </main>
      <Toaster />
    </div>
  );
}
