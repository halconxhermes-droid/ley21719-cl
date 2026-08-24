import { useEffect } from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { NavigationProvider, useNavigation } from "../context/NavigationContext";
import { RolProvider, useRol } from "../context/RolContext";
import Home from "../views/Home";
import LectorModulo from "../views/LectorModulo";
import QuizView from "../views/Quiz";
import ChecklistView from "../views/Checklist";
import GlosarioView from "../views/Glosario";
import TestFinalView from "../views/TestFinal";
import ResultadosView from "../views/Resultados";

function TestWrapper({ children }: { children: React.ReactNode }) {
  return (
    <RolProvider>
      <NavigationProvider>{children}</NavigationProvider>
    </RolProvider>
  );
}

const MODULE_MOCK = {
  module: {
    id: "empresa",
    title: "Ley 21.719 para Empresas",
    slug: "empresas",
    order: 1,
    levels: {
      summary: {
        title: "Resumen ejecutivo",
        estimatedMinutes: 3,
        bullets: ["B1", "B2"],
        keyTerms: ["dato personal"],
      },
      friendly: {
        title: "Explicación amigable",
        estimatedMinutes: 15,
        sections: [
          {
            heading: "Sección 1",
            content: "Contenido de la sección",
            scenarios: [{ title: "¿Qué pasa si…?", content: "Escenario" }],
            keyFacts: [{ text: "Dato clave" }],
          },
        ],
        glossaryTerms: ["dato personal"],
      },
      legal: {
        title: "Texto legal",
        articles: [{ number: "Art. 4", title: "Principios", text: "Texto…" }],
      },
    },
  },
};

beforeEach(() => {
  global.fetch = vi.fn();
});

describe("Home view", () => {
  it("renderiza hero con título y selector de rol (4 tarjetas)", async () => {
    render(<TestWrapper><Home /></TestWrapper>);
    expect(
      screen.getByRole("heading", { name: /Ley 21\.719: Protección de Datos Personales en Chile/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/¿Quién eres\?/i)).toBeInTheDocument();
    const cards = screen.getAllByRole("button", { name: /Responsables y encargados|Ejerce tus derechos|Consentimiento explícito|Transparencia, RAT/i });
    expect(cards).toHaveLength(4);
    // Cuenta regresiva visible en hero
    expect(screen.getByText(/Cuenta regresiva a la vigencia plena/i)).toBeInTheDocument();
  });

  it("selecciona rol y muestra estado aria-pressed + persiste en localStorage", () => {
    render(<TestWrapper><Home /></TestWrapper>);
    // El nombre accesible del botón es "Empresa Responsables y encargados..." (span interno es aria-hidden)
    const card = screen.getByRole("button", { name: /Empresa Responsables/i });
    expect(card).toHaveAttribute("aria-pressed", "false");
    fireEvent.click(card);
    expect(card).toHaveAttribute("aria-pressed", "true");
    expect(window.localStorage.getItem("ley21719_role")).toBe("empresa");
  });
});

describe("LectorModulo view", () => {
  it("muestra loading mientras carga el módulo", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockImplementation(
      () => new Promise(() => {}), // nunca resuelve
    );
    render(<TestWrapper><LectorModulo /></TestWrapper>);
    expect(screen.getByText(/Cargando módulo/i)).toBeInTheDocument();
  });

  it("carga módulo y muestra niveles de lectura", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => MODULE_MOCK,
    });
    render(<TestWrapper><LectorModulo /></TestWrapper>);
    await waitFor(() =>
      expect(screen.getByRole("heading", { name: /Ley 21\.719 para Empresas/i })).toBeInTheDocument(),
    );
    // Tabs de nivel
    expect(screen.getByRole("button", { name: /^Resumen/i })).toBeInTheDocument();
    expect(screen.getByText("Resumen ejecutivo")).toBeInTheDocument();
    // Cambia a nivel amigable
    fireEvent.click(screen.getByRole("button", { name: /Explicación amigable/i }));
    await waitFor(() => expect(screen.getByText(/Sección 1/i)).toBeInTheDocument());
    // Cambia a nivel legal
    fireEvent.click(screen.getByRole("button", { name: /Texto legal completo/i }));
    await waitFor(() => expect(screen.getByText(/Art\. 4 — Principios/i)).toBeInTheDocument());
  });

  it("embebe videos YouTube del módulo", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => MODULE_MOCK,
    });
    render(<TestWrapper><LectorModulo /></TestWrapper>);
    await waitFor(() =>
      expect(screen.getAllByTitle(/reloj de control de asistencia/i)).toHaveLength(1),
    );
    const iframe = screen.getByTitle(/reloj de control de asistencia/i);
    expect(iframe.getAttribute("src")).toContain("youtube-nocookie.com/embed/mrlj9vSB0EM");
  });
});

