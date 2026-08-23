import { useEffect, useState } from "react";
import { useNavigation } from "../context/NavigationContext";
import { getFinalTest, submitFinalTest } from "../lib/api";
import type { FinalTest, FinalTestSubmitResult } from "../lib/api";
import { Loading, ErrorPanel } from "../components/Feedback";

export interface LastTestState {
  answers: number[];
  result: FinalTestSubmitResult["result"];
  questions: FinalTest["questions"];
}

interface TestFinalProps {
  onComplete?: (state: LastTestState) => void;
}

export default function TestFinalView({ onComplete }: TestFinalProps) {
  const { navigate } = useNavigation();
  const [test, setTest] = useState<FinalTest | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let alive = true;
    setError(null);
    getFinalTest()
      .then((res) => {
        if (!alive) return;
        setTest(res.test);
        setAnswers(Array(res.test.questions.length).fill(-1));
      })
      .catch((e: Error) => {
        if (alive) setError(e.message);
      });
    return () => { alive = false; };
  }, []);

  if (error) return <ErrorPanel message={error} onRetry={() => window.location.reload()} />;
  if (!test) return <Loading label="Cargando test final…" />;

  const handleSelect = (qIdx: number, optId: number) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[qIdx] = optId;
      return next;
    });
  };

  const answeredCount = answers.filter((a) => a !== -1).length;
  const isComplete = answeredCount === test.questions.length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isComplete || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await submitFinalTest(answers);
      const state: LastTestState = {
        answers,
        result: res.result,
        questions: test.questions,
      };
      try {
        window.sessionStorage.setItem("ley21719_test_result", JSON.stringify(state));
      } catch {
        /* noop */
      }
      onComplete?.(state);
      navigate("resultados");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section aria-labelledby="testfinal-title">
      <header className="mb-8 text-center">
        <h2 id="testfinal-title" className="mb-2 text-2xl font-semibold">
          Test final
        </h2>
        <p className="text-slate-600">
          {test.totalQuestions} preguntas sobre toda la ley · Sin feedback inmediato ·
          Resultados al terminar (umbral aprobación: {test.passThreshold}%).
        </p>
        <p className="mt-2 text-sm font-medium text-slate-700">
          Respondidas: {answeredCount} de {test.questions.length}
        </p>
      </header>

      <form id="testfinal-form" onSubmit={handleSubmit} noValidate>
        <div id="testfinal-questions" className="space-y-6">
          {test.questions.map((q, qIdx) => {
            const groupName = `tf_${qIdx}`;
            return (
              <fieldset
                key={q.id}
                className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <legend className="mb-4 text-base font-semibold text-slate-900">
                  {qIdx + 1}. {q.text}
                </legend>
                <div className="space-y-3">
                  {q.options.map((opt) => {
                    const optId = `tf_${qIdx}_${opt.id}`;
                    const selected = answers[qIdx] === opt.id;
                    return (
                      <label
                        key={opt.id}
                        htmlFor={optId}
                        className={`flex cursor-pointer items-start gap-3 rounded-lg border-2 p-4 transition-colors hover:border-primary-500 ${
                          selected
                            ? "border-primary-700 bg-primary-50"
                            : "border-slate-200 bg-white"
                        }`}
                      >
                        <input
                          id={optId}
                          type="radio"
                          name={groupName}
                          value={opt.id}
                          checked={selected}
                          onChange={() => handleSelect(qIdx, opt.id)}
                          className="mt-0.5 h-5 w-5 shrink-0 accent-primary-700"
                        />
                        <span className="text-base text-slate-800">{opt.text}</span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            );
          })}
        </div>

        {error ? <div className="mt-4"><ErrorPanel message={error} /></div> : null}

        <div className="mt-6 text-center">
          <button
            type="submit"
            id="testfinal-submit"
            disabled={!isComplete || submitting}
            className="rounded-md bg-primary-700 px-6 py-3 font-medium text-white shadow-sm hover:bg-primary-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? "Enviando…" : "Enviar respuestas y ver resultados"}
          </button>
        </div>
      </form>
    </section>
  );
}
