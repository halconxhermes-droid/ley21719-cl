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
      <nav aria-label="Ruta de navegación" className="mb-5 text-sm text-slate-500">
        <button type="button" onClick={() => navigate("home")} className="hover:text-primary-700 hover:underline">Curso</button>
        <span className="mx-2" aria-hidden="true">/</span>
        <span aria-current="page" className="font-medium text-slate-700">Resultados finales</span>
      </nav>
      <div className="mx-auto max-w-3xl">
        <div className={`rounded-2xl p-6 text-center shadow-sm sm:p-8 ${result.passed ? "bg-gradient-to-br from-emerald-900 to-emerald-700 text-white" : "bg-gradient-to-br from-slate-800 to-slate-700 text-white"}`}>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] opacity-80">Cierre de evaluación</p>
          <h1 id="resultados-title" className="mt-2 text-2xl font-bold sm:text-3xl">Resultados del test final</h1>
          <p id="result-score" className="my-3 text-5xl font-bold">{result.score} / {result.total}</p>
          <p id="result-status" className="text-lg font-semibold">
            {result.passed ? `✓ Curso aprobado (${result.percentage}%)` : `✗ Aún no alcanzado (${result.percentage}%)`}
          </p>
          <p className="mx-auto mt-3 max-w-xl text-sm opacity-85">
            {result.passed ? "Has completado la evaluación final. Revisa tu resumen y conserva tus resultados." : "Revisa el detalle de tus respuestas, vuelve al material y repite la evaluación cuando estés preparado."}
          </p>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-4 text-center shadow-sm"><p className="text-xs uppercase tracking-wide text-slate-500">Porcentaje</p><p className="mt-1 text-2xl font-bold text-primary-700">{result.percentage}%</p></div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 text-center shadow-sm"><p className="text-xs uppercase tracking-wide text-slate-500">Preguntas correctas</p><p className="mt-1 text-2xl font-bold text-slate-900">{result.score}/{result.total}</p></div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 text-center shadow-sm"><p className="text-xs uppercase tracking-wide text-slate-500">Estado</p><p className={`mt-1 text-lg font-bold ${result.passed ? "text-emerald-700" : "text-amber-700"}`}>{result.passed ? "Completado" : "En refuerzo"}</p></div>
        </div>

        {result.certificateEligible ? (
          <div className="mt-4 rounded-xl border border-green-200 bg-green-50 p-5 text-green-900">
            <p className="font-semibold">¡Felicitaciones! Tu resultado permite solicitar la constancia de aprobación.</p>
            <p className="mt-1 text-sm">Conserva esta pantalla y sigue las instrucciones de entrega disponibles en la plataforma.</p>
          </div>
        ) : null}

        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6 text-left shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Resumen de tu recorrido</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg bg-slate-50 p-4"><p className="text-xs uppercase tracking-wide text-slate-500">Cobertura</p><p className="mt-1 font-semibold text-slate-900">{result.detailByModule?.length ?? 0} módulos evaluados</p></div>
            <div className="rounded-lg bg-slate-50 p-4"><p className="text-xs uppercase tracking-wide text-slate-500">Próximo paso</p><p className="mt-1 font-semibold text-slate-900">{result.passed ? "Revisar tus resultados" : "Repasar contenidos"}</p></div>
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6 text-left shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Detalle de respuestas</h2>
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
