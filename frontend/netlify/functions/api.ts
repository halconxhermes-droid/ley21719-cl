/* ── Netlify Function: Auth gate (mínimo y definitivo) ──
   Login: email + password "ley21719-2026"
   Un solo password aceptado, sin complejidades
------------------------------------------------------------------- */
import type { Context } from "@netlify/functions";
import { createHash } from "node:crypto";

// Único password aceptado (SHA256 puro generado al despliegue)
const ACCEPTED_PURE_HASH = "02b76a8c2e854c1364557d4b4f6638a7722fb804634924382b2714a994badc39";  // sha256("ley21719-2026")

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
    
    // Hash puro del password proporcionado
    const providedHash = hashPasswordPure(data.password);
    
    // Comparar contra el hash aceptado conocido
    const isValid = providedHash === ACCEPTED_PURE_HASH;
    
    if (!isValid) {
      return new Response(JSON.stringify({ error: { code: "INVALID_PASSWORD", message: "Contraseña incorrecta." } }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
    
    // Devolver token (misma función de hash para consistencia)
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