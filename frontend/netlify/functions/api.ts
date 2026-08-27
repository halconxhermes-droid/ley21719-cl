/* ── Netlify Function: InsForge API adapter + Auth gate ──
   Reemplaza el backend Fly.io. Consulta InsForge REST directamente.
   Incluye gate de acceso con contraseña (server-side,hash + timing-safe).
------------------------------------------------------------------- */
import type { Context } from "@netlify/functions";
import { createHash, timingSafeEqual } from "node:crypto";

const INSFORGE = "https://7cn2ezja.us-east.insforge.app";
const API_KEY =
  process.env.INSFORGE_API_KEY || "ik_c9a1dd3bfe6a1f5d465946e624e3cb0c";
const HDR = {
  Authorization: "Bearer " + API_KEY,
  "Content-Type": "application/json",
  Accept: "application/json",
};
const CORS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, Accept",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

function json(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...CORS },
  });
}

/* ═══════════════════════════════════════════════════════
   AUTH GATE — contraseña server-side
   La password vive en la env var ACCESS_PASSWORD de Netlify.
   El frontend nunca ve el hash; solo recibe un token
   determinista que presenta en cada request.
   ═══════════════════════════════════════════════════════ */
// Hashes de password aceptados (SHA256 con salt "ley21719::gate::v1")
// generados al momento del despliegue
const LEGACY_PASSWORD_HASH = "26553e2a23c8a7b0c97c53267140eacf936c43b013b2609cac01b63c7b1d1862";  // legacy: ley21719-2026
const NEW_ADMIN_PASSWORD_HASH = "cf7cd6cdbb836faf4adc82941b02598bd1264f9b8ac8b736787e82fa7932b4c6";   // nuevo admin: Halconx15426321+-
 "26553e2a23c8a7b0c97c53267140eacf936c43b013b2609cac01b63c7b1d1862"  // legacy: ley21719-2026
// NEW ADMIN: Halconx15426321+-
 "cf7cd6cdbb836faf4adc82941b02598bd1264f9b8ac8b736787e82fa7932b4c6"  // nuevo admin: Halconx15426321+-
const NEW_ADMIN_PASSWORD_HASH = "0d743d93ea28a6ce732e34350918342999485dbe515683e6d2c8f78a99b24af1";

function tokenFor(password: string): string {
  return createHash("sha256").update(`${TOKEN_SALT}::${password}`).digest("hex");
}

async function verifyAccess(password: unknown): Promise<boolean> {
  if (typeof password !== "string" || !password || password.length > 128) return false;

  // Generar hash del password proporcionado
  const providedHash = createHash("sha256").update(`${TOKEN_SALT}::${password}`).digest("hex");
  const providedBuf = Buffer.from(providedHash);

  // Hashes conocidos (SHA256 con salt)
  const legacyHash = "26553e2a23c8a7b0c97c53267140eacf936c43b013b2609cac01b63c7b1d1862";  // legacy: ley21719-2026
  const newAdminHash = "cf7cd6cdbb836faf4adc82941b02598bd1264f9b8ac8b736787e82fa7932b4c6";   // nuevo admin: Halconx15426321+-

  // Comparar contra cada hash conocido (timing-safe)
  const legacyExpected = Buffer.from(legacyHash);
  const newExpected = Buffer.from(newAdminHash);

  if (timingSafeEqual(providedBuf, legacyExpected)) return true;
  if (timingSafeEqual(providedBuf, newExpected)) return true;
  return false;
}
  if (typeof password !== "string" || !password || password.length > 128) return false;
  const provided = Buffer.from(tokenFor(password));
  // Verificar contra password legacy (por defecto)
  const legacyExpected = Buffer.from(tokenFor('ley21719-2026'));
  if (timingSafeEqual(provided, legacyExpected)) return true;
  // Verificar contra nueva password de admin
  const newExpected = Buffer.from(NEW_ADMIN_PASSWORD_HASH);
  return timingSafeEqual(provided, newExpected);
}

/* ═══════════════════════════════════════════════════════
   INSFORGE REST helpers
   ═══════════════════════════════════════════════════════ */