describe("Quiz view", () => {
  const QUIZ_MOCK = {
    quiz: {
      moduleId: "empresa",
      totalQuestions: 2,
      questions: [
        {
          id: "q1",
          text: "Pregunta uno",
          options: [{ id: 0, text: "Opción A" }, { id: 1, text: "Opción B" }],
          explanation: "Porque sí",
        },
        {
          id: "q2",
          text: "Pregunta dos",
          options: [{ id: 0, text: "Opción C" }, { id: 1, text: "Opción D" }],
          explanation: "Porque no",
        },
      ],
    },
  };

  it("carga pregunta y permite navegar entre preguntas", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => QUIZ_MOCK,
    });
    render(<TestWrapper><QuizView /></TestWrapper>);
    await waitFor(() => expect(screen.getByText("Pregunta uno")).toBeInTheDocument());
    // Seleccionar opción A
    fireEvent.click(screen.getByLabelText("Opción A"));
    fireEvent.click(screen.getByRole("button", { name: "Responder" }));
    // Feedback con explicación visible
    expect(await screen.findByText(/Porque sí/i)).toBeInTheDocument();
    // Siguiente
    fireEvent.click(screen.getByTestId("quiz-next"));
    expect(screen.getByText("Pregunta dos")).toBeInTheDocument();
    expect(screen.getByText(/^2$/)).toBeInTheDocument(); // "Pregunta 2 de 2"
  });

  it("al terminar envía respuestas y muestra resultados del backend", async () => {
    (global.fetch as ReturnType<typeof vi.fn>)
      .mockResolvedValueOnce({ ok: true, json: async () => QUIZ_MOCK })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          result: {
            score: 2,
            total: 2,
            passed: true,
            correctIndices: [0, 1],
            explanations: [
              { questionId: "q1", correctIndex: 0, explanation: "Bien 1" },
              { questionId: "q2", correctIndex: 1, explanation: "Bien 2" },
            ],
          },
        }),
      });

    render(<TestWrapper><QuizView /></TestWrapper>);
    await waitFor(() => expect(screen.getByText("Pregunta uno")).toBeInTheDocument());
    fireEvent.click(screen.getByLabelText("Opción A"));
    fireEvent.click(screen.getByRole("button", { name: "Responder" }));
    fireEvent.click(await screen.findByTestId("quiz-next"));
    fireEvent.click(screen.getByLabelText("Opción D"));
    fireEvent.click(screen.getByRole("button", { name: "Responder" }));
    // POST submit → resultados
    expect(await screen.findByText(/Resultados del quiz/i)).toBeInTheDocument();
    expect(screen.getByText("2 / 2")).toBeInTheDocument();
    expect(global.fetch).toHaveBeenCalledWith(
      "/api/v1/quizzes/empresa/submit",
      expect.objectContaining({ method: "POST" }),
    );
  });
});

