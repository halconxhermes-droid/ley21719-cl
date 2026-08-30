/**
 * InsForge Auth Client para ley21719-cl
 * Usa la REST API de InsForge (no requiere SDK - funciona desde el browser).
 *
 * Endpoints:
 * - POST /api/auth/users                -> registro
 * - POST /api/auth/sessions             -> login (password | otp)
 * - POST /api/auth/email/send-otp       -> enviar OTP al email
 * - POST /api/auth/email/verify         -> verificar email con código
 * - POST /api/auth/sessions/refresh     -> refresh access token
 * - DELETE /api/auth/sessions/current   -> logout
 * - GET /api/auth/users                 -> info usuario actual (con Bearer)
 */

const INSFORGE_BASE = "https://7cn2ezja.us-east.insforge.app";
const INSFORGE_API_KEY = "ik_c9a1dd3bfe6a1f5d465946e624e3cb0c";

const TOKEN_KEY = "insforge_access_token";
const REFRESH_KEY = "insforge_refresh_token";
const USER_KEY = "insforge_user";

export interface InsForgeUser {
  id: string;
  email: string;
  emailVerified: boolean;
  name?: string;
  createdAt: string;
  updatedAt: string;
  providers: string[];
  profile: Record<string, unknown>;
}

interface AuthResponse {
  user?: InsForgeUser;
  accessToken?: string | null;
  refreshToken?: string | null;
  csrfToken?: string;
  requireEmailVerification?: boolean;
}

interface ApiError {
  error: string;
  message: string;
  statusCode: number;
  nextActions?: string;
}

function storeSession(data: AuthResponse): void {
  try {
    if (data.accessToken) {
      window.localStorage.setItem(TOKEN_KEY, data.accessToken);
    }
    if (data.refreshToken) {
      window.localStorage.setItem(REFRESH_KEY, data.refreshToken);
    }
    if (data.user) {
      window.localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    }
  } catch {
    /* noop */
  }
}

export function getStoredToken(): string | null {
  try {
    return window.localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function getStoredUser(): InsForgeUser | null {
  try {
    const raw = window.localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as InsForgeUser) : null;
  } catch {
    return null;
  }
}

export function clearSession(): void {
  try {
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.removeItem(REFRESH_KEY);
    window.localStorage.removeItem(USER_KEY);
  } catch {
    /* noop */
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    apikey: INSFORGE_API_KEY,
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  if (init.headers) Object.assign(headers, init.headers as Record<string, string>);

  const res = await fetch(`${INSFORGE_BASE}${path}`, { ...init, headers });
  const text = await res.text();
  let data: unknown;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    throw new Error(`Respuesta inválida del servidor: ${text.slice(0, 120)}`);
  }

  if (!res.ok) {
    const apiErr = data as ApiError;
    const err = new Error(apiErr.message || `Error ${res.status}`);
    (err as Error & { code?: string; nextActions?: string }).code = apiErr.error;
    (err as Error & { code?: string; nextActions?: string }).nextActions = apiErr.nextActions;
    throw err;
  }
  return data as T;
}

/**
 * Registra un usuario nuevo. El email requiere verificación posterior.
 */
export async function signUp(
  email: string,
  password: string,
  name?: string,
): Promise<AuthResponse> {
  const data = await request<AuthResponse>("/api/auth/users", {
    method: "POST",
    body: JSON.stringify({ email, password, name }),
  });
  storeSession(data);
  return data;
}

/**
 * Login con password. Si el email no está verificado, el servidor responde 403.
 */
export async function signInPassword(
  email: string,
  password: string,
): Promise<AuthResponse> {
  const data = await request<AuthResponse>("/api/auth/sessions", {
    method: "POST",
    body: JSON.stringify({ method: "password", email, password }),
  });
  storeSession(data);
  return data;
}

/**
 * Login con OTP (código de 6 dígitos enviado al email).
 */
export async function signInOtp(email: string, otp: string): Promise<AuthResponse> {
  const data = await request<AuthResponse>("/api/auth/sessions", {
    method: "POST",
    body: JSON.stringify({ method: "otp", email, otp }),
  });
  storeSession(data);
  return data;
}

/**
 * Solicita un OTP para verificar email o para login passwordless.
 */
export async function sendOtp(email: string): Promise<void> {
  await request("/api/auth/email/send-otp", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

/**
 * Solicita un enlace de verificacion al email del usuario.
 * El servidor envia un email con un link que el usuario debe abrir.
 * Usado cuando verify_email_method = "link" en InsForge.
 */
export async function sendVerificationLink(email: string): Promise<void> {
  await request("/api/auth/email/send-verification", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

/**
 * Verifica el email del usuario con el código recibido.
 */
export async function verifyEmail(email: string, otp: string): Promise<AuthResponse> {
  const data = await request<AuthResponse>("/api/auth/email/verify", {
    method: "POST",
    body: JSON.stringify({ email, otp }),
  });
  storeSession(data);
  return data;
}

/**
 * Cierra la sesión actual.
 */
export async function signOut(): Promise<void> {
  const token = getStoredToken();
  try {
    if (token) {
      await request("/api/auth/sessions/current", { method: "DELETE" });
    }
  } catch {
    /* noop */
  } finally {
    clearSession();
  }
}

/**
 * Helper para llamadas autenticadas a tu propio backend.
 * Inyecta el Bearer token de InsForge en cada request.
 */
export async function authedFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    apikey: INSFORGE_API_KEY,
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  if (init.headers) Object.assign(headers, init.headers as Record<string, string>);
  return fetch(`${INSFORGE_BASE}${path}`, { ...init, headers });
}

export { INSFORGE_BASE, INSFORGE_API_KEY };
