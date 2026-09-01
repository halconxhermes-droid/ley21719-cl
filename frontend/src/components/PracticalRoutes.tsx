interface PracticalRoutesProps {
  onOpen: (moduleId: string) => void;
}

const routes = [
  { id: "rights", icon: "✉", title: "Responder una solicitud", description: "Analiza una petición de acceso, rectificación o supresión.", module: "ciudadano", label: "Practicar derechos" },
  { id: "breach", icon: "⚠", title: "Gestionar una brecha", description: "Contén un incidente, evalúa el impacto y documenta la respuesta.", module: "empresa", label: "Practicar brechas" },
  { id: "provider", icon: "⌘", title: "Evaluar un proveedor", description: "Revisa un SaaS, sus transferencias y sus condiciones contractuales.", module: "empresa", label: "Evaluar proveedor" },
  { id: "ai", icon: "✦", title: "Usar IA responsablemente", description: "Decide qué datos puede recibir un chatbot y qué controles necesita.", module: "desarrollador", label: "Analizar caso de IA" },
];

export default function PracticalRoutes({ onOpen }: PracticalRoutesProps) {
  return (
    <section aria-labelledby="practical-routes-title" className="mt-12">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-primary-700">Aprendizaje aplicado</p>
          <h2 id="practical-routes-title" className="mt-1 text-2xl font-semibold text-slate-900">Rutas prácticas</h2>
          <p className="mt-1 text-slate-600">Elige una situación y aprende resolviéndola.</p>
        </div>
        <span className="rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-800">30 min para actuar</span>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {routes.map((route) => (
          <article key={route.id} className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-primary-500 hover:shadow-md">
            <div className="flex items-start gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-xl text-primary-800" aria-hidden="true">{route.icon}</span>
              <div className="min-w-0">
                <h3 className="font-semibold text-slate-900">{route.title}</h3>
                <p className="mt-1 text-sm leading-5 text-slate-600">{route.description}</p>
                <button type="button" onClick={() => onOpen(route.module)} className="mt-4 text-sm font-semibold text-primary-700 hover:text-primary-900 hover:underline">{route.label} →</button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
