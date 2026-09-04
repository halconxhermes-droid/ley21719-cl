/**
 * LMSLayout — Corporate / Institucional
 * Sidebar colapsable con índice de módulos, progreso SENCE y métricas.
 */
import { useState } from "react";
import { useNavigation, type ViewId } from "../../context/NavigationContext";
import { useRol } from "../../context/RolContext";
import ExperienceSwitcher, { type ExperienceMode } from "../ExperienceSwitcher";
import ThemeSwitcher from "../ThemeSwitcher";

interface LMSLayoutProps {
  children: React.ReactNode;
}

const MODULE_ITEMS: { view: ViewId; label: string; icon: string }[] = [
  { view: "home", label: "Inicio del curso", icon: "⌂" },
  { view: "lector", label: "Lectura de módulos", icon: "📖" },
  { view: "quiz", label: "Quiz por módulo", icon: "✎" },
  { view: "checklist", label: "Mi checklist", icon: "✓" },
  { view: "practica", label: "Simulador práctico", icon: "⚖" },
  { view: "glosario", label: "Glosario A-Z", icon: "Aa" },
  { view: "testfinal", label: "Test final", icon: "□" },
];

export default function LMSLayout({ children }: LMSLayoutProps) {
  const { view, navigate } = useNavigation();
  const { rol } = useRol();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [experienceMode, setExperienceMode] = useState<ExperienceMode>("lms");

  return (
    <div className="flex min-h-screen flex-col" data-experience={experienceMode}>
      {/* ── Barra superior ── */}
      <header
        role="banner"
        className="sticky top-0 z-[100] flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 shadow-sm dark:border-slate-700 dark:bg-slate-900"
      >
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setSidebarOpen((o) => !o)}
            aria-label="Abrir/cerrar menú lateral"
            aria-expanded={sidebarOpen}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <span aria-hidden="true" className="text-xl leading-none">☰</span>
          </button>
          <button
            type="button"
            onClick={() => navigate("portal")}
            className="flex cursor-pointer items-center gap-2 border-none bg-transparent text-lg font-bold text-primary-900 dark:text-white"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true" className="h-8 w-8 shrink-0">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            Ley 21.719
          </button>
          {rol && (
            <span className="hidden rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-semibold text-primary-700 dark:bg-primary-900/40 dark:text-primary-300 sm:inline">
              {rol}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <ThemeSwitcher />
          <ExperienceSwitcher currentMode={experienceMode} onChange={setExperienceMode} />
        </div>
      </header>

      <div className="flex flex-1">
        {/* ── Sidebar ── */}
        <aside
          aria-label="Menú lateral"
          className={`${sidebarOpen ? "w-64" : "w-0 overflow-hidden"} relative z-[90] flex-shrink-0 border-r border-slate-200 bg-white transition-all duration-300 dark:border-slate-700 dark:bg-slate-900`}
        >
          <nav className="sticky top-16 h-[calc(100vh-4rem)] w-64 overflow-y-auto p-4">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
              Navegación del curso
            </p>
            <ul className="space-y-1">
              {MODULE_ITEMS.map((item) => (
                <li key={item.view}>
                  <button
                    type="button"
                    onClick={() => { navigate(item.view); setSidebarOpen(false); }}
                    aria-current={view === item.view ? "page" : undefined}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                      view === item.view
                        ? "bg-primary-50 text-primary-800 dark:bg-primary-900/30 dark:text-primary-200"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                    }`}
                  >
                    <span aria-hidden="true" className="text-base">{item.icon}</span>
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>

            <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
              <p className="mb-2 text-xs font-semibold text-slate-500 dark:text-slate-400">Progreso SENCE</p>
              <div className="mb-2 h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                <div className="h-full w-1/3 rounded-full bg-primary-500" />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">1 de 3 módulos completados</p>
            </div>
          </nav>
        </aside>

        {sidebarOpen && (
          <div
            aria-hidden="true"
            className="fixed inset-0 z-[80] bg-black/30 sm:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <main
          id="main-content"
          role="main"
          className="flex-1 overflow-x-hidden px-4 py-6 sm:px-8"
        >
          {children}
        </main>
      </div>
    </div>
  );
}