/**
 * VISTA PARCIAL: Secciones adicionales del Portal (Ley 21.719).
 * Exporta 3 secciones independientes que Portal.tsx inserta entre
 * "¿A quién afecta?" y el calendario:
 *   1. SeccionCincoPuntos — checklist web antes del 1° de diciembre de 2026.
 *   2. SeccionRiesgos     — sanciones y riesgos del incumplimiento.
 *   3. SeccionIndustrias  — directrices por industria.
 *
 * REGLA 0: todo el contenido legal proviene de docs/fuentes.md y
 * backend/docs/*.json (verificados contra BCN LeyChile idNorma=1209272).
 * Colores semánticos definidos en index.css (--color-exito-* / --color-riesgo-*).
 */

const CINCO_PUNTOS = [
  {
    num: "01",
    titulo: "Política de privacidad clara y visible",
    desc: "No sirve un texto genérico copiado. La política debe identificar al responsable, las finalidades, las bases de licitud, los destinatarios, los plazos de conservación y el canal para ejercer derechos ARSOP. Debe estar enlazada desde el pie de página y desde cada formulario de captura.",
    cita: "Falta = infracción grave",
    icon: "M9 12h6m-6 4h4M6 3h9l5 5v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm9 0v5h5",
  },
  {
    num: "02",
    titulo: "Banner de cookies con consentimiento opt-in",
    desc: "El usuario debe aceptar activamente: el consentimiento tácito por seguir navegando ya no es válido. El banner debe bloquear preventivamente los scripts de seguimiento (Meta Pixel, Google Analytics, Google Ads) hasta que el usuario consienta. SERNAC exige dos botones equivalentes (rechazar / aceptar) con el mismo peso visual y sin patrones oscuros.",
    cita: "Hasta 10.000 UTM si es invasivo",
    icon: "M12 8v4l3 3M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z",
  },
  {
    num: "03",
    titulo: "Casillas desmarcadas por defecto",
    desc: "Prohibido el checkbox pre-marcado. Cada finalidad (newsletter, marketing, cesión a terceros) requiere una casilla independiente, voluntaria y desmarcada que diga explícitamente qué autoriza. Especialmente sensible: envío de boletines, remarketing y carga de datos en plataformas externas.",
    cita: "Infracción grave automática",
    icon: "M9 12l2 2 4-4M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z",
  },
  {
    num: "04",
    titulo: "Canal visible para derechos ARCOP",
    desc: "Un buzón o formulario público (ej. privacidad@empresa.cl) desde donde cualquier titular pueda ejercer acceso, rectificación, supresión, oposición y portabilidad. Plazo de respuesta: 30 días corridos. Si se solicita bloqueo temporal conjunto, el plazo es de solo 2 días hábiles.",
    cita: "Canal debe estar en pie de página",
    icon: "M3 8l9 6 9-6M3 6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6z",
  },
  {
    num: "05",
    titulo: "Contratos DPA con proveedores",
    desc: "Revise los contratos con Google Analytics, Meta, hosting, CRM, Mailchimp, HubSpot y cualquier SaaS que procese datos por usted. Cada uno requiere un Data Processing Agreement firmado conforme a la ley, con cláusulas de confidencialidad, limitación de finalidad, subencargados y devolución/supresión al término.",
    cita: "Incluye transferencias internacionales",
    icon: "M9 12h6m-6 4h4M6 3h9l5 5v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm9 0v5h5",
  },
];