describe("Checklist view", () => {
  it("carga checklist del rol empresa y marca ítems con persistencia", async () => {
    window.localStorage.clear();
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({
        checklist: {
          role: "empresas",
          sections: [
            {
              id: "s1",
              title: "Gobernanza",
              order: 1,
              items: [{ id: "item-1", text: "Ítem uno", completed: false }],
            },
          ],
          progress: { completed: 0, total: 1, percentage: 0 },
        },
      }),
    });
    render(<TestWrapper><ChecklistView /></TestWrapper>);
    expect(await screen.findByText("Ítem uno")).toBeInTheDocument();

    const checkbox = screen.getByLabelText("Ítem uno");
    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();
    // Persistencia local
    expect(window.localStorage.getItem("ley21719_ck_empresa")).toBe(
      JSON.stringify({ "item-1": true }),
    );
    // Persistencia remota (POST)
    await waitFor(() =>
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/v1/checklist/empresas",
        expect.objectContaining({ method: "POST" }),
      ),
    );
    // % actualizado
    expect(screen.getByText(/1 de 1 ítems completados/i)).toBeInTheDocument();
  });
});

describe("Glosario view", () => {
  it("lista términos y abre modal de definición", async () => {
    (global.fetch as ReturnType<typeof vi.fn>)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          terms: [
            { id: "dato_personal", term: "Dato personal", definition: "Definición corta" },
          ],
          total: 1,
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          term: {
            id: "dato_personal",
            term: "Dato personal",
            definition: "Definición completa del término",
            category: "tecnica",
            legalRef: "Art. 2 letra a)",
            relatedTerms: [],
          },
        }),
      });

    render(<TestWrapper><GlosarioView /></TestWrapper>);
    expect(await screen.findByText("Dato personal")).toBeInTheDocument();
    expect(screen.getByText(/Mostrando 1 término$/i)).toBeInTheDocument();

    fireEvent.click(screen.getByText("Ver definición →"));
    const dialog = await screen.findByRole("dialog");
    expect(dialog).toBeInTheDocument();
    expect(await screen.findByText("Definición completa del término")).toBeInTheDocument();
  });
});

describe("TestFinal + Resultados", () => {
  it("carga 10 preguntas, envía y navega a resultados", async () => {
    const questions = Array.from({ length: 10 }, (_, i) => ({
      id: `ft-${i + 1}`,
      moduleId: "empresa",
      text: `Pregunta final ${i + 1}`,
      options: [
        { id: 0, text: `A${i}` },
        { id: 1, text: `B${i}` },
      ],
    }));
    (global.fetch as ReturnType<typeof vi.fn>)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ test: { questions, totalQuestions: 10, passThreshold: 70 } }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          result: {
            score: 8,
            total: 10,
            percentage: 80,
            passed: true,
            detailByModule: [{ moduleId: "empresa", correct: 8, total: 10, percentage: 80 }],
            certificateEligible: true,
          },
        }),
      });

        function AppRouter() {
      const { view, navigate } = useNavigation();

      useEffect(() => {
        navigate("testfinal");
      }, [navigate]);

      return (
        <>
          {view === "testfinal" && <TestFinalView />}
          {view === "resultados" && <ResultadosView />}
        </>
      );
    }

    render(
      <RolProvider>
        <NavigationProvider>
          <AppRouter />
        </NavigationProvider>
      </RolProvider>,
    );

    // Navegar a testfinal
    await waitFor(() => expect(screen.getByText(/^1\.\s*Pregunta final 1/)).toBeInTheDocument());
    // Responder todas (labels asocian inputs por htmlFor)
    for (let i = 1; i <= 10; i++) {
      fireEvent.click(screen.getByLabelText(`A${i - 1}`));
    }
    fireEvent.click(screen.getByText("Enviar respuestas y ver resultados"));
    expect(await screen.findByText(/Resultados del test final/i)).toBeInTheDocument();
    expect(screen.getByText("8 / 10")).toBeInTheDocument();
    expect(screen.getByText(/Aprobado \(80%\)/i)).toBeInTheDocument();
    expect(global.fetch).toHaveBeenCalledWith(
      "/api/v1/final-test/submit",
      expect.objectContaining({ method: "POST" }),
    );
  });

  it("Resultados sin datos muestra estado vacío", () => {
    window.sessionStorage.clear();
    render(<TestWrapper><ResultadosView /></TestWrapper>);
    expect(screen.getByText(/Resultados no disponibles/i)).toBeInTheDocument();
  });
});
