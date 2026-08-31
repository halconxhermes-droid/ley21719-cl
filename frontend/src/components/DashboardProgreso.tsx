import { useState, useEffect } from "react";
import {
  ProgresoEstudiante,
  calcularNotaFinal,
  generarFeedback,
  notaAEscalaChilena,
  ResultadoQuiz,
} from "../lib/sence";

interface DashboardProgresoProps {
  estudianteId: string;
  nombreEstudiante: string;
  quizzes: Record<string, ResultadoQuiz>;
  casos: Record<string, number>;
  examenFinal: ResultadoQuiz | null;
  proyectoNota: number | null;
  horasDedicadas: number;
  onVerCertificado: () => void;
}

/**
 * Dashboard de progreso del estudiante
 * Muestra notas, horas dedicadas, y estado del curso
 */
export default function DashboardProgreso({
  estudianteId,
  nombreEstudiante,
  quizzes,
  casos,
  examenFinal,
  proyectoNota,
  horasDedicadas,
  onVerCertificado,
}: DashboardProgresoProps) {
  const [progreso, setProgreso] = useState<ProgresoEstudiante | null>(null);

  useEffect(() => {
    const p = calcularNotaFinal(
      quizzes,
      casos,
      examenFinal,
      proyectoNota,
      horasDedicadas
    );
    p.estudianteId = estudianteId;
    setProgreso(p);
  }, [estudianteId, quizzes, casos, examenFinal, proyectoNota, horasDedicadas]);

  if (!progreso) {
    return <div className="p-6">Cargando progreso...</div>;
  }

  const totalQuizzes = 6; // 6 quizzes en el curso
  const totalCasos = 5; // 5 casos prácticos
  const quizzesCompletados = Object.keys(quizzes).length;
  const casosCompletados = Object.keys(casos).length;
  const examenCompletado = examenFinal !== null;
  const proyectoEntregado = proyectoNota !== null;

  const tareasTotales = totalQuizzes + totalCasos + 1 + 1; // quizzes + casos + examen + proyecto
  const tareasCompletadas = quizzesCompletados + casosCompletados +
    (examenCompletado ? 1 : 0) + (proyectoEntregado ? 1 : 0);
  const porcentajeTareas = (tareasCompletadas / tareasTotales) * 100;

  const horasEsperadas = 80;
  const porcentajeHoras = Math.min((horasDedicadas / horasEsperadas) * 100, 100);

  return (
    <div className="mx-auto max-w-4xl p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-800 p-6 sm:p-8 text-white shadow-lg">
        <h1 className="text-2xl sm:text-3xl font-bold">Hola, {nombreEstudiante}</h1>
        <p className="mt-2 text-emerald-100">
          Tu progreso en el curso Ley 21.719
        </p>
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <div className="text-3xl font-bold">
              {progreso.notaFinal?.toFixed(1) || "—"}
            </div>
            <div className="text-sm text-emerald-100">Nota Final</div>
          </div>
          <div>
            <div className="text-3xl font-bold">{horasDedicadas}h</div>
            <div className="text-sm text-emerald-100">Dedicadas</div>
          </div>
          <div>
            <div className="text-3xl font-bold">{quizzesCompletados}/{totalQuizzes}</div>
            <div className="text-sm text-emerald-100">Quizzes</div>
          </div>
          <div>
            <div className="text-3xl font-bold">
              {progreso.aprobado ? "✓" : "—"}
            </div>
            <div className="text-sm text-emerald-100">Estado</div>
          </div>
        </div>
      </div>

      {/* Progreso General */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">
          Progreso del Curso
        </h2>

        <div className="space-y-4">
          {/* Tareas */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-slate-700">Tareas completadas</span>
              <span className="font-semibold">{tareasCompletadas}/{tareasTotales}</span>
            </div>
            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-600 transition-all"
                style={{ width: `${porcentajeTareas}%` }}
              />
            </div>
          </div>

          {/* Horas */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-slate-700">Horas dedicadas</span>
              <span className="font-semibold">{horasDedicadas}/{horasEsperadas}h</span>
            </div>
            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all ${
                  porcentajeHoras >= 100 ? "bg-emerald-600" : "bg-blue-600"
                }`}
                style={{ width: `${porcentajeHoras}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Desglose por Componente */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">
          Desglose de Calificación
        </h2>

        <div className="space-y-3">
          {/* Quizzes */}
          <div className="flex items-center justify-between py-2 border-b border-slate-100">
            <div>
              <div className="font-medium text-slate-800">Quizzes por módulo</div>
              <div className="text-xs text-slate-500">30% de la nota final</div>
            </div>
            <div className="text-right">
              <div className="font-bold text-slate-900">
                {quizzesCompletados > 0
                  ? notaAEscalaChilena(
                      (Object.values(quizzes).reduce((s, r) => s + r.porcentaje, 0) /
                        quizzesCompletados)
                    ).toFixed(1)
                  : "—"}
              </div>
              <div className="text-xs text-slate-500">
                {quizzesCompletados}/{totalQuizzes} completados
              </div>
            </div>
          </div>

          {/* Casos */}
          <div className="flex items-center justify-between py-2 border-b border-slate-100">
            <div>
              <div className="font-medium text-slate-800">Casos prácticos</div>
              <div className="text-xs text-slate-500">15% de la nota final</div>
            </div>
            <div className="text-right">
              <div className="font-bold text-slate-900">
                {casosCompletados > 0
                  ? (Object.values(casos).reduce((s, n) => s + n, 0) / casosCompletados).toFixed(1)
                  : "—"}
              </div>
              <div className="text-xs text-slate-500">
                {casosCompletados}/{totalCasos} entregados
              </div>
            </div>
          </div>

          {/* Examen Final */}
          <div className="flex items-center justify-between py-2 border-b border-slate-100">
            <div>
              <div className="font-medium text-slate-800">Examen Final</div>
              <div className="text-xs text-slate-500">20% de la nota final</div>
            </div>
            <div className="text-right">
              <div className="font-bold text-slate-900">
                {examenCompletado
                  ? notaAEscalaChilena(examenFinal.porcentaje).toFixed(1)
                  : "—"}
              </div>
              <div className="text-xs text-slate-500">
                {examenCompletado ? "Aprobado" : "Pendiente"}
              </div>
            </div>
          </div>

          {/* Proyecto Final */}
          <div className="flex items-center justify-between py-2">
            <div>
              <div className="font-medium text-slate-800">Proyecto Final</div>
              <div className="text-xs text-slate-500">20% de la nota final</div>
            </div>
            <div className="text-right">
              <div className="font-bold text-slate-900">
                {proyectoEntregado ? proyectoNota?.toFixed(1) : "—"}
              </div>
              <div className="text-xs text-slate-500">
                {proyectoEntregado ? "Entregado" : "Pendiente"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Estado del Curso */}
      {progreso.aprobado && progreso.notaFinal && (
        <div className="rounded-2xl border-2 border-emerald-500 bg-emerald-50 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="text-4xl">🎓</div>
            <div>
              <h2 className="text-xl font-bold text-emerald-900">
                ¡Felicitaciones! Has aprobado el curso
              </h2>
              <p className="text-sm text-emerald-800">
                Nota final: {progreso.notaFinal.toFixed(1)} / 7.0
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onVerCertificado}
            className="w-full mt-4 rounded-lg bg-emerald-700 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-800"
          >
            📜 Ver Certificado Digital
          </button>
        </div>
      )}

      {!progreso.aprobado && tareasCompletadas > 0 && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="text-3xl">📚</div>
            <div>
              <h2 className="text-lg font-bold text-amber-900">
                Continúa tu aprendizaje
              </h2>
              <p className="text-sm text-amber-800">
                Te faltan {tareasTotales - tareasCompletadas} tareas para completar el curso.
                ¡No te rindas!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
