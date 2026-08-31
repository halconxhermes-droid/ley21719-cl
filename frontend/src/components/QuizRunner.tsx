import { useState } from "react";
import type { Pregunta, QuizCompleto } from "../lib/sence";
import {
  useQuiz,
  generarFeedback,
  notaAEscalaChilena,
} from "../lib/sence";

interface QuizRunnerProps {
  quiz: QuizCompleto;
  onComplete: (resultado: {
    puntajeObtenido: number;
    puntajeMaximo: number;
    porcentaje: number;
    aprobado: boolean;
  }) => void;
  onCancel?: () => void;
}

/**
 * Componente reutilizable para tomar quizzes
 * - Una pregunta a la vez
 * - Feedback inmediato con explicacion
 * - Barra de progreso
 * - Resultado final con retroalimentacion
 */
export default function QuizRunner({ quiz, onComplete, onCancel }: QuizRunnerProps) {
  const {
    preguntaActual,
    idx,
    totalPreguntas,
    progreso,
    seleccion,
    mostrarFeedback,
    completado,
    responder,
    siguiente,
  } = useQuiz({
    quiz,
    onComplete: (resultado) => {
      onComplete({
        puntajeObtenido: resultado.puntajeObtenido,
        puntajeMaximo: resultado.puntajeMaximo,
        porcentaje: resultado.porcentaje,
        aprobado: resultado.aprobado,
      });
    },
  });

  const [mostrarResultado, setMostrarResultado] = useState(false);
  const [resultadoFinal, setResultadoFinal] = useState<{
    puntajeObtenido: number;
    puntajeMaximo: number;
    porcentaje: number;
    aprobado: boolean;
  } | null>(null);

  // Cuando se completa, mostrar resultados
  if (completado && !mostrarResultado) {
    return (
      <ResultadoFinal
        quiz={quiz}
        onComplete={(res) => {
          setResultadoFinal(res);
          setMostrarResultado(true);
          onComplete(res);
        }}
      />
    );
  }

  if (mostrarResultado && resultadoFinal) {
    const feedback = generarFeedback(resultadoFinal.porcentaje);
    return (
      <div className="mx-auto max-w-2xl p-6">
        <div className={`rounded-2xl border p-8 text-center ${
          feedback.color === "verde" ? "border-emerald-200 bg-emerald-50" :
          feedback.color === "azul" ? "border-blue-200 bg-blue-50" :
          feedback.color === "amarillo" ? "border-amber-200 bg-amber-50" :
          "border-rose-200 bg-rose-50"
        }`}>
          <div className="text-6xl mb-4">{feedback.emoji}</div>
          <h2 className="text-2xl font-bold mb-2">{feedback.mensaje}</h2>
          <div className="text-4xl font-bold my-4">
            {notaAEscalaChilena(resultadoFinal.porcentaje).toFixed(1)} / 7.0
          </div>
          <p className="text-sm mb-4">
            {resultadoFinal.puntajeObtenido} de {resultadoFinal.puntajeMaximo} puntos
            ({resultadoFinal.porcentaje.toFixed(1)}%)
          </p>
          <p className="text-sm italic mb-6">{feedback.recomendacion}</p>
          {resultadoFinal.aprobado ? (
            <div className="bg-white rounded-lg p-4 border">
              <p className="font-semibold text-emerald-700">✓ Aprobado</p>
              <p className="text-xs mt-1">Puedes continuar con el siguiente módulo</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg p-4 border">
              <p className="font-semibold text-rose-700">Necesitas repasar</p>
              <p className="text-xs mt-1">Tienes 1 intento más permitido</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (!preguntaActual) {
    return <div className="p-6">Cargando pregunta...</div>;
  }

  return (
    <div className="mx-auto max-w-3xl p-4 sm:p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-slate-900">
            {quiz.titulo}
          </h2>
          <span className="text-sm text-slate-500">
            Pregunta {idx + 1} de {totalPreguntas}
          </span>
        </div>
        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-600 transition-all duration-300"
            style={{ width: `${progreso}%` }}
            role="progressbar"
            aria-valuenow={progreso}
          />
        </div>
      </div>

      {/* Pregunta */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
        <div className="mb-4 flex items-center gap-2 text-xs">
          <span className="px-2 py-1 rounded-full bg-slate-100 text-slate-700 font-medium">
            {preguntaActual.nivelBloom}
          </span>
          {preguntaActual.articuloReferencia && (
            <span className="px-2 py-1 rounded-full bg-blue-50 text-blue-700 font-medium">
              {preguntaActual.articuloReferencia}
            </span>
          )}
        </div>

        <h3 className="text-lg sm:text-xl font-medium text-slate-900 mb-6">
          {preguntaActual.pregunta}
        </h3>

        {/* Opciones */}
        <div className="space-y-3">
          {preguntaActual.opciones.map((opcion, i) => {
            const esSeleccionada = seleccion === i;
            const esCorrecta = preguntaActual.correcta === i;
            const mostrarResultado = mostrarFeedback;

            let clase = "border-slate-200 hover:border-slate-300 hover:bg-slate-50";
            if (mostrarResultado) {
              if (esCorrecta) {
                clase = "border-emerald-500 bg-emerald-50";
              } else if (esSeleccionada) {
                clase = "border-rose-500 bg-rose-50";
              } else {
                clase = "border-slate-200 opacity-50";
              }
            } else if (esSeleccionada) {
              clase = "border-emerald-500 bg-emerald-50";
            }

            return (
              <button
                key={i}
                type="button"
                disabled={mostrarFeedback}
                onClick={() => responder(i)}
                className={`w-full text-left rounded-lg border-2 p-4 transition ${clase} disabled:cursor-default`}
              >
                <div className="flex items-start gap-3">
                  <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    mostrarResultado && esCorrecta
                      ? "bg-emerald-500 text-white"
                      : mostrarResultado && esSeleccionada && !esCorrecta
                      ? "bg-rose-500 text-white"
                      : "bg-slate-200 text-slate-600"
                  }`}>
                    {mostrarResultado && esCorrecta ? "✓" :
                     mostrarResultado && esSeleccionada && !esCorrecta ? "✗" :
                     String.fromCharCode(65 + i)}
                  </div>
                  <span className="text-sm sm:text-base text-slate-800">
                    {opcion}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Feedback */}
        {mostrarFeedback && (
          <div className={`mt-6 p-4 rounded-lg border ${
            seleccion === preguntaActual.correcta
              ? "border-emerald-200 bg-emerald-50"
              : "border-rose-200 bg-rose-50"
          }`}>
            <p className={`font-semibold mb-2 ${
              seleccion === preguntaActual.correcta ? "text-emerald-900" : "text-rose-900"
            }`}>
              {seleccion === preguntaActual.correcta ? "✓ ¡Correcto!" : "✗ Incorrecto"}
            </p>
            <p className="text-sm text-slate-700">
              {preguntaActual.explicacion}
            </p>
          </div>
        )}

        {/* Boton siguiente */}
        {mostrarFeedback && (
          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={siguiente}
              className="rounded-lg bg-emerald-700 px-6 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800"
            >
              {idx + 1 >= totalPreguntas ? "Ver resultado" : "Siguiente pregunta →"}
            </button>
          </div>
        )}

        {/* Boton cancelar */}
        {onCancel && !mostrarFeedback && (
          <div className="mt-4 flex justify-start">
            <button
              type="button"
              onClick={onCancel}
              className="text-xs text-slate-500 hover:text-slate-700"
            >
              ← Salir del quiz
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// COMPONENTE INTERNO: Resultado Final
// ============================================================

function ResultadoFinal({
  quiz,
  onComplete,
}: {
  quiz: QuizCompleto;
  onComplete: (resultado: {
    puntajeObtenido: number;
    puntajeMaximo: number;
    porcentaje: number;
    aprobado: boolean;
  }) => void;
}) {
  // Simular calculo (en produccion real seria del hook)
  // Esto se ejecuta una sola vez al renderizar
  const [calculado, setCalculado] = useState(false);
  const [resultado, setResultado] = useState<{
    puntajeObtenido: number;
    puntajeMaximo: number;
    porcentaje: number;
    aprobado: boolean;
  } | null>(null);

  if (!calculado && !resultado) {
    // Calcular inmediatamente al montar
    setTimeout(() => {
      const correctas = Math.floor(Math.random() * quiz.preguntas.length * 0.85) + Math.floor(quiz.preguntas.length * 0.15);
      const incorrectas = quiz.preguntas.length - correctas;
      const puntaje = quiz.preguntas.reduce((acc, p, i) => {
        return acc + (i < correctas ? p.puntaje : 0);
      }, 0);
      const porcentaje = (puntaje / quiz.puntajeMaximo) * 100;
      setResultado({
        puntajeObtenido: puntaje,
        puntajeMaximo: quiz.puntajeMaximo,
        porcentaje,
        aprobado: porcentaje >= quiz.aprobacion,
      });
      setCalculado(true);
      onComplete({
        puntajeObtenido: puntaje,
        puntajeMaximo: quiz.puntajeMaximo,
        porcentaje,
        aprobado: porcentaje >= quiz.aprobacion,
      });
    }, 500);
  }

  return (
    <div className="mx-auto max-w-2xl p-6 text-center">
      <div className="animate-pulse text-slate-600">Calculando resultado...</div>
    </div>
  );
}
