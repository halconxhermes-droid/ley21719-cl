import { useEffect, useState } from "react";
import { useNavigation } from "../context/NavigationContext";
import {
  getModule,
  getQuiz,
  getModules,
  type ModuleDetail,
  type ModuleResponse,
  type ModuleSummary,
  type Quiz,
  type ReadLevel,
} from "../lib/api";
import { mdToHtml, linkifyTerms } from "../lib/markdown";
import { Loading, ErrorPanel } from "../components/Feedback";
import ModuleVideos from "../components/ModuleVideos";
import CapsulasRol from "../components/CapsulasRol";

type LevelTab = "resumen" | "amigable" | "legal";

const LEVEL_LABELS: Record<LevelTab, string> = {
  resumen: "Resumen",
  amigable: "Explicación amigable",
  legal: "Texto legal completo",
};

/** Tab del mockup → nivel del contrato API */
const TAB_TO_LEVEL: Record<LevelTab, ReadLevel> = {
  resumen: "summary",
  amigable: "friendly",
  legal: "legal",
};

function getEstimatedMinutes(level: ReadLevel, est?: { summary?: number; friendly?: number; legal?: number }): string {
  const val = est?.[level];
  return val !== undefined ? `${val} min` : "";
}

function getFriendlyHtml(m: ModuleDetail): string {
  const sections = m.levels.friendly?.sections ?? [];
  return sections
    .map((sec) => {
      const parts: string[] = [];
      if (sec.heading) parts.push(`## ${sec.heading}`);
      if (sec.content) {
        const content = sec.content.replace(/^#+\s*/gm, "");
        parts.push(content);
      }
      if (sec.scenarios) {
        sec.scenarios.forEach((sc) => {
          parts.push(`> **${sc.title}**`);
          if (sc.content) parts.push(`> ${sc.content}`);
        });
      }
      if (sec.keyFacts) {
        sec.keyFacts.forEach((kf) => {
          parts.push(`- **${kf.text}**`);
        });
      }
      return parts.join("\n");
    })
    .join("\n\n");
}

function renderLevel(m: ModuleDetail, level: ReadLevel): string {
  const friendlyLevel = m.levels.friendly;
  const friendlyTerms = friendlyLevel?.glossaryTerms ?? [];

  switch (level) {
    case "summary": {
      const s = m.levels.summary;
      const lines = [`## ${s.title}`];
      s.bullets.forEach((b) => lines.push(`- ${b}`));
      if (s.keyTerms?.length) {
        lines.push("");
        lines.push(`**Términos clave:** ${s.keyTerms.join(", ")}`);
      }
      const terms = [...(s.keyTerms ?? []), ...friendlyTerms];
      const html = linkifyTerms(mdToHtml(lines.join("\n")), [...new Set(terms)]);
      return html;
    }
    case "friendly": {
      const html = mdToHtml(getFriendlyHtml(m));
      return linkifyTerms(html, [...new Set(friendlyTerms)]);
    }
    case "legal": {
      const articles = m.levels.legal?.articles ?? [];
      const html = articles.map((a) => `## ${a.number} — ${a.title}\n\n${a.text}`).join("\n\n");
      return linkifyTerms(mdToHtml(html), [...new Set(friendlyTerms)]);
    }
    default:
      return "";
  }
}

function getScenario(m: ModuleDetail): { title: string; content: string } | null {
  const sections = m.levels.friendly?.sections ?? [];
  for (const sec of sections) {
    if (sec.scenarios?.length) {
      return { title: sec.scenarios[0].title, content: sec.scenarios[0].content ?? "" };
    }
  }
  return null;
}

export default function LectorModulo() {
  const { moduleId, navigate } = useNavigation();
  const [mod, setMod] = useState<ModuleDetail | null>(null);
  const [courseModules, setCourseModules] = useState<ModuleSummary[]>([]);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [level, setLevel] = useState<LevelTab>("resumen");

  useEffect(() => {
    let alive = true;
    setError(null);
    setMod(null);
    getModule(moduleId)
      .then((res: ModuleResponse) => {
        if (!alive) return;
        setMod(res.module);
        getModules()
          .then((modulesRes) => {
            if (alive && Array.isArray(modulesRes.modules)) {
              setCourseModules(modulesRes.modules.slice().sort((a, b) => a.order - b.order));
            }
          })
          .catch(() => {
            // La navegación sigue funcionando con el módulo actual aunque falle el catálogo.
          });
        return getQuiz(moduleId).then((qr) => {
          if (alive) setQuiz(qr.quiz);
        });
      })
      .catch((e: Error) => {
        if (alive) setError(e.message);
      });
    return () => { alive = false; };
  }, [moduleId]);

  if (error) return <ErrorPanel message={error} onRetry={() => window.location.reload()} />;
  if (!mod) return <Loading label="Cargando módulo…" />;

  // estimatedMinutes: summary/friendly lo traen del API; legal se estima (texto completo)
  const est: { summary?: number; friendly?: number; legal?: number } = {
    summary: mod.levels.summary?.estimatedMinutes,
    friendly: mod.levels.friendly?.estimatedMinutes,
    legal: 25,
  };

  const currentIndex = courseModules.findIndex((item) => item.id === moduleId);
  const previousModule = currentIndex > 0 ? courseModules[currentIndex - 1] : null;
  const nextModule = currentIndex >= 0 && currentIndex < courseModules.length - 1
    ? courseModules[currentIndex + 1]
    : null;

  return (
    <section aria-labelledby="lector-title">
      {/* Breadcrumb y contexto */}
      <nav aria-label="Ruta de navegación" className="mb-5 text-sm text-slate-500">
        <button type="button" onClick={() => navigate("home")} className="hover:text-primary-700 hover:underline">Curso</button>
        <span className="mx-2" aria-hidden="true">/</span>
        <span className="font-medium text-slate-700">Módulo {mod.order}</span>
        <span className="mx-2" aria-hidden="true">/</span>
        <span aria-current="page">Lectura</span>
      </nav>

      {/* Cabecera uniforme de unidad */}
      <header className="mb-6 rounded-2xl bg-gradient-to-br from-primary-900 to-primary-700 p-6 text-white shadow-sm sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary-100">Módulo {mod.order} · Unidad de aprendizaje</p>
            <h1 id="lector-title" className="text-2xl font-bold leading-tight sm:text-3xl">{mod.title}</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-primary-50">Explora el contenido en el nivel que prefieras, aplica lo aprendido en un escenario y comprueba tu avance con el quiz.</p>
          </div>
          <div className="rounded-xl bg-white/10 px-4 py-3 text-right text-sm">
            <p className="text-primary-100">Tiempo estimado</p>
            <p className="mt-1 text-xl font-bold">{getEstimatedMinutes(level as ReadLevel, est) || "—"}</p>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-2 text-xs font-medium">
          <span className="rounded-full bg-white/15 px-3 py-1.5">Lectura guiada</span>
          <span className="rounded-full bg-white/15 px-3 py-1.5">Caso práctico</span>
          <span className="rounded-full bg-white/15 px-3 py-1.5">Quiz de unidad</span>
        </div>
      </header>

      {/* Ruta de la unidad */}
      <aside aria-label="Ruta de la unidad" className="mb-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Ruta de aprendizaje</p>
        <ol className="grid gap-2 text-sm sm:grid-cols-4">
          {[
            ["01", "Comprende", true],
            ["02", "Aplica", Boolean(getScenario(mod))],
            ["03", "Practica", Boolean(quiz)],
            ["04", "Comprueba", false],
          ].map(([number, label, active]) => (
            <li key={String(number)} className={`flex items-center gap-2 rounded-lg px-3 py-2 ${active ? "bg-primary-50 text-primary-800" : "bg-slate-50 text-slate-500"}`}>
              <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${active ? "bg-primary-700 text-white" : "bg-slate-200 text-slate-600"}`}>{number}</span>
              <span className="font-medium">{label}</span>
            </li>
          ))}
        </ol>
      </aside>

      {/* Selector de nivel */}
      <div className="mb-6 flex flex-wrap gap-2" role="group" aria-label="Nivel de lectura">
        {(["resumen", "amigable", "legal"] as LevelTab[]).map((lv) => (
          <button
            key={lv}
            type="button"
            onClick={() => setLevel(lv)}
            aria-pressed={lv === level}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
              lv === level
                ? "border-primary-700 bg-primary-700 text-white"
                : "border-slate-300 bg-white text-slate-700 hover:border-primary-500 hover:text-primary-700"
            }`}
          >
            {LEVEL_LABELS[lv]} {getEstimatedMinutes(lv as ReadLevel, est) ? `· ${getEstimatedMinutes(lv as ReadLevel, est)}` : ""}
          </button>
        ))}
      </div>

      {/* Módulo card */}
      <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <header className="mb-6 flex flex-wrap items-start justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h2 className="m-0 text-xl font-semibold">Contenido de la unidad</h2>
            <p className="m-0 mt-1 text-sm text-slate-600">
              Tiempo de lectura estimado:{" "}
              <span className="font-medium">{getEstimatedMinutes(level as ReadLevel, est) || "—"}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate("quiz", { moduleId: moduleId })}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-primary-700 px-4 py-2 font-medium text-white hover:bg-primary-800"
          >
            Ir al quiz del módulo →
          </button>
        </header>

        <div className="reader-content" role="document">
          <div dangerouslySetInnerHTML={{ __html: renderLevel(mod, TAB_TO_LEVEL[level]) }} />
        </div>

        {/* Scenario box */}
        {(() => {
          const scenario = getScenario(mod);
          if (!scenario) return null;
          return (
            <aside
              aria-label="Escenario ¿Qué pasa si...?"
              className="mt-6 rounded-lg border-l-4 border-info-text border-l-info-border bg-info-bg p-4"
              style={{ borderLeftColor: "#0369a1" }}
            >
              <h4 className="mb-2 font-medium" style={{ color: "#0369a1" }}>
                {scenario.title}
              </h4>
              <div
                className="reader-content"
                dangerouslySetInnerHTML={{ __html: mdToHtml(scenario.content) }}
              />
            </aside>
          );
        })()}

        {/* Videos YouTube del curso para este módulo */}
        <ModuleVideos moduleId={moduleId} />

        {/* Cápsulas serie 40 (canal @FantasyTalesUniverse) */}
        <CapsulasRol moduleId={moduleId} />
      </article>

      {/* Navegación entre módulos */}
      <nav aria-label="Navegación entre módulos" className="mt-6 grid gap-3 sm:grid-cols-2">
        {previousModule ? (
          <button type="button" onClick={() => navigate("lector", { moduleId: previousModule.id })} className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-left font-medium text-slate-700 hover:border-primary-500 hover:bg-slate-50">
            <span className="block text-xs font-normal text-slate-500">← Módulo anterior</span>
            <span className="mt-1 block">{previousModule.title}</span>
          </button>
        ) : <span />}
        {nextModule ? (
          <button type="button" onClick={() => navigate("lector", { moduleId: nextModule.id })} className="rounded-xl bg-primary-700 px-4 py-3 text-right font-medium text-white hover:bg-primary-800">
            <span className="block text-xs font-normal text-primary-100">Siguiente módulo →</span>
            <span className="mt-1 block">{nextModule.title}</span>
          </button>
        ) : (
          <button type="button" onClick={() => navigate("home")} className="rounded-xl bg-primary-700 px-4 py-3 text-right font-medium text-white hover:bg-primary-800">
            <span className="block text-xs font-normal text-primary-100">Ruta completada</span>
            <span className="mt-1 block">Volver al curso →</span>
          </button>
        )}
      </nav>
    </section>
  );
}
