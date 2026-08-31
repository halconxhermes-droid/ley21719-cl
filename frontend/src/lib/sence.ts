/**
 * Sistema de Evaluacion SENCE
 * Hooks y funciones para quizzes, examenes, calificacion y certificados
 */

import { useState, useEffect, useCallback, useRef } from "react";

// ============================================================
// TIPOS
// ============================================================

export interface Pregunta {
  id: string;
  modulo: string;
  nivelBloom: "recordar" | "comprender" | "aplicar" | "analizar" | "evaluar";
  pregunta: string;
  opciones: string[];
  correcta: number;
  explicacion: string;
  articuloReferencia?: string;
  puntaje: number;
}

export interface QuizCompleto {
  id: string;
  titulo: string;
  modulo: string;
  preguntas: Pregunta[];
  duracionMinutos: number;
  puntajeMaximo: number;
  aprobacion: number; // porcentaje
  intentosPermitidos: number;
}

export interface RespuestaQuiz {
  preguntaId: string;
  seleccion: number;
  tiempoSegundos: number;
  esCorrecta: boolean;
}

export interface ResultadoQuiz {
  quizId: string;
  puntajeObtenido: number;
  puntajeMaximo: number;
  porcentaje: number;
  aprobado: boolean;
  correctas: number;
  incorrectas: number;
  tiempoTotalSegundos: number;
  respuestas: RespuestaQuiz[];
  feedbackPorPregunta: { preguntaId: string; correcta: boolean; explicacion: string }[];
}

export interface ProgresoEstudiante {
  estudianteId: string;
  cursoId: string;
  quizzesCompletados: string[];
  notasPorQuiz: Record<string, ResultadoQuiz>;
  casosCompletados: string[];
  proyectoFinal: {
    entregado: boolean;
    nota?: number;
    fechaEntrega?: string;
  };
  examenFinal?: ResultadoQuiz;
  notaFinal?: number;
  aprobado: boolean;
  horasDedicadas: number;
}

// ============================================================
// HOOK: useQuiz
// ============================================================

interface UseQuizOptions {
  quiz: QuizCompleto;
  onComplete: (resultado: ResultadoQuiz) => void;
  onProgress?: (progreso: number) => void;
}

export function useQuiz({ quiz, onComplete, onProgress }: UseQuizOptions) {
  const [idx, setIdx] = useState(0);
  const [respuestas, setRespuestas] = useState<RespuestaQuiz[]>([]);
  const [seleccion, setSeleccion] = useState<number | null>(null);
  const [mostrarFeedback, setMostrarFeedback] = useState(false);
  const [tiempoInicio] = useState(Date.now());
  const [tiempoPregunta, setTiempoPregunta] = useState(Date.now());
  const [completado, setCompletado] = useState(false);

  const preguntaActual = quiz.preguntas[idx];
  const totalPreguntas = quiz.preguntas.length;
  const progreso = ((idx + 1) / totalPreguntas) * 100;

  useEffect(() => {
    if (onProgress) onProgress(progreso);
  }, [progreso, onProgress]);

  const responder = useCallback((opcionIdx: number) => {
    if (mostrarFeedback) return;
    setSeleccion(opcionIdx);
    setMostrarFeedback(true);
  }, [mostrarFeedback]);

  const siguiente = useCallback(() => {
    if (seleccion === null) return;

    const tiempoRespuesta = Math.floor((Date.now() - tiempoPregunta) / 1000);
    const esCorrecta = seleccion === preguntaActual.correcta;
    const nuevaRespuesta: RespuestaQuiz = {
      preguntaId: preguntaActual.id,
      seleccion,
      tiempoSegundos: tiempoRespuesta,
      esCorrecta,
    };

    const nuevasRespuestas = [...respuestas, nuevaRespuesta];
    setRespuestas(nuevasRespuestas);
    setMostrarFeedback(false);
    setSeleccion(null);
    setTiempoPregunta(Date.now());

    if (idx + 1 >= totalPreguntas) {
      // Calcular resultado final
      const correctas = nuevasRespuestas.filter(r => r.esCorrecta).length;
      const puntajeObtenido = nuevasRespuestas.reduce((acc, r) => {
        const pregunta = quiz.preguntas.find(p => p.id === r.preguntaId);
        return acc + (r.esCorrecta ? pregunta?.puntaje || 0 : 0);
      }, 0);
      const porcentaje = (puntajeObtenido / quiz.puntajeMaximo) * 100;
      const tiempoTotal = Math.floor((Date.now() - tiempoInicio) / 1000);

      const resultado: ResultadoQuiz = {
        quizId: quiz.id,
        puntajeObtenido,
        puntajeMaximo: quiz.puntajeMaximo,
        porcentaje,
        aprobado: porcentaje >= quiz.aprobacion,
        correctas,
        incorrectas: totalPreguntas - correctas,
        tiempoTotalSegundos: tiempoTotal,
        respuestas: nuevasRespuestas,
        feedbackPorPregunta: nuevasRespuestas.map(r => {
          const pregunta = quiz.preguntas.find(p => p.id === r.preguntaId);
          return {
            preguntaId: r.preguntaId,
            correcta: r.esCorrecta,
            explicacion: pregunta?.explicacion || "",
          };
        }),
      };

      setCompletado(true);
      onComplete(resultado);
    } else {
      setIdx(idx + 1);
    }
  }, [idx, seleccion, preguntaActual, respuestas, quiz, tiempoInicio, tiempoPregunta, onComplete, totalPreguntas]);

  return {
    preguntaActual,
    idx,
    totalPreguntas,
    progreso,
    seleccion,
    mostrarFeedback,
    completado,
    respuestas,
    responder,
    siguiente,
  };
}

