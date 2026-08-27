/**
 * Gate de acceso -- cliente.
 * Guarda el token en localStorage y lo inyecta en cada request via api.ts.
 */

const TOKEN_KEY = "ley21719_access_token";

export function getStoredToken(): string | null {
  try {
    return window.localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function storeToken(token: string): void {
  try {
    window.localStorage.setItem(TOKEN_KEY, token);
  } catch {
    /* noop */
  }
}

export function clearToken(): void {
  try {
    window.localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* noop */
  }
}

/** POST /api/v1/access/verify -- retorna { token } o lanza si invalida */
export async function verifyPassword(email: string, code: string): Promise<string> {
  const res = await fetch("/api/v1/access/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ email, code }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error?.message || "Correo o contraseña incorrectos.");
  }
  const data = (await res.json()) as { token: string };
  storeToken(data.token);
  return data.token;
}
