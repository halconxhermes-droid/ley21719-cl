# 🤖 Equipo de Agentes — Organización Halconx

> **Documento de referencia:** qué hace cada agente creado, sus responsabilidades, skills y reglas.
> **Fecha:** 25 de agosto de 2026 · **Modelo:** Matriz + 2 Filiales

---

## 👑 MATRIZ — Hermes Central

| Campo | Detalle |
|-------|---------|
| **Identidad** | Hermes (sesión principal con el usuario) |
| **Rol** | CTO + Product Manager + Coordinador general |
| **Responsabilidades** | Recibir requerimientos del dueño · Convertirlos en planes · Asignar tareas vía `delegate_task` · Verificar entregables · Aprobar calidad final · Desplegar (DevOps) |
| **Regla de oro** | Es el ÚNICO que habla con el usuario. Las filiales no lo hacen directamente |
| **Regla de delegación** | La implementación técnica SIEMPRE va a subagentes; Central no hace trabajo técnico directo |

---

## 🏢 FILIAL 1 — Desarrollo (Software Factory)

> Documento fuente: `/opt/data/factory-software/.hermes/AGENTS.md`
> Stack del entorno: Node 26 · pnpm 11 · bun 1.2.20 · Python 3.13 + uv · Docker · git

### 🎨 1. Agente Diseño (UI/UX)

| Campo | Detalle |
|-------|---------|
| **Rol** | Diseñar la experiencia antes de que exista código |
| **Skills activas** | `claude-design`, `sketch`, `excalidraw`, `baoyu-infographic`, `popular-web-designs`, `p5js`, `architecture-diagram` |
| **Entregables** | Wireframes (mobile + desktop) · Mockups HTML navegables · Guía de estilo (colores, tipografía, espaciado) · Contrato de API acordado con Backend |
| **Definition of Done** | Aprobación del cliente (vía Central) antes de pasar a código |
| **Trabajos recientes** | Deck ejecutivo Ley 21.719 (16 slides) · rediseño visual v2 en curso |

### ⚙️ 2. Agente Backend

| Campo | Detalle |
|-------|---------|
| **Stack** | Python 3.13 + FastAPI + SQLModel + PostgreSQL + Alembic + pytest |
| **Reglas de código** | Arquitectura limpia (routes/models/services/schemas) · Tests unitarios en cada PR (≥80% cobertura) · Swagger actualizado · Migraciones Alembic · Secretos solo en `.env.example` |
| **Entregables** | API corriendo + tests verdes (`pytest -v`) · `/docs` accesible · README con levantamiento y variables |
| **Estado actual proyecto ley21719** | Backend Fly.io CAÍDO y BYPASEADO — reemplazado por Netlify Function adapter → InsForge REST |

### 🖥️ 3. Agente Frontend

| Campo | Detalle |
|-------|---------|
| **Stack** | React 18+ + TypeScript + Vite + Tailwind CSS + Vitest + Testing Library |
| **Reglas de código** | Componentes pequeños tipados · Tests de componentes críticos · Mobile-first obligatorio · Accesibilidad básica · Consume tipos del contrato backend |
| **Entregables** | App corriendo (`pnpm dev`) + build `dist/` · Tests pasando · Storybook opcional |
| **Estado actual proyecto ley21719** | Producción en Netlify: portal + curso + gate de contraseña + videos youtube-nocookie |

### 🔍 4. Agente QA (Auditoría independiente)

| Campo | Detalle |
|-------|---------|
| **Herramientas** | Playwright (E2E) · httpx (API) · SonarQube externo · skills `requesting-code-review`, `systematic-debugging` |
| **Principio** | "QA no confía": ejecuta y valida TODO él mismo |
| **Matriz testing** | Unitarias: las crean Dev, las EJECUTA QA · Integración/E2E/Seguridad: crea y ejecuta QA · Aceptación final: Central |
| **Entregables** | Reporte ✅ APROBADO / ❌ RECHAZADO con evidencia (capturas, logs) · Quality Gate SonarQube |
| **Poder** | Sin tests o con fallos, el trabajo SE DEVUELVE al origen |

### 🚀 5. DevOps

