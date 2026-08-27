/* ── Netlify Function: Auth gate (mínimo) ──
   Compara hash SHA256 del password tal como llega.
   Acepta: ley21719-2026 y Halconx15426321+- (según como se haga el hash)
------------------------------------------------------------------- */
import type { Context } from "@netlify/functions";
import { createHash } from "node:crypto";

// Hashes SHA256puros (sin salt) generados al momento del despliegue:
// sha256("ley21719-2026") = 02b76a8c2e854c1364557d4b4f6638a7722fb804634924382b2714a994badc39
// sha256("Halconx15426321+-") = 0d743d93ea28a6ce732e34350918342999485dbe515683e6d2c8f78a99b24af1
const ACCEPTED_PURE_HASHES = [
  "02b76a8c2e854c1364557d4b4f6638a7722fb804634924382b2714a994badc39",
  "0d743d93ea28a6ce732e34350918342999485dbe515683e6d2c8f78a99b24af1",
];

function hashPasswordPure(password: string): string {
  return createHash("sha256").update(password).digest("hex");
}

export default async (req: Request, ctx: Context) => {
  const url = new URL(req.url);
  const path = url.pathname.replace(/^\//, "");
  const method = req.method;

  if (method === "OPTIONS")
    return new Response(null, { status: 204 });

  let data: any = null;
  if (method === "POST") {
    try { data = await req.json(); } catch { data = null; }
  } else if (method === "GET") {
    const sp = url.searchParams.toString();
    if (sp) data = { searchParams: sp };
  }

  /* ── Gate: POST api/v1/access/verify {password} → {token} ── */
  if (path === "api/v1/access/verify" && method === "POST") {
    if (!data?.password) {
      return new Response(JSON.stringify({ error: { code: "MISSING_PASSWORD", message: "Falta el parámetro password" } }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    
    // Hash puro del password proporcionado (sin salt)
    const providedHash = hashPasswordPure(data.password);
    
    // Verificar contra hashes aceptados
    const isValid = ACCEPTED_PURE_HASHES.includes(providedHash);
    
    if (!isValid) {
      return new Response(JSON.stringify({ error: { code: "INVALID_PASSWORD", message: "Contraseña incorrecta." } }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
    
    // Devolver token (misma función de hash)
    const token = createHash("sha256").update(data.password).digest("hex");
    
    return new Response(JSON.stringify({ token, expiresIn: "30d" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ error: { code: "NOT_FOUND", message: "Ruta no encontrada" } }), {
    status: 404,
    headers: { "Content-Type": "application/json" },
  });
};