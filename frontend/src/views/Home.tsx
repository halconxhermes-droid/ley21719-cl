import { useEffect, useState } from "react";
import Countdown from "../components/Countdown";
import { ROLES, ROLE_LABELS, useRol } from "../context/RolContext";
import type { Rol } from "../context/RolContext";
import { useNavigation } from "../context/NavigationContext";
import { getModules } from "../lib/api";
import type { ModuleSummary } from "../lib/api";
import { Loading, ErrorPanel } from "../components/Feedback";
import ProgressBar from "../components/ProgressBar";
import LearningProgressExtras from "../components/LearningProgressExtras";

const ROLE_ICONS: Record<Rol, string> = {
  empresa: "M3 21h18M5 21V7l7-4 7 4v14M9 21v-4a3 3 0 0 1 6 0v4",
  ciudadano: "",
  desarrollador: "M16 18l6-6-6-6M8 6l-6 6 6 6",
  institucion: "M3 21h18M4 21V10l8-6 8 6v11M9 21v-6h6v6",
};

const ROLE_DESCRIPTIONS: Record<Rol, string> = {
  empresa:
    "Responsables y encargados de tratamiento: obligaciones legales, multas y cumplimiento.",
  ciudadano:
    "Ejerce tus derechos ARSOP+: acceso, rectificación, supresión, oposición, portabilidad.",
  desarrollador:
    "Consentimiento explícito, seudonimización, EIPD y medidas de seguridad.",
  institucion: "Transparencia, RAT, AGEPRODAT y plazos de respuesta a titulares.",
};

const MODULE_PROGRESS_KEY = "ley21719_module_progress";
const LAST_MODULE_KEY = "ley21719_last_module";

function readModuleProgress(): Record<string, number> {
  try {
    const raw = window.localStorage.getItem(MODULE_PROGRESS_KEY);
    return raw ? JSON.parse(raw) as Record<string, number> : {};
  } catch {
    return {};
  }
}