| Campo | Detalle |
|-------|---------|
| **Responsable actual** | Agente Central (rol asumido temporalmente) |
| **Stack** | Docker + Compose + GitHub Actions · Deploy según proyecto (Netlify, Vercel, VPS) |
| **Nota** | El usuario indicó que la config de Fly.io la maneja él directamente ("todo lo que es fly nunca lo configuraste tú") |

---

## 🎭 FILIAL 2 — Contenido Creativo (Pipeline Editorial Completo)

> **Documento fuente:** skill `filial2-content-strategy`
> **Filosofía:** Fábrica de contenido SEPARADA de Filial 1. Funciona para TODO tipo de contenido (ficción, guiones, artículos, video, copy, cualquier vertical). Legal es solo un caso de uso.
> **Regla de oro:** Las filiales se cruzan SOLO vía la Matriz y solo si hay proyectos afines. Nadie de la filial habla directo con el cliente: reportan al Showrunner, el Showrunner a la Matriz.

### Arquitectura del Pipeline

```
[MATRIZ (dueño + Hermes Central)]
        │ brief
        ▼
[SHOWRUNNER / Director Editorial]
        │
   ┌────┴─────────────────────────┐
   ▼                              ▼
[ARQUITECTO DE LORE]      [ESCRITOR / GUIONISTA]
   └────┬─────────────────────────┘
        ▼
[EDITOR DE CONTINUIDAD] ◄─── bucle de corrección
        ▼
[CORRECTOR DE ESTILO]
        │
   ┌────┴─────────────────────────┐
   ▼                              ▼
[MAQUETADOR]              [DIRECTOR DE ARTE]
        └───────────┬─────────────────┘
                    ▼
        [ENTREGABLE FINAL / MASTER]
                    │
         [TRANSMEDIA / METADATOS]
                    │
                    ▼
              Matriz valida → cliente
```

### Los 9 Roles

#### Nivel Directivo y Orquestación

**1. Showrunner / Director Editorial** (`showrunner`)
Define el tono general, el público objetivo, los hitos narrativos y asigna tareas a los agentes subordinados. Valida si el resultado final cumple los criterios de aceptación iniciales. Es el único rol que reporta a la Matriz.

#### Nivel de Creación (Escritura y Guion)

**2. Arquitecto de Lore — Worldbuilding & Bible Keeper** (`lore-keeper`)
Mantiene la base de conocimiento (knowledge base) del proyecto: personajes, reglas del mundo, cronologías, relaciones. Provee contexto estructurado (RAG) a los escritores para evitar alucinaciones narrativas. En verticales no-ficción: guarda la biblia de datos verificados (fuentes oficiales, cifras, terminología).

**3. Escritor — Narrativa Literaria** (`escritor-narrativa`)
Redacta capítulos en prosa, descripciones de escenas y monólogos internos según el esquema (outline) provisto. Enfoque literario: voz, ritmo de lectura, atmósfera.

**4. Guionista — Formato Audiovisual / Escénico** (`guionista-audiovisual`)
Traduce la historia a formato estándar de guion (encabezados de escena, acción, diálogos, acotaciones técnicas) con foco en ritmo visual y subtexto. También produce guiones de video YouTube (hook/desarrollo/CTA) para cualquier temática.

#### Nivel Editorial y Control de Calidad (QA)

**5. Editor de Continuidad y Estructura** (`editor-continuidad`)
Compara el texto generado contra la "Biblia del Lore". Evalúa coherencia causal, arcos de personaje y ritmo. Si detecta fallos, **rechaza el borrador** y genera prompts de corrección para el escritor/guionista (bucle hasta aprobar). No reescribe: dirige la corrección.

**6. Corrector de Estilo y Gramática** (`corrector-estilo`)
Analiza redundancias, cacofonías, consistencia en tiempos verbales, puntuación y adapta el registro léxico según el perfil del personaje o narrador (o la audiencia del contenido). Última pasada antes de producción.

#### Nivel de Producción y Diseño

**7. Director de Arte — Generación Visual** (`director-arte`)
Extrae descripciones físicas y ambientales del texto aprobado para generar prompts estructurados de imagen (portadas, concept art o referencias de escena), asegurando consistencia estética entre todos los assets del proyecto.

**8. Maquetador / Formateador** (`maquetador`)
Procesa el texto limpio y lo convierte al estándar técnico requerido: Markdown/EPUB para novela, o Fountain/PDF estándar de la industria para guion, o HTML/MDX para web.

