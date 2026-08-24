import { useEffect, useState } from "react";
import Countdown from "../components/Countdown";
import { useNavigation } from "../context/NavigationContext";
import { getModules } from "../lib/api";
import { SeccionCincoPuntos, SeccionRiesgos, SeccionIndustrias } from "./PortalSections";

/**
 * VISTA: Portal global de la Ley 21.719.
 * Página principal explicativa (no el curso). El curso interactivo
 * queda como una sección dentro ("Ir al curso").
 *
 * REGLA 0: todo el contenido legal proviene de docs/fuentes.md y
 * backend/docs/*.json (verificados contra BCN LeyChile idNorma=1209272).
 */

const VIDEOS = [
  { id: "lNQVy8HoKKs", titulo: "Privacidad en Chile: adiós 19.628, ARSOP y APDP", tema: "Introducción general" },
  { id: "mrlj9vSB0EM", titulo: "¿Es ilegal el reloj de control de asistencia?", tema: "Biometría laboral" },
  { id: "GM4ayufDF7s", titulo: "¿Qué pasa si un algoritmo rechaza tu crédito?", tema: "Decisiones automatizadas" },
  { id: "wULqitj6Khc", titulo: "Sector público: Art. 20 y responsabilidad personal", tema: "Instituciones" },
  { id: "z4TGvt1jtlo", titulo: "Nuevas leyes de datos en salud (21.719 + 21.663)", tema: "Salud" },
  { id: "-gk_XW3Fu_c", titulo: "¿Están seguros los datos de los estudiantes?", tema: "Educación" },
];

const CAMBIOS_CLAVE = [
  {
    titulo: "Agencia fiscalizadora",
    desc: "Crea la Agencia de Protección de Datos Personales (Art. 30): organismo autónomo que fiscaliza, sanciona y resuelve tutelas.",
    ref: "Art. 30–33",
  },
  {
    titulo: "Sanciones disuasivas",
    desc: "Multas de hasta 20.000 UTM (gravísimas) o hasta un 4% de los ingresos anuales del responsable en caso de reincidencia.",
    ref: "Art. 35",
  },
  {
    titulo: "Datos sensibles y biométricos",
    desc: "Reglas reforzadas para salud, biometría y menores de edad; consentimiento explícito como regla general.",
    ref: "Art. 16–16 quater",
  },
  {
    titulo: "Derechos ARSOP+",
    desc: "Acceso, rectificación, supresión, oposición, portabilidad y bloqueo: titulares pueden exigirlos directamente.",
    ref: "Art. 4°–11",
  },
  {
    titulo: "Brechas de seguridad",
    desc: "Notificación obligatoria a la Agencia y a los afectados ante vulneraciones de seguridad, sin dilaciones indebidas.",
    ref: "Art. 14 sexies",
  },
  {
    titulo: "Transferencias internacionales",
    desc: "Solo hacia países con nivel adecuado de protección o con garantías apropiadas del responsable.",
    ref: "Art. 27–29",
  },
];

const AFECTADOS = [
  {
    icon: "M3 21h18M5 21V7l7-4 7 4v14M9 21v-4a3 3 0 0 1 6 0v4",
    titulo: "Empresas",
    desc: "Obligaciones de registro, seguridad, DPO voluntario, EIPD en tratamientos de alto riesgo y respuesta a titulares en plazos legales.",
  },
  {
    icon: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 8v8M8 12h8",
    titulo: "Ciudadanos",
    desc: "Titulares de datos: nuevos derechos exigibles ante empresas y Estado, con tutela ante la Agencia (procedimiento administrativo gratuito).",
  },
  {
    icon: "M3 21h18M4 21V10l8-6 8 6v11M9 21v-6h6v6",
    titulo: "Instituciones públicas",
    desc: "Base legal reforzada, transparencia activa, coordinación con el CPLT y responsabilidad personal de directivos (Art. 20).",
  },
  {
    icon: "M16 18l6-6-6-6M8 6l-6 6 6 6",
    titulo: "Desarrolladores",
    desc: "Privacidad desde el diseño, seudonimización, minimización y evaluaciones de impacto para sistemas que traten datos.",
  },
];