// ============================================================
// HOOK: useExamenFinal
// ============================================================

interface UseExamenOptions {
  examen: QuizCompleto;
  duracionMinutos: number;
  onComplete: (resultado: ResultadoQuiz) => void;
  onTimeOut: () => void;
}

export function useExamenFinal({ examen, duracionMinutos, onComplete, onTimeOut }: UseExamenOptions) {
  const [tiempoRestante, setTiempoRestante] = useState(duracionMinutos * 60);
  const [iniciado, setIniciado] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!iniciado) return;
    timerRef.current = window.setInterval(() => {
      setTiempoRestante(prev => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          onTimeOut();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [iniciado, onTimeOut]);

  const iniciar = useCallback(() => setIniciado(true), []);

  const tiempoFormateado = () => {
    const min = Math.floor(tiempoRestante / 60);
    const seg = tiempoRestante % 60;
    return `${min.toString().padStart(2, "0")}:${seg.toString().padStart(2, "0")}`;
  };

  return {
    tiempoRestante,
    tiempoFormateado,
    iniciar,
    iniciado,
  };
}

// ============================================================
// FUNCIONES DE CALIFICACION
// ============================================================

/**
 * Calcula la nota final del curso segun el sistema de calificacion SENCE
 */
export function calcularNotaFinal(
  quizzes: Record<string, ResultadoQuiz>,
  casos: Record<string, number>, // casoId -> nota (1-7)
  examenFinal: ResultadoQuiz | null,
  proyectoNota: number | null, // 1-7
  horasDedicadas: number
): ProgresoEstudiante {
  // Calcular promedios
  const notasQuizzes = Object.values(quizzes);
  const promedioQuizzes = notasQuizzes.length > 0
    ? notasQuizzes.reduce((sum, r) => sum + r.porcentaje, 0) / notasQuizzes.length
    : 0;
  const notaQuizzes = (promedioQuizzes / 100) * 7;

  // Foros (asumimos aprobacion automatica por ahora)
  const notaForos = 6.0;

  // Casos practicos
  const notasCasos = Object.values(casos);
  const promedioCasos = notasCasos.length > 0
    ? notasCasos.reduce((sum, n) => sum + n, 0) / notasCasos.length
    : 0;

  // Examen final
  const notaExamen = examenFinal
    ? (examenFinal.porcentaje / 100) * 7
    : 0;

  // Proyecto final
  const notaProyecto = proyectoNota || 0;

  // Nota final ponderada
  const notaFinal =
    notaQuizzes * 0.30 +
    notaForos * 0.05 +
    promedioCasos * 0.15 +
    notaExamen * 0.20 +
    notaProyecto * 0.20;

  return {
    estudianteId: "",
    cursoId: "ley21719-sence",
    quizzesCompletados: Object.keys(quizzes),
    notasPorQuiz: quizzes,
    casosCompletados: Object.keys(casos),
    proyectoFinal: {
      entregado: proyectoNota !== null,
      nota: proyectoNota || undefined,
    },
    examenFinal: examenFinal || undefined,
    notaFinal: Math.round(notaFinal * 10) / 10,
    aprobado: notaFinal >= 5.0,
    horasDedicadas,
  };
}

/**
 * Genera mensaje de retroalimentacion segun el desempeno
 */
export function generarFeedback(nota: number): {
  emoji: string;
  mensaje: string;
  recomendacion: string;
  color: "verde" | "azul" | "amarillo" | "rojo";
} {
  if (nota >= 9.0) {
    return {
      emoji: "🏆",
      mensaje: "¡Excelente trabajo! Desempeño Summa Cum Laude.",
      recomendacion: "Continúa así. Estás listo para el examen final.",
      color: "verde",
    };
  } else if (nota >= 7.0) {
    return {
      emoji: "🌟",
      mensaje: "¡Muy bien! Desempeño Magna Cum Laude.",
      recomendacion: "Excelente trabajo. Sigue profundizando.",
      color: "verde",
    };
  } else if (nota >= 5.0) {
    return {
      emoji: "✅",
      mensaje: "Aprobado. Buen trabajo.",
      recomendacion: "Refuerza los temas donde tuviste errores.",
      color: "azul",
    };
  } else if (nota >= 4.0) {
    return {
      emoji: "⚠️",
      mensaje: "Necesitas reforzar. Cerca del aprobado.",
      recomendacion: "Revisa el material y repite el quiz.",
      color: "amarillo",
    };
  } else {
    return {
      emoji: "❌",
      mensaje: "No aprobaste. Necesitas estudiar más.",
      recomendacion: "Revisa los manuales y pide tutoría.",
      color: "rojo",
    };
  }
}

/**
 * Convierte nota numerica a escala 1-7
 */
export function notaAEscalaChilena(porcentaje: number): number {
  return Math.round((porcentaje / 100) * 7 * 10) / 10;
}

/**
 * Convierte nota 1-7 a porcentaje
 */
export function escalaAPorcentaje(nota: number): number {
  return Math.round((nota / 7) * 100 * 10) / 10;
}

/**
 * Genera codigo unico para estudiante (UUID)
 */
export function generarCodigoEstudiante(): string {
  return "EST-" + Date.now().toString(36).toUpperCase() + "-" +
    Math.random().toString(36).substring(2, 8).toUpperCase();
}

/**
 * Genera codigo de certificado unico
 */
export function generarCodigoCertificado(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 10).toUpperCase();
  return `LEY21719-${timestamp}-${random}`;
}
