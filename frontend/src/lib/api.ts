/**
 * Cliente fetch tipado contra /api/v1 (design/api-contract.md).
 * En dev, Vite proxifica /api → http://localhost:8000.
 * En prod (Netlify), el request a "/api/v1" se redirige automáticamente
 * a http://82.239.175.215:9000/api/v1 gracias al [[redirects]] en netlify.toml.
 */

const API_BASE = "/api/v1";

/* ============================================================
   Tipos del contrato REST
   ============================================================ */

export interface EstimatedMinutes {
  summary: number;
  friendly: number;
  legal: number;
}

export interface ModuleSummary {
  id: string;
  title: string;
  slug: string;
  order: number;
  estimatedMinutes: EstimatedMinutes;
  description: string;
}

export interface ModulesResponse {
  modules: ModuleSummary[];
  total: number;
}

export interface SummaryLevel {
  title: string;
  estimatedMinutes: number;
  bullets: string[];
  keyTerms?: string[];
}

export interface ScenarioBox {
  title: string;
  content: string;
}

export interface KeyFact {
  icon?: string;
  text: string;
}

export interface FriendlySection {
  heading: string;
  content: string;
  scenarios?: ScenarioBox[];
  keyFacts?: KeyFact[];
}

export interface FriendlyLevel {
  title: string;
  estimatedMinutes: number;
  sections: FriendlySection[];
  glossaryTerms?: string[];
}

export interface LegalArticle {
  number: string;
  title: string;
  text: string;
}

export interface LegalLevel {
  title: string;
  articles: LegalArticle[];
}

export type ReadLevel = "summary" | "friendly" | "legal";

export interface ModuleLevels {
  summary: SummaryLevel;
  friendly: FriendlyLevel;
  legal: LegalLevel;
}

export interface ModuleDetail {
  id: string;
  title: string;
  slug: string;
  order: number;
  levels: ModuleLevels;
}

export interface ModuleResponse {
  module: ModuleDetail;
}

export interface QuizOption {
  id: number;
  text: string;
}

export interface QuizQuestion {
  id: string;
  text: string;
  options: QuizOption[];
  explanation?: string;
}

export interface Quiz {
  moduleId: string;
  questions: QuizQuestion[];
  totalQuestions: number;
}

export interface QuizResponse {
  quiz: Quiz;
}

export interface ExplanationItem {
  questionId: string;
  correctIndex: number;
  explanation: string;
}

export interface QuizResult {
  score: number;
  total: number;
  passed: boolean;
  correctIndices: number[];
  explanations: ExplanationItem[];
}

export interface QuizSubmitResult {
  result: QuizResult;
}

export interface ChecklistItem {
  id: string;
  text: string;
  legalRef?: string;
  guideUrl?: string | null;
  completed: boolean;
}

export interface ChecklistSection {
  id: string;
  title: string;
  order: number;
  items: ChecklistItem[];
}

export interface ChecklistProgress {
  completed: number;
  total: number;
  percentage: number;
}

export interface ChecklistData {
  role: string;
  sections: ChecklistSection[];
  progress: ChecklistProgress;
}

export interface ChecklistResponse {
  checklist: ChecklistData;
}

export interface GlossaryTermSummary {
  id: string;
  term: string;
  definition: string;
  category?: string;
  legalRef?: string;
  relatedTerms?:
    | string[]
    | { id: string; term: string }[]
    | undefined;
}

export interface GlossaryTerm extends GlossaryTermSummary {}

export interface GlossaryListResponse {
  terms: GlossaryTermSummary[];
  total: number;
}

export interface GlossaryTermResponse {
  term: GlossaryTerm;
}

export interface FinalTestQuestion {
  id: string;
  moduleId: string;
  text: string;
  options: QuizOption[];
}

export interface FinalTest {
  questions: FinalTestQuestion[];
  totalQuestions: number;
  passThreshold: number;
}

export interface FinalTestResponse {
  test: FinalTest;
}

export interface DetailByModule {
  moduleId: string;
  correct: number;
  total: number;
  percentage: number;
}