const CALENDARIO = [
  { fecha: "13 dic 2024", evento: "Publicación en Diario Oficial", detalle: "Inicio del cuenta regresiva legal.", pasado: true },
  { fecha: "13 jun 2025", evento: "Plazo reglamento general (Art. 2° transitorio)", detalle: "6 meses para dictar el reglamento.", pasado: true },
  { fecha: "1 dic 2026", evento: "Entrada en vigencia", detalle: "Comienzan a aplicarse derechos y obligaciones; Agencia operativa plenamente.", pasado: false },
];

export default function Portal() {
  const { navigate } = useNavigation();
  const [modulesCount, setModulesCount] = useState<number | null>(null);

  useEffect(() => {
    let alive = true;
    getModules()
      .then((res) => {
        if (alive) setModulesCount(res.modules.length);
      })
      .catch(() => {
        if (alive) setModulesCount(4);
      });
    return () => {
      alive = false;
    };
  }, []);

  return (
    <section aria-labelledby="portal-title">
      {/* HERO */}
      <div
        className="rounded-xl px-6 py-10 text-center text-white sm:py-14"
        style={{
          background: "linear-gradient(135deg, var(--color-primary-900), var(--color-primary-700))",
        }}
      >
        <p className="mb-2 text-xs uppercase tracking-[0.15em] opacity-85">
          Chile · Protección de Datos Personales
        </p>
        <h1
          id="portal-title"
          className="mx-auto mb-4 max-w-3xl font-bold leading-tight"
          style={{ fontSize: "clamp(1.9rem, 5vw, 3rem)" }}
        >
          Ley 21.719: todo lo que cambia con la nueva ley de datos personales
        </h1>
        <p className="mx-auto mb-6 max-w-2xl text-lg opacity-95">
          Reemplaza a la Ley 19.628 y crea la Agencia de Protección de Datos Personales.{" "}
          <strong>Entra en vigencia plena el 1&nbsp;de diciembre de 2026</strong>
        </p>

        <div className="mx-auto mb-6 max-w-md rounded-xl bg-white/10 px-6 py-4">
          <Countdown hero />
        </div>

        <button
          type="button"
          onClick={() => navigate("home")}
          className="cursor-pointer rounded-lg bg-white px-6 py-3 text-base font-semibold text-primary-900 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg"
        >
          Ir al curso interactivo →
        </button>
      </div>

      {/* QUÉ ES LA LEY */}
      <div className="mt-14 max-w-3xl">
        <h2 className="text-2xl font-semibold">¿Qué es la Ley 21.719?</h2>
        <p className="mt-3 text-slate-700">
          Es la <strong>nueva ley chilena de protección de datos personales</strong>, publicada el{" "}
          <strong>13 de diciembre de 2024</strong> en el Diario Oficial. Regula cómo empresas e
          instituciones públicas pueden <em>tratar</em> (recolectar, usar, guardar, compartir) los
          datos personales, y establece un catálogo de derechos exigibles para las personas.
        </p>
        <p className="mt-3 text-slate-700">
          Su cambio más visible es institucional: crea la{" "}
          <strong>Agencia de Protección de Datos Personales</strong>, un organismo autónomo con
          facultades de fiscalización y sanción, algo que la antigua Ley 19.628 nunca tuvo.
        </p>
      </div>

      {/* CAMBIOS CLAVE */}
      <div className="mt-14">
        <h2 className="text-2xl font-semibold">Los 6 cambios clave</h2>
        <ol className="m-0 mt-6 grid list-none gap-4 p-0 md:grid-cols-2 lg:grid-cols-3">
          {CAMBIOS_CLAVE.map((c, i) => (
            <li key={c.titulo} className="rounded-xl border border-solid border-slate-200 bg-white p-5 shadow-sm">
              <span className="mr-2 inline-block rounded-full bg-primary-50 px-2 py-0.5 text-xs font-semibold text-primary-800">
                {i + 1} · {c.ref}
              </span>
              <h3 className="my-2 text-lg font-semibold text-slate-900">{c.titulo}</h3>
              <p className="m-0 text-sm text-slate-600">{c.desc}</p>
            </li>
          ))}
        </ol>
      </div>

      {/* ¿A QUIÉN AFECTA? */}
      <div className="mt-14">
        <h2 className="text-2xl font-semibold">¿A quién afecta?</h2>
        <p className="mt-1 text-slate-600">
          A todos los actores que tratan datos personales en Chile. Selecciona tu perfil en el curso
          para una guía personalizada.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {AFECTADOS.map((a) => (
            <button
              key={a.titulo}
              type="button"
              onClick={() => navigate("home")}
              className="cursor-pointer rounded-xl border border-solid border-slate-200 bg-white p-5 text-left shadow-sm transition-all duration-200 hover:border-primary-500 hover:shadow-md"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                aria-hidden="true"
                className="mb-3 h-10 w-10 text-primary-700"
              >
                <path d={a.icon} />
              </svg>
              <h3 className="mb-2 text-base font-semibold text-slate-900">{a.titulo}</h3>
              <p className="m-0 text-sm text-slate-600">{a.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* 5 PUNTOS WEB · RIESGOS · INDUSTRIAS */}
      <SeccionCincoPuntos />
      <SeccionRiesgos />
      <SeccionIndustrias />

      {/* CALENDARIO */}
      <div className="mt-14">
        <h2 className="text-2xl font-semibold">Calendario de vigencia</h2>
        <ol className="m-0 mt-6 list-none space-y-0 p-0">
          {CALENDARIO.map((c, i) => (
            <li key={c.fecha} className="relative flex gap-4 pb-6 last:pb-0">
              {i < CALENDARIO.length - 1 && (
                <span aria-hidden="true" className="absolute left-[7px] top-5 h-full w-px bg-slate-300" />
              )}
              <span
                aria-hidden="true"
                className={`relative mt-1.5 h-4 w-4 shrink-0 rounded-full border-2 ${
                  c.pasado ? "border-primary-500 bg-primary-500" : "border-primary-500 bg-white"
                }`}
              />
              <div>
                <p className="m-0 font-semibold text-slate-900">
                  {c.evento}{" "}
                  <span className="ml-1 rounded bg-slate-100 px-1.5 py-0.5 text-xs font-medium text-slate-600">
                    {c.fecha}
                  </span>
                </p>
                <p className="m-0 text-sm text-slate-600">{c.detalle}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* VIDEOS */}
      <div className="mt-14">
        <h2 className="text-2xl font-semibold">Serie de videos</h2>
        <p className="mt-1 text-slate-600">
          Casos reales explicados en minutos. Todos los videos también están integrados dentro de
          cada módulo del curso.
        </p>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {VIDEOS.map((v) => (
            <figure key={v.id} className="m-0 overflow-hidden rounded-xl border border-solid border-slate-200 bg-white shadow-sm">
              <div className="aspect-video w-full">
                <iframe
                  src={`https://www.youtube.com/embed/${v.id}`}
                  title={v.titulo}
                  loading="lazy"
                  allowFullScreen
                  className="h-full w-full border-none"
                />
              </div>
              <figcaption className="p-4">
                <p className="m-0 mb-1 text-xs uppercase tracking-wide text-primary-700">{v.tema}</p>
                <h3 className="m-0 text-sm font-semibold text-slate-900">{v.titulo}</h3>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>

      {/* CTA CURSO */}
      <div
        className="mt-16 rounded-xl px-6 py-10 text-center text-white"
        style={{
          background: "linear-gradient(135deg, var(--color-primary-800), var(--color-primary-600))",
        }}
      >
        <h2 className="mb-3 text-2xl font-bold sm:text-3xl">
          ¿Listo para profundizar?{modulesCount ? ` Curso de ${modulesCount} módulos` : ""}
        </h2>
        <p className="mx-auto mb-6 max-w-xl opacity-95">
          Lecturas en 3 niveles (resumen / amigable / texto legal), quizzes con explicación,
          checklist por rol, glosario A-Z y test final con certificado.
        </p>
        <button
          type="button"
          onClick={() => navigate("home")}
          className="cursor-pointer rounded-lg bg-white px-6 py-3 text-base font-semibold text-primary-900 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg"
        >
          Entrar al curso interactivo →
        </button>
      </div>
    </section>
  );
}