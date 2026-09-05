# AGENTS.md — Ley 21.719: Fábrica de Historias Interactivas por Industria

> Archivo canónico para subagentes que producen contenido narrativo-legal para el proyecto `ley21719-cl`. Define roles, contratos de fase, biblia legal y reglas innegociables.

---

## 1. Proyecto y propósito

**Proyecto:** `ley21719-cl`
**Producto:** Historias interactivas (7 capítulos) por industria que enseñan la Ley 21.719 de protección de datos personales en Chile, con personajes, decisiones legales ramificadas, simuladores ARCO y quizzes.

**Estructura de salida (idéntica para cada industria):**
```
historias_interactivas/industria_<nombre>/
├── fase_1_investigacion/
│   └── informe_legal.md
├── fase_2_guion/
│   └── guion_historia.md
├── fase_3_prompts/
│   └── prompts.md
├── fase_4_interactivos/
│   ├── simulador_arco.json
│   ├── arbol_decision.json
│   └── quiz_<industria>.json
├── fase_5_revision_legal/
│   └── revision_legal.md
└── fase_6_integracion/
    └── historia_completa.md
```

---

## 2. Roles y responsabilidades (Filial 3 + Filial 2 combinadas)

| # | Rol | Skill cargada | Entregable |
|---|-----|--------------|------------|
| 1 | **Legal Showrunner** (orquesta) | `filial3-content-strategy` | brief + outline validado |
| 2 | **Legal Lore Keeper** (biblia Ley 21.719) | `filial3-content-strategy` + `grounded-citations` | `fase_1_investigacion/informe_legal.md` |
| 3 | **Guionista Legal-Narrativo** | `filial3-content-strategy` + `filial2-content-strategy` + `humanizer` | `fase_2_guion/guion_historia.md` |
| 4 | **Director de Arte Multimedia** | `filial2-content-strategy` + `claude-design` | `fase_3_prompts/prompts.md` |
| 5 | **Maquetador Interactivo** | `multi-agent-software-factory` | `fase_4_interactivos/*.json` (3 archivos) |
| 6 | **Editor de Continuidad Jurídica** | `filial3-content-strategy` | `fase_5_revision_legal/revision_legal.md` |
| 7 | **Integrador / Lore Consolidator** | `filial2-content-strategy` + `filial3-content-strategy` | `fase_6_integracion/historia_completa.md` |

Cada rol corre como **subagente independiente** vía `delegate_task`. Ningún subagente habla con otro: todo pasa por el orquestador central (yo).

---

## 3. Stack y decisiones locked

- **Formato:** Markdown (.md) para texto narrativo/legal; JSON (.json) para simuladores/quiz.
- **Idioma:** TODO el contenido en **español latino** — incluyendo textos en pantalla y nombres de campo en JSON. NO usar español peninsular.
- **Norma citada:** Ley 21.719 (publicada 13-12-2024, vigencia plena 01-12-2026). Reemplaza Ley 19.628.
- **Fuente oficial primaria:** Biblioteca del Congreso Nacional (BCN), LeyChile idNorma=1209272.
- **Fuentes secundarias verificadas:** Diario Oficial, Agencia de Protección de Datos Personales (APDP), ministerios sectoriales (MINSAL, MINEDUC, CMF, SERNATUR, MTT, SEA).
- **Multas base:** UTM chileno — Art. 35 (leve 5.000, grave 10.000, gravísima 20.000 UTM). Aplicar atenuantes Art. 49.
- **Datos sensibles:** Art. 16 y 16 bis (salud, perfil biológico, biométricos).
- **Brechas:** Art. 14 quinquies (medidas) + Art. 14 sexies (notificación 72h).
- **EIPD:** Art. 15 ter.
- **DPO:** Art. 50 (obligatorio para monitoreo masivo, datos sensibles masivos, perfiles automatizados).

---

## 4. Reglas innegociables (NON-NEGOTIABLE)

