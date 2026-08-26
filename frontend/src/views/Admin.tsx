import { useEffect, useState, useCallback } from "react";
import {
  adminCreatePassword,
  adminGeneratePassword,
  adminExpirePassword,
  adminMetricsSummary,
  adminAlertsNearExpiry,
  adminGetPassword,
  type PasswordResponse,
  type AdminMetricsSummary,
  type PasswordPreview,
} from "../lib/api";

/**
 * Vista: Panel de Administración de Contraseñas Temporales
 * Ruta: /admin (accesible solo para project_admin vía RLS policy)
 *
 * Funcionalidades:
 * 1. Dashboard de métricas (placeholders hasta tener datos reales)
 * 2. Crear contraseña manual o auto-generada
 * 3. Listar contraseñas que vencen pronto
 * 4. Buscar/ver detalles de una contraseña
 * 5. Marcar contraseñas como vencidas
 */
export default function Admin() {
  return (
    <section aria-labelledby="admin-title">
      <header className="mb-6">
        <h1 id="admin-title" className="text-3xl font-bold text-slate-900">
          🔐 Panel de Administración
        </h1>
        <p className="mt-2 text-slate-600">
          Gestión de contraseñas temporales, licencias individuales y métricas del curso.
        </p>
      </header>

      <MetricsCards />
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <CreatePasswordForm />
        <NearExpiryAlert />
      </div>
      <div className="mt-8">
        <PasswordLookup />
      </div>
    </section>
  );
}

/* ======================================================================
   COMPONENTE 1: Tarjetas de métricas resumen
   ====================================================================== */
function MetricsCards() {
  const [metrics, setMetrics] = useState<AdminMetricsSummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const loadMetrics = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminMetricsSummary();
      setMetrics(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al cargar métricas");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMetrics();
  }, [loadMetrics]);

  if (loading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 text-center text-slate-500">
        Cargando métricas…
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-6">
        <p className="text-amber-900">
          ⚠ No se pudieron cargar las métricas: {error}
        </p>
        <button
          type="button"
          onClick={loadMetrics}
          className="mt-2 rounded-md bg-amber-100 px-3 py-1 text-sm text-amber-900 hover:bg-amber-200"
        >
          Reintentar
        </button>
      </div>
    );
  }

  const cards = [
    { label: "Contraseñas creadas", value: metrics?.total_passwords_created ?? 0, color: "text-primary-700" },
    { label: "Activas", value: metrics?.active_passwords ?? 0, color: "text-emerald-700" },
    { label: "Vencidas", value: metrics?.expired_passwords ?? 0, color: "text-slate-500" },
    { label: "Sesiones registradas", value: metrics?.total_sessions_recorded ?? 0, color: "text-primary-700" },
    { label: "Usuarios únicos", value: metrics?.unique_users ?? 0, color: "text-primary-700" },
    { label: "Vencen pronto (7d)", value: metrics?.near_expiry ?? 0, color: "text-amber-700" },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
      {cards.map((c) => (
        <div
          key={c.label}
          className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
        >
          <p className="m-0 text-xs uppercase tracking-wide text-slate-500">
            {c.label}
          </p>
          <p className={`m-0 mt-1 text-2xl font-bold ${c.color}`}>
            {c.value}
          </p>
        </div>
      ))}
    </div>
  );
}

/* ======================================================================
   COMPONENTE 2: Formulario para crear contraseñas
   ====================================================================== */
