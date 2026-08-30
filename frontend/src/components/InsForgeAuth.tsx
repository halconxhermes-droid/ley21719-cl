import { useState } from "react";
import {
  signUp,
  sendOtp,
  signInPassword,
  signInOtp,
  verifyEmail,
  type InsForgeUser,
} from "../lib/insforgeAuth";

type Mode = "login" | "signup";
type Step = "credentials" | "verify-otp" | "done";

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
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [useOtp, setUseOtp] = useState(false);

  async function handleCredentials(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!email.trim()) return setError("Ingresa tu correo.");
    if (!useOtp && password.length < 6) {
      return setError("La contraseña debe tener al menos 6 caracteres.");
    }

    setLoading(true);
    try {
      if (mode === "signup") {
        const res = await signUp(email, password, name);
        // Siempre hay que verificar email
        await sendOtp(email);
        setStep("verify-otp");
      } else if (useOtp) {
        await sendOtp(email);
        setStep("verify-otp");
      } else {
        try {
          const res = await signInPassword(email, password);
          if (res.user) onSuccess(res.user);
          setStep("done");
        } catch (err) {
          const e = err as Error & { code?: string; nextActions?: string };
          if (e.code === "FORBIDDEN" && e.message.toLowerCase().includes("verify")) {
            // Email no verificado, enviar OTP
            await sendOtp(email);
            setStep("verify-otp");
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

  async function handleOtp(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!otp.trim() || otp.length !== 6) {
      return setError("Ingresa el código de 6 dígitos.");
    }
    setLoading(true);
    try {
      // 1) Verificar email (necesario después de signup)
      try {
        await verifyEmail(email, otp);
      } catch {
        // Si ya estaba verificado, ignoramos
      }
      // 2) Iniciar sesión con OTP
      const res = await signInOtp(email, otp);
      if (res.user) onSuccess(res.user);
      setStep("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Código inválido o expirado.");
    } finally {
      setLoading(false);
    }
  }

  function back() {
    setStep("credentials");
    setError(null);
    setOtp("");
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
          <p className="text-lg font-semibold text-slate-900">¡Listo! Cargando plataforma…</p>
        </div>
      </div>
    );
  }

  if (step === "verify-otp") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="mb-6 flex items-center justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-emerald-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </div>
          </div>
          <h1 className="mb-2 text-center text-2xl font-semibold text-slate-900">Verifica tu correo</h1>
          <p className="mb-6 text-center text-sm text-slate-600">
            Enviamos un código de 6 dígitos a <strong>{email}</strong>. Revisa también la bandeja de spam.
          </p>
          <form onSubmit={handleOtp} className="space-y-4">
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]{6}"
              maxLength={6}
              value={otp}
              onChange={(e) => { setOtp(e.target.value.replace(/\D/g, "").slice(0, 6)); setError(null); }}
              placeholder="000000"
              autoFocus
              className="w-full rounded-lg border border-slate-300 px-4 py-4 text-center text-2xl font-mono tracking-widest focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-100"
            />
            {error && (
              <div role="alert" className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {error}
              </div>
            )}
            <button type="submit" disabled={loading} className="w-full rounded-lg bg-emerald-700 px-4 py-3 text-base font-semibold text-white transition hover:bg-emerald-800 disabled:bg-slate-400">
              {loading ? "Verificando…" : "Verificar código"}
            </button>
          </form>
          <div className="mt-6 flex flex-col gap-2 text-center text-sm">
            <button type="button" onClick={() => sendOtp(email).then(() => setError("Código reenviado."))} disabled={loading} className="text-emerald-700 hover:underline">
              Reenviar código
            </button>
            <button type="button" onClick={back} className="text-slate-500 hover:underline">
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
          {mode === "signup" ? "Crear cuenta" : "Iniciar sesión"}
        </h1>
        <p className="mb-6 text-center text-sm text-slate-600">
          Plataforma Ley 21.719 — Protección de datos personales
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
          {!useOtp && (
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(null); }}
              placeholder="Contraseña (mín. 6 caracteres)"
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
              disabled={loading}
              required
              minLength={6}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-base focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-100"
            />
          )}

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
              ? "Procesando…"
              : mode === "signup"
              ? "Crear cuenta y enviar código"
              : useOtp
              ? "Enviar código al correo"
              : "Acceder"}
          </button>
        </form>

        {mode === "login" && (
          <div className="mt-4 text-center">
            <button type="button" onClick={() => { setUseOtp(!useOtp); setError(null); }} className="text-sm text-emerald-700 hover:underline">
              {useOtp ? "Usar contraseña" : "Iniciar con código al correo (OTP)"}
            </button>
          </div>
        )}

        <div className="mt-6 text-center text-sm text-slate-600">
          {mode === "signup" ? (
            <>¿Ya tienes cuenta? <button type="button" onClick={() => { setMode("login"); setError(null); }} className="font-semibold text-emerald-700 hover:underline">Inicia sesión</button></>
          ) : (
            <>¿No tienes cuenta? <button type="button" onClick={() => { setMode("signup"); setError(null); }} className="font-semibold text-emerald-700 hover:underline">Regístrate</button></>
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