1. **Cero inventos legales.** Cada cita a un artículo debe coincidir con el texto vigente. Si el lore-keeper no tiene la fuente, marcar `> PENDIENTE: validar con fuente oficial` y dejar la nota, no rellenar.
2. **Texto en pantalla = español latino neutro.** Subtítulos y voces también en español latino (NO peninsular).
3. **JSON sin acentos críticos en nombres de campo** (`id`, `pregunta`, `opciones`, `siguiente`, etc.). Los textos de pregunta/opción pueden llevar acentos porque van en UTF-8 válido, pero los **identificadores** deben ser ASCII.
4. **Cada industria debe tener protagonista realista** con nombre, cargo, organización y número de afectados/registros.
5. **Decisiones interactivas con consecuencias legales reales** referenciando los artículos correctos.
6. **Multas calculadas con UTM, no CLP** (CLP solo como referencia al lado: ~$67.000/UTM a la fecha).
7. **Git backup obligatorio** al cerrar cada industria: `git add`, `git commit -m "feat(industria_X): completar 6 fases"`, `git push origin main`.

---

## 5. Testing matrix (DoD por fase)

| Fase | DoD |
|------|-----|
| 1 | Cite verificada a Art. de Ley 21.719. Datos sectoriales con fuente. Sanciones Art. 35/49 aplicadas. |
| 2 | 7 capítulos narrativos. Decisión interactiva con consecuencia legal. Persona + organización realista. |
| 3 | 4 prompts de imagen + 2 prompts de video. Texto en español latino explícito en cada prompt. |
| 4 | 3 JSON válidos: simulador ARCO (5+ pasos), árbol decisión (3+ bifurcaciones), quiz (7 preguntas con cita). |
| 5 | Checklist de cumplimiento + cálculo UTM + atenuantes + acciones correctivas. |
| 6 | Historia completa que integra las 5 fases anteriores con narrativa fluida. |

---

## 6. Convenciones de naming

- **Carpetas:** `industria_<snake_case>` (ej. `industria_energia`, `industria_salud`).
- **Archivos:** `<fase>/<tipo>_<industria>.md|json` (ej. `quiz_energia.json`, `historia_completa_energia.md`).
- **Capítulos:** "Capítulo N: <título>" numerados del 1 al 7.
- **Decisiones:** formato `> **A)** ... \n > **B)** ... \n > **C)** ...` con consecuencia legal al final.

---

## 7. External integrations

- **fal.ai MCP** (ya activo): para regenerar videos con el modelo `minimax/h3-max-turbo/text-to-video`. Duración máx 15s. **Obligatorio**: prompts con texto en español y audio/voz en español latino.
- **NotebookLM** (validación legal externa): revisar antes de mergear a main.

---

## 8. Estado actual del proyecto (snapshot 2026-09-05)

| # | Industria | Estado real |
|---|-----------|-------------|
| 1 | Salud | 6/6 ✅ |
| 2 | Educación | 6/6 ✅ |
| 3 | Finanzas | 6/6 ✅ |
| 4 | Retail | 2/6 (falta 2-5) |
| 5 | Manufactura | 4/6 (falta 5-6) |
| 6 | Energía | **0/6 — primera a construir** |
| 7 | Tecnología | 1/6 (solo historia_completa) |
| 8 | Turismo | 1/6 |
| 9 | Agricultura | 1/6 |
| 10 | Transporte | 1/6 |

**Industria priorizada ahora:** Energía.

---

## 9. Comandos útiles

```bash
# Estado kanban
hermes kanban list

# Validar JSON
python3 -m json.tool historias_interactivas/industria_energia/fase_4_interactivos/simulador_arco_energia.json

# Git workflow
cd /opt/data/ley21719-cl
git add historias_interactivas/industria_<x>/
git commit -m "feat(industria_<x>): completar 6 fases"
git push origin main
```

---

*Mantenedor: Hermes Agent (Matriz central) — versión 2.0 — multiagente Filial 2 + Filial 3.*
