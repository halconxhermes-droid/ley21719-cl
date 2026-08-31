import { useState, useRef } from "react";
import { generarCodigoCertificado } from "../lib/sence";

interface CertificadoSENCEProps {
  estudianteId: string;
  nombreEstudiante: string;
  runEstudiante?: string;
  cursoNombre: string;
  notaFinal: number;
  horasCurso: number;
  fechaFinalizacion: string;
  codigoSENCE?: string;
  instructor: string;
  onDescargar: (formato: "pdf" | "imagen") => void;
}

/**
 * Certificado digital del curso
 * - Codigo unico verificable
 * - QR code
 * - Datos del estudiante
 * - Codigo SENCE (cuando se asigne)
 */
export default function CertificadoSENCE({
  estudianteId,
  nombreEstudiante,
  runEstudiante = "12.345.678-9",
  cursoNombre = "Ley 21.719 - Protección de Datos Personales",
  notaFinal,
  horasCurso,
  fechaFinalizacion,
  codigoSENCE = "PENDIENTE",
  instructor,
  onDescargar,
}: CertificadoSENCEProps) {
  const codigoCertificado = useRef(generarCodigoCertificado());
  const urlVerificacion = `https://ley21719-cl.netlify.app/verificar?cod=${codigoCertificado.current}`;
  const [descargando, setDescargando] = useState<"pdf" | "imagen" | null>(null);

  const handleDescargar = async (formato: "pdf" | "imagen") => {
    setDescargando(formato);
    try {
      await onDescargar(formato);
    } finally {
      setDescargando(null);
    }
  };

  return (
    <div className="mx-auto max-w-4xl p-4 sm:p-6">
      {/* Certificado Visual */}
      <div
        id="certificado-sence"
        className="relative bg-gradient-to-br from-white via-emerald-50 to-white border-8 border-double border-emerald-700 rounded-lg p-8 sm:p-12 shadow-2xl"
        style={{ aspectRatio: "297/210" }} // A4 landscape ratio
      >
        {/* Decoracion esquinas */}
        <div className="absolute top-4 left-4 w-16 h-16 border-t-4 border-l-4 border-emerald-700 rounded-tl-lg" />
        <div className="absolute top-4 right-4 w-16 h-16 border-t-4 border-r-4 border-emerald-700 rounded-tr-lg" />
        <div className="absolute bottom-4 left-4 w-16 h-16 border-b-4 border-l-4 border-emerald-700 rounded-bl-lg" />
        <div className="absolute bottom-4 right-4 w-16 h-16 border-b-4 border-r-4 border-emerald-700 rounded-br-lg" />

        {/* Contenido */}
        <div className="text-center space-y-4 sm:space-y-6 relative z-10">
          {/* Encabezado */}
          <div>
            <div className="text-xs sm:text-sm uppercase tracking-widest text-emerald-700 font-semibold">
              Servicio Nacional de Capacitación y Empleo
            </div>
            <div className="text-xs text-slate-500 mt-1">SENCE - Chile</div>
          </div>

          <div className="border-t-2 border-b-2 border-emerald-700 py-3">
            <h1 className="text-2xl sm:text-4xl font-bold text-slate-900">
              Certificado de Aprobación
            </h1>
          </div>

          <p className="text-sm sm:text-base text-slate-700 italic">
            Se otorga el presente certificado a
          </p>

          {/* Nombre del Estudiante */}
          <div>
            <h2 className="text-3xl sm:text-5xl font-serif font-bold text-emerald-900 mt-2">
              {nombreEstudiante}
            </h2>
            <p className="text-sm text-slate-600 mt-1">RUN: {runEstudiante}</p>
          </div>

          <p className="text-sm sm:text-base text-slate-700 max-w-2xl mx-auto">
            por haber aprobado satisfactoriamente el curso de capacitación
          </p>

          {/* Nombre del Curso */}
          <div className="bg-white/50 rounded-lg p-3 inline-block">
            <h3 className="text-lg sm:text-2xl font-bold text-slate-900">
              {cursoNombre}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Código SENCE: <span className="font-mono font-semibold">{codigoSENCE}</span>
            </p>
          </div>

          {/* Detalles */}
          <div className="grid grid-cols-3 gap-4 max-w-xl mx-auto mt-6">
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-emerald-700">
                {notaFinal.toFixed(1)}
              </div>
              <div className="text-xs uppercase text-slate-500">Nota Final</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-emerald-700">
                {horasCurso}h
              </div>
              <div className="text-xs uppercase text-slate-500">Horas</div>
            </div>
            <div>
              <div className="text-base sm:text-lg font-bold text-slate-700">
                {fechaFinalizacion}
              </div>
              <div className="text-xs uppercase text-slate-500">Fecha</div>
            </div>
          </div>

          {/* Firmas */}
          <div className="grid grid-cols-2 gap-8 max-w-2xl mx-auto mt-8">
            <div>
              <div className="border-t-2 border-slate-400 pt-2 mt-12">
                <p className="font-semibold text-slate-800 text-sm">
                  {instructor}
                </p>
                <p className="text-xs text-slate-500">Instructor Certificado SENCE</p>
              </div>
            </div>
            <div>
              <div className="border-t-2 border-slate-400 pt-2 mt-12">
                <p className="font-semibold text-slate-800 text-sm">
                  Agencia de Protección de Datos
                </p>
                <p className="text-xs text-slate-500">Validación Oficial</p>
              </div>
            </div>
          </div>

          {/* Codigo de Verificacion */}
          <div className="mt-6 pt-4 border-t border-slate-300">
            <p className="text-xs text-slate-500">Código de verificación único</p>
            <p className="font-mono text-sm text-slate-800 mt-1 break-all">
              {codigoCertificado.current}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Verifica en: <span className="text-blue-600">{urlVerificacion}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Botones de Accion */}
      <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
        <button
          type="button"
          onClick={() => handleDescargar("pdf")}
          disabled={descargando !== null}
          className="rounded-lg bg-emerald-700 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-50 inline-flex items-center justify-center gap-2"
        >
          {descargando === "pdf" ? "⏳ Generando..." : "📄 Descargar PDF"}
        </button>
        <button
          type="button"
          onClick={() => handleDescargar("imagen")}
          disabled={descargando !== null}
          className="rounded-lg bg-slate-700 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50 inline-flex items-center justify-center gap-2"
        >
          {descargando === "imagen" ? "⏳ Generando..." : "🖼️ Descargar Imagen"}
        </button>
        <button
          type="button"
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: "Mi Certificado SENCE",
                text: `Obtuve mi certificado en ${cursoNombre} con nota ${notaFinal}`,
                url: urlVerificacion,
              });
            } else {
              window.open(urlVerificacion, "_blank");
            }
          }}
          className="rounded-lg border-2 border-emerald-700 px-6 py-3 text-sm font-semibold text-emerald-700 hover:bg-emerald-50 inline-flex items-center justify-center gap-2"
        >
          🔗 Compartir
        </button>
      </div>

      {/* Informacion Adicional */}
      <div className="mt-6 rounded-lg border border-slate-200 bg-white p-4 text-xs text-slate-600">
        <p className="font-semibold mb-2">ℹ️ Información del Certificado</p>
        <ul className="space-y-1 list-disc pl-5">
          <li>Código único: <span className="font-mono">{codigoCertificado.current}</span></li>
          <li>Verificable públicamente en la URL indicada arriba</li>
          <li>Válido para presentar en currículum y postulaciones</li>
          <li>Emitido bajo el marco de la Ley 19.518 y Ley 21.124</li>
          <li>Inscrito en el Registro Nacional de Capacitación</li>
        </ul>
      </div>
    </div>
  );
}