function CreatePasswordForm() {
  const [mode, setMode] = useState<"manual" | "auto">("auto");
  const [code, setCode] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [endDate, setEndDate] = useState("");
  const [daysValid, setDaysValid] = useState(30);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PasswordResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      let pw: PasswordResponse;
      if (mode === "auto") {
        pw = await adminGeneratePassword(
          userEmail.trim() || undefined,
          daysValid,
        );
      } else {
        if (!code.trim()) {
          throw new Error("El código es obligatorio en modo manual");
        }
        pw = await adminCreatePassword({
          code: code.trim(),
          user_email: userEmail.trim() || null,
          end_date: endDate || null,
        });
      }
      setResult(pw);
      // Limpiar formulario
      setCode("");
      setUserEmail("");
      setEndDate("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al crear contraseña");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="m-0 text-xl font-semibold text-slate-900">
        ➕ Crear nueva contraseña
      </h2>
      <p className="mt-1 text-sm text-slate-500">
        Licencia individual de acceso al curso.
      </p>

      <div className="mt-4 flex gap-2 rounded-lg bg-slate-100 p-1">
        <button
          type="button"
          onClick={() => setMode("auto")}
          className={`flex-1 cursor-pointer rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
            mode === "auto"
              ? "bg-white text-primary-700 shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Auto-generada
        </button>
        <button
          type="button"
          onClick={() => setMode("manual")}
          className={`flex-1 cursor-pointer rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
            mode === "manual"
              ? "bg-white text-primary-700 shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Manual
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mt-4 space-y-3">
        {mode === "manual" && (
          <div>
            <label
              htmlFor="admin-code"
              className="block text-sm font-medium text-slate-700"
            >
              Código de contraseña
            </label>
            <input
              id="admin-code"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="ej. CLIENTE-2024-001"
              disabled={loading}
              className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>
        )}

        <div>
          <label
            htmlFor="admin-email"
            className="block text-sm font-medium text-slate-700"
          >
            Email del usuario (opcional)
          </label>
          <input
            id="admin-email"
            type="email"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            placeholder="usuario@ejemplo.com"
            disabled={loading}
            className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
        </div>

        {mode === "auto" ? (
          <div>
            <label
              htmlFor="admin-days"
              className="block text-sm font-medium text-slate-700"
            >
              Días de validez
            </label>
            <input
              id="admin-days"
              type="number"
              min={1}
              max={365}
              value={daysValid}
              onChange={(e) => setDaysValid(Number(e.target.value))}
              disabled={loading}
              className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>
        ) : (
          <div>
            <label
              htmlFor="admin-enddate"
              className="block text-sm font-medium text-slate-700"
            >
              Fecha de vencimiento (opcional)
            </label>
            <input
              id="admin-enddate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              disabled={loading}
              className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
            <p className="mt-1 text-xs text-slate-500">
              Si se omite, vence en 30 días.
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full cursor-pointer rounded-md bg-primary-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-800 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {loading ? "Creando…" : mode === "auto" ? "Generar contraseña" : "Crear contraseña"}
        </button>
      </form>

      {error && (
        <div className="mt-4 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
          {error}
        </div>
      )}

      {result && (
        <div className="mt-4 rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm">
          <p className="m-0 font-semibold text-emerald-900">
            ✓ Contraseña creada
          </p>
          <p className="m-0 mt-1 text-emerald-800">
            <span className="font-mono font-bold">{result.code}</span>
            {result.user_email && (
              <span className="ml-2 text-slate-600">→ {result.user_email}</span>
            )}
          </p>
          <p className="m-0 mt-1 text-xs text-emerald-700">
            Vence: {result.end_date ? new Date(result.end_date).toLocaleDateString() : "—"}
          </p>
        </div>
      )}
    </div>
  );
}

/* ======================================================================
   COMPONENTE 3: Alerta de contraseñas por vencer
   ====================================================================== */
function NearExpiryAlert() {
  const [days, setDays] = useState(7);
  const [data, setData] = useState<{ count: number; passwords: PasswordPreview[] } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadAlerts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminAlertsNearExpiry(days);
      setData({ count: res.count, passwords: res.passwords });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al cargar alertas");
    } finally {
      setLoading(false);
    }
  }, [days]);

  useEffect(() => {
    loadAlerts();
  }, [loadAlerts]);

  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="m-0 text-xl font-semibold text-amber-900">
          ⏰ Vencen pronto
        </h2>
        <div className="flex items-center gap-2">
          <label htmlFor="admin-days-select" className="text-sm text-amber-800">
            En los próximos
          </label>
          <select
            id="admin-days-select"
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="rounded-md border border-amber-300 bg-white px-2 py-1 text-sm"
          >
            <option value={3}>3 días</option>
            <option value={7}>7 días</option>
            <option value={14}>14 días</option>
            <option value={30}>30 días</option>
          </select>
        </div>
      </div>

      {loading && (
        <p className="mt-3 text-sm text-amber-800">Cargando…</p>
      )}

      {error && (
        <p className="mt-3 text-sm text-red-700">⚠ {error}</p>
      )}

      {data && !loading && (
        <>
          <p className="mt-3 text-sm text-amber-800">
            <strong>{data.count}</strong> contraseña{data.count !== 1 ? "s" : ""} activa{data.count !== 1 ? "s" : ""} vence{data.count !== 1 ? "n" : ""} en los próximos {days} días.
          </p>
          {data.passwords.length > 0 && (
            <ul className="mt-3 m-0 list-none space-y-2 p-0">
              {data.passwords.slice(0, 5).map((p) => (
                <li
                  key={p.code}
                  className="flex items-center justify-between rounded-md bg-white px-3 py-2 text-sm"
                >
                  <span className="font-mono font-semibold">{p.code}</span>
                  <span className="text-slate-600">
                    {p.user_email ?? "—"}
                  </span>
                  <span className="text-amber-700">
                    {p.end_date ? new Date(p.end_date).toLocaleDateString() : "—"}
                  </span>
                </li>
              ))}
              {data.passwords.length > 5 && (
                <li className="text-center text-xs text-amber-700">
                  +{data.passwords.length - 5} más…
                </li>
              )}
            </ul>
          )}
        </>
      )}
    </div>
  );
}

