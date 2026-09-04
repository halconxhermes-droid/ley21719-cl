import { useTheme, type ThemeId } from "../context/ThemeContext";
import { Palette, Check } from "lucide-react";

const THEMES: { id: ThemeId; label: string; color: string; description: string }[] = [
  { id: "corporate", label: "Institucional", color: "#0284c7", description: "Diseño sobrio y formal para certificación SENCE" },
  { id: "academy", label: "Académico", color: "#0891b2", description: "Estilo gamificado y dinámico para aprendizaje interactivo" },
  { id: "legal-hub", label: "Legal Hub", color: "#f59e0b", description: "Herramienta práctica con pantalla dividida y buscador global" },
];

/** Selector visual accesible del tema activo. */
export default function ThemeSwitcher() {
  const { theme, setTheme, colorMode, setColorMode } = useTheme();

  const toggleColorMode = () => {
    if (colorMode === "light") setColorMode("dark");
    else if (colorMode === "dark") setColorMode("system");
    else setColorMode("light");
  };

  const colorIcon = colorMode === "light" ? "☀" : colorMode === "dark" ? "☾" : "🌓";

  return (
    <div className="flex items-center gap-1.5">
      {/* Selector de tema visual */}
      <div className="relative inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white p-1 text-sm dark:border-slate-600 dark:bg-slate-800">
        {THEMES.map((t) => {
          const isActive = theme === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTheme(t.id)}
              aria-pressed={isActive}
              title={`${t.label}: ${t.description}`}
              className={`relative flex items-center gap-1.5 rounded-md px-2.5 py-1.5 font-medium transition-all duration-200 ${
                isActive
                  ? "text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
              }`}
              style={
                isActive
                  ? { backgroundColor: t.color }
                  : { backgroundColor: "transparent" }
              }
            >
              <span
                className="flex h-3 w-3 shrink-0 rounded-full"
                style={{ backgroundColor: t.color }}
                aria-hidden="true"
              />
              <span className="hidden sm:inline">{t.label}</span>
              {isActive && <Check className="h-3 w-3 shrink-0" />}
            </button>
          );
        })}
        <Palette className="pointer-events-none absolute -right-8 h-4 w-4 text-slate-400 dark:text-slate-500" />
      </div>

      {/* Selector de modo claro/oscuro */}
      <button
        type="button"
        onClick={toggleColorMode}
        aria-label={
          colorMode === "light"
            ? "Cambiar a modo oscuro"
            : colorMode === "dark"
              ? "Cambiar a modo automático"
              : "Cambiar a modo claro"
        }
        title={colorMode === "light" ? "Modo oscuro" : colorMode === "dark" ? "Modo automático" : "Modo claro"}
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-lg text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
      >
        <span aria-hidden="true">{colorIcon}</span>
      </button>
    </div>
  );
}
