import { useMemo, useState } from "react";
import { useNavigation } from "../context/NavigationContext";

interface Step { prompt: string; options: { label: string; feedback: string; correct: boolean }[]; }
interface Scenario { title: string; subtitle: string; steps: Step[]; }

const SCENARIOS: Record<string, Scenario> = {
  rights: { title: "Responder una solicitud de derechos", subtitle: "Ayuda a una organización a responder correctamente.", steps: [
    { prompt: "Recibes una solicitud de una persona que pide eliminar todos sus datos. ¿Qué haces primero?", options: [
      { label: "Borrar todo inmediatamente", feedback: "La supresión debe analizarse antes de ejecutar la acción y puede coexistir con obligaciones de conservación.", correct: false },
      { label: "Identificar la solicitud y verificar la identidad", feedback: "Correcto: primero se determina el derecho, el alcance y la identidad de quien solicita.", correct: true },
      { label: "Ignorarla hasta que la persona insista", feedback: "Una solicitud debe registrarse y gestionarse oportunamente.", correct: false },
    ]},
    { prompt: "Parte de los antecedentes debe conservarse por una obligación vigente. ¿Cómo respondes?", options: [
      { label: "Rechazar toda la solicitud sin explicar", feedback: "La respuesta debe ser clara y distinguir los datos afectados.", correct: false },
      { label: "Separar los datos y explicar qué se conserva y por qué", feedback: "Correcto: se responde de forma proporcional y trazable.", correct: true },
      { label: "Entregar la base completa a cualquier solicitante", feedback: "Debe protegerse la información de terceros y verificarse el alcance.", correct: false },
    ]},
  ]},
  breach: { title: "Gestionar una brecha", subtitle: "Toma decisiones durante un incidente de seguridad.", steps: [
    { prompt: "TI detecta una descarga anómala de datos. ¿Cuál es la primera respuesta?", options: [
      { label: "Aislar el acceso y preservar evidencia", feedback: "Correcto: contener sin destruir evidencias permite investigar el alcance.", correct: true },
      { label: "Borrar los registros para evitar exposición", feedback: "Borrar registros impide determinar qué ocurrió y agrava la falta de trazabilidad.", correct: false },
      { label: "Publicar una explicación antes de investigar", feedback: "Primero se debe evaluar el evento, alcance y riesgos.", correct: false },
    ]},
    { prompt: "¿Cómo defines el siguiente análisis?", options: [
      { label: "Categorizar datos, titulares, alcance y riesgo", feedback: "Correcto: esos elementos permiten decidir el escalamiento y las comunicaciones.", correct: true },
      { label: "Contar solamente archivos, sin revisar su contenido", feedback: "El riesgo depende de las categorías de datos y personas afectadas.", correct: false },
      { label: "Esperar un plazo fijo de 72 horas", feedback: "No debe presentarse como plazo automático de la legislación chilena.", correct: false },
    ]},
  ]},
  provider: { title: "Evaluar un proveedor", subtitle: "Decide si una organización puede contratar un servicio SaaS.", steps: [
    { prompt: "El proveedor no informa dónde se almacenan los datos. ¿Qué haces?", options: [
      { label: "Contratar igual porque es una plataforma conocida", feedback: "La reputación no reemplaza la evaluación del tratamiento y las transferencias.", correct: false },
      { label: "Solicitar información de ubicación, subencargados y transferencias", feedback: "Correcto: necesitas conocer el flujo y las partes involucradas.", correct: true },
      { label: "Enviar datos reales para probar el servicio", feedback: "Las pruebas deben minimizar o anonimizar los datos.", correct: false },
    ]},
    { prompt: "El contrato no contempla eliminación o devolución al término. ¿Qué decisión tomas?", options: [
      { label: "Aprobar sin cambios", feedback: "Falta una condición importante de control y cierre del tratamiento.", correct: false },
      { label: "Condicionar la aprobación a una cláusula y evidencias", feedback: "Correcto: la decisión debe ser proporcional y documentada.", correct: true },
      { label: "Rechazar todos los proveedores externos", feedback: "No siempre es necesario rechazar; se deben evaluar y controlar los riesgos.", correct: false },
    ]},
  ]},
  ai: { title: "Usar IA responsablemente", subtitle: "Diseña controles para un chatbot que procesa solicitudes.", steps: [
    { prompt: "El chatbot recibe texto libre con datos personales. ¿Qué control priorizas?", options: [
      { label: "Permitir cualquier dato para mejorar el modelo", feedback: "La mejora del modelo no justifica recopilar datos sin límites.", correct: false },
      { label: "Minimizar entradas y filtrar datos innecesarios", feedback: "Correcto: se reduce exposición y se alinea el tratamiento con su finalidad.", correct: true },
      { label: "Guardar todo indefinidamente", feedback: "La retención debe estar definida y justificada.", correct: false },
    ]},
    { prompt: "El sistema propone una decisión que afecta a una persona. ¿Qué incorporas?", options: [
      { label: "Aceptar la decisión automática sin revisión", feedback: "Las decisiones relevantes requieren controles y revisión según el contexto.", correct: false },
      { label: "Revisión humana, información clara y registro de cambios", feedback: "Correcto: se agrega supervisión y trazabilidad.", correct: true },
      { label: "Ocultar el uso de IA para evitar dudas", feedback: "La transparencia es parte de un tratamiento responsable.", correct: false },
    ]},
  ]},
};

