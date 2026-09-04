/**
 * LegalHubLayout — Herramienta Práctica / Split-screen
 * Pantalla dividida: lector a la izquierda, herramientas a la derecha.
 * Buscador global con Cmd+K / Ctrl+K.
 */
import { useEffect, useRef, useState } from "react";
import { useNavigation } from "../../context/NavigationContext";
import type { ViewId } from "../../context/NavigationContext";
import ExperienceSwitcher, { type ExperienceMode } from "../ExperienceSwitcher";
import ThemeSwitcher from "../ThemeSwitcher";

interface LegalHubLayoutProps {
  children: React.ReactNode;
}

const GLOBAL_ACTIONS: { label: string; description: string; view: ViewId; icon: string }[] = [
  { label: "Buscar artículos de la ley", description: "Busca por número de artículo, palabra clave o tema", view: "lector", icon: "⚖" },
  { label: "Matriz de riesgos", description: "Evalúa el nivel de riesgo de tu organización", view: "checklist", icon: "⚠" },
  { label: "Simulador de multas", description: "Calcula la multa potencial según el tipo de infracción", view: "practica", icon: "💰" },
  { label: "Generador DPIA", description: "Documento de Evaluación de Impacto en Protección de Datos", view: "practica", icon: "📋" },
  { label: "Glosario AGEPRODAT", description: "Definiciones oficiales de términos técnicos", view: "glosario", icon: "Aa" },
  { label: "Verificar certificado", description: "Valida un certificado SENCE existente", view: "verificar", icon: "✓" },
];

export default function LegalHubLayout({ children }: LegalHubLayoutProps) {
  const { view, navigate } = useNavigation();
  const [experienceMode, setExperienceMode] = useState<ExperienceMode>("hub");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Atajo de teclado Cmd+K / Ctrl+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === "Escape") setSearchOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Focus input cuando se abre
  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus();
  }, [searchOpen]);

  const filtered = searchQuery.trim()
    ? GLOBAL_ACTIONS.filter(
        (a) =>
          a.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : GLOBAL_ACTIONS;

  return (
    <div className="flex min-h-screen flex-col" data-experience={experienceMode}>
      {/* ── Barra superior ── */}
      <header
        role="banner"
        className="sticky top-0 z-[100] flex h-16 items-center justify-between border-b border-slate-700 bg-slate-900 px-4 shadow-md"
      >
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate("portal")}
            className="flex cursor-pointer items-center gap-2 border-none bg-transparent text-xl font-black text-amber-400"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} aria-hidden="true" className="h-8 w-8 shrink-0">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            Ley 21.719
          </button>
          <span className="hidden rounded-full bg-amber-900/50 px-2.5 py-0.5 text-xs font-bold text-amber-400 sm:inline">
            ⚖ Modo Legal Hub
          </span>
        </div>

        {/* Buscador global */}
        <button
          type="button"
          onClick={() => setSearchOpen(true)}
          aria-label="Abrir buscador global (Cmd+K)"
          className="hidden max-w-sm items-center gap-2 rounded-lg border border-slate-600 bg-slate-800 px-4 py-2 text-sm text-slate-400 hover:border-slate-500 hover:text-slate-200 sm:flex"
        >
          <span aria-hidden="true">🔍</span>
          <span>Buscar herramientas, artículos, términos…</span>
          <kbd className="ml-4 rounded bg-slate-700 px-1.5 py-0.5 text-xs font-mono text-slate-400">⌘K</kbd>
        </button>

        <div className="flex items-center gap-2">
          <ThemeSwitcher />
          <ExperienceSwitcher currentMode={experienceMode} onChange={setExperienceMode} />
        </div>
      </header>

      <div className="flex flex-1">
        {/* ── Panel de herramientas rápido ── */}
        <aside
          aria-label="Herramientas legales"
          className="hidden w-72 flex-shrink-0 border-r border-slate-700 bg-slate-900 p-4 dark:block sm:block"
        >
          <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-amber-500">
            Herramientas
          </p>

          <ul className="space-y-1.5">
            {GLOBAL_ACTIONS.map((action) => (
              <li key={action.label}>
                <button
                  type="button"
                  onClick={() => navigate(action.view)}
                  className={`flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                    view === action.view
                      ? "bg-amber-900/40 text-amber-300"
                      : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                  }`}
                >
                  <span aria-hidden="true" className="mt-0.5 text-base">{action.icon}</span>
                  <div>
                    <p className="font-medium">{action.label}</p>
                    <p className="mt-0.5 text-xs text-slate-500">{action.description}</p>
                  </div>
                </button>
              </li>
            ))}
          </ul>

          {/* Info de multas */}
          <div className="mt-6 rounded-xl border border-amber-900/50 bg-amber-950/30 p-4">
            <p className="mb-1 text-xs font-bold text-amber-500">Multas según Ley 21.719</p>
            <div className="space-y-1 text-xs text-slate-400">
              <p>• Art. 47: hasta <strong className="text-amber-400">20.000 UTM</strong></p>
              <p>• Art. 48: hasta <strong className="text-amber-400">10.000 UTM</strong></p>
              <p>• Art. 49: hasta <strong className="text-amber-400">5.000 UTM</strong></p>
            </div>
          </div>
        </aside>

        {/* ── Área de contenido ── */}
        <main
          id="main-content"
          role="main"
          className="flex-1 overflow-x-hidden bg-slate-100 px-4 py-6 dark:bg-slate-950 sm:px-8"
        >
          {children}
        </main>
      </div>

      {/* ── Buscador global overlay (Cmd+K) ── */}
      {searchOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Buscador global"
          className="fixed inset-0 z-[200] flex items-start justify-center pt-[15vh]"
        >
          {/* Backdrop */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-black/60"
            onClick={() => setSearchOpen(false)}
          />
          {/* Panel */}
          <div className="relative z-10 w-full max-w-lg rounded-2xl border border-slate-600 bg-slate-900 shadow-2xl">
            <div className="flex items-center gap-3 border-b border-slate-700 px-4 py-3">
              <span aria-hidden="true" className="text-lg">🔍</span>
              <input
                ref={searchInputRef}
                type="search"
                placeholder="Buscar herramientas, artículos, términos…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 border-none bg-transparent text-sm text-white placeholder-slate-500 outline-none"
                aria-label="Búsqueda"
              />
              <kbd className="rounded bg-slate-700 px-1.5 py-0.5 text-xs font-mono text-slate-400">Esc</kbd>
            </div>
            <ul className="max-h-80 overflow-y-auto p-2" role="listbox">
              {filtered.length === 0 ? (
                <li className="px-4 py-6 text-center text-sm text-slate-500">
                  No se encontraron resultados para "{searchQuery}"
                </li>
              ) : (
                filtered.map((action) => (
                  <li key={action.label}>
                    <button
                      type="button"
                      onClick={() => { navigate(action.view); setSearchOpen(false); }}
                      className="flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-slate-300 hover:bg-slate-800 hover:text-white"
                    >
                      <span aria-hidden="true" className="mt-0.5 text-base">{action.icon}</span>
                      <div>
                        <p className="font-medium">{action.label}</p>
                        <p className="text-xs text-slate-500">{action.description}</p>
                      </div>
                    </button>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
