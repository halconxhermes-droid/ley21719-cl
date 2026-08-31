# Plan de Mejora Integral: ley21719-cl → Calidad SENCE

**Proyecto:** Plataforma Educativa Ley 21.719 - Protección de Datos Personales
**Fecha:** 31 de agosto de 2026
**Estado actual:** v1.0 - Fases 1, 2, 3 (73%) + Fase 4 (código) completadas
**Meta:** v2.0 - Curso certificado SENCE, código oficial asignado

---

## 📊 DIAGNÓSTICO DEL ESTADO ACTUAL (Actualizado)

### Contenido Existente

| Componente | Cantidad | Estado |
|------------|----------|--------|
| Módulos temáticos | 7 | ✅ 100% |
| Horas contenido | 80h | ✅ 100% |
| Preguntas quizzes | ~196 en manuales | ✅ 100% |
| Examen final | 50 + 5 casos | ✅ 100% |
| Componentes React | 3 nuevos | ✅ 100% |
| Endpoints backend | 5 nuevos | ✅ 100% |

### Componentes Implementados (Fase 3 + 4)

**Frontend (React 19 + TypeScript):**
1. `frontend/src/lib/sence.ts` (10KB) - Lógica de evaluación
2. `frontend/src/components/QuizRunner.tsx` (10KB) - Componente de quiz
3. `frontend/src/components/DashboardProgreso.tsx` (10KB) - Dashboard
4. `frontend/src/components/CertificadoSENCE.tsx` (8KB) - Certificado
5. `frontend/src/views/VerificarCertificadoMejorado.tsx` (8KB) - Verificación

**Backend (FastAPI + Python):**
1. `backend/app/routers/certificates.py` (4KB) - Endpoints de certificados

---

## 🎯 OBJETIVO FINAL

Transformar `ley21719-cl` de una plataforma educativa a un **curso SENCE certificado** con código oficial.

---

## 📋 ROADMAP DE IMPLEMENTACIÓN

### 🟢 FASE 1: Documentación Base (Semana 1-2) — 24h ✅ COMPLETADA

**Tareas:** Perfil de Ingreso, Perfil de Egreso, Objetivos medibles, Plan de Estudios, Recursos

**Entregables:** 5 documentos formales creados en `docs/sence/`

---

### 🟢 FASE 2: Expansión de Contenido (Semana 3-5) — 130h ✅ COMPLETADA

**Tareas:** 7 módulos completos (M1-M7) con contenido detallado

**Entregables:** 7 manuales expandidos en `docs/contenido/`

---

### 🟢 FASE 3: Sistema de Evaluación (Semana 6-7) — 70h ✅ COMPLETADA (73%)

**Tareas:** Banco de preguntas, Examen final, Sistema de calificación, Retroalimentación

**Entregables:**
- `docs/sence/EXAMEN_FINAL.md` (23KB) - 50 preguntas + 5 casos
- `docs/sence/SISTEMA_CALIFICACION.md` (11KB) - Sistema completo
- `frontend/src/lib/sence.ts` - Lógica de evaluación
- `frontend/src/components/QuizRunner.tsx` - UI de quiz
- `frontend/src/components/DashboardProgreso.tsx` - Dashboard

---

### 🟢 FASE 4: Certificación (Semana 8) — 35-65h ✅ COMPLETADA (código)

**Tareas:** Plantilla de certificado, Sistema de generación, Verificación pública

**Entregables:**
- `frontend/src/components/CertificadoSENCE.tsx` (8KB) - UI del certificado
- `frontend/src/views/VerificarCertificadoMejorado.tsx` (8KB) - Verificador público
- `backend/app/routers/certificates.py` (4KB) - 5 endpoints
  - GET /verify - Verificar certificado (público)
  - POST /issue - Emitir certificado
  - GET /{codigo} - Detalles
  - POST /revoke/{codigo} - Revocar
  - GET /stats/summary - Estadísticas

---

### 🟡 FASE 5: Cumplimiento Técnico (Semana 9-10) — 72h ⏳ PENDIENTE

**Tareas:**
- [ ] Auditoría WCAG 2.1 AA completa
- [ ] Subtítulos y transcripciones en videos
- [ ] Política de privacidad y términos
- [ ] HTTPS obligatorio y certificados
- [ ] Encriptación y backups
- [ ] Plan de recuperación ante desastres

---

### 🟡 FASE 6: Instructor y Operación (Semana 11-12) — 70h ⏳ PENDIENTE

**Tareas:**
- [ ] Identificar y contratar instructor certificado SENCE
- [ ] Certificación de Facilitador SENCE (40h)
- [ ] Documentar CV en formato SENCE
- [ ] Procesos de inscripción y soporte
- [ ] Sistema de seguimiento de egresados

---

### 🟡 FASE 7: Postulación SENCE (Semana 13-14) — 40h ⏳ PENDIENTE

**Tareas:**
- [ ] Completar Formulario F-01
- [ ] Carta de presentación
- [ ] Acreditación como OTEC
- [ ] Carga en plataforma SENCE
- [ ] Seguimiento del estado
- [ ] **Recibir código SENCE oficial**

---

## 📊 RESUMEN DE ESFUERZO

