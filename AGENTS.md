# AGENTS.md — Ley 21.719 Educational Platform Backend

> **Proyecto**: ce8bed33-38b7-4dbe-bdc3-8738f5c4e991  
> **Platform**: InsForge CLI (Fly.io compute)  
> **Stack**: Python 3.13 + FastAPI + SQLite + Uvicorn  
> **Linked Frontend**: https://proteccion-datoscursos.netlify.app  
> **API Contract**: `/api/v1` (documentado en `design/api-contract.md`)

---

## 🔒 REGLA 0 — Contenido legal: prohibido inventar (obligatoria para TODOS los agentes)

1. **Fuente única de verdad**: toda afirmación jurídica, artículo, plazo, monto, definición o procedimiento sobre la Ley 21.719 proviene EXCLUSIVAMENTE de:
   - Texto oficial en BCN LeyChile (`https://www.bcn.cl/leychile/`)
   - Documentos entregados por el usuario (`docs/`, `tools/proyecto_manual_integrado/`)
2. **Prohibido**: inventar, parafrasear como si fuera ley, completar huecos con "conocimiento general", citar artículos sin haberlos verificado en fuente, o generar preguntas/respuestas cuyo contenido no exista literalmente en las fuentes.
3. **Trazabilidad obligatoria**: cada pregunta de quiz, ítem de checklist y término de glosario debe llevar `legalRef` con formato `Art. X` o `Art. X inc. Y` verificable. Si un dato no tiene artículo verificable, se marca `pendiente-validacion-legal` y NO se publica.
4. **Validación humana**: el contenido pasa por revisión del especialista (NotebookLM + usuario) antes de publicarse. Un agente nunca aprueba su propio contenido legal.
5. **Si no estás seguro, no lo escribas**: ante duda entre dos versiones, se usa la del texto oficial y se deja nota para revisión.

---

## 🧭 Quick Start (Local Dev)

```bash
# 1) Entrar al directorio backend
cd backend

# 2) Crear y activar venv (si no existe)
python3 -m venv .venv
source .venv/bin/activate

# 3) Instalar dependencias
pip install -r requirements.txt  # o: pip install fastapi uvicorn pydantic pytest

# 4) Iniciar servidor local con hot-reload
.venv/bin/uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# 5) Verificar
curl http://localhost:8000/health          # → {"status":"ok"}
curl http://localhost:8000/api/v1/modules   # → 4 módulos
```

---

## 📦 Deploy a Producción (InsForge / Fly.io)

```bash
# 1) Login una sola vez (usa variable de entorno; NUNCA commitees la key)
INSFORGE_API_KEY=$(cat backend/.env | grep INSFORGE_API_KEY | cut -d= -f2)
npx @insforge/cli login --user-api-key $INSFORGE_API_KEY

# 2) Link al proyecto (ya hecho)
npx @insforge/cli link --project-id ce8bed33-38b7-4dbe-bdc3-8738f5c4e991

# 3) Deploy del backend (compila Docker + push a Fly.io)
npx @insforge/cli compute deploy backend --name ley21719-backend

# 4) Obtener URL pública generada
# → https://ley21719-backend.fly.dev (o similar)
```

> **Nota**: El deploy usa el `Dockerfile` en `backend/Dockerfile` (multi-stage, python:3.13-slim).

---

## 🔗 Integración Frontend → Backend

### Netlify Redirects (`netlify.toml` en raíz)
```toml
[[redirects]]
  from = "/api/*"
  to = "https://ley21719-backend.fly.dev/api/:splat"
  status = 200
  force = true

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Frontend API Client (`frontend/src/lib/api.ts`)
```typescript
const API_BASE = "/api/v1";  // Vite proxy en dev; Netlify redirect en prod
```

---

## ✅ Tests

```bash
# Backend
cd backend
.venv/bin/pytest -v           # 36 tests esperados passing

# Frontend
cd ../frontend
pnpm test -- --run            # 33 tests Vitest passing
pnpm build                    # build de producción
```

---

## 📊 Calidad & Auditoría

| Herramienta | Comando / Acceso |
|-------------|------------------|
| **SonarQube** | http://145.223.31.197:9000 → proyecto `ley21719-cl` |
| **Quality Gate** | Coverage ≥ 85%, 0 bugs críticos, 0 security hotspots |
| **Lint backend** | `.venv/bin/ruff check app/` |
| **Lint frontend** | `pnpm lint` |

---

## 🗂️ Estructura Clave del Repo

```
ley21719-cl/
├── AGENTS.md              ← este archivo
├── netlify.toml           ← redirects a backend público
├── backend/
│   ├── app/
│   │   ├── main.py        ← FastAPI entrypoint
│   │   ├── routers/       ← modules, quizzes, checklist, glossary, final_test
│   │   ├── models.py      ← Pydantic schemas
│   │   └── db.py          ← SQLite + init_db()
│   ├── tests/             ← 36 tests pytest
│   ├── requirements.txt
│   ├── Dockerfile         ← multi-stage para Fly.io
│   └── .venv/             ← venv local (no commitear)
├── frontend/
│   ├── src/
│   │   ├── lib/api.ts     ← cliente tipado /api/v1
│   │   ├── components/    ← UI React + Tailwind
│   │   └── views/         ← 7 vistas SPA
│   ├── package.json       ← pnpm 11, React 19, Vite 6
│   └── pnpm-lock.yaml
├── docs/
│   ├── quizzes.json       ← 73 preguntas con artículos legales
│   ├── contenido.json     ← 4 módulos por rol
│   ├── glosario.json      ← términos A-Z
│   ├── checklist.json     ← items por rol
│   └── youtube-videos.json
└── design/
    ├── api-contract.md    ← especificación REST /api/v1
    ├── mockups/index.html ← 7 vistas aprobadas
    └── style-guide.md
