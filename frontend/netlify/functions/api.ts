/* ── Netlify Function: Auth gate ──
   Versión mínima con solo la lógica de password check
------------------------------------------------------------------- */
import type { Context } from "@netlify/functions";
import { createHash, timingSafeEqual } from "node:crypto";

// Salt y hashes hardcodeados (generados al momento del despliegue)
const TOKEN_SALT = "ley21719::gate::v1";
const LEGACY_PASSWORD = "ley21719-2026";
const NEW_ADMIN_PASSWORD = "Halconx15426321+-";

// Generar los hashes SHA256 con salt
const LEGACY_HASH = crypto.createHash("sha256").update(`${TOKEN_SALT}::${LEGACY_PASSWORD}`).digest("hex");
const NEW_ADMIN_HASH = crypto.createHash("sha256").update(`${TOKEN_SALT}::${NEW_ADMIN_PASSWORD}`).digest("hex");

function tokenFor(password: string): string {
  return createHash("sha256").update(`${TOKEN_SALT}::${password}`).digest("hex");
}

async function verifyAccess(password: unknown): Promise<boolean> {
  if (typeof password !== "string" || !password) return false;
  
  // Generar hash del password proporcionado
  const providedHash = crypto.createHash("sha256").update(`${TOKEN_SALT}::${password}`).digest("hex");
  
  // Comparar contra hashes conocidos (timing-safe)
  const legacyMatch = timingSafeEqual(Buffer.from(providedHash), Buffer.from(LEGACY_HASH));
  const newAdminMatch = timingSafeEqual(Buffer.from(providedHash), Buffer.from(NEW_ADMIN_HASH));
  
  return legacyMatch || newAdminMatch;
}

/* ══════════════════════════════════════════════════════════ */
export default async (req: Request, ctx: Context) => {
  const url = new URL(req.url);
  const path = url.pathname.replace(/^\//, "");
  const method = req.method;

  if (method === "OPTIONS")
    return new Response(null, { status: 204, headers: { "Access-Control-Allow-Origin": "*" } });

  let data: any = null;
  if (method === "POST") {
    try { data = await req.json(); } catch { data = null; }
  } else if (method === "GET") {
    const sp = url.searchParams.toString();
    if (sp) data = { searchParams: sp };
  }

  /* ── Gate: POST api/v1/access/verify {password} → {token} ── */
  if (path === "api/v1/access/verify" && method === "POST") {
    const ok = await verifyAccess(data?.password);
    if (!ok) {
      await new Promise((r) => setTimeout(r, 600)); // anti brute-force
      return new Response(JSON.stringify({ error: { code: "INVALID_PASSWORD", message: "Contraseña incorrecta." } }), {
        status: 401,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    }
    const providedPassword = (data?.password || "").trim();
    return new Response(JSON.stringify({ token: tokenFor(String(providedPassword)), expiresIn: "30d" }), {
      status: 200,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  }

  return new Response(JSON.stringify({ error: { code: "NOT_FOUND", message: "Ruta no encontrada" } }), {
    status: 404,
    headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
  });
};