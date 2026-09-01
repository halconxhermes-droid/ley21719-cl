import { useEffect, useState, useRef } from "react";
import { useNavigation } from "../context/NavigationContext";
import { getQuiz, submitQuiz } from "../lib/api";
import type { Quiz, QuizResult } from "../lib/api";
import { Loading, ErrorPanel } from "../components/Feedback";
import ProgressBar from "../components/ProgressBar";

export default function QuizView() {
  const { moduleId, navigate } = useNavigation();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const feedbackRef = useRef<HTMLDivElement | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [answers, setAnswers] = useState<number[]>([]);

  useEffect(() => {
    let alive = true;
    setError(null);
    setQuiz(null);
    setIdx(0);
    setSelected(null);
    setAnswered(false);
    setCorrect(0);
    setQuizResult(null);
    setAnswers([]);
    getQuiz(moduleId)
      .then((res) => {
        if (alive) {
          setQuiz(res.quiz);
          setAnswers(Array(res.quiz.questions.length).fill(-1));
        }
      })
      .catch((e: Error) => {
        if (alive) setError(e.message);
      });
    return () => { alive = false; };
  }, [moduleId]);

  if (error) return <ErrorPanel message={error} onRetry={() => navigate("lector", { moduleId })} />;
  if (!quiz) return <Loading label="Cargando quiz…" />;

  const total = quiz.questions.length;
  const q = quiz.questions[idx];
  if (!q) return <p className="text-slate-600">No hay preguntas disponibles.</p>;

  const isLast = idx === total - 1;

  const handleSubmitAnswer = async () => {
    if (selected === null || answered) return;
    const updated = [...answers];
    updated[idx] = selected;
    setAnswers(updated);
    setAnswered(true);
    feedbackRef.current?.focus();
    // Calcular estado local (las respuestas correctas se validan al enviar por API)
    if (isLast) {
      // Enviar al backend para obtener puntaje real
      setSubmitting(true);
      try {
        const res = await submitQuiz(moduleId, updated);
        setQuizResult(res.result);
        saveModuleProgress(res.result);
      } catch (e) {
        setError((e as Error).message);
      } finally {
        setSubmitting(false);
      }
    }
  };

  const handleNext = () => {
    setIdx((n) => n + 1);
    setSelected(null);
    setAnswered(false);
  };

  // Detectar aciertos locales: no tenemos datos del backend hasta POST; el feedback
  // real (correct/incorrect) se muestra tras el POST en el último paso. Para la
  // navegación pregunta-a-pregunta del mockup, anticipamos: el backend devuelve
  // `explanations` con `correctIndex`; localmente mostramos solo selección.
  const isSelected = (i: number) => selected === i;

  // Tras responder: para preguntas intermedias no hay validación del backend;
  // solo marcan transición. Tras la última y el POST, quizResult contiene verdad.
  const showLastResult = quizResult !== null;

  const handleRetry = () => {
    setIdx(0);
    setSelected(null);
    setAnswered(false);
    setQuizResult(null);
    setAnswers(Array(quiz.questions.length).fill(-1));
    setCorrect(0);
  };

  const saveModuleProgress = (result: QuizResult) => {
    try {
      const raw = window.localStorage.getItem("ley21719_module_progress");
      const progress = raw ? JSON.parse(raw) as Record<string, number> : {};
      progress[moduleId] = result.passed ? 100 : Math.max(progress[moduleId] ?? 0, 75);
      window.localStorage.setItem("ley21719_module_progress", JSON.stringify(progress));
    } catch {
      /* noop: el progreso visual no debe bloquear el resultado */
    }
  };

  if (showLastResult) {
    const r = quizResult!;
    return (
      <section aria-labelledby="quiz-title">
        <div className="rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm">
          <h2 id="quiz-title" className="text-2xl font-semibold">Resultados del quiz · Resumen del módulo</h2>
          <p className="mb-2 text-sm text-slate-600">{quiz.moduleId}</p>
          <p className="my-4 text-4xl font-bold text-primary-700">{r.score} / {r.total}</p>
          <p className={`my-4 text-xl font-semibold ${r.passed ? "text-green-700" : "text-red-700"}`}>
            {r.passed ? "✓ Módulo completado" : "✗ Necesitas reforzar"}
          </p>

          <div className="mb-6 grid gap-3 text-left sm:grid-cols-3">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3"><p className="text-xs text-slate-500">Resultado</p><p className="font-semibold text-slate-900">{Math.round((r.score / r.total) * 100)}%</p></div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3"><p className="text-xs text-slate-500">Actividad</p><p className="font-semibold text-slate-900">Quiz realizado</p></div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3"><p className="text-xs text-slate-500">Siguiente paso</p><p className="font-semibold text-slate-900">{r.passed ? "Avanzar" : "Repasar"}</p></div>
          </div>

          <div className={`mb-6 rounded-lg border p-4 text-left ${r.passed ? "border-emerald-200 bg-emerald-50" : "border-amber-200 bg-amber-50"}`}>
            <h3 className="font-semibold text-slate-900">Resumen de aprendizaje</h3>
            <p className="mt-1 text-sm leading-6 text-slate-700">
              {r.passed ? "Has demostrado una comprensión suficiente de este módulo. Revisa las explicaciones para consolidar lo aprendido y continúa con la siguiente parte del curso." : "Revisa las explicaciones de las respuestas incorrectas y vuelve a estudiar el contenido antes de repetir el quiz."}
            </p>
          </div>

          <div className="mx-auto max-w-xl text-left">
            <h3 className="mb-4 text-lg font-semibold">Retroalimentación por pregunta</h3>
            {r.explanations.map((exp, i) => {
              const qtext = quiz.questions[i]?.text ?? exp.questionId;
              const wasCorrect = r.correctIndices.includes(i);
              const userAnswer = answers[i] !== -1 ? quiz.questions[i]?.options[answers[i]]?.text : "Sin responder";
              return (
                <div key={exp.questionId} className={`rounded-md border p-3 mb-2 ${wasCorrect ? "bg-green-50 border-green-200 text-green-800" : "bg-red-50 border-red-200 text-red-800"}`}>
                  <p className="m-0 mb-1 font-medium">{i + 1}. {wasCorrect ? "✓" : "✗"} {qtext}</p>
                  <p className="m-0 text-sm">{wasCorrect ? "" : `Tu respuesta: ${userAnswer}`}</p>
                  <p className="m-0 text-sm opacity-85">{exp.explanation}</p>
                </div>
              );
            })}
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button type="button" onClick={handleRetry} className="rounded-md border border-slate-300 bg-white px-4 py-2 font-medium text-slate-700 hover:bg-slate-50">Repetir quiz</button>
            <button type="button" onClick={() => navigate("lector", { moduleId })} className="rounded-md border border-slate-300 bg-white px-4 py-2 font-medium text-slate-700 hover:bg-slate-50">Repasar módulo</button>
            <button type="button" onClick={() => navigate("home")} className="rounded-md bg-primary-700 px-4 py-2 font-medium text-white hover:bg-primary-800">Continuar curso →</button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section aria-labelledby="quiz-title">
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        {/* Progreso */}
        <p className="mb-2 flex justify-between text-sm font-medium">
          <span>Pregunta <span data-testid="quiz-current">{idx + 1}</span> de {total}</span>
          <span>Respondidas: <span data-testid="quiz-answered">{idx + (answered ? 1 : 0)}</span></span>
        </p>
        <ProgressBar value={(idx / total) * 100} ariaLabel="Progreso del quiz" />

        <h3 id="quiz-title" className="mt-6 text-lg font-semibold">
          <span id={`quiz-question-${idx}`}>{q.text}</span>
        </h3>

        {/* Opciones */}
        <div role="radiogroup" aria-labelledby={`quiz-question-${idx}`} className="mt-4 flex flex-col gap-3">
          {q.options.map((opt) => {
            const inputId = `quiz-opt-${idx}-${opt.id}`;
            return (
              <label
                key={opt.id}
                htmlFor={inputId}
                className={`flex cursor-pointer items-start gap-3 rounded-lg border-2 bg-white p-4 text-base transition-colors hover:border-primary-500 ${
                  isSelected(opt.id) ? "border-primary-700 bg-primary-50" : "border-slate-200"
                }`}
              >
                <input
                  id={inputId}
                  type="radio"
                  name={`quiz-opt-${idx}`}
                  value={opt.id}
                  checked={selected === opt.id}
                  disabled={answered}
                  onChange={() => !answered && setSelected(opt.id)}
                  className="mt-0.5 h-5 w-5 shrink-0 accent-primary-700"
                  aria-checked={isSelected(opt.id) ? "true" : "false"}
                />
                <span className="flex-1">{opt.text}</span>
              </label>
            );
          })}
        </div>

        {/* Feedback inmediato (solo tras responder; muestra explicación del GET si existe) */}
        {answered ? (
          <div
            ref={feedbackRef}
            tabIndex={-1}
            role="status"
            aria-live="polite"
            className="mt-4 rounded-lg border p-4 animate-fade-in bg-primary-50 border-primary-100 text-slate-800"
          >
            {q.explanation ? (
              <p className="m-0">{q.explanation}</p>
            ) : (
              <p className="m-0">Respuesta registrada. {isLast ? "Procesando resultado…" : "Pulsa Siguiente."}</p>
            )}
          </div>
        ) : null}

        {/* Acciones */}
        <div className="mt-6 flex flex-wrap justify-end gap-3 border-t border-slate-200 pt-4">
          <button
            type="button"
            onClick={() => navigate("lector", { moduleId })}
            className="rounded-md border border-slate-300 bg-white px-4 py-2 font-medium text-slate-700 hover:bg-slate-50"
          >
            Salir del quiz
          </button>
          {!answered ? (
            <button
              type="button"
              onClick={handleSubmitAnswer}
              disabled={selected === null || submitting}
              className="rounded-md bg-primary-700 px-4 py-2 font-medium text-white hover:bg-primary-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Enviando…" : "Responder"}
            </button>
          ) : isLast ? null : (
            <button
              type="button"
              onClick={handleNext}
              data-testid="quiz-next"
              className="rounded-md bg-primary-700 px-4 py-2 font-medium text-white hover:bg-primary-800"
            >
              Siguiente →
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