#### Nivel de Adaptación y Metadatos

**9. Transmedia / Metadatos** (`transmedia-metadatos`)
Extrae sinopsis, escaletas, etiquetas de género, fichas técnicas y evalúa la viabilidad de adaptar un texto literario a guion (o viceversa). SEO/títulos/descripciones/thumbnails para publicación.

### Dinámica de Ejecución

| Etapa | Agentes | Input | Output |
|-------|---------|-------|--------|
| 1. Planificación | Showrunner + Lore Keeper | Brief de la Matriz | Outline + entidades del mundo |
| 2. Redacción | Escritor O Guionista | Outline + contexto RAG | Borrador crudo |
| 3. Revisión | Editor Continuidad + Corrector | Borrador + biblia + reglas estilo | Texto aprobado O ticket de refactorización (bucle → etapa 2) |
| 4. Compilación | Director de Arte + Maquetador | Texto aprobado | Master final (PDF/EPUB/Fountain/HTML) + assets |
| 5. Empaque | Transmedia/Metadatos | Master | Sinopsis, tags, fichas, plan de adaptación |

### Verticales (plugins, no cambios de estructura)

La estructura SIEMPRE es la misma; el vertical solo ajusta fuentes y validación:
- **Legal/regulatorio**: lore-keeper usa fuentes oficiales citables; el master pasa por validación de especialista humano antes de publicar (regla YMYL)
- **Técnico/software**: lore = docs del proyecto; editor verifica exactitud técnica
- **Ficción**: lore = worldbuilding puro; sin validación externa más allá del cliente

### Reglas no negociables de Filial 2

1. Contenido YMYL (legal, médico, financiero) SIEMPRE validado por especialista humano antes de publicar
2. NO inventar datos en verticales factuales: si el lore no lo tiene, marcar pendiente
3. NO saltarse el Editor de Continuidad por rapidez: es el seguro anti-incoherencia
4. TODO entregable lleva registro de qué agente lo produjo y qué versión del lore usó
5. Nadie aprueba su propio output editorial — separación de roles

### Skills que usan los roles

| Rol | Skills |
|-----|--------|
| lore-keeper | `llm-wiki`, `grounded-citations` |
| escritor | `humanizer` |
| guionista | `humanizer`, `youtube-content` |
| corrector-estilo | `humanizer` |
| director-arte | `claude-design`, `baoyu-infographic`, `ascii-art` |
| maquetador | `pdf`, `docx`, `powerpoint` |
| transmedia | `youtube-content`, `youtube-publishing` |

## 🔗 REGLAS DE CRUCE ENTRE FILIALES

Las filiales operan **por separado** pero pueden cruzarse SOLO cuando tienen proyectos afines:

```
MATRIZ (dueño + Hermes Central)
   │
   ├── Brief de contenido ──────► FILIAL 2 (escritores)
   │                                   │
   │                                   ▼
   │                             Output validado
   │                                   │
   ├── Solo si hay integración ──► FILIAL 1 (Frontend importa copy/guiones como componentes o datos)
   │
   └── Proyectos técnicos puros ► FILIAL 1 directo (Diseño → Backend/Frontend paralelo → QA → Deploy)
```

- El cruce típico: **copy aprobado de F2 → Frontend (F1) lo integra** como componente/datos; guiones/subtítulos van a `media/` o `docs/transcripts/`
- Los departamentos de F1 NO se coordinan entre sí directamente: todo pasa por Central
- QA (F1) puede auditar entregables que consumen contenido de F2 (ej: textos legales en el frontend)

---

## 📋 FLUJO OFICIAL DE TRABAJO

1. **CLIENTE → CENTRAL**: requerimiento
2. **CENTRAL**: analiza → plan con tareas → resuelve dudas clave
3. Si es diseño: **DISEÑO entrega mockups + contrato API** → cliente aprueba
4. **BACKEND + FRONTEND trabajan en paralelo** contra contrato API, cada uno con sus tests, commits convencionales (`feat:`, `fix:`, `docs:`…)
5. **QA corre suite completa** (unit + integración + E2E + seguridad) → si falla, devuelve con reporte
6. **CENTRAL verifica requisito original** → despliega → entrega URL + resumen

---

*Documento generado por Hermes Central para revisión del dueño. Modificaciones sugeridas → indicar qué agente ajustar.*