async function records(table: string, query = "") {
  const url = `${INSFORGE}/api/database/records/${table}${query ? `?${query}` : ""}`;
  try {
    const r = await fetch(url, { headers: HDR });
    if (!r.ok) { console.error(`InsForge ${url} → ${r.status}`); return []; }
    return await r.json();
  } catch (e) { console.error(`Error fetching ${table}: ${e}`); return []; }
}

const SECTION_TITLES: Record<string, Record<string, string>> = {
  empresas: {
    gobernanza: "Gobernanza y diseño organizacional",
    "derechos-arsop": "Derechos ARSOP",
    "seguridad-brechas": "Seguridad y brechas",
    "cultura-cumplimiento": "Cultura de cumplimiento",
  },
  ciudadanos: {
    gobernanza: "Marcos institucionales",
    "derechos-arsop": "Transparencia activa",
    "seguridad-brechas": "Procedimientos internos",
    "cultura-cumplimiento": "Cultura institucional",
  },
  desarrolladores: {
    gobernanza: "Marcos institucionales",
    "derechos-arsop": "Transparencia activa",
    "seguridad-brechas": "Procedimientos internos",
    "cultura-cumplimiento": "Cultura institucional",
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

/* ═══════════════════════════════════════════════════════
   ROUTER — rutas /api/v1/*
   ═══════════════════════════════════════════════════════ */
async function handle(path: string, method: string, body: any) {
  const seg = path.split("/").filter(Boolean);

  /* ── GET /api/v1/modules ── */
  if (path === "api/v1/modules") {
    const rows = await records("modules");
    const modules = rows.map((r: any) => {
      const raw = JSON.parse(r.levels_json || "{}");
      const levels = raw.levels || raw;
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

  /* ── GET /api/v1/modules/:id ── */
  if (seg[2] === "modules" && seg[3] && method === "GET") {
    const modId = seg[3];
    const rows = await records("modules", `id=eq.${modId}`);
    if (!rows.length) return json(200, { module: null });
    const r = rows[0];
    const raw = JSON.parse(r.levels_json || "{}");
    const levels = raw.levels || raw;
    return json(200, {
      module: {
        id: r.id,
        title: r.title,
        slug: r.slug,
        order: r.ordering,
        estimatedMinutes: {
          summary: levels.summary?.estimatedMinutes ?? 0,
          friendly: levels.friendly?.estimatedMinutes ?? 0,
          legal: levels.legal?.estimatedMinutes ?? 0,
        },
        levels: { summary: levels.summary, friendly: levels.friendly, legal: levels.legal },
      },
    });
  }

  /* ── GET /api/v1/quizzes/:moduleId ── */
  if (seg[2] === "quizzes" && seg[3] && method === "GET") {
    const modId = seg[3];
    const rows = await records("quizzes", `module_id=eq.${modId}`);
    if (!rows.length) return json(200, { quiz: { moduleId: modId, questions: [], totalQuestions: 0 } });
    const qs = JSON.parse(rows[0].questions_json || "[]");
    const safeQs = qs.map((q: any) => ({
      id: q.id,
      text: q.text,
      options: q.options,
      explanation: q.explanation,
    }));
    return json(200, { quiz: { moduleId: modId, questions: safeQs, totalQuestions: safeQs.length } });
  }

  /* ── POST /api/v1/quizzes/:moduleId/submit ── */
  if (seg[2] === "quizzes" && seg[3] && method === "POST") {
    const modId = seg[3];
    const rows = await records("quizzes", `module_id=eq.${modId}`);
    if (!rows.length) return json(404, { error: { code: "NO_QUIZ", message: "Quiz no encontrado" } });
    const qs = JSON.parse(rows[0].questions_json || "[]");
    const answers: number[] = body?.answers ?? [];
    let score = 0;
    const explanations = qs.map((q: any, i: number) => {
      const ci = q.correctIndex ?? q.correct;
      if (answers[i] === ci) score++;
      return { questionId: q.id, correctIndex: ci, explanation: q.explanation };
    });
    return json(200, {
      result: {
        score,
        total: qs.length,
        passed: score > qs.length * 0.7,
        correctIndices: qs.map((q: any) => q.correctIndex ?? q.correct),
        explanations,
      },
    });
  }

  /* ── GET /api/v1/checklist/:role ── */
  if (seg[2] === "checklist" && seg[3] && method === "GET") {
    const role = seg[3];
    const allItems = await records("checklist_items", `role=eq.${role}&order=item_order`);
    const progress = await records("checklist_progress", `role=eq.${role}`);
    const done = new Set(progress.filter((p: any) => p.completed).map((p: any) => p.item_id));
    const sectionMap: Record<string, any[]> = {};
    for (const it of allItems) {
      const sid = it.section_id;
      if (!sectionMap[sid]) sectionMap[sid] = [];
      sectionMap[sid].push({
        id: it.item_id,
        text: it.text,
        legalRef: it.legal_ref,
        guideUrl: it.guide_url || "",
        completed: done.has(it.item_id),
      });
    }
    const sections = Object.entries(sectionMap)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([sid, items], idx) => ({
        id: sid,
        title: sectionTitle(role, sid),
        order: idx + 1,
        items,
      }));
    const total = allItems.length;
    const completed = progress.filter((p: any) => p.completed).length;
    return json(200, {
      checklist: {
        role,
        sections,
        progress: { completed, total, percentage: total ? Math.round((completed / total) * 100) : 0 },
      },
    });
  }

  /* ── POST /api/v1/checklist/:role ── */
  if (seg[2] === "checklist" && seg[3] && method === "POST") {
    const role = seg[3];
    const items: { id: string; completed: boolean }[] = body?.items ?? [];
    for (const it of items) {
      const url = `${INSFORGE}/api/database/records/checklist_progress?role=eq.${role}&item_id=eq.${it.id}`;
      await fetch(url, {
        method: "PATCH",
        headers: HDR,
        body: JSON.stringify({ completed: it.completed ? 1 : 0 }),
      });
    }
    const progress = await records("checklist_progress", `role=eq.${role}`);
    const total = (await records("checklist_items", `role=eq.${role}`)).length;
    const completed = progress.filter((p: any) => p.completed).length;
    return json(200, {
      checklist: {
        role,
        progress: { completed, total, percentage: total ? Math.round((completed / total) * 100) : 0 },
      },
    });
  }

  /* ── GET /api/v1/glossary ── */
  if (path.startsWith("api/v1/glossary") && method === "GET") {
    const termId = seg[3];
    if (termId) {
      const rows = await records("glossary", `id=eq.${termId}`);
      return rows.length ? json(200, { term: rows[0] }) : json(404, { error: { code: "NOT_FOUND", message: "Término no encontrado" } });
    }
    /* filtrado por query string: ?q=xxx&category=yyy
       Nota: el entry pasa el pathname; query string se parsea allí abajo    */
    // Los params llegan desde el entry en body (GET sin query en Netlify Fns v2)
    const q = (body as any)?.searchParams || "";
    let query = "";
    const params: string[] = [];
    const sp = new URLSearchParams(q);
    if (sp.get("q")) params.push(`term=like.*${sp.get("q")}*`);
    if (sp.get("category")) params.push(`category=eq.${sp.get("category")}`);
    if (params.length) query = params.join("&");
    const rows = await records("glossary", query);
    return json(200, { terms: rows, total: rows.length });
  }

  /* ── GET /api/v1/final-test ── */
  if (path === "api/v1/final-test" && method === "GET") {
    const rows = await records("final_test");
    const questions = rows.map((r: any) => ({
      id: r.question_id,
      moduleId: r.module_id,
      text: r.text,
      options: JSON.parse(r.options_json || "[]"),
    }));
    return json(200, { test: { questions, totalQuestions: questions.length, passThreshold: 7 } });
  }

  /* ── POST /api/v1/final-test/submit ── */
  if (path === "api/v1/final-test/submit" && method === "POST") {
    const rows = await records("final_test");
    const answers: number[] = body?.answers ?? [];
    let score = 0;
    const byModule: Record<string, { correct: number; total: number }> = {};
    for (let i = 0; i < rows.length; i++) {
      const r = rows[i];
      const modId = r.module_id;
      if (!byModule[modId]) byModule[modId] = { correct: 0, total: 0 };
      byModule[modId].total++;
      const ci = r.correct_index;
      if (answers[i] !== undefined && answers[i] === ci) {
        score++;
        byModule[modId].correct++;
      }
    }
    const total = rows.length;
    const percentage = total ? Math.round((score / total) * 100) : 0;
    return json(200, {
      result: {
        score, total, percentage,
        passed: percentage >= 70,
        detailByModule: Object.entries(byModule).map(([moduleId, v]) => ({
          moduleId,
          correct: v.correct,
          total: v.total,
          percentage: v.total ? Math.round((v.correct / v.total) * 100) : 0,
        })),
        certificateEligible: percentage >= 70,
      },
    });
  }

  return json(404, { error: { code: "NOT_FOUND", message: `Unknown route: ${path}` } });
}

/* ═══════════════════════════════════════════════════════
   Netlify Function v2 entry + Auth gate wrapper
   ═══════════════════════════════════════════════════════ */
export default async (req: Request, ctx: Context) => {
  const url = new URL(req.url);
  const path = url.pathname.replace(/^\//, "");
  const method = req.method;

  if (method === "OPTIONS")
    return new Response(null, { status: 204, headers: CORS });

  let data: any = null;
  if (method === "POST") {
    try { data = await req.json(); } catch { data = null; }
  } else if (method === "GET") {
    // Pasar query string a handle() para rutas que lo necesiten (glossary)
    const sp = url.searchParams.toString();
    if (sp) data = { searchParams: sp };
  }

  /* ── GET /api/v1/verify-certificate?cod=XXXXXXXX — PÚBLICO (sin gate) ──
     Verificación anti-fraude de certificados. No expone datos personales:
     solo confirma si el código existe y devuelve fecha/puntaje. */
  if (path === "api/v1/verify-certificate" && method === "GET") {
    const raw = (data?.searchParams || "");
    const cod = (new URLSearchParams(raw).get("cod") || "").trim().toUpperCase();
    if (!/^[A-F0-9]{8}$/.test(cod)) {
      return json(400, { error: { code: "BAD_CODE", message: "Formato de código inválido (se esperan 8 caracteres hex)." } });
    }
    const rows = await records("certificados", `codigo=eq.${cod}`);
    if (!rows.length) {
      return json(404, { valid: false, code: cod, message: "Certificado no encontrado en el registro oficial." });
    }
    const r = rows[0];
    return json(200, {
      valid: true,
      code: r.codigo,
      issuedAt: r.fecha_emision?.slice(0, 10) ?? null,
      score: { obtained: r.puntaje, total: r.total },
      course: "Ley N° 21.719 sobre Protección de Datos Personales de Chile",
      issuer: "Plataforma Educativa Ley 21.719",
    });
  }

  /* ── Gate: POST api/v1/access/verify {password} → {token} ── */
  if (path === "api/v1/access/verify" && method === "POST") {
    // Verificar password contra lista blanca
    const ok = await verifyAccess(data?.password);
    if (!ok) {
      await new Promise((r) => setTimeout(r, 600)); // anti brute-force
      return json(401, { error: { code: "INVALID_PASSWORD", message: "Contraseña incorrecta." } });
    }
    // Devolver token usando el password proporcionado
    const providedPassword = (data?.password || "").trim();
    return json(200, { token: tokenFor(String(providedPassword)), expiresIn: "30d" });
  }

  /* ── Todo lo demás exige X-Access-Token válido ── */
  const providedToken = req.headers.get("x-access-token");
  const expected = tokenFor(ACCESS_PASSWORD);
  if (!providedToken || providedToken !== expected) {
    return json(401, { error: { code: "UNAUTHORIZED", message: "Acceso requerido." } });
  }

  try {
    return await handle(path, method, data);
  } catch (e: any) {
    console.error("Adapter error:", e);
    return json(500, { error: { code: "INTERNAL", message: e?.message ?? "error" } });
  }
};