| Fase | Horas | Semanas | Estado |
|------|-------|---------|--------|
| 1. Documentación Base | 24h | 1-2 | ✅ 100% |
| 2. Expansión Contenido | 130h | 3-5 | ✅ 100% |
| 3. Sistema Evaluación | 70h | 6-7 | ✅ 73% |
| 4. Certificación | 50h | 8 | ✅ 100% (código) |
| 5. Cumplimiento Técnico | 72h | 9-10 | ⏳ 0% |
| 6. Operación | 70h | 11-12 | ⏳ 0% |
| 7. Postulación SENCE | 40h | 13-14 | ⏳ 0% |
| **TOTAL** | **456h** | **14 sem** | **57%** |

---

## 💰 PRESUPUESTO ESTIMADO

| Concepto | Costo |
|----------|-------|
| Desarrollo de contenido | $6,600,000 |
| Producción de videos | $3,000,000 |
| Diseño y UX | $1,500,000 |
| Auditoría WCAG | $500,000 |
| Instructor certificado | $800,000 |
| LMS Moodle | $300,000 |
| Habilitación OTEC | $1,200,000 |
| Postulación SENCE | $200,000 |
| Contingencia (10%) | $1,410,000 |
| **TOTAL** | **~$15,510,000 CLP** |

---

## 🎯 HITOS PRINCIPALES (Actualizado)

| # | Hito | Fecha | Estado |
|---|------|-------|--------|
| M1 | Documentación SENCE completa | Semana 2 | ✅ |
| M2 | 80h de contenido disponibles | Semana 5 | ✅ |
| M3 | Sistema evaluación operativo | Semana 7 | ✅ 73% |
| M4 | Certificados generándose | Semana 8 | ✅ Código |
| M5 | Plataforma técnicamente apta | Semana 10 | ⏳ |
| M6 | Operación funcionando | Semana 12 | ⏳ |
| M7 | **Código SENCE obtenido** | **Semana 14** | ⏳ |

---

## 📂 ESTRUCTURA DEL PROYECTO

```
ley21719-cl/
├── frontend/
│   └── src/
│       ├── lib/
│       │   ├── sence.ts                    [NUEVO] Lógica de evaluación
│       │   └── insforgeAuth.ts             Auth con InsForge
│       ├── components/
│       │   ├── QuizRunner.tsx              [NUEVO] Componente de quiz
│       │   ├── DashboardProgreso.tsx       [NUEVO] Dashboard estudiante
│       │   ├── CertificadoSENCE.tsx         [NUEVO] Certificado
│       │   ├── InsForgeAuth.tsx             Auth UI
│       │   └── ... (otros existentes)
│       └── views/
│           ├── VerificarCertificadoMejorado.tsx [NUEVO]
│           └── ... (otros existentes)
├── backend/
│   └── app/
│       └── routers/
│           ├── certificates.py             [NUEVO] Endpoints certificados
│           └── ... (otros existentes)
├── docs/
│   ├── contenido/
│   │   ├── M1_EMPRESAS_EXPANDIDO.md       [Fase 2]
│   │   ├── M2_CIUDADANOS.md                [Fase 2]
│   │   ├── M3_TECNICO_EXPANDIDO.md         [Fase 2]
│   │   ├── M4_INSTITUCIONES.md             [Fase 2]
│   │   ├── M5_SANCIONES.md                 [Fase 2]
│   │   ├── M6_CASOS_REALES.md              [Fase 2]
│   │   └── M7_PROYECTO_FINAL.md            [Fase 2]
│   └── sence/
│       ├── PLAN_MEJORA_SENCE.md            [Fase 1]
│       ├── PERFILES_INGRESO_EGRESO.md      [Fase 1]
│       ├── OBJETIVOS.md                    [Fase 1]
│       ├── PLAN_ESTUDIOS.md                [Fase 1]
│       ├── RECURSOS_MATERIALES.md           [Fase 1]
│       ├── RESUMEN_EJECUTIVO.md            [Fase 1]
│       ├── EXAMEN_FINAL.md                 [Fase 3]
│       ├── SISTEMA_CALIFICACION.md         [Fase 3]
│       └── CHECKLIST_TAREAS.md             [Tracking]
```

---

## 🎉 LOGROS ALCANZADOS

### Fases 1-2 (Documentación + Contenido)
- ✅ 5 documentos formales SENCE
- ✅ 7 módulos completos (80h de contenido)
- ✅ ~196 preguntas de quiz
- ✅ 22 casos prácticos
- ✅ 10 casos reales documentados

### Fases 3-4 (Evaluación + Certificación)
- ✅ Examen final completo (50+5)
- ✅ Sistema de calificación integral
- ✅ 3 componentes React nuevos
- ✅ 1 vista de verificación mejorada
- ✅ 5 endpoints de backend para certificados
- ✅ Lógica completa de evaluación

---

## 🚀 PRÓXIMOS PASOS

### Fases 5-6-7 (Pendientes)
- Fase 5: Cumplimiento técnico (WCAG, seguridad)
- Fase 6: Instructor certificado y operación
- Fase 7: Postulación a SENCE

---

*Plan actualizado al 31 de agosto de 2026*
*Fases 1-4 completadas (57% del total)*
*Stack: React 19 + TypeScript + FastAPI + Python + InsForge*