/* ======================================================================
   COMPONENTE 4: Búsqueda y detalle de una contraseña
   ====================================================================== */
function PasswordLookup() {
  const [code, setCode] = useState("");
  const [password, setPassword] = useState<PasswordResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim()) return;
    setLoading(true);
    setError(null);
    setPassword(null);
    try {
      const pw = await adminGetPassword(code.trim());
      setPassword(pw);
    } catch (e) {
      if (e instanceof Error && e.message.includes("404")) {
        setError(`No se encontró la contraseña "${code}"`);
      } else {
        setError(e instanceof Error ? e.message : "Error al buscar");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleExpire() {
    if (!password) return;
    if (!confirm(`¿Marcar "${password.code}" como vencida?`)) return;
    setActionLoading(true);
    try {
      const res = await adminExpirePassword(password.code);
      setPassword(res.password);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al expirar");
    } finally {
      setActionLoading(false);
    }
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="m-0 text-xl font-semibold text-slate-900">
        🔍 Buscar contraseña
      </h2>
      <form onSubmit={handleSearch} className="mt-4 flex gap-2">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Código de contraseña"
          className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
        />
        <button
          type="submit"
          disabled={loading}
          className="cursor-pointer rounded-md bg-primary-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-800 disabled:bg-slate-300"
        >
          {loading ? "Buscando…" : "Buscar"}
        </button>
      </form>

      {error && (
        <div className="mt-4 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
          {error}
        </div>
      )}

      {password && (
        <div className="mt-4 space-y-3 rounded-md border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center justify-between">
            <h3 className="m-0 font-mono text-lg font-bold text-slate-900">
              {password.code}
            </h3>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                password.status === "active"
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-slate-200 text-slate-600"
              }`}
            >
              {password.status === "active" ? "✓ Activa" : "✕ Vencida"}
            </span>
          </div>

          <dl className="m-0 grid grid-cols-2 gap-3 text-sm">
            <div>
              <dt className="text-xs uppercase text-slate-500">Email</dt>
              <dd className="m-0 text-slate-900">
                {password.user_email ?? "—"}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase text-slate-500">Creada</dt>
              <dd className="m-0 text-slate-900">
                {password.created_at ? new Date(password.created_at).toLocaleDateString() : "—"}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase text-slate-500">Vence</dt>
              <dd className="m-0 text-slate-900">
                {password.end_date ? new Date(password.end_date).toLocaleDateString() : "—"}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase text-slate-500">Última conexión</dt>
              <dd className="m-0 text-slate-900">
                {password.last_connection ? new Date(password.last_connection).toLocaleString() : "Nunca"}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase text-slate-500">Sesiones totales</dt>
              <dd className="m-0 text-slate-900">
                {password.total_sessions}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase text-slate-500">Módulos vistos</dt>
              <dd className="m-0 text-slate-900">
                {password.courses_accessed.length > 0
                  ? password.courses_accessed.join(", ")
                  : "—"}
              </dd>
            </div>
          </dl>

          {password.status === "active" && (
            <div className="flex gap-2 border-t border-slate-200 pt-3">
              <button
                type="button"
                onClick={handleExpire}
                disabled={actionLoading}
                className="cursor-pointer rounded-md border border-amber-300 bg-amber-50 px-3 py-1.5 text-sm font-medium text-amber-900 transition-colors hover:bg-amber-100 disabled:opacity-50"
              >
                {actionLoading ? "Procesando…" : "Marcar como vencida"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
