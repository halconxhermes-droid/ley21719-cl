import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getModules, getModule, getQuiz, submitQuiz, getChecklist, saveChecklist, getGlossary, getGlossaryTerm, getFinalTest, submitFinalTest } from "../lib/api";

const mockFetch = vi.fn();
beforeEach(() => {
  vi.resetAllMocks();
  global.fetch = mockFetch;
});

describe("API client (lib/api.ts)", () => {
  it("getModules: llama /api/v1/modules y devuelve lista", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ modules: [{ id: "empresa", title: "Empresas", slug: "empresas", order: 1, estimatedMinutes: { summary: 3, friendly: 15, legal: 25 }, description: "Desc" }], total: 1 })
    });
    const res = await getModules();
    expect(res.modules).toHaveLength(1);
    expect(res.modules[0].id).toBe("empresa");
    expect(mockFetch).toHaveBeenCalledWith("/api/v1/modules", expect.any(Object));
  });

  it("getModule: llama /api/v1/modules/{id}", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ module: { id: "empresa", title: "Empresas", slug: "empresas", order: 1, levels: { summary: { title: "Res", estimatedMinutes: 3, bullets: [] }, friendly: { title: "Amig", estimatedMinutes: 15, sections: [], glossaryTerms: [] }, legal: { title: "Leg", articles: [] } } } })
    });
    const res = await getModule("empresa");
    expect(res.module.id).toBe("empresa");
  });

  it("getQuiz: llama /api/v1/quizzes/{module_id}", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ quiz: { moduleId: "empresa", totalQuestions: 1, questions: [{ id: "q1", text: "P?", options: [{id:0,text:"A"},{id:1,text:"B"}], explanation: "exp" }] } })
    });
    const res = await getQuiz("empresa");
    expect(res.quiz.totalQuestions).toBe(1);
  });

  it("submitQuiz: POST /api/v1/quizzes/{module_id}/submit con answers", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ result: { score: 1, total: 1, passed: true, correctIndices: [0], explanations: [] } })
    });
    const res = await submitQuiz("empresa", [0]);
    expect(res.result.score).toBe(1);
    // verify body
    expect(mockFetch).toHaveBeenCalledWith("/api/v1/quizzes/empresa/submit", expect.objectContaining({
      method: "POST",
      body: JSON.stringify({ answers: [0] })
    }));
  });

  it("getChecklist: llama /api/v1/checklist/{roleApi}", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ checklist: { role: "empresas", sections: [], progress: { completed: 0, total: 0, percentage: 0 } } })
    });
    const res = await getChecklist("empresas");
    expect(res.checklist.role).toBe("empresas");
  });

  it("saveChecklist: POST /api/v1/checklist/{roleApi}", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ checklist: { role: "empresas", progress: { completed: 1, total: 2, percentage: 50 } } })
    });
    const res = await saveChecklist("empresas", [{ id: "i1", completed: true }]);
    expect(res.checklist.progress.completed).toBe(1);
  });

  it("getGlossary: parámetros q, category, letter", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ terms: [{ id: "dato_personal", term: "Dato personal", definition: "Def", category: "tecnica", legalRef: "Art. 2", relatedTerms: [] }], total: 1 })
    });
    const res = await getGlossary({ q: "dato", letter: "D" });
    expect(res.terms[0].term).toBe("Dato personal");
    expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining("q=dato"), expect.any(Object));
  });

  it("getGlossaryTerm: llama /api/v1/glossary/{termId}", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ term: { id: "dato_personal", term: "Dato personal", definition: "Def", category: "tecnica", legalRef: "Art. 2", relatedTerms: [] } })
    });
    const res = await getGlossaryTerm("dato_personal");
    expect(res.term.id).toBe("dato_personal");
  });

  it("getFinalTest: llama /api/v1/final-test", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ test: { totalQuestions: 10, passThreshold: 70, questions: [] } })
    });
    const res = await getFinalTest();
    expect(res.test.totalQuestions).toBe(10);
  });

  it("submitFinalTest: POST /api/v1/final-test/submit", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ result: { score: 8, total: 10, percentage: 80, passed: true, detailByModule: [], certificateEligible: true } })
    });
    const res = await submitFinalTest([1,0,2,3,1,0,2,1,3,0]);
    expect(res.result.score).toBe(8);
  });

  it("lanza ApiError en 404 NOT_FOUND", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: async () => ({ error: { code: "NOT_FOUND", message: "Módulo no encontrado", details: {} } })
    });
    await expect(getModule("no-existe")).rejects.toThrow("Módulo no encontrado");
  });

  it("lanza ApiError en error de red", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Failed to fetch"));
    await expect(getModules()).rejects.toThrow("No se pudo conectar con el servidor");
  });
});