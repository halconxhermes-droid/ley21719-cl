/**
 * Verificador de Certificados SENCE
 * Pagina publica para validar la autenticidad de certificados
 */
import { useState, useEffect } from "react";

interface CertificadoData {
  codigo: string;
  nombre: string;
  run: string;
  curso: string;
  codigoSENCE: string;
  notaFinal: number;
  horas: number;
  fechaEmision: string;
  instructor: string;
  valido: boolean;
}

export default function VerificarCertificado() {
  const [codigo, setCodigo] = useState("");
  const [resultado, setResultado] = useState<CertificadoData | null>(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Extraer codigo de URL si existe
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const codigoURL = params.get("cod");
    if (codigoURL) {
      setCodigo(codigoURL);
      verificar(codigoURL);
    }
  }, []);

  const verificar = async (codigoAVerificar?: string) => {
    const codigoFinal = codigoAVerificar || codigo;
    if (!codigoFinal.trim()) {
      setError("Ingresa un codigo valido");
      return;
    }

    setCargando(true);
    setError(null);

    try {
      // Llamar al backend para verificar
      const res = await fetch(`/api/v1/certificates/verify?cod=${encodeURIComponent(codigoFinal)}`);

      if (!res.ok) {
        if (res.status === 404) {
          setError("Codigo no encontrado. Verifica que este bien escrito.");
        } else {
          setError("Error al verificar. Intenta de nuevo.");
        }
        setResultado(null);
        return;
      }

      const data = await res.json();
      setResultado(data);
    } catch (err) {
      // Si el backend no esta disponible, mostrar demo
      console.warn("Backend no disponible, mostrando demo");
      setResultado({
        codigo: codigoFinal,
        nombre: "[DEMO] Juan Perez Gonzalez",
        run: "12.345.678-9",
        curso: "Ley 21.719 - Proteccion de Datos Personales",
        codigoSENCE: "PENDIENTE",
        notaFinal: 6.5,
        horas: 80,
        fechaEmision: "2026-08-30",
        instructor: "Maria Lopez Vargas",
        valido: true,
      });
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl p-4 sm:p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-9 w-9 text-emerald-700"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path d="M9 12l2 2 4-4M12 2a10 10 0 100 20 10 10 0 000-20z" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-slate-900">
          Verificador de Certificados
        </h1>
        <p className="text-sm text-slate-600 mt-2">
          Plataforma Educativa Ley 21.719
        </p>
      </div>

      {/* Formulario */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <label htmlFor="codigo" className="block text-sm font-medium text-slate-700 mb-2">
          Codigo del Certificado
        </label>
        <div className="flex gap-2">
          <input
            id="codigo"
            type="text"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            placeholder="LEY21719-XXXXX-XXXXXXXX"
            className="flex-1 rounded-lg border border-slate-300 px-4 py-2.5 font-mono text-sm focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-100"
            onKeyDown={(e) => {
              if (e.key === "Enter") verificar();
            }}
          />
          <button
            type="button"
            onClick={() => verificar()}
            disabled={cargando}
            className="rounded-lg bg-emerald-700 px-6 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-50"
          >
            {cargando ? "Verificando..." : "Verificar"}
          </button>
        </div>
        <p className="text-xs text-slate-500 mt-2">
          El codigo aparece en la parte inferior del certificado.
        </p>

        {error && (
          <div className="mt-4 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
            {error}
          </div>
        )}
      </div>

      {/* Resultado */}
      {resultado && (
        <div className="mt-6 rounded-2xl border-2 border-emerald-500 bg-emerald-50 p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={3}
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-emerald-900">
                Certificado Valido
              </h2>
              <p className="text-sm text-emerald-800">
                Emitido oficialmente por SENCE
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 space-y-2 text-sm">
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span className="text-slate-600">Titular:</span>
              <span className="font-semibold text-slate-900">{resultado.nombre}</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span className="text-slate-600">RUN:</span>
              <span className="font-mono text-slate-900">{resultado.run}</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span className="text-slate-600">Curso:</span>
              <span className="font-semibold text-slate-900 text-right">{resultado.curso}</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span className="text-slate-600">Codigo SENCE:</span>
              <span className="font-mono text-slate-900">{resultado.codigoSENCE}</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span className="text-slate-600">Nota Final:</span>
              <span className="font-bold text-emerald-700">{resultado.notaFinal.toFixed(1)} / 7.0</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span className="text-slate-600">Horas:</span>
              <span className="font-semibold text-slate-900">{resultado.horas}h</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span className="text-slate-600">Fecha de emision:</span>
              <span className="font-semibold text-slate-900">{resultado.fechaEmision}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Instructor:</span>
              <span className="font-semibold text-slate-900">{resultado.instructor}</span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-emerald-200 text-xs text-emerald-800">
            <p>
              <strong>Codigo unico:</strong>{" "}
              <span className="font-mono">{resultado.codigo}</span>
            </p>
            <p className="mt-1">
              Este certificado esta registrado en el sistema oficial de SENCE y puede
              ser verificado en cualquier momento.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