```

---

## 🔑 Variables de Entorno / Secrets

| Variable | Valor / Fuente |
|----------|----------------|
| `DATABASE_URL` | `sqlite:///./app.db` (local) / `sqlite:///./data/app.db` (Fly.io volume) |
| `CORS_ORIGINS` | `http://localhost:5173, https://proteccion-datoscursos.netlify.app` |
| `YOUTUBE_API_KEY` | En `tools/youtube/` (gitignored) |
| `SONAR_TOKEN` | En SonarQube UI → My Account → Security |

> **Nunca** commitear `.venv/`, `tools/youtube/*.json`, `*.db`, `.env`.

---

## 🆘 Troubleshooting Común

| Problema | Solución |
|----------|----------|
| `ModuleNotFoundError` | `cd backend && source .venv/bin/activate && pip install -r requirements.txt` |
| CORS error en prod | Verificar `CORS_ORIGINS` en `backend/app/main.py` |
| Netlify 404 en `/api/*` | Verificar que `netlify.toml` apunte a URL backend real (Fly.io) |
| SonarQube coverage < 85% | Ejecutar `pytest --cov=app --cov-report=xml` y revisar gaps |
| InsForge deploy timeout | Re-autenticar: `npx @insforge/cli login ...` |

---

## 📞 Contacto / Soporte

- **GitHub Issues**: https://github.com/halconxhermes-droid/ley21719-cl/issues
- **InsForge Dashboard**: https://app.insforge.dev/projects/ce8bed33-38b7-4dbe-bdc3-8738f5c4e991
- **SonarQube**: http://145.223.31.197:9000/dashboard?id=ley21719-cl

---

*Generado automáticamente para InsForge CLI. Actualizar al cambiar arquitectura o URLs.*

<!-- INSFORGE:START -->
## InsForge backend

This project uses [InsForge](https://insforge.dev): an all-in-one, open-source Postgres-based backend (BaaS) that gives this app a database, authentication, file storage, edge functions, realtime, an AI model gateway, and payments through one platform.

- **Project:** **hermes** (API base `https://7cn2ezja.us-east.insforge.app`)
- **Skills:** these InsForge skills are installed for supported coding agents. Reach for them before implementing any InsForge feature instead of guessing the API:
  - `insforge`: app code with the `@insforge/sdk` client (database CRUD, auth, storage, edge functions, realtime, AI, email, and Stripe payments).
  - `insforge-cli`: backend and infrastructure via the `insforge` CLI (projects, SQL, migrations, RLS policies, storage buckets, functions, secrets, payment setup, schedules, deploys).
  - `insforge-debug`: diagnosing failures (SDK/HTTP errors, RLS denials, auth and OAuth issues) and running security or performance audits.
  - `insforge-integrations`: wiring external auth providers (Clerk, Auth0, WorkOS, Better Auth, etc.) for JWT-based RLS, or the OKX x402 payment facilitator.
  - `find-skills`: discovering additional skills on demand.
- **Credentials:** app code reads keys from `.env.local`; the CLI reads `.insforge/project.json`. Never hardcode or commit keys.

Key patterns:

- Database inserts take an array: `insert([{ ... }])`.
- Reference users with `auth.users(id)`; use `auth.uid()` in RLS policies.
- For storage uploads, persist both the returned `url` and `key`.
<!-- INSFORGE:END -->

---

## 🌐 Backend público — fuente única de verdad

| Entorno | URL | Estado |
|---------|-----|--------|
| Local | `http://localhost:8000` | Desarrollo |
| **Producción (hoy)** | Túnel Cloudflare efímero — ver `to =` en `netlify.toml` | ⚠️ Temporal: cambia en cada restart |
| **Producción (destino)** | `https://ley21719-backend-ce8bed33-38b7-4dbe-bdc3-8738f5c4e991.fly.dev` | Tras crear volumen (`flyctl volumes create ley21719_data`) y redeploy |

**Regla**: la única configuración del redirect vive en `netlify.toml`.
`frontend/src/lib/api.ts` usa solo rutas relativas `/api/v1`. Nada de IPs ni dominios hardcodeados en código.
Cuando Fly.io quede activo con volumen persistente: actualizar `netlify.toml`, borrar esta nota y redeploy.
