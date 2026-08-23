import { useEffect, useState } from "react";
import Countdown from "../components/Countdown";
import { ROLES, ROLE_LABELS, useRol } from "../context/RolContext";
import type { Rol } from "../context/RolContext";
import { useNavigation } from "../context/NavigationContext";
import { getModules } from "../lib/api";
import type { ModuleSummary } from "../lib/api";
import { Loading, ErrorPanel } from "../components/Feedback";

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

/** VISTA 1: Home + selector de rol + hero con cuenta regresiva. */
export default function Home() {
  const { rol, setRol } = useRol();
  const { navigate } = useNavigation();
  const [modules, setModules] = useState<ModuleSummary[] | null>(null);
  const [error, setError] = useState<string | null>(null);

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

      {/* SELECTOR DE ROL */}
      <div className="mt-12">
        <h2 id="home-title" className="mb-1 text-2xl font-semibold">
          ¿Quién eres? Personaliza tu experiencia
        </h2>
        <p className="text-slate-600">Selecciona tu rol para personalizar checklist y textos.</p>
      </div>

      <div role="group" aria-label="Selector de rol" className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 max-md:grid-cols-1">
        {ROLES.map((r) => {
          const selected = rol === r;
          return (
            <button
              key={r}
              type="button"
              onClick={() => setRol(r)}
              aria-pressed={selected}
              className={`relative cursor-pointer rounded-xl border-2 border-solid bg-white p-6 text-left transition-all duration-200 hover:border-primary-500 hover:shadow-md ${
                selected ? "border-primary-700 bg-primary-50" : "border-slate-200"
              }`}
            >
              {selected ? (
                <span
                  aria-hidden="true"
                  className="absolute -top-0.5 right-[-2px] flex h-6 w-6 items-center justify-center rounded-full bg-primary-700 text-xs font-bold text-white"
                >
                  ✓
                </span>
              ) : null}
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                aria-hidden="true"
                className="mb-3 h-12 w-12 text-primary-700"
              >
                <path d={ROLE_ICONS[r] || "M12 16v-4M12 8h.01 M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20"} />
              </svg>
              <h3 className="mb-2 text-lg font-semibold text-slate-900">{ROLE_LABELS[r]}</h3>
              <p className="m-0 mb-4 text-sm text-slate-600">{ROLE_DESCRIPTIONS[r]}</p>
              <span
                aria-hidden="true"
                className="inline-flex min-h-9 items-center rounded-md bg-primary-700 px-4 py-2 text-sm font-medium text-white"
              >
                Empezar como {ROLE_LABELS[r].split(" /")[0]}
              </span>
            </button>
          );
        })}
      </div>

      {/* MÓDULOS */}
      <div className="mt-12">
        <h2 className="mb-1 text-2xl font-semibold">Módulos del curso</h2>
        <p className="text-slate-600">
          Cuatro rutas de lectura según tu rol. Cada módulo tiene resumen, explicación amigable,
          texto legal, quiz y videos.
        </p>
      </div>

      {!modules && !error && <Loading label="Cargando módulos…" />}
      {error && <ErrorPanel message={error} onRetry={() => window.location.reload()} />}

      {modules && (
        <ol className="m-0 mt-6 grid list-none gap-4 p-0 md:grid-cols-2">
          {modules.map((m) => (
            <li key={m.id}>
              <button
                type="button"
                onClick={() => navigate("lector", { moduleId: m.id })}
                className="w-full cursor-pointer rounded-xl border border-solid border-slate-200 bg-white p-6 text-left shadow-sm transition-all duration-200 hover:border-primary-500 hover:shadow-md"
              >
                <span className="mr-2 inline-block rounded-full bg-primary-50 px-2 py-0.5 text-xs font-semibold text-primary-800">
                  Módulo {m.order}
                </span>
                <h3 className="my-2 text-lg font-semibold text-slate-900">{m.title}</h3>
                <p className="m-0 mb-3 line-clamp-2 text-sm text-slate-600">{m.description}</p>
                <span className="text-sm font-medium text-primary-700">
                  Lectura: {m.estimatedMinutes.summary}/{m.estimatedMinutes.friendly}/
                  {m.estimatedMinutes.legal} min · Ver módulo →
                </span>
              </button>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