export interface FinalTestResult {
  score: number;
  total: number;
  percentage: number;
  passed: boolean;
  detailByModule: DetailByModule[];
  certificateEligible: boolean;
}

export interface FinalTestSubmitResult {
  result: FinalTestResult;
}

export interface ApiErrorBody {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

/* ============================================================
   Errores
   ============================================================ */

export class ApiError extends Error {
  status: number;
  code: string;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      headers: { Accept: "application/json" },
      ...init,
    });
  } catch {
    throw new ApiError(0, "NETWORK_ERROR", "No se pudo conectar con el servidor.");
  }

  if (!res.ok) {
    let code = "INTERNAL_ERROR";
    let message = `Error ${res.status}`;
    try {
      const body = await res.json();
      // FastAPI HTTPException anida el cuerpo en `detail`; nuestro backend también
      // puede devolver { error: {...} } directo.
      const b = body as Record<string, unknown>;
      const err =
        (b?.detail ?? b?.error ?? b) as Partial<ApiErrorBody["error"]> | undefined;
      if (err && typeof err === "object" && "code" in err && "message" in err) {
        code = String(err.code);
        message = String(err.message);
      }
    } catch {
      /* respuesta sin JSON */
    }
    throw new ApiError(res.status, code, message);
  }

  return (await res.json()) as T;
}

function toQuery(params: Record<string, string | undefined>): string {
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== "") qs.set(k, v);
  }
  const s = qs.toString();
  return s ? `?${s}` : "";
}

/* ============================================================
   Endpoints
   ============================================================ */

/** GET /api/modules */
export function getModules(): Promise<ModulesResponse> {
  return request<ModulesResponse>("/modules");
}

/** GET /api/modules/{id} */
export function getModule(id: string): Promise<ModuleResponse> {
  return request<ModuleResponse>(`/modules/${encodeURIComponent(id)}`);
}

/** GET /api/quizzes/{module_id} */
export function getQuiz(moduleId: string): Promise<QuizResponse> {
  return request<QuizResponse>(`/quizzes/${encodeURIComponent(moduleId)}`);
}

/** POST /api/quizzes/{module_id}/submit */
export function submitQuiz(
  moduleId: string,
  answers: number[],
): Promise<QuizSubmitResult> {
  return request<QuizSubmitResult>(`/quizzes/${encodeURIComponent(moduleId)}/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ answers }),
  });
}

/**
 * GET /api/checklist/{rol}
 * Roles válidos (API): empresas, ciudadanos, desarrolladores, instituciones-publicas
 */
export function getChecklist(roleApi: string): Promise<ChecklistResponse> {
  return request<ChecklistResponse>(`/checklist/${encodeURIComponent(roleApi)}`);
}

/**
 * POST /api/checklist/{rol}
 * Persiste el progreso de ítems marcados.
 */
export function saveChecklist(
  roleApi: string,
  items: { id: string; completed: boolean }[],
): Promise<{ checklist: Pick<ChecklistData, "role" | "progress"> }> {
  return request<{ checklist: Pick<ChecklistData, "role" | "progress"> }>(
    `/checklist/${encodeURIComponent(roleApi)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items }),
    },
  );
}

/** GET /api/glossary (con búsqueda y filtros opcionales) */
export function getGlossary(params?: {
  q?: string;
  category?: string;
  letter?: string;
}): Promise<GlossaryListResponse> {
  const query = params ? toQuery(params) : "";
  return request<GlossaryListResponse>(`/glossary${query}`);
}

/** GET /api/glossary/{termId} */
export function getGlossaryTerm(termId: string): Promise<GlossaryTermResponse> {
  return request<GlossaryTermResponse>(`/glossary/${encodeURIComponent(termId)}`);
}

/** GET /api/final-test */
export function getFinalTest(): Promise<FinalTestResponse> {
  return request<FinalTestResponse>("/final-test");
}

/** POST /api/final-test/submit */
export function submitFinalTest(answers: number[]): Promise<FinalTestSubmitResult> {
  return request<FinalTestSubmitResult>("/final-test/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ answers }),
  });
}