const RIESGOS = [
  {
    etiqueta: "01 / RIESGO",
    titulo: "Riesgo financiero",
    cifra: "20.000 UTM o 4% ingresos",
    desc: "Aproximadamente $1.300 MM CLP por infracciones gravísimas. Multas escalonadas: 5.000 UTM (leves), 10.000 UTM (graves), 20.000 UTM (gravísimas). En reincidencia, la multa puede elevarse hasta el 4% de los ingresos anuales. Las mitigaciones documentadas actúan como atenuantes formales.",
    mitigacion: "Mitigación: MPI certificado reduce la multa",
    ref: "Art. 35",
  },
  {
    etiqueta: "02 / RIESGO",
    titulo: "Riesgo operacional",
    cifra: "30 días de suspensión",
    desc: "La Agencia puede ordenar el cese temporal de las operaciones de tratamiento. Para una empresa, esto significa el apagado inmediato de procesos clave: gestión de remuneraciones y personal paralizada, contratos con clientes y proveedores sin respaldo de datos, coordinación operativa detenida.",
    mitigacion: "Mitigación: protocolos operativos documentados",
    ref: "Art. 37",
  },
  {
    etiqueta: "03 / RIESGO",
    titulo: "Riesgo reputacional y comercial",
    cifra: "5 años registro público",
    desc: "Se crea el Registro Nacional de Sanciones, de carácter público. Las anotaciones permanecen visibles por 5 años: bloqueo en licitaciones que exijan limpieza reglamentaria, pérdida de confianza de clientes y socios comerciales, e impacto mediático en sectores sensibles (salud, menores, finanzas).",
    mitigacion: "Mitigación: cultura de cumplimiento preventiva",
    ref: "Art. 39",
  },
];

const INDUSTRIAS = [
  {
    nombre: "Aseo industrial",
    subtitulo: "Servicios de instalaciones",
    afecta: "Alta rotación de personal y uso masivo de biometría para control de asistencia.",
    datos: "Huella dactilar, reconocimiento facial y datos de salud laboral: sensibles según la ley.",
    riesgo: "Biometría sin DPIA ni base de licitud es una infracción de alto impacto por el volumen involucrado.",
  },
  {
    nombre: "Logística/Transporte",
    subtitulo: "Cadena de suministro",
    afecta: "Tratamiento constante de geolocalización de conductores y datos de destinatarios finales.",
    datos: "Rutas GPS en tiempo real, identificación de conductores y contacto de destinatarios.",
    riesgo: "La filtración de rutas y clientes puede sancionarse como infracción grave, con impacto contractual.",
  },
  {
    nombre: "Minería y construcción",
    subtitulo: "Maquinaria y faena",
    afecta: "Perfiles de salud complejos para autorizar ingreso a faena y datos de seguridad ocupacional.",
    datos: "Exámenes preocupacionales, aptitud de altura, licencias médicas y accidentes: todos sensibles.",
    riesgo: "Un cese de tratamiento de hasta 30 días podría paralizar el acceso de personal a las obras.",
  },
  {
    nombre: "Tecnología/SaaS",
    subtitulo: "Software y TI",
    afecta: "Actúan como encargados de tratamiento para sus clientes, garantizando seguridad técnica.",
    datos: "Bases de clientes en la nube, logs, credenciales y respaldos, muchas veces fuera de Chile.",
    riesgo: "Una brecha sin notificar compromete todos los contratos de encargo vigentes con clientes.",
  },
  {
    nombre: "Finanzas y Retail",
    subtitulo: "Banca, comercio y fidelización",
    afecta: "Perfiles de consumo, scoring y programas de fidelización tratados a gran escala.",
    datos: "Datos financieros, historial de compras y decisiones automatizadas sobre personas.",
    riesgo: "El perfilamiento sin base de licitud expone a multas gravísimas y tutelas de titulares.",
  },
  {
    nombre: "Salud",
    subtitulo: "Clínicas y prestadores",
    afecta: "Fichas clínicas, agendamiento y telesalud concentran datos sensibles de miles de pacientes.",
    datos: "Diagnósticos, tratamientos y biometría: consentimiento explícito y seguridad reforzada.",
    riesgo: "Una brecha de fichas clínicas genera sanción, tutelas masivas y daño reputacional directo.",
  },
];

function Icono({ d }: { d: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="mb-3 h-10 w-10 text-[color:var(--color-exito-700)]"
    >
      <path d={d} />
    </svg>
  );
}

