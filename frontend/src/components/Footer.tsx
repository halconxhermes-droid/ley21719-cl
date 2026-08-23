import { useNavigation, type ViewId } from "../context/NavigationContext";

const LINKS: { view: ViewId; label: string }[] = [
  { view: "home", label: "Inicio y selector de rol" },
  { view: "lector", label: "Lectura de módulos" },
  { view: "quiz", label: "Quiz del módulo" },
  { view: "checklist", label: "Checklist «¿Estoy listo?»" },
  { view: "glosario", label: "Glosario A–Z" },
  { view: "testfinal", label: "Test final" },
];

/** Footer del mockup: navegación, recursos y nota de accesibilidad. */
export default function Footer() {
  const { navigate } = useNavigation();

  return (
    <footer role="contentinfo" className="mt-auto bg-slate-900 px-6 py-8 text-slate-300">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <nav aria-label="Secciones del sitio">
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Ley 21.719
            </h4>
            <ul className="m-0 list-none p-0">
              {LINKS.map((l) => (
                <li key={l.view} className="my-2">
                  <button
                    type="button"
                    onClick={() => navigate(l.view)}
                    className="cursor-pointer border-none bg-transparent p-0 text-left text-sm text-slate-300 hover:text-primary-100"
                  >
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Recursos
            </h4>
            <ul className="m-0 list-none p-0">
              <li className="my-2">
                <a
                  href="https://www.bcn.cl/leychile/navegar?idNorma=1205835"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-slate-300 hover:text-primary-100"
                >
                  Texto de la ley (BCN)
                </a>
              </li>
              <li className="my-2">
                <a
                  href="https://www.gob.cl"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-slate-300 hover:text-primary-100"
                >
                  Gob.cl
                </a>
              </li>
              <li className="my-2">
                <button
                  type="button"
                  onClick={() => navigate("glosario")}
                  className="cursor-pointer border-none bg-transparent p-0 text-left text-sm text-slate-300 hover:text-primary-100"
                >
                  AGEPRODAT (ver Glosario)
                </button>
              </li>
              <li className="my-2">
                <a
                  href="https://www.youtube.com/playlist?list=PLe_vi6plvNRU"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-slate-300 hover:text-primary-100"
                >
                  Curso en video (playlist)
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Acerca de
            </h4>
            <p className="text-sm text-slate-400">
              Web educativa sobre la Ley 21.719 de Protección de Datos Personales.
              Contenido servido por API REST propia; videos del curso embebidos desde
              YouTube.
            </p>
            <p className="text-sm text-slate-400">
              Accesibilidad: WCAG 2.1 AA · skip-link · focus visible ·
              prefers-reduced-motion.
            </p>
          </div>
        </div>

        <p className="m-0 border-t border-slate-800 pt-6 text-sm text-slate-500">
          Ley 21.719 · Vigencia plena: 1-dic-2026
        </p>
      </div>
    </footer>
  );
}
