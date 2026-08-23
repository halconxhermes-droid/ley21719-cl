import { useEffect, useState } from "react";
import { useNavigation } from "../context/NavigationContext";
import {
  getModule,
  getQuiz,
  type ModuleDetail,
  type ModuleResponse,
  type Quiz,
  type ReadLevel,
} from "../lib/api";
import { mdToHtml, linkifyTerms } from "../lib/markdown";
import { Loading, ErrorPanel } from "../components/Feedback";
import ModuleVideos from "../components/ModuleVideos";

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

  return (
    <section aria-labelledby="lector-title">
      {/* Toolbar de nivel */}
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
            <h2 id="lector-title" className="m-0 text-2xl font-semibold">{mod.title}</h2>
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
      </article>

      {/* Navegación inferior */}
      <div className="mt-6 flex flex-wrap justify-between gap-4">
        <button
          type="button"
          onClick={() => navigate("home")}
          className="rounded-md border border-slate-300 bg-white px-4 py-2 font-medium text-slate-700 hover:bg-slate-50"
        >
          ← Volver al inicio
        </button>
        <button
          type="button"
          onClick={() => navigate("quiz", { moduleId: moduleId })}
          className="rounded-md bg-primary-700 px-4 py-2 font-medium text-white hover:bg-primary-800"
        >
          Quiz del módulo →
        </button>
      </div>
    </section>
  );
}
