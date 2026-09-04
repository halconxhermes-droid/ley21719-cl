/**
 * AcademyLayout — Gamificado / Microlearning
 * Bento Grid con ruta de aprendizaje, skill tree y badges de progreso.
 */
import { useState } from "react";
import { useNavigation } from "../../context/NavigationContext";
import ExperienceSwitcher, { type ExperienceMode } from "../ExperienceSwitcher";
import ThemeSwitcher from "../ThemeSwitcher";

interface AcademyLayoutProps {
  children: React.ReactNode;
}

const SKILL_TREE = [
  { id: "modulo-1", label: "Módulo 1: Principios y Definiciones", completed: true, xp: 200, view: "home" as const },
  { id: "modulo-2", label: "Módulo 2: Derechos del Titular", completed: false, xp: 200, view: "home" as const },
  { id: "modulo-3", label: "Módulo 3: Obligaciones del Responsable", completed: false, xp: 200, view: "home" as const },
  { id: "quiz-m1", label: "Quiz Módulo 1", completed: true, xp: 100, view: "quiz" as const },
  { id: "checklist", label: "Mi Checklist", completed: false, xp: 150, view: "checklist" as const },
  { id: "casos", label: "Casos Prácticos", completed: false, xp: 300, view: "practica" as const },
  { id: "test-final", label: "Test Final", completed: false, xp: 500, view: "testfinal" as const },
] as const;

export default function AcademyLayout({ children }: AcademyLayoutProps) {
  const { navigate } = useNavigation();
  const [experienceMode, setExperienceMode] = useState<ExperienceMode>("academy");
  const totalXP = SKILL_TREE.filter((s) => s.completed).reduce((acc, s) => acc + s.xp, 0);
  const completedCount = SKILL_TREE.filter((s) => s.completed).length;

  return (
    <div className="flex min-h-screen flex-col" data-experience="academy">
      <header
        role="banner"
        className="sticky top-0 z-[100] flex h-16 items-center justify-between border-b border-slate-200 bg-gradient-to-r from-cyan-50 to-blue-50 px-4 shadow-sm dark:border-slate-700 dark:from-slate-900 dark:to-slate-800"
      >
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate("portal")}
            className="flex cursor-pointer items-center gap-2 border-none bg-transparent text-xl font-black text-cyan-800 dark:text-cyan-300"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} aria-hidden="true" className="h-8 w-8 shrink-0">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            Ley 21.719
          </button>
          <span className="rounded-full bg-cyan-100 px-2.5 py-0.5 text-xs font-bold text-cyan-700 dark:bg-cyan-900/50 dark:text-cyan-300">
            ✦ Modo Academia
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-sm font-bold text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 sm:flex">
            ⚡ {totalXP} XP
          </div>
          <ThemeSwitcher />
          <ExperienceSwitcher currentMode={experienceMode} onChange={setExperienceMode} />
        </div>
      </header>

      <div className="flex flex-1">
        <aside
          aria-label="Ruta de aprendizaje"
          className="hidden w-72 flex-shrink-0 border-r border-slate-200 bg-gradient-to-b from-slate-50 to-cyan-50 p-4 dark:border-slate-700 dark:from-slate-900 dark:to-slate-900 sm:block"
        >
          <p className="mb-4 text-xs font-bold uppercase tracking-widest text-cyan-600 dark:text-cyan-400">
            Ruta de Aprendizaje
          </p>
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-cyan-100 bg-white p-3 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <div>
              <p className="text-sm font-bold text-slate-800 dark:text-white">{completedCount}/{SKILL_TREE.length} completados</p>
              <div className="mt-1.5 h-1.5 w-44 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"
                  style={{ width: `${(completedCount / SKILL_TREE.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
          <ul className="space-y-2">
            {SKILL_TREE.map((skill) => (
              <li key={skill.id}>
                <button
                  type="button"
                  onClick={() => navigate(skill.view)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-all duration-200 ${
                    skill.completed
                      ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300"
                      : "bg-white text-slate-600 shadow-sm hover:scale-[1.02] dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                  }`}
                >
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                      skill.completed
                        ? "bg-emerald-500 text-white"
                        : "border-2 border-slate-300 bg-white text-slate-400 dark:border-slate-600 dark:bg-slate-900"
                    }`}
                    aria-hidden="true"
                  >
                    {skill.completed ? "✓" : skill.id.split("-")[1]}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold">{skill.label}</p>
                    <p className="text-[10px] text-slate-400">{skill.xp} XP</p>
                  </div>
                </button>
                {skill.id !== "test-final" && (
                  <div className={`ml-3 h-3 w-0.5 rounded ${skill.completed ? "bg-emerald-300 dark:bg-emerald-700" : "bg-slate-200 dark:bg-slate-700"}`} aria-hidden="true" />
                )}
              </li>
            ))}
          </ul>
        </aside>
        <main
          id="main-content"
          role="main"
          className="flex-1 overflow-x-hidden bg-slate-50 px-4 py-6 dark:bg-slate-900 sm:px-8"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
