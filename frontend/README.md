# Frontend — Ley 21.719 (ley21719-cl)

Web educativa sobre la **Ley 21.719 de Protección de Datos Personales de Chile** (vigencia plena: **1 de diciembre de 2026**). Réplica exacta del mockup aprobado en `../design/mockups/index.html`, consumiendo la API FastAPI del backend.

## Stack

- **React 18+ / TypeScript / Vite**
- **Tailwind CSS v4** (tokens del `design/style-guide.md` vía `@theme`)
- **Vitest + React Testing Library** (34 tests)
- Gestor: **pnpm**

## Arranque

```bash
# 1) Backend FastAPI en :8000 (desde la raíz del repo)
backend/.venv/bin/uvicorn app.main:app --port 8000 --app-dir backend

# 2) Frontend con proxy /api → :8000
cd frontend
pnpm install
pnpm dev        # http://localhost:5173
```

En desarrollo, Vite proxifica `/api/*` a `http://localhost:8000` (ver `vite.config.ts`). No hace falta CORS para localhost:5173, aunque el backend ya lo habilita.

## Tests y build

```bash
pnpm test        # Vitest + RTL — 34 tests, 5 archivos
pnpm test:watch  # modo watch
pnpm build       # tsc --noEmit && vite build (sin errores TS)
pnpm preview     # sirve dist/
```

## Estructura

```
src/
├── components/        # Header (sticky + countdown), Footer, Modal glosario,
│                      # ProgressBar, ModuleVideos (embeds YouTube), RoleIndicator, Feedback
├── views/             # Home, LectorModulo, Quiz, Checklist, Glosario, TestFinal, Resultados
├── context/           # RolContext (localStorage), NavigationContext (router por estado)
├── lib/
│   ├── api.ts         # cliente fetch tipado contra /api/v1 (tipos del contrato REST)
│   ├── videos.ts      # mapeo de los 10 videos YouTube unlisted (docs/youtube-videos.json)
│   ├── countdown.ts   # cuenta regresiva viva al 2026-12-01T03:00Z (00:00 CLST)
│   └── markdown.ts    # render básico de markdown → HTML
└── test/              # suites Vitest (setup jsdom + matchMedia)
```

## Vistas (7)

1. **Home** — hero + selector de rol (4 perfiles, persistente en localStorage, botones `aria-pressed`) + cuenta regresiva.
2. **LectorModulo** — 3 niveles de lectura (Resumen / Amigable / Legal) con tabs `aria-pressed`, escenario «¿Qué pasa si…?» y videos del módulo.
3. **Quiz** — feedback inmediato por pregunta, barra de progreso.
4. **Checklist** — «¿Estoy listo?» con % persistente en localStorage (`ley21719_ck_<rol>`) + sync opcional al API.
5. **Glosario** — A–Z con buscador y modal accesible (foco atrapado, Escape cierra).
6. **TestFinal** — 10 preguntas sin feedback inmediato; envía respuestas al API.
7. **Resultados** — score, desglose por módulo y elegibilidad de certificado (estado en sessionStorage).

## Videos YouTube

Los 10 videos del curso son **unlisted**: solo se muestran embebidos via `https://www.youtube.com/embed/{video_id}` dentro de las vistas correspondientes según el campo `tema` del mapeo (`docs/youtube-videos.json`). Playlist: `PLe_vi6plvNRU`.

## Accesibilidad (WCAG 2.1 AA)

- Skip-link «Saltar al contenido principal» (visible al enfocar).
- Header sticky con `role="banner"`, nav con `aria-label`.
- Cuenta regresiva en `aria-live="polite"` (anuncia cada minuto).
- Botones de rol/nivel con `aria-pressed`; checkboxes con `<label>` asociado.
- Modal de glosario con `role="dialog"`, `aria-modal`, foco inicial y cierre con Escape.
- `focus-visible` estilizado globalmente; respeta `prefers-reduced-motion`.

## Estado local

| Clave | Contenido |
|---|---|
| `ley21719_role` | rol seleccionado (`ciudadano`, `empresa`, `publico`, `periodista`) |
| `ley21719_ck_<rol>` | progreso checklist `{itemId: true}` |
| `ley21719_test_result` | resultado último test final (sessionStorage) |
