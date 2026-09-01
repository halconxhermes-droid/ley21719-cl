import { useState } from "react";
import { useNavigation } from "../context/NavigationContext";
import type { ViewId } from "../context/NavigationContext";
import Countdown from "./Countdown";
import RoleIndicator from "./RoleIndicator";

interface HeaderProps {
  user?: { email: string } | null;
  onSignOut?: () => void;
}

/** Header sticky con logo, nav Portal/Curso, cuenta regresiva viva, indicador de rol y logout opcional. */
export default function Header({ user, onSignOut }: HeaderProps) {
  const { view, navigate } = useNavigation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const go = (target: ViewId) => {
    navigate(target);
    setMobileOpen(false);
  };

  const navBtn = (target: ViewId, label: string) => {
    const active = view === target || (target === "home" && view !== "portal");
    return (
      <button
        type="button"
        onClick={() => go(target)}
        aria-current={active ? "page" : undefined}
        className={`cursor-pointer rounded-lg border-none px-3 py-2 text-sm font-medium transition-colors ${
          active
            ? "bg-primary-50 text-primary-800"
            : "bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900"
        }`}
      >
        {label}
      </button>
    );
  };

  return (
    <header
      role="banner"
      className="sticky top-0 z-[100] border-b border-slate-200 bg-white"
    >
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6 sm:py-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate("portal")}
            aria-label="Ley 21.719 - Portal"
            className="flex cursor-pointer items-center gap-3 border-none bg-transparent p-0 text-lg font-bold text-primary-900 sm:text-xl"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
              className="h-9 w-9 shrink-0"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            Ley 21.719
          </button>
          <nav aria-label="Navegación principal" className="ml-2 hidden sm:flex sm:items-center sm:gap-1">
            {navBtn("portal", "Portal")}
            {navBtn("home", "Curso")}
          </nav>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <RoleIndicator />
          <Countdown />
          <button
            type="button"
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
            aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
            onClick={() => setMobileOpen((open) => !open)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 sm:hidden"
          >
            <span aria-hidden="true" className="text-xl leading-none">{mobileOpen ? "×" : "☰"}</span>
          </button>
          {user && (
            <div className="flex items-center gap-2">
              <span className="hidden text-xs text-slate-500 sm:inline" title={user.email}>
                {user.email.split("@")[0]}
              </span>
              {onSignOut && (
                <button
                  type="button"
                  onClick={onSignOut}
                  className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
                  title="Cerrar sesión"
                >
                  Salir
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      {mobileOpen && (
        <nav id="mobile-navigation" aria-label="Navegación móvil" className="border-t border-slate-200 bg-slate-50 px-4 py-3 sm:hidden">
          <div className="mx-auto grid max-w-5xl gap-1">
            {[
              ["portal", "Portal informativo"],
              ["home", "Curso"],
              ["checklist", "Mi checklist"],
              ["glosario", "Glosario"],
              ["testfinal", "Test final"],
            ].map(([target, label]) => (
              <button
                key={target}
                type="button"
                onClick={() => go(target as ViewId)}
                className={`rounded-lg px-3 py-3 text-left text-sm font-medium ${view === target ? "bg-primary-100 text-primary-800" : "text-slate-700 hover:bg-white"}`}
                aria-current={view === target ? "page" : undefined}
              >
                {label}
              </button>
            ))}
          </div>
        </nav>
      )}
      <nav aria-label="Acceso rápido móvil" className="fixed inset-x-0 bottom-0 z-[90] grid grid-cols-4 border-t border-slate-200 bg-white/95 shadow-[0_-4px_12px_rgba(15,23,42,0.08)] backdrop-blur sm:hidden">
        {[
          ["home", "Inicio", "⌂"],
          ["checklist", "Checklist", "✓"],
          ["glosario", "Glosario", "Aa"],
          ["testfinal", "Test final", "□"],
        ].map(([target, label, icon]) => (
          <button
            key={target}
            type="button"
            onClick={() => go(target as ViewId)}
            aria-current={view === target ? "page" : undefined}
            className={`flex min-h-14 flex-col items-center justify-center gap-0.5 px-1 text-[11px] font-medium ${view === target ? "bg-primary-50 text-primary-800" : "text-slate-600 hover:bg-slate-50"}`}
          >
            <span aria-hidden="true" className="text-base leading-5">{icon}</span>
            <span>{label}</span>
          </button>
        ))}
      </nav>
    </header>
  );
}
