import { useEffect, useState } from "react";

interface VerifyResult {
  valid: boolean;
  message?: string;
  code?: string;
  issuedAt?: string;
  score?: { obtained: number; total: number };
  course?: string;
  issuer?: string;
}

export default function VerificarCertificado() {
  const [code, setCode] = useState("");
  const [result, setResult] = useState<VerifyResult | null>(null);
  const [loading, setLoading] = useState(false);

  // si viene ?cod=XXXX en la URL, autollenar y consultar
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cod = params.get("cod");
    if (cod) {
      setCode(cod.toUpperCase());
      consultar(cod);
    }
  }, []);

  async function consultar(cod: string) {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch(`/api/v1/certificates/verify?cod=${encodeURIComponent(cod)}`);
      const data = await res.json();
      setResult({
        valid: Boolean(data.valido),
        message: data.valido ? undefined : "El certificado fue revocado.",
        code: data.codigo,
        issuedAt: data.fecha_emision,
        score: { obtained: data.nota_final, total: 7 },
        course: data.curso,
        issuer: data.instructor,
      });
    } catch {
      setResult({ valid: false, message: "Error de red al verificar." });
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const cod = code.trim().toUpperCase();
    if (!/^LEY21719-[A-Z0-9]+-[A-Z0-9]+$/.test(cod)) {
      setResult({ valid: false, message: "El código no tiene un formato válido." });
      return;
    }
    consultar(cod);
  }

  function limpiar() {
    setCode("");
    setResult(null);
  }

  return (
    <section className="max-w-2xl mx-auto px-4 py-10 sm:py-16">
      <header className="mb-8 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-emerald-900 tracking-tight">
          Verificar Certificado
        </h1>
        <p className="mt-2 text-slate-600">
          Introduce el código de verificación que aparece en el certificado.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="mb-8" noValidate>
        <div className="flex gap-2">
          <label htmlFor="cod" className="sr-only">
            Código de verificación
          </label>
          <input
            id="cod"
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="LEY21719-XXXXXX-XXXXXXXX"
            maxLength={32}
            className="flex-1 px-4 py-3 text-center text-xl font-mono tracking-widest border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
            disabled={loading}
            autoComplete="off"
          />
          <button
            type="submit"
            disabled={loading || code.trim().length === 0}
            className="px-6 py-3 bg-emerald-700 text-white font-semibold rounded-lg hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Verificando…" : "Verificar"}
          </button>
        </div>
        <p className="mt-2 text-xs text-slate-500 text-center">
          El código está en la esquina inferior izquierda del certificado (formato: 8 dígitos hexadecimales).
        </p>
      </form>

      {result && (
        <article
          className={`rounded-xl p-6 border-2 ${
            result.valid
              ? "bg-emerald-50 border-emerald-200"
              : "bg-red-50 border-red-200"
          }`}
          role="status"
          aria-live="polite"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className={`inline-flex items-center justify-center w-10 h-10 rounded-full ${
              result.valid ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
            }`}>
              {result.valid ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </span>
            <h2 className={`text-xl font-bold ${result.valid ? "text-emerald-800" : "text-red-800"}`}>
              {result.valid ? "Certificado VÁLIDO" : "Certificado NO ENCONTRADO"}
            </h2>
          </div>

          {result.valid && (
            <dl className="grid gap-3 sm:grid-cols-2 text-sm">
              <div>
                <dt className="text-slate-500">Código</dt>
                <dd className="font-mono font-semibold text-emerald-900">{result.code}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Fecha de emisión</dt>
                <dd className="font-medium">{result.issuedAt}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Puntaje</dt>
                <dd className="font-medium">{result.score?.obtained} / {result.score?.total}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Curso</dt>
                <dd className="font-medium">{result.course}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-slate-500">Emitido por</dt>
                <dd className="font-medium">{result.issuer}</dd>
              </div>
            </dl>
          )}

          {!result.valid && (
            <p className="text-red-700">{result.message}</p>
          )}

          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              type="button"
              onClick={limpiar}
              className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 font-medium"
            >
              Verificar otro
            </button>
          </div>
        </article>
      )}
    </section>
  );
}