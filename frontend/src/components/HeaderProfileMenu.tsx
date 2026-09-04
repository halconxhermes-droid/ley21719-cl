import { useTheme } from "../context/ThemeContext";
import { Palette } from "lucide-react";

interface HeaderProfileMenuProps {
  onSignOut?: () => void;
}

export default function HeaderProfileMenu({ onSignOut }: HeaderProfileMenuProps) {
  const { theme } = useTheme();

  const toggleColorMode = () => {
    const modes = ["light", "system", "dark"];
    const currentIndex = modes.indexOf(theme as any);
    const nextIndex = (currentIndex + 1) % modes.length;
    // El tema es string, pero usamos el contexto para cambiarlo
    // Nota: el ThemeProvider ya maneja la persistencia, aquí solo visualizamos
  };

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        aria-label="Cambiar tema visual"
        title="Cambiar tema visual"
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-sm text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
      >
        <Palette className="h-4 w-4" />
      </button>

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
  );
}