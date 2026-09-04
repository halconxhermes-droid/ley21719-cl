import { LayoutDashboard, Library, Split } from "lucide-react";

export type ExperienceMode = "lms" | "academy" | "hub";

const EXPERIENCES: { id: ExperienceMode; label: string; icon: React.ReactNode; description: string }[] = [
  { id: "lms", label: "Modo LMS", icon: <LayoutDashboard />, description: "Curso estructurado con sidebar colapsable y dashboard SENCE" },
  { id: "academy", label: "Modo Academia", icon: <Library />, description: "Ruta interactiva tipo Bento Grid con skills tree y badges" },
  { id: "hub", label: "Modo Legal Hub", icon: <Split />, description: "Pantalla dividida con buscador global y herramientas legales" },
];

interface ExperienceSwitcherProps {
  currentMode: ExperienceMode;
  onChange: (mode: ExperienceMode) => void;
}

/** Selector visual accesible del modo de experiencia. */
export default function ExperienceSwitcher({ currentMode, onChange }: ExperienceSwitcherProps) {
  return (
    <div className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white p-1 text-sm dark:border-slate-600 dark:bg-slate-800">
      {EXPERIENCES.map((exp) => {
        const isActive = currentMode === exp.id;
        return (
          <button
            key={exp.id}
            type="button"
            onClick={() => onChange(exp.id)}
            aria-pressed={isActive}
            title={exp.description}
            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 font-medium transition-colors ${
              isActive
                ? "bg-primary-100 text-primary-800 dark:bg-slate-700 dark:text-white"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-700"
            }`}
          >
            <span className="flex h-4 w-4 items-center justify-center">{exp.icon}</span>
            {exp.label}
          </button>
        );
      })}
    </div>
  );
}
