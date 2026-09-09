import type { ReactNode } from "react";
import { NavLink, useLocation } from "react-router-dom";

export function Layout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const immersive = location.pathname === "/game";
  if (immersive) {
    return <div className="h-dvh overflow-hidden">{children}</div>;
  }
  return (
    <div className="font-game relative min-h-dvh text-slate-800 dark:text-rose-50">
      <div className="game-blob pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-rose-200/40" />
      <div className="game-blob pointer-events-none absolute -right-20 top-1/3 h-64 w-64 rounded-full bg-amber-100/50" />
      <div className="game-blob pointer-events-none absolute -bottom-10 left-10 h-64 w-64 rounded-full bg-sky-100/55" />
      <div className="relative z-10 mx-auto min-h-dvh w-full min-w-0 max-w-lg overflow-x-hidden px-4 pb-[max(6.5rem,calc(5.25rem+env(safe-area-inset-bottom)))] pt-[max(1.5rem,env(safe-area-inset-top))]">
        {children}
      </div>
      <nav
        className="fixed bottom-0 left-0 right-0 z-20 border-t border-rose-100 bg-white/95 pb-[max(0.5rem,env(safe-area-inset-bottom))] backdrop-blur dark:border-white/15 dark:bg-[#4a3a4c]/92"
        aria-label="Main"
      >
        <div className="mx-auto grid max-w-lg grid-cols-6 gap-0.5 px-1 py-2 text-[10px] font-semibold">
          <Tab to="/" label="บ้าน" icon="🏠" />
          <Tab to="/daily" label="วันนี้" icon="☀️" />
          <Tab to="/map" label="แผนที่" icon="🗺️" />
          <Tab to="/practice" label="ฝึก" icon="🧸" />
          <Tab to="/stats" label="สถิติ" icon="⭐" />
          <Tab to="/settings" label="ตั้งค่า" icon="🎀" />
        </div>
      </nav>
    </div>
  );
}

function Tab({ to, label, icon }: { to: string; label: string; icon: string }) {
  return (
    <NavLink
      to={to}
      end={to === "/"}
      className={({ isActive }) =>
        `flex min-h-11 flex-col items-center justify-center rounded-2xl ${
          isActive ? "bg-gradient-to-b from-rose-400 to-rose-500 text-white shadow-[0_3px_0_0_#e11d48]" : "text-rose-400"
        }`
      }
    >
      <span aria-hidden>{icon}</span>
      {label}
    </NavLink>
  );
}
