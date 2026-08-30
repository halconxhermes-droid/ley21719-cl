import { useState } from "react";
import {
  signUp,
  signInPassword,
  sendVerificationLink,
  type InsForgeUser,
} from "../lib/insforgeAuth";

type Mode = "login" | "signup";
type Step = "credentials" | "check-email" | "done";

interface Props {
  onSuccess: (user: InsForgeUser) => void;
  onCancel?: () => void;
}

export default function InsForgeAuth({ onSuccess, onCancel }: Props) {
  const [mode, setMode] = useState<Mode>("login");
  const [step, setStep] = useState<Step>("credentials");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sentLinkTo, setSentLinkTo] = useState<string | null>(null);

  async function handleCredentials(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!email.trim()) return setError("Ingresa tu correo.");
    if (password.length < 6) {
      return setError("La contrasena debe tener al menos 6 caracteres.");
    }

    setLoading(true);
    try {
      if (mode === "signup") {
        await signUp(email, password, name);
        setSentLinkTo(email);
        setStep("check-email");
      } else {
        try {
          const res = await signInPassword(email, password);
          if (res.user) onSuccess(res.user);
          setStep("done");
        } catch (err) {
          const e = err as Error & { code?: string; nextActions?: string };
          if (e.code === "FORBIDDEN" && e.message.toLowerCase().includes("verify")) {
            await sendVerificationLink(email);
            setSentLinkTo(email);
            setStep("check-email");
          } else {
            throw err;
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido.");
    } finally {
      setLoading(false);
    }
  }

  async function resendLink() {
    if (!sentLinkTo) return;
    setLoading(true);
    try {
      await sendVerificationLink(sentLinkTo);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo reenviar.");
    } finally {
      setLoading(false);
    }
  }

  function back() {
    setStep("credentials");
    setSentLinkTo(null);
    setError(null);
  }

  if (step === "done") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="text-center">
          <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-emerald-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <p className="text-lg font-semibold text-slate-900">Listo! Cargando plataforma...</p>
        </div>
      </div>
    );
  }

  if (step === "check-email") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="mb-6 flex items-center justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-9 w-9 text-emerald-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </div>
          </div>
          <h1 className="mb-2 text-center text-2xl font-semibold text-slate-900">Revisa tu correo</h1>
          <p className="mb-6 text-center text-sm text-slate-600">
            Enviamos un enlace de verificacion a <strong>{sentLinkTo}</strong>.
            <br />
            Haz click en el enlace para activar tu cuenta.
          </p>
          <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            <p className="font-semibold">Pasos:</p>
            <ol className="ml-4 mt-2 list-decimal space-y-1">
              <li>Abre tu email (revisa spam si no lo ves)</li>
              <li>Busca el email de Plataforma Ley 21.719</li>
              <li>Haz click en el enlace "Confirmar correo"</li>
              <li>Volveras a esta pagina ya verificado</li>
            </ol>
          </div>
          {error && (
            <div role="alert" className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          )}
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={resendLink}
              disabled={loading}
              className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
            >
              {loading ? "Reenviando..." : "Reenviar enlace"}
            </button>
            <button
              type="button"
              onClick={back}
              className="w-full text-center text-sm text-slate-500 hover:underline"
            >
              Cambiar correo
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-6 flex items-center justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-emerald-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M12 2L4 6v6c0 5 3.5 9.5 8 10 4.5-.5 8-5 8-10V6l-8-4z" />
            </svg>
          </div>
        </div>
        <h1 className="mb-2 text-center text-2xl font-semibold text-slate-900">
          {mode === "signup" ? "Crear cuenta" : "Iniciar sesion"}
        </h1>
        <p className="mb-6 text-center text-sm text-slate-600">
          Plataforma Ley 21.719 - Proteccion de datos personales
        </p>

        <form onSubmit={handleCredentials} className="space-y-4">
          {mode === "signup" && (
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nombre (opcional)"
              disabled={loading}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-base focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-100"
            />
          )}
          <input
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError(null); }}
            placeholder="correo@ejemplo.cl"
            autoComplete="email"
            disabled={loading}
            required
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-base focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-100"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(null); }}
            placeholder="Contrasena (min. 6 caracteres)"
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
            disabled={loading}
            required
            minLength={6}
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-base focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-100"
          />

          {error && (
            <div role="alert" className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-emerald-700 px-4 py-3 text-base font-semibold text-white transition hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-300 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {loading
              ? "Procesando..."
              : mode === "signup"
              ? "Crear cuenta"
              : "Acceder"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-600">
          {mode === "signup" ? (
            <>Ya tienes cuenta? <button type="button" onClick={() => { setMode("login"); setError(null); }} className="font-semibold text-emerald-700 hover:underline">Inicia sesion</button></>
          ) : (
            <>No tienes cuenta? <button type="button" onClick={() => { setMode("signup"); setError(null); }} className="font-semibold text-emerald-700 hover:underline">Registrate</button></>
          )}
        </div>

        {onCancel && (
          <div className="mt-3 text-center">
            <button type="button" onClick={onCancel} className="text-xs text-slate-400 hover:underline">
              Entrar sin cuenta (modo demo)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
