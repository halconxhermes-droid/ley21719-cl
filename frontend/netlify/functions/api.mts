/* ── Netlify Function: InsForge API adapter ────────────────────────
   Reemplaza el backend Fly.io. Consulta InsForge REST directamente.
   Compatible con frontend/src/lib/api.ts sin cambios.
------------------------------------------------------------------- */
import type { Context } from "@netlify/functions";

const INSFORGE = "https://7cn2ezja.us-east.insforge.app";
const API_KEY = process.env.INSFORGE_API_KEY || "ik_c9a1dd3bfe6a1f5d465946e624e3cb0c";

const HDR = { Authorization: `Bearer ${API_KEY}` };

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, Accept",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

const json = (status: number, body: unknown) => ({
  statusCode: status,
  headers: { "Content-Type": "application/json", ...CORS },
  body: JSON.stringify(body),
});

/* GET helper → InsForge REST, con fallback a [] si la tabla no existe */
async function records(table: string, query = "") {
  const url = `${INSFORGE}/api/database/records/${table}${query ? `?${query}` : ""}`;
  try {
    const r = await fetch(url, { headers: HDR });
    if (!r.ok) {
      console.error(`InsForge ${url} -> ${r.status}`);
      return [];
    }
    return await r.json();
  } catch (e) {
    console.error(`Error fetching ${table}: ${e}`);
    return [];
  }
}

/* ── Section title lookup ── */
const SECTION_TITLES: Record<string, Record<string, string>> = {
  empresas: {
    gobernanza: "Gobernanza y políticas",
    "derechos-arsop": "Derechos y solicitudes (ARSOP)",
    "seguridad-brechas": "Seguridad y brechas",
    "proveedores-transferencias": "Proveedores y transferencias",
    "cultura-cumplimiento": "Cultura y cumplimiento continuo",
  },
  ciudadanos: {
    gobernanza: "Tus derechos fundamentales",
    "derechos-arsop": "Ejercer tus derechos",
    "seguridad-brechas": "Cuándo preocuparse",
    "cultura-cumplimiento": "Mejores prácticas",
  },
  desarrolladores: {
    gobernanza: "Privacidad por diseño",
    "derechos-arsop": "DPA y herramientas",
    "seguridad-brechas": "Seguridad técnica",
    "cultura-cumplimiento": "Operación continua",
  },
  "instituciones-publicas": {
    gobernanza: "Marcos institucionales",
    "derechos-arsop": "Transparencia activa",
    "seguridad-brechas": "Procedimientos internos",
    "cultura-cumplimiento": "Cultura institucional",
  },
};

function sectionTitle(role: string, sectionId: string): string {
  return SECTION_TITLES[role]?.[sectionId] || sectionId;
}

