import { useState, useEffect } from "react";
import { verifyPassword } from "../lib/access";

interface Props {
  onUnlock?: () => void;
}

export default function AccessGate({ onUnlock }: Props) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("ley21719_access_token");
    if (stored) onUnlock?.();
  }, [onUnlock]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!password.trim()) {
      setError("Ingresa la contraseña de acceso.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await verifyPassword(password);
      onUnlock?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Contraseña incorrecta.");
      setPassword("");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-6 flex items-center justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7 text-emerald-700"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0110 0v4" />
           </svg>
         </div>
       </div>

        <h1 className="mb-2 text-center text-2xl font-semibold text-slate-900">
          Acceso restringido
       </h1>
        <p className="mb-6 text-center text-sm text-slate-600">
          Esta plataforma es privada. Ingresa la contraseña proporcionada para
          acceder al contenido sobre la Ley N° 21.719.
       </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="access-password" className="sr-only">
              Contraseña
           </label>
            <input
              id="access-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(null);
              }}
              placeholder="Contraseña de acceso"
              disabled={loading}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-base focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-100 disabled:bg-slate-50"
              autoFocus
            />
         </div>

          {error && (
            <div
              role="alert"
              className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
            >
              {error}
           </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-emerald-700 px-4 py-3 text-base font-semibold text-white transition hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-300 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {loading ? "Verificando…" : "Acceder"}
         </button>
       </form>

        <p className="mt-6 text-center text-xs text-slate-500">
          ¿No tienes acceso? Contacta al administrador del sitio.
       </p>
     </div>
   </div>
  );
}