/** VISTA 1: Home + selector de rol + hero con cuenta regresiva. */
export default function Home() {
  const { rol, setRol } = useRol();
  const { navigate } = useNavigation();
  const [modules, setModules] = useState<ModuleSummary[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [moduleProgress] = useState<Record<string, number>>(readModuleProgress);
  const [lastModuleId, setLastModuleId] = useState<string | null>(() => {
    try { return window.localStorage.getItem(LAST_MODULE_KEY); } catch { return null; }
  });

  useEffect(() => {
    let alive = true;
    getModules()
      .then((res) => {
        if (alive) setModules(res.modules);
      })
      .catch((e: Error) => {
        if (alive) setError(e.message);
      });
    return () => {
      alive = false;
    };
  }, []);

  const openModule = (moduleId: string) => {
    setLastModuleId(moduleId);
    try {
      window.localStorage.setItem(LAST_MODULE_KEY, moduleId);
      const raw = window.localStorage.getItem("ley21719_activity_history");
      const history = raw ? JSON.parse(raw) as { moduleId: string; action: string; at: string }[] : [];
      history.unshift({ moduleId, action: "Módulo abierto", at: new Date().toISOString() });
      window.localStorage.setItem("ley21719_activity_history", JSON.stringify(history.slice(0, 20)));
    } catch { /* noop */ }
    navigate("lector", { moduleId });
  };

  const completedModules = modules?.filter((m) => (moduleProgress[m.id] ?? 0) >= 100).length ?? 0;
  const overallProgress = modules?.length
    ? Math.round(modules.reduce((sum, m) => sum + (moduleProgress[m.id] ?? 0), 0) / modules.length)
    : 0;
  const continueModule = modules?.find((m) => m.id === lastModuleId) ?? modules?.[0];

  return (
    <section aria-labelledby="home-title">
      {/* HERO */}
      <div
        className="rounded-xl px-6 py-8 text-center text-white"
        style={{
          background: "linear-gradient(135deg, var(--color-primary-900), var(--color-primary-700))",
        }}
      >
        <p className="mb-2 text-xs uppercase tracking-[0.1em] opacity-85">
          Web educativa · Ley 21.719
        </p>
        <h1
          id="home-hero-title"
          className="mx-auto mb-4 max-w-3xl font-bold leading-tight"
          style={{ fontSize: "clamp(1.75rem, 5vw, 2.75rem)" }}
        >
          Ley 21.719: Protección de Datos Personales en Chile
        </h1>
        <p className="mx-auto mb-6 max-w-xl text-lg opacity-95">
          Nueva ley de protección de datos personales para Chile —{" "}
          <strong>vigencia plena: 1&nbsp;de diciembre de 2026</strong>.
        </p>
        <div className="mx-auto max-w-2xl rounded-xl bg-white/10 px-6 py-4">
          <p className="m-0 text-sm opacity-90">
            Cuenta regresiva a la vigencia plena (actualizada cada segundo):
          </p>
          <Countdown hero />
        </div>
      </div>

      {/* PANEL DE APRENDIZAJE */}
      <div className="mt-10 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-primary-700">Tu recorrido</p>
              <h2 className="mt-1 text-2xl font-semibold text-slate-900">Continúa donde quedaste</h2>
              <p className="mt-2 text-sm text-slate-600">
                Avanza a tu ritmo. El progreso se guarda en este dispositivo.
              </p>
            </div>
            <span className="rounded-full bg-primary-50 px-3 py-1 text-sm font-bold text-primary-800">{overallProgress}%</span>
          </div>
          <div className="mt-5"><ProgressBar value={overallProgress} ariaLabel="Progreso general del curso" /></div>
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-slate-50 p-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Siguiente actividad</p>
              <p className="mt-1 font-semibold text-slate-900">
                {continueModule ? `Módulo ${continueModule.order}: ${continueModule.title}` : "Cargando módulos…"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => continueModule && openModule(continueModule.id)}
              disabled={!continueModule}
              className="rounded-lg bg-primary-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Continuar →
            </button>
          </div>
        </article>
        <aside className="grid grid-cols-2 gap-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Módulos completados</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">{completedModules}<span className="text-lg font-medium text-slate-400">/{modules?.length ?? "—"}</span></p>
            <p className="mt-1 text-xs text-slate-500">Sigue avanzando</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Tu perfil</p>
            <p className="mt-2 text-lg font-bold text-slate-900">{rol ? ROLE_LABELS[rol] : "Sin elegir"}</p>
            <p className="mt-1 text-xs text-slate-500">Personaliza tu ruta</p>
          </div>
        </aside>
      </div>

      {/* SELECTOR DE ROL */}
      <div className="mt-12">
        <h2 id="home-title" className="mb-1 text-2xl font-semibold">¿Quién eres? Personaliza tu experiencia</h2>
        <p className="text-slate-600">Selecciona tu rol para personalizar checklist y textos.</p>
      </div>

      <div role="group" aria-label="Selector de rol" className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {ROLES.map((r) => {
          const selected = rol === r;
          return (
            <button key={r} type="button" onClick={() => setRol(r)} aria-pressed={selected}
              className={`relative cursor-pointer rounded-xl border-2 border-solid bg-white p-6 text-left transition-all duration-200 hover:border-primary-500 hover:shadow-md ${selected ? "border-primary-700 bg-primary-50" : "border-slate-200"}`}>
              {selected ? <span aria-hidden="true" className="absolute -top-0.5 right-[-2px] flex h-6 w-6 items-center justify-center rounded-full bg-primary-700 text-xs font-bold text-white">✓</span> : null}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true" className="mb-3 h-12 w-12 text-primary-700"><path d={ROLE_ICONS[r] || "M12 16v-4M12 8h.01 M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20"} /></svg>
              <h3 className="mb-2 text-lg font-semibold text-slate-900">{ROLE_LABELS[r]}</h3>
              <p className="m-0 mb-4 text-sm text-slate-600">{ROLE_DESCRIPTIONS[r]}</p>
              <span aria-hidden="true" className="inline-flex min-h-9 items-center rounded-md bg-primary-700 px-4 py-2 text-sm font-medium text-white">Elegir perfil</span>
            </button>
          );
        })}
      </div>

      {/* MÓDULOS */}
      <div className="mt-12">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="mb-1 text-2xl font-semibold">Ruta de aprendizaje</h2>
            <p className="text-slate-600">Cada módulo combina lectura, actividad práctica y evaluación.</p>
          </div>
          <span className="text-sm font-medium text-slate-500">{completedModules} de {modules?.length ?? "—"} completados</span>
        </div>
      </div>

      {!modules && !error && <Loading label="Cargando módulos…" />}
      {error && <ErrorPanel message={error} onRetry={() => window.location.reload()} />}

      {modules && (
        <ol className="m-0 mt-6 grid list-none gap-4 p-0 md:grid-cols-2">
          {modules.map((m) => {
            const progress = Math.max(0, Math.min(100, moduleProgress[m.id] ?? 0));
            const complete = progress >= 100;
            return (
              <li key={m.id}>
                <button type="button" onClick={() => openModule(m.id)}
                  className="group w-full cursor-pointer rounded-2xl border border-solid border-slate-200 bg-white p-6 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary-500 hover:shadow-md">
                  <div className="flex items-start justify-between gap-3">
                    <span className="rounded-full bg-primary-50 px-2.5 py-1 text-xs font-semibold text-primary-800">Módulo {m.order}</span>
                    <span className={`text-xs font-semibold ${complete ? "text-emerald-700" : "text-slate-500"}`}>{complete ? "✓ Completado" : progress ? "En progreso" : "No iniciado"}</span>
                  </div>
                  <h3 className="my-3 text-lg font-semibold text-slate-900 group-hover:text-primary-800">{m.title}</h3>
                  <p className="m-0 line-clamp-2 text-sm text-slate-600">{m.description}</p>
                  <div className="mt-5"><ProgressBar value={progress} label={`${progress}% completado`} ariaLabel={`Progreso de ${m.title}`} /></div>
                  <p className="mt-4 text-sm font-medium text-primary-700">{m.estimatedMinutes.summary}/{m.estimatedMinutes.friendly}/{m.estimatedMinutes.legal} min de lectura · Abrir módulo →</p>
                </button>
              </li>
            );
          })}
        </ol>
      )}

      {modules && <LearningProgressExtras modules={modules} progress={moduleProgress} lastModuleId={lastModuleId} role={rol} />}
    </section>
  );
}