export function SeccionCincoPuntos() {
  return (
    <div className="mt-14">
      <h2 className="text-2xl font-semibold">Los 5 puntos que su sitio web debe tener antes del 1° de diciembre</h2>
      <p className="mt-1 text-slate-600">
        Si su empresa tiene página web, formulario de contacto, newsletter, login o cualquier integración que recolecte
        datos, esta lista de verificación aplica. Pegar un plugin de cookies no es suficiente: la adecuación exige
        revisar todo el ecosistema digital.
      </p>
      <ol className="m-0 mt-6 grid list-none gap-4 md:grid-cols-2 lg:grid-cols-3">
        {CINCO_PUNTOS.map((p) => (
          <li
            key={p.num}
            className="relative rounded-xl border border-solid border-[color:var(--color-exito-200)] bg-[color:var(--color-exito-50)] p-5 shadow-sm transition-shadow duration-200 hover:shadow-md"
          >
            <span
              aria-hidden="true"
              className="absolute right-4 top-4 text-2xl font-bold leading-none text-[color:var(--color-exito-200)]"
            >
              {p.num}
            </span>
            <Icono d={p.icon} />
            <h3 className="mb-2 pr-10 text-base font-semibold text-slate-900">{p.titulo}</h3>
            <p className="m-0 mb-3 text-sm text-slate-600">{p.desc}</p>
            <p className="m-0 border-t border-solid border-[color:var(--color-exito-200)] pt-2 text-xs font-medium text-[color:var(--color-exito-700)]">
              ⚖ {p.cita}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function SeccionRiesgos() {
  return (
    <div className="mt-14">
      <h2 className="text-2xl font-semibold">¿Qué se arriesga su empresa?</h2>
      <p className="mt-1 text-slate-600">
        El incumplimiento tiene tres niveles de impacto crítico para la continuidad del negocio. Las mitigaciones
        preventivas documentadas actúan como atenuantes formales.
      </p>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {RIESGOS.map((r) => (
          <article
            key={r.ref}
            className="flex flex-col rounded-xl border border-solid border-[color:var(--color-riesgo-200)] bg-white p-5 shadow-sm transition-shadow duration-200 hover:shadow-md"
          >
            <p className="m-0 mb-2 text-xs font-semibold uppercase tracking-wide text-[color:var(--color-riesgo-700)]">
              {r.etiqueta} · {r.ref}
            </p>
            <h3 className="m-0 text-lg font-semibold text-slate-900">{r.titulo}</h3>
            <p className="mb-3 mt-1 text-xl font-bold text-[color:var(--color-riesgo-600)]">{r.cifra}</p>
            <p className="m-0 mb-3 text-sm text-slate-600">{r.desc}</p>
            <p className="mt-auto m-0 border-t border-solid border-[color:var(--color-riesgo-100)] pt-2 text-xs font-medium text-[color:var(--color-riesgo-700)]">
              🛡 {r.mitigacion}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}

export function SeccionIndustrias() {
  return (
    <div className="mt-14">
      <h2 className="text-2xl font-semibold">Directrices específicas por industria</h2>
      <p className="mt-1 text-slate-600">
        Cada sector enfrenta riesgos y obligaciones particulares. Conozca los puntos críticos que su empresa debe
        abordar antes del 1° de diciembre de 2026.
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {INDUSTRIAS.map((ind) => (
          <article
            key={ind.nombre}
            className="rounded-xl border border-solid border-slate-200 bg-white p-5 shadow-sm"
          >
            <h3 className="m-0 text-base font-semibold text-slate-900">{ind.nombre}</h3>
            <p className="m-0 mb-3 text-xs uppercase tracking-wide text-primary-700">{ind.subtitulo}</p>
            <dl className="m-0 space-y-2">
              <div>
                <dt className="text-xs font-semibold text-slate-500">Cómo afecta</dt>
                <dd className="m-0 text-sm text-slate-600">{ind.afecta}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold text-slate-500">Datos críticos</dt>
                <dd className="m-0 text-sm text-slate-600">{ind.datos}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold text-[color:var(--color-riesgo-700)]">Riesgo principal</dt>
                <dd className="m-0 text-sm text-slate-600">{ind.riesgo}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
    </div>
  );
}
