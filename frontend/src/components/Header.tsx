import { useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { useNavigation } from "../context/NavigationContext";
import type { ViewId } from "../context/NavigationContext";
import Countdown from "./Countdown";
import RoleIndicator from "./RoleIndicator";
import HeaderProfileMenu from "./HeaderProfileMenu";

/** Header simplificado que usa el ThemeProvider global y delega el logout al perfil. */
export default function Header({ user, onSignOut }: { user?: { email: string } | null; onSignOut?: () => void }) {
  const { view, navigate } = useNavigation();
  const { colorMode } = useTheme();

  // Solo setear dark si el modo activo es auto (system) para que el ThemeProvider maneje la lógica completa
  // El dato colorMode aquí ya no controla el dark class aquí, ThemeProvider lo hace globalmente

  const go = (target: ViewId) => {
    navigate(target);
  };

  const navBtn = (target: ViewId, label: string) => {
    const active = view === target || (target === "home" && view !== "portal");
    return (
      <button
        type="button"
        onClick={() => go(target)}
        aria-current={active ? "page" : undefined}
        className={`cursor-pointer rounded-lg border-none px-3 py-2 text-sm font-medium transition-colors ${active ? "bg-primary-50 text-primary-800" : "bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900"}`}
      >
        {label}
      </button>
    );
  };

  const colorIcon = colorMode === "light" ? "☀" : colorMode === "dark" ? "☾" : "🌓";

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
            {navBtn("portal", "Portal")}{navBtn("home", "Curso")}
          </nav>
        </div>

        {/* Selector de tema delegado al ThemeProvider */}
        {/* Mostramos el icono simple y el ThemeSwitcher se encarga del resto */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-pressed={colorMode !== "light"}
            aria-label={
              colorMode === "light"
                ? "Cambiar a modo oscuro"
                : colorMode === "dark"
                  ? "Cambiar a modo automático"
                  : "Cambiar a modo claro"
            }
            title={
              colorMode === "light" ? "Modo oscuro" : colorMode === "dark" ? "Modo automático" : "Modo claro"
            }
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-sm text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <span aria-hidden="true">{colorIcon}</span>
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <RoleIndicator />
          <Countdown />
          <HeaderProfileMenu onSignOut={onSignOut} />
        </div>
      </div>
    </header>
  );
}