/* ── Router ── */
async function handle(path: string, method: string, body: any) {
  const segments = path.split("/").filter(Boolean); // ['api','v1','modules',... ]

  /* /api/v1/modules */
  if (path === "api/v1/modules") {
    const rows = await records("modules");
    const modules = rows.map((r: any) => {
      const levels = JSON.parse(r.levels_json || "{}");
      return {
        id: r.id,
        title: r.title,
        slug: r.slug,
        order: r.ordering,
        estimatedMinutes: {
          summary: levels.summary?.estimatedMinutes ?? 0,
          friendly: levels.friendly?.estimatedMinutes ?? 0,
          legal: levels.legal?.estimatedMinutes ?? 0,
        },
        description: r.description,
      };
    });
    return json(200, { modules, total: modules.length });
  }

  /* /api/v1/modules/:id */
  if (path.startsWith("api/v1/modules/") && method === "GET") {
    const modId = segments[3];
    const rows = await records("modules", `id=eq.${modId}`);
    if (!rows.length) return json(200, { module: null });
    const r = rows[0];
    const levels = JSON.parse(r.levels_json || "{}");
    const module = {
      id: r.id,
      title: r.title,
      slug: r.slug,
      order: r.ordering,
      estimatedMinutes: {
        summary: levels.summary?.estimatedMinutes ?? 0,
        friendly: levels.friendly?.estimatedMinutes ?? 0,
        legal: levels.legal?.estimatedMinutes ?? 0,
      },
      levels: {
        summary: levels.summary || { title: "", estimatedMinutes: 0, bullets: [] },
        friendly: levels.friendly || {
          title: "", estimatedMinutes: 0, sections: [], glossaryTerms: [],
        },
        legal: levels.legal || { title: "", articles: [] },
      },
    };
    return json(200, { module });
  }

  /* /api/v1/quizzes/:moduleId */
  if (path.startsWith("api/v1/quizzes/") && method === "GET") {
    const modId = segments[3];
    const rows = await records("quizzes", `module_id=eq.${modId}`);
    if (!rows.length) return json(200, { quiz: { moduleId, questions: [], totalQuestions: 0 } });
    const questions = JSON.parse(rows[0].questions_json || "[]");
    // anti-trampa: NO enviar correctIndex en GET
    const safe = questions.map((q: any) => ({
      id: q.id,
      text: q.text,
      options: q.options || [],
      explanation: q.explanation ?? "",
    }));
    return json(200, { quiz: { moduleId: modId, questions: safe, totalQuestions: safe.length } });
  }

  /* /api/v1/quizzes/:moduleId/submit */
  if (path.startsWith("api/v1/quizzes/") && path.endsWith("/submit") && method === "POST") {
    const modId = segments[3];
    const answers: number[] = body?.answers ?? [];
    const rows = await records("quizzes", `module_id=eq.${modId}`);
    const questions = rows.length ? JSON.parse(rows[0].questions_json || "[]") : [];
    let score = 0;
    const correctIndices: number[] = [];
    const explanations: { questionId: string; correctIndex: number; explanation: string }[] = [];
    questions.forEach((q: any, i: number) => {
      const ci = q.correctIndex;
      correctIndices.push(ci);
      explanations.push({
        questionId: q.id,
        correctIndex: ci,
        explanation: q.explanation ?? "",
      });
      if (answers[i] !== undefined && answers[i] === ci) score++;
    });
    const total = questions.length;
    const result = { score, total, passed: score >= Math.ceil(total / 2), correctIndices, explanations };
    return json(200, { result });
  }

  /* /api/v1/checklist/:role */
  if (path.startsWith("api/v1/checklist/") && method === "GET") {
    const role = segments[3];
    const items = await records("checklist_items", `role=eq.${role}`);
    const progressRows = await records("checklist_progress", `role=eq.${role}`);
    const doneMap: Record<string, boolean> = {};
    progressRows.forEach((p: any) => { doneMap[p.item_id] = p.completed; });

    // agrupar por section_id en orden
    const bySection: Record<string, any[]> = {};
    items.forEach((it: any) => {
      const s = it.section_id;
      if (!bySection[s]) bySection[s] = [];
      bySection[s].push(it);
    });
    Object.values(bySection).forEach((arr) => arr.sort((a, b) => a.item_order - b.item_order));
    const sectionIds = Object.keys(bySection).sort((a, b) =>
      (items.find((i: any) => i.section_id === a)?.item_order || 0) -
      (items.find((i: any) => i.section_id === b)?.item_order || 0)
    );

    const sections = sectionIds.map((sid, idx) => ({
      id: sid,
      title: sectionTitle(role, sid),
      order: idx,
      items: bySection[sid].map((it: any) => ({
        id: it.item_id,
        text: it.text,
        legalRef: it.legal_ref,
        guideUrl: it.guide_url,
        completed: doneMap[it.item_id] ?? false,
      })),
    }));

    const total = items.length;
    const completed = items.filter((it: any) => doneMap[it.item_id]).length;
    const progress = { completed, total, percentage: total ? Math.round((completed / total) * 100) : 0 };
    return json(200, { checklist: { role, sections, progress } });
  }

  /* /api/v1/checklist/:role (POST) */
  if (path.startsWith("api/v1/checklist/") && method === "POST") {
    const role = segments[3];
    const posted: { id: string; completed: boolean }[] = body?.items ?? [];
    // upsert fila por fila
    for (const it of posted) {
      const url = `${INSFORGE}/api/database/records/checklist_progress`;
      const existing = await records("checklist_progress", `role=eq.${role}&item_id=eq.${it.item_id}`);
      const payload = { role, item_id: it.item_id, completed: it.completed };
      if (existing.length) {
        await fetch(`${url}?role=eq.${role}&item_id=eq.${it.item_id}`, {
          method: "PATCH", headers: { ...HDR, "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch(url, {
          method: "POST", headers: { ...HDR, "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
    }
    // recalcular progreso
    const items = await records("checklist_items", `role=eq.${role}`);
    const doneMap: Record<string, boolean> = {};
    (await records("checklist_progress", `role=eq.${role}`)).forEach((p: any) => {
      doneMap[p.item_id] = p.completed;
    });
    const total = items.length;
    const completed = items.filter((it: any) => doneMap[it.item_id]).length;
    const progress = { completed, total, percentage: total ? Math.round((completed / total) * 100) : 0 };
    return json(200, { checklist: { role, progress } });
  }

  /* /api/v1/glossary/:termId  (debe ir antes que :q genérico) */
  if (path === "api/v1/glossary" || path === "api/v1/glossary/") {
    const rows = await records("glossary");
    const terms = rows.map((r: any) => ({
      id: r.id, term: r.term, definition: r.definition,
      category: r.category, legalRef: r.legal_ref,
    }));
    return json(200, { terms, total: terms.length });
  }

  /* /api/v1/glossary/:termId */
  if (segments[2] === "glossary" && segments.length === 4) {
    const tid = segments[3];
    const rows = await records("glossary", `id=eq.${tid}`);
    if (!rows.length) return json(404, { error: { code: "NOT_FOUND", message: "Glossary term not found" } });
    const r = rows[0];
    let related: any[] = [];
    try { related = JSON.parse(r.related_terms_json || "[]"); } catch { related = []; }
    const term = {
      id: r.id, term: r.term, definition: r.definition,
      category: r.category, legalRef: r.legal_ref, relatedTerms: related,
    };
    return json(200, { term });
  }

  /* /api/v1/final-test */
  if (path === "api/v1/final-test" && method === "GET") {
    const rows = await records("final_test");
    const questions = rows.map((r: any) => {
      let opts: any[] = [];
      try { opts = JSON.parse(r.options_json || "[]"); } catch { opts = []; }
      return { id: r.question_id, moduleId: r.module_id, text: r.text, options: opts };
    });
    return json(200, { test: { questions, totalQuestions: questions.length, passThreshold: 7 } });
  }

  /* /api/v1/final-test/submit */
  if (path === "api/v1/final-test/submit" && method === "POST") {
    const answers: number[] = body?.answers ?? [];
    const rows = await records("final_test");
    let score = 0;
    const detailByModule: Record<string, { correct: number; total: number }> = {};
    rows.forEach((r: any, i: number) => {
      const modId = r.module_id;
      if (!detailByModule[modId]) detailByModule[modId] = { correct: 0, total: 0 };
      detailByModule[modId].total++;
      const ci = r.correct_index;
      if (answers[i] !== undefined && answers[i] === ci) {
        score++;
        detailByModule[modId].correct++;
      }
    });
    const total = rows.length;
    const percentage = total ? Math.round((score / total) * 100) : 0;
    return json(200, {
      result: {
        score, total, percentage,
        passed: percentage >= 70,
        detailByModule: Object.entries(detailByModule).map(([moduleId, v]) => ({
          moduleId,
          correct: v.correct,
          total: v.total,
          percentage: v.total ? Math.round((v.correct / v.total) * 100) : 0,
        })),
        certificateEligible: percentage >= 70,
      },
    });
  }

  /* fallback */
  return json(404, { error: { code: "NOT_FOUND", message: `Unknown route: ${path}` } });
}

/* ── Netlify Function v2 entry ── */
export default async (req: Request, ctx: Context) => {
  const url = new URL(req.url);
  const path = url.pathname.replace(/^\//, "");
  const method = req.method;

  if (method === "OPTIONS") return json(204, null as any);

  let body: any = null;
  if (method === "POST") {
    try { body = await req.json(); } catch { body = null; }
  }

  try {
    return await handle(path, method, body);
  } catch (e: any) {
    console.error("Adapter error:", e);
    return json(500, { error: { code: "INTERNAL", message: e?.message ?? "error" } });
  }
};
