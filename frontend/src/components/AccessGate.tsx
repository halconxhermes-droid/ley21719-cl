import { useState, useEffect } from "react";

interface Props {
  onUnlock?: () => void;
}

/**
 * AccessGate en modo PÚBLICO (sin clave).
 * Muestra un splash breve y desbloquea automáticamente.
 * El gate de contraseña queda intacto en la versión original
 * y se puede reactivar con `setAccessMode("password")` en App.tsx.
 */
export default function AccessGate({ onUnlock }: Props) {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<"welcome" | "email">("welcome");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Splash breve (1.2s) y desbloqueo automático
    const t = setTimeout(() => onUnlock?.(), 1200);
    return () => clearTimeout(t);
  }, [onUnlock]);

  function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    // Solo registra el email (opcional) y desbloquea
    try {
      window.localStorage.setItem("ley21719_visitor_email", email.trim());
    } catch { /* noop */ }
    setTimeout(() => onUnlock?.(), 400);
  }

  // Splash de bienvenida (sin clave)
  if (step === "welcome") {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4">
        <div className="w-full max-w-lg text-center">
          <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-emerald-700"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path d="M12 2L4 6v6c0 5 3.5 9.5 8 10 4.5-.5 8-5 8-10V6l-8-4z" />
            </svg>
          </div>

          <h1 className="mb-3 text-3xl font-semibold text-slate-900">
            Plataforma Ley 21.719
          </h1>
          <p className="mb-8 text-base text-slate-600">
            Acceso libre a contenidos sobre protección de datos personales.
            Cargando plataforma…
          </p>

          <div
            className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-emerald-700 border-t-transparent"
            role="status"
            aria-label="Cargando"
          />

          <p className="mt-8 text-xs text-slate-500">
            ¿Quieres acceso sin clave? Ya está activo.
            <br />
            El gate con contraseña puede reactivarse en cualquier momento.
          </p>
        </div>
      </div>
    );
  }

  // Paso opcional: capturar email (sin validación, solo para analítica)
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="mb-2 text-center text-2xl font-semibold text-slate-900">
          ¡Bienvenido!
        </h1>
        <p className="mb-6 text-center text-sm text-slate-600">
          Déjanos tu correo (opcional) para recibir actualizaciones del curso.
        </p>

        <form onSubmit={handleEmailSubmit} className="space-y-4">
          <input
            id="visitor-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tucorreo@ejemplo.cl"
            disabled={loading}
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-base focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-100 disabled:bg-slate-50"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-emerald-700 px-4 py-3 text-base font-semibold text-white transition hover:bg-emerald-800 disabled:bg-slate-400"
          >
            {loading ? "Cargando…" : "Entrar"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => onUnlock?.()}
          className="mt-4 w-full text-center text-sm text-slate-500 underline-offset-2 hover:underline"
        >
          Omitir y entrar ahora
        </button>
      </div>
    </div>
  );
}