function savePractice(practiceId: string, score: number, total: number) {
  try {
    const raw = window.localStorage.getItem("ley21719_practice_results");
    const results = raw ? JSON.parse(raw) as Record<string, { score: number; total: number; at: string }> : {};
    results[practiceId] = { score, total, at: new Date().toISOString() };
    window.localStorage.setItem("ley21719_practice_results", JSON.stringify(results));
  } catch { /* noop */ }
}

export default function PracticalSimulator() {
  const { practiceId, navigate } = useNavigation();
  const scenario = SCENARIOS[practiceId] ?? SCENARIOS.breach;
  const [stepIndex, setStepIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const step = scenario.steps[stepIndex];
  const percentage = Math.round((stepIndex / scenario.steps.length) * 100);
  const resultPercentage = Math.round((finalScore / scenario.steps.length) * 100);
  const feedback = useMemo(() => selected === null ? null : step.options[selected].feedback, [selected, step]);

  const answer = (index: number) => {
    if (selected !== null) return;
    setSelected(index);
    if (step.options[index].correct) setScore((value) => value + 1);
  };

  const next = () => {
    if (selected === null) return;
    if (stepIndex === scenario.steps.length - 1) {
      const finalScoreValue = score + (step.options[selected].correct ? 1 : 0);
      savePractice(practiceId, finalScoreValue, scenario.steps.length);
      setFinalScore(finalScoreValue);
      setFinished(true);
    } else {
      setStepIndex((value) => value + 1);
      setSelected(null);
    }
  };

  if (finished) {
    const passed = resultPercentage >= 70;
    return <section aria-labelledby="practice-title" className="mx-auto max-w-3xl py-6">
      <div className={`rounded-2xl p-8 text-center ${passed ? "bg-emerald-50" : "bg-amber-50"}`}>
        <p className="text-5xl" aria-hidden="true">{passed ? "✓" : "↻"}</p>
        <h1 id="practice-title" className="mt-3 text-2xl font-bold text-slate-900">Práctica completada</h1>
        <p className="mt-2 text-4xl font-bold text-primary-700">{resultPercentage}%</p>
        <p className="mt-2 text-slate-700">{scenario.title}</p>
        <p className="mt-4 text-sm text-slate-600">{passed ? "Tus decisiones muestran una base sólida. Revisa el feedback y aplica esta ruta en el proyecto." : "Revisa el feedback y vuelve a intentarlo para consolidar la decisión."}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3"><button type="button" onClick={() => { setStepIndex(0); setScore(0); setFinalScore(0); setSelected(null); setFinished(false); }} className="rounded-lg border border-slate-300 bg-white px-4 py-2 font-medium text-slate-700">Repetir práctica</button><button type="button" onClick={() => navigate("home")} className="rounded-lg bg-primary-700 px-4 py-2 font-medium text-white">Volver al curso →</button></div>
      </div>
    </section>;
  }

  return <section aria-labelledby="practice-title" className="mx-auto max-w-3xl py-6">
    <nav aria-label="Ruta de navegación" className="mb-5 text-sm text-slate-500"><button type="button" onClick={() => navigate("home")} className="hover:text-primary-700 hover:underline">Curso</button><span className="mx-2">/</span><span aria-current="page">Práctica</span></nav>
    <header className="rounded-2xl bg-gradient-to-br from-primary-900 to-primary-700 p-6 text-white sm:p-8"><p className="text-xs font-semibold uppercase tracking-wider text-primary-100">Decisión guiada</p><h1 id="practice-title" className="mt-2 text-2xl font-bold sm:text-3xl">{scenario.title}</h1><p className="mt-2 text-primary-50">{scenario.subtitle}</p><div className="mt-5 h-2 overflow-hidden rounded-full bg-white/20"><div className="h-full bg-white transition-all" style={{ width: `${Math.max(8, percentage)}%` }} /></div><p className="mt-2 text-xs text-primary-100">Paso {stepIndex + 1} de {scenario.steps.length}</p></header>
    <article className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><h2 className="text-xl font-semibold text-slate-900">{step.prompt}</h2><div className="mt-5 grid gap-3">{step.options.map((option, index) => <button key={option.label} type="button" disabled={selected !== null} onClick={() => answer(index)} className={`rounded-xl border-2 p-4 text-left transition ${selected === null ? "border-slate-200 hover:border-primary-500 hover:bg-primary-50" : option.correct ? "border-emerald-500 bg-emerald-50" : selected === index ? "border-rose-500 bg-rose-50" : "border-slate-200 opacity-60"}`}><span className="mr-3 inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-600">{String.fromCharCode(65 + index)}</span>{option.label}</button>)}</div>{feedback && <div role="status" className="mt-5 rounded-lg border border-primary-100 bg-primary-50 p-4 text-sm text-slate-700"><strong>Retroalimentación:</strong> {feedback}</div>}<div className="mt-6 flex justify-end"><button type="button" disabled={selected === null} onClick={next} className="rounded-lg bg-primary-700 px-5 py-2.5 font-semibold text-white disabled:opacity-50">{stepIndex === scenario.steps.length - 1 ? "Finalizar práctica" : "Siguiente decisión →"}</button></div></article>
  </section>;
}
