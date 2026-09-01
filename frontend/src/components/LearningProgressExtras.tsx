import type { ModuleSummary } from "../lib/api";
import { ROLE_LABELS, type Rol } from "../context/RolContext";

interface LearningProgressExtrasProps {
  modules: ModuleSummary[];
  progress: Record<string, number>;
  lastModuleId: string | null;
  role: Rol | null;
}

const HISTORY_KEY = "ley21719_activity_history";

interface ActivityEntry {
  moduleId: string;
  action: string;
  at: string;
}

function readHistory(): ActivityEntry[] {
  try {
    const raw = window.localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) as ActivityEntry[] : [];
  } catch { return []; }
}

function downloadProgress(modules: ModuleSummary[], progress: Record<string, number>, role: Rol | null) {
  const payload = {
    exportedAt: new Date().toISOString(),
    role: role ? ROLE_LABELS[role] : null,
    modules: modules.map((module) => ({
      id: module.id,
      title: module.title,
      progress: progress[module.id] ?? 0,
      status: (progress[module.id] ?? 0) >= 100 ? "completed" : (progress[module.id] ?? 0) > 0 ? "in_progress" : "not_started",
    })),
    history: readHistory(),
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "mi-avance-ley-21719.json";
  link.click();
  URL.revokeObjectURL(url);
}

export default function LearningProgressExtras({ modules, progress, lastModuleId, role }: LearningProgressExtrasProps) {
  const completed = modules.filter((module) => (progress[module.id] ?? 0) >= 100).length;
  const started = modules.filter((module) => (progress[module.id] ?? 0) > 0).length;
  const history = readHistory().slice(0, 4);
  const lastModule = modules.find((module) => module.id === lastModuleId);
  const badges = [
    { icon: "🚀", title: "Primer paso", description: "Iniciaste tu recorrido", unlocked: started >= 1 },
    { icon: "📖", title: "Constancia", description: "Completaste un módulo", unlocked: completed >= 1 },
    { icon: "🧭", title: "Explorador", description: "Avanzaste en tres módulos", unlocked: started >= 3 },
    { icon: "🏁", title: "Ruta completa", description: "Completaste todos los módulos", unlocked: modules.length > 0 && completed === modules.length },
  ];

  const recommendation = completed === modules.length && modules.length > 0
    ? "Has completado todos los módulos. Revisa tus resultados y consolida tus aprendizajes."
    : lastModule
      ? `Continúa con ${lastModule.title} para mantener tu ritmo de aprendizaje.`
      : "Comienza por el primer módulo y avanza a tu propio ritmo.";

  return (
    <section aria-labelledby="extras-title" className="mt-12 space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-primary-700">Tu avance</p>
          <h2 id="extras-title" className="mt-1 text-2xl font-semibold text-slate-900">Logros y próximos pasos</h2>
        </div>
        <button type="button" onClick={() => downloadProgress(modules, progress, role)} className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">↓ Descargar avance</button>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="font-semibold text-slate-900">Insignias</h3>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {badges.map((badge) => (
              <div key={badge.title} className={`rounded-xl border p-3 text-center ${badge.unlocked ? "border-emerald-200 bg-emerald-50" : "border-slate-200 bg-slate-50 opacity-55"}`} title={badge.description}>
                <div className="text-2xl" aria-hidden="true">{badge.icon}</div>
                <p className="mt-1 text-xs font-semibold text-slate-800">{badge.title}</p>
                <p className="mt-1 text-[11px] text-slate-500">{badge.unlocked ? "Desbloqueada" : "Pendiente"}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-2xl border border-primary-100 bg-primary-50 p-5 shadow-sm">
          <h3 className="font-semibold text-primary-900">Recomendación personalizada</h3>
          <p className="mt-2 text-sm leading-6 text-primary-900">{recommendation}</p>
          <p className="mt-3 text-xs text-primary-700">Basada en tu avance guardado en este dispositivo.</p>
        </article>
      </div>

      <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-semibold text-slate-900">Actividad reciente</h3>
          <span className="text-xs text-slate-500">Últimos movimientos</span>
        </div>
        {history.length > 0 ? (
          <ul className="mt-4 divide-y divide-slate-100">
            {history.map((entry, index) => {
              const module = modules.find((item) => item.id === entry.moduleId);
              return <li key={`${entry.at}-${index}`} className="flex justify-between gap-3 py-3 text-sm"><span className="text-slate-700">{entry.action} · {module?.title ?? entry.moduleId}</span><time className="shrink-0 text-xs text-slate-500" dateTime={entry.at}>{new Date(entry.at).toLocaleDateString("es-CL")}</time></li>;
            })}
          </ul>
        ) : <p className="mt-3 text-sm text-slate-500">Tu actividad aparecerá aquí cuando abras un módulo o completes una actividad.</p>}
      </article>
    </section>
  );
}
