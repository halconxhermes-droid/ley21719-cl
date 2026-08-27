/* ── Netlify Function: Auth gate ──
   Lógica: frontend envía password plano, backend hashea con salt y compara.
   Acepta Halconx15426321+- y Halconx15426321- (por si el + se pierde)
------------------------------------------------------------------- */
import type { Context } from "@netlify/functions";
import { createHash, timingSafeEqual } from "node:crypto";

// Salt conocido (generado al momento del despliegue)
const TOKEN_SALT = "ley21719::gate::v1";

// Hashes SHA256 CON salt conocidos (generados al despliegue)
// LEGACY: sha256("ley21719::gate::v1::ley21719-2026")
const LEGACY_HASH = "26553e2a23c8a7b0c97c53267140eacf936c43b013b2609cac01b63c7b1d1862";
// NEW ADMIN: sha256("ley21719::gate::v1::Halconx15426321+-")
const NEW_ADMIN_HASH = "cf7cd6cdbb836faf4adc82941b02598bd1264f9b8ac8b736787e82fa7932b4c6";
// NEW ADMIN (sin +, por si el + se pierde en el transporte): sha256("ley21719::gate::v1::Halconx15426321-")
const NEW_ADMIN_HASH_NOPLUS = "25619b29d27de2296c0772541cf16b8aac5b796e1c3a4ceca5675747d19468b4";

// Generar hash SHA256 con salt del password proporcionado
function hashWithSalt(password: string): string {
  return createHash("sha256").update(`${TOKEN_SALT}::${password}`).digest("hex");
}

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
    if (!data?.password) {
      return new Response(JSON.stringify({ error: { code: "MISSING_PASSWORD", message: "Falta el parámetro password" } }), {
        status: 400,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    }
    
    // Hash del password proporcionado (con salt)
    const providedHash = hashWithSalt(data.password);
    
    // Comparar usando timing-safe equal contra todos los hashes conocidos
    const legacyMatch = timingSafeEqual(Buffer.from(providedHash), Buffer.from(LEGACY_HASH));
    const newAdminMatch = timingSafeEqual(Buffer.from(providedHash), Buffer.from(NEW_ADMIN_HASH));
    const newAdminNoPlusMatch = timingSafeEqual(Buffer.from(providedHash), Buffer.from(NEW_ADMIN_HASH_NOPLUS));
    
    if (!legacyMatch && !newAdminMatch && !newAdminNoPlusMatch) {
      return new Response(JSON.stringify({ error: { code: "INVALID_PASSWORD", message: "Contraseña incorrecta." } }), {
        status: 401,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    }
    
    // Devolver token (usando el mismo mecanismo)
    const token = createHash("sha256").update(`${TOKEN_SALT}::${data.password}`).digest("hex");
    
    return new Response(JSON.stringify({ token, expiresIn: "30d" }), {
      status: 200,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  }

  return new Response(JSON.stringify({ error: { code: "NOT_FOUND", message: "Ruta no encontrada" } }), {
    status: 404,
    headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
  });
};