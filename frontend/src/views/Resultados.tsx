import { useEffect, useState } from "react";
import { useNavigation } from "../context/NavigationContext";
import type { LastTestState } from "./TestFinal";

export default function ResultadosView() {
  const { navigate } = useNavigation();
  const [state, setState] = useState<LastTestState | null>(() => {
    try {
      const raw = window.sessionStorage.getItem("ley21719_test_result");
      if (raw) return JSON.parse(raw) as LastTestState;
    } catch {
      /* noop */
    }
    return null;
  });

  if (!state) {
    return (
      <section aria-labelledby="resultados-title" className="py-12 text-center">
        <h2 id="resultados-title" className="text-2xl font-semibold">
          Resultados no disponibles
        </h2>
        <p className="mt-2 text-slate-600">
          No se encontró un resultado de test final reciente.
        </p>
        <button
          type="button"
          onClick={() => navigate("testfinal")}
          className="mt-6 rounded-md bg-primary-700 px-4 py-2 font-medium text-white hover:bg-primary-800"
        >
          Ir al test final
        </button>
      </section>
    );
  }

  const { result, questions, answers } = state;

  return (
    <section aria-labelledby="resultados-title" className="py-6">
      <div className="mx-auto max-w-2xl text-center">
        <h2 id="resultados-title" className="text-2xl font-semibold">
          Resultados del test final
        </h2>
        <p id="result-score" className="my-2 text-4xl font-bold text-primary-700">
          {result.score} / {result.total}
        </p>
        <p
          id="result-status"
          className={`my-6 text-xl font-semibold ${
            result.passed ? "text-green-700" : "text-red-700"
          }`}
        >
          {result.passed
            ? `✓ Aprobado (${result.percentage}%)`
            : `✗ No alcanzado (${result.percentage}%) — repasa y vuelve a intentarlo`}
        </p>

        {result.certificateEligible ? (
          <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-4 text-green-900">
            <p className="m-0 font-semibold">¡Elegible para certificado de aprobación!</p>
            <p className="m-0 text-sm">Has superado el umbral del 70% en el test final.</p>
          </div>
        ) : null}

        <div className="mb-8 rounded-xl border border-slate-200 bg-white p-6 text-left shadow-sm">
          <h3 className="mb-4 text-lg font-semibold">Detalle por pregunta</h3>
          <div id="result-detail" className="divide-y divide-slate-200">
            {questions.map((q, i) => {
              const userOptId = answers[i];
              const userOpt = q.options.find((o) => o.id === userOptId);
              // Como el backend no devuelve qué opción era la correcta en POST /final-test/submit (solo puntaje global y desglose por módulo),
              // mostramos la respuesta del usuario seleccionada.
              return (
                <div key={q.id} className="py-3 flex justify-between items-center gap-4">
                  <div>
                    <span className="font-medium text-slate-900">{i + 1}.</span>{" "}
                    <span className="text-slate-700">{q.text}</span>
                  </div>
                  <div className="shrink-0 text-sm font-medium text-slate-600">
                    Tu respuesta: {userOpt ? userOpt.text : "Sin responder"}
                  </div>
                </div>
              );
            })}
          </div>

          {result.detailByModule?.length ? (
            <div className="mt-6 border-t border-slate-200 pt-4">
              <h4 className="mb-2 text-sm font-semibold uppercase tracking-wider text-slate-500">
                Desglose por módulo
              </h4>
              <ul className="m-0 list-none p-0 space-y-1">
                {result.detailByModule.map((dm) => (
                  <li key={dm.moduleId} className="flex justify-between text-sm">
                    <span className="text-slate-700">{dm.moduleId}</span>
                    <span className="font-medium text-slate-900">
                      {dm.correct}/{dm.total} ({dm.percentage}%)
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          <button
            type="button"
            id="result-retry"
            onClick={() => navigate("testfinal")}
            className="rounded-md border border-slate-300 bg-white px-4 py-2 font-medium text-slate-700 hover:bg-slate-50"
          >
            Repetir test
          </button>
          <button
            type="button"
            onClick={() => navigate("home")}
            className="rounded-md bg-primary-700 px-4 py-2 font-medium text-white hover:bg-primary-800"
          >
            Volver al inicio
          </button>
          <button
            type="button"
            onClick={() => navigate("glosario")}
            className="rounded-md border border-transparent px-4 py-2 font-medium text-primary-700 hover:bg-primary-50"
          >
            Repasar glosario
          </button>
        </div>
      </div>
    </section>
  );
}
