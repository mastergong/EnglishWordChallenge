import type { ReactNode } from "react";
import { NavLink, useLocation } from "react-router-dom";

export function Layout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const immersive = location.pathname === "/game";
  if (immersive) {
    return <div className="h-dvh overflow-hidden">{children}</div>;
  }
  return (
    <div className="mx-auto min-h-dvh w-full min-w-0 max-w-lg overflow-x-hidden px-4 pb-24 pt-6">
      {children}
      <nav
        className="fixed bottom-0 left-0 right-0 z-20 border-t border-white/40 bg-white/85 backdrop-blur dark:bg-slate-950/80"
        aria-label="Main"
      >
        <div className="mx-auto grid max-w-lg grid-cols-6 gap-0.5 px-1 py-2 text-[10px] font-semibold">
          <Tab to="/" label="Home" icon="🏠" />
          <Tab to="/daily" label="Daily" icon="📅" />
          <Tab to="/map" label="Map" icon="🧠" />
          <Tab to="/practice" label="Practice" icon="📖" />
          <Tab to="/stats" label="Stats" icon="📊" />
          <Tab to="/settings" label="Settings" icon="⚙️" />
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
          isActive ? "bg-indigo-600 text-white" : "text-slate-500"
        }`
      }
    >
      <span aria-hidden>{icon}</span>
      {label}
    </NavLink>
  );
}
