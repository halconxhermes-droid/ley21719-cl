# Plan de Mejora Integral: ley21719-cl → Calidad SENCE

**Proyecto:** Plataforma Educativa Ley 21.719 - Protección de Datos Personales
**Fecha:** 31 de agosto de 2026
**Documento base:** INFORME_SENCE_COMPLETO_2026 (https://github.com/halconxhermes-droid/ley21719-cl-docs)
**Estado actual:** v0.8 - Curso funcional pero NO certificado SENCE
**Meta:** v2.0 - Curso certificado SENCE, código oficial asignado

---

## 📊 DIAGNÓSTICO DEL ESTADO ACTUAL

### Contenido Existente (inventario)

| Componente | Cantidad Actual | Cumple SENCE | Brecha |
|------------|------------------|--------------|--------|
| **Módulos temáticos** | 4 | ✅ Tiene | Mejorar profundidad y horas |
| **Tiempo de lectura** | 26 min (0.4h) | ❌ Muy poco | +75h para llegar a 80h |
| **Preguntas quizzes** | 73 | ✅ Tiene | Rediseñar a 3 niveles |
| **Items checklist** | 39 | ✅ Tiene | Expandir a 60+ items |
| **Términos glosario** | 23 | ⚠️ Escaso | Expandir a 50+ términos |
| **Videos asociados** | ~10+ (tools/youtube) | ⚠️ Parcial | Crear videos por módulo |
| **Perfil ingreso/egreso** | ❌ No existe | ❌ Faltante | Crear |
| **Objetivos medibles** | ❌ No existe | ❌ Faltante | Crear |
| **Material descargable** | ❌ No existe | ❌ Faltante | Generar PDFs |
| **Certificado final** | ❌ No existe | ❌ Faltante | Implementar |
| **Evaluación final** | ❌ Solo quizzes | ⚠️ Parcial | Crear examen final |
| **Instructor certificado** | ❌ No identificado | ❌ Faltante | Buscar/contratar |
| **Accesibilidad WCAG** | ⚠️ Sin auditar | ❌ Faltante | Auditar y corregir |

### Brecha Total: 12 elementos críticos faltantes

---

## 🎯 OBJETIVO FINAL

Transformar `ley21719-cl` de una plataforma educativa a un **curso SENCE certificado** con código oficial, mediante:

1. Expansión de contenido a 80-120 horas
2. Estructura pedagógica formal (perfiles, objetivos, evaluación)
3. Material descargable y accesible
4. Sistema de certificación verificable
5. Cumplimiento de todos los requisitos técnicos y legales

---

## 📋 ROADMAP DE IMPLEMENTACIÓN

### 🟢 FASE 1: Documentación Base (Semana 1-2)
**Objetivo:** Establecer los cimientos formales del curso

**Tareas:**

#### 1.1 Perfil de Ingreso y Egreso
- [ ] Redactar **Perfil de Ingreso** formal (nivel educacional, conocimientos previos, edad, contexto laboral)
- [ ] Redactar **Perfil de Egreso** con 5-7 competencias específicas
- [ ] Definir **3-5 Objetivos de aprendizaje medibles** (usar taxonomía de Bloom: aplicar, analizar, implementar)
- [ ] Crear documento `docs/sence/perfiles.md`

**Responsable:** Content Lead
**Tiempo estimado:** 8 horas
**Entregable:** Documento con perfiles validados

#### 1.2 Objetivos Específicos
- [ ] Transformar cada módulo en objetivos medibles con verbos de acción
- [ ] Mapear objetivos → evaluaciones (alineación constructiva)
- [ ] Documentar en `docs/sence/objetivos.md`

**Tiempo:** 6 horas

#### 1.3 Plan de Estudios Formal
- [ ] Crear `docs/sence/plan-estudios.md` con:
  - Distribución horaria por módulo
  - Modalidad (presencial/online/mixta)
  - Secuencia pedagógica
  - Correlatividades
- [ ] Cronograma de actividades
- [ ] Recursos necesarios por módulo

**Tiempo:** 10 horas

**✅ Hito Fase 1:** 3 documentos formales creados, validados con el SENCE checklist

---

### 🟡 FASE 2: Expansión de Contenido (Semana 3-5)
**Objetivo:** Llevar el curso de 0.4h a 80-120h de contenido real

**Tareas:**

#### 2.1 Reestructuración de Módulos (16h → 80h)

| Módulo | Horas Actuales | Horas Meta | Horas a Agregar |
|--------|----------------|------------|-----------------|
| **Módulo 1: Empresas** | 8 min | 25h | +24.7h |
| **Módulo 2: Ciudadanos** | 5 min | 15h | +14.9h |
| **Módulo 3: Desarrolladores** | 7 min | 25h | +24.8h |
| **Módulo 4: Instituciones** | 6 min | 15h | +14.9h |
| **TOTAL** | 26 min | 80h | +79.3h |

**Para cada módulo, agregar:**

- [ ] **2-3 unidades didácticas nuevas** por módulo (contenido profundo)
- [ ] **Lecturas complementarias** (PDFs descargables, 5-8 páginas cada uno)
- [ ] **Casos prácticos extensos** (3-4 por módulo, ~500 palabras cada uno)
- [ ] **Material audiovisual** (videos explicativos de 8-12 min por unidad)
- [ ] **Actividades prácticas** con entregables
- [ ] **Foros de discusión** moderados

#### 2.2 Contenido Técnico Avanzado (NUEVO)
- [ ] **Módulo 5: Cumplimiento Normativo y Sanciones** (10h)
  - Régimen sancionatorio (Art. 35-37)
  - Procedimientos ante la Agencia
  - Defensa del responsable
- [ ] **Módulo 6: Casos Reales y Jurisprudencia** (10h)
  - Casos emblemáticos internacionales (GDPR)
  - Análisis de decisiones de la Agencia
  - Simulaciones de incidentes
- [ ] **Módulo 7: Proyecto Final Integrador** (10h)
  - Desarrollo de un plan de cumplimiento
  - Presentación y defensa

**Tiempo:** 80 horas de desarrollo de contenido

#### 2.3 Biblioteca de Recursos
- [ ] **20 PDFs descargables** (5-8 páginas cada uno)
- [ ] **15 videos** (8-12 min cada uno)
- [ ] **10 plantillas** (formularios, checklists, contratos)
- [ ] **5 infografías** (visualización de procesos)

**✅ Hito Fase 2:** 80h de contenido disponibles, con materiales descargables

---

### 🟠 FASE 3: Sistema de Evaluación Integral (Semana 6-7)
**Objetivo:** Sistema de evaluación riguroso con 3 niveles

**Tareas:**

#### 3.1 Niveles de Evaluación

| Nivel | Tipo | Ponderación | Características |
|-------|------|-------------|-----------------|
| **Diagnóstica** | Inicial | 0% | No pondera, identifica nivel |
| **Formativa** | Durante curso | 40% | Quizzes por unidad, tareas, foros |
| **Sumativa** | Final | 60% | Examen + proyecto final |

#### 3.2 Rediseño de Quizzes
- [ ] Expandir de 73 a **100+ preguntas** con distribución:
  - 30% conocimiento (recordar)
  - 40% comprensión (analizar, aplicar)
  - 30% aplicación práctica (casos)
- [ ] Cada pregunta con:
  - 4 opciones bien redactadas
  - Explicación detallada al fallar
  - Referencia al artículo legal
  - Dificultad graduada

**Tiempo:** 30 horas

#### 3.3 Examen Final Integrador
- [ ] **50 preguntas** de opción múltiple
- [ ] **5 casos prácticos** extensos con análisis
- [ ] **1 proyecto final**: Plan de cumplimiento para una empresa ficticia
- [ ] **Tiempo límite:** 3 horas
- [ ] **Calificación automática** + revisión manual del proyecto
- [ ] **Aprobación:** 70% mínimo

**Tiempo:** 25 horas

#### 3.4 Sistema de Calificación Detallado
- [ ] Nota por módulo (visualización inmediata)
- [ ] Nota final ponderada
- [ ] Retroalimentación detallada
- [ ] Certificado con QR verificable

**Tiempo:** 15 horas

**✅ Hito Fase 3:** Sistema de evaluación completo, 70+ preguntas, examen final

---

### 🔴 FASE 4: Certificación Oficial (Semana 8)
**Objetivo:** Sistema de emisión de certificados con verificación

**Tareas:**

#### 4.1 Generación de Certificados
- [ ] **Plantilla PDF** profesional con:
  - Logo del organismo
  - Datos del participante
  - Código único verificable (UUID)
  - Código SENCE (cuando se asigne)
  - QR de verificación
  - Firmas digitales del instructor y SENCE
- [ ] **Generación automática** al aprobar
- [ ] **Envío por email** + descarga desde la plataforma

**Tiempo:** 20 horas

#### 4.2 Sistema de Verificación Pública
- [ ] **Página web pública** `/verificar?cod=XXX`
- [ ] **API de verificación** con rate limiting
- [ ] **QR** que apunta a la URL de verificación
- [ ] **Rechazo de certificados falsificados**

**Tiempo:** 15 horas

#### 4.3 Blockchain (opcional, alto impacto)
- [ ] Registrar hashes de certificados en blockchain pública
- [ ] Verificación independiente sin necesidad de la plataforma

**Tiempo:** 30 horas (opcional)

**✅ Hito Fase 4:** Certificados verificables, sistema antifraude

---

### 🟣 FASE 5: Cumplimiento Técnico y Legal (Semana 9-10)
**Objetivo:** Plataforma técnicamente apta para SENCE

**Tareas:**

#### 5.1 Accesibilidad WCAG 2.1 AA
- [ ] **Auditoría completa** con axe-core / pa11y
- [ ] **Subtítulos** en todos los videos
- [ ] **Transcripciones** textuales
- [ ] **Lectores de pantalla** compatibles
- [ ] **Contraste de colores** verificado
- [ ] **Navegación por teclado** completa
- [ ] **Textos alternativos** en imágenes

**Tiempo:** 25 horas

#### 5.2 Política de Privacidad y Términos
- [ ] **Política de privacidad** completa (cumple Ley 19.628 + Ley 21.719)
- [ ] **Términos y condiciones** de uso
- [ ] **Consentimiento explícito** al registrarse
- [ ] **Cookies banner** (GDPR-compliant)
- [ ] **Proceso de eliminación de datos** del usuario

**Tiempo:** 12 horas

#### 5.3 Seguridad y Datos
- [ ] **HTTPS obligatorio** en toda la plataforma
- [ ] **Encriptación** de datos en tránsito y reposo
- [ ] **Backups diarios** automatizados
- [ ] **Logs de auditoría** completos
- [ ] **Plan de recuperación** ante desastres

**Tiempo:** 15 horas

#### 5.4 Performance y UX
- [ ] **Tiempo de carga < 3 segundos**
- [ ] **Mobile responsive** verificado
- [ ] **Offline mode** (PWA) para videos descargados
- [ ] **Acceso desde múltiples dispositivos**

**Tiempo:** 20 horas

**✅ Hito Fase 5:** Plataforma 100% técnicamente apta

---

### 🟤 FASE 6: Instructor y Operación (Semana 11-12)
**Objetivo:** Equipo docente certificado y procesos de operación

**Tareas:**

#### 6.1 Instructor Certificado SENCE
- [ ] **Identificar instructor(es)** con:
  - Formación en derecho/tecnología (5+ años exp.)
  - Certificación de Facilitador SENCE (40h)
  - Conocimiento específico de Ley 21.719
- [ ] **Documentar CV** en formato SENCE
- [ ] **Certificados** de experiencia y formación

**Tiempo:** Variable (reclutamiento)

#### 6.2 Procesos de Operación
- [ ] **Inscripción y matrícula** automatizada
- [ ] **Recepción de pagos** (gratuito para becas)
- [ ] **Soporte al estudiante** (email + chat)
- [ ] **Reportes SENCE** automatizados
- [ ] **Diploma y seguimiento** post-curso

**Tiempo:** 30 horas

#### 6.3 Plan de Seguimiento
- [ ] **Encuesta de satisfacción** al finalizar
- [ ] **Encuesta a 3 meses** post-curso
- [ ] **Encuesta a 6 meses** post-curso
- [ ] **Encuesta a 12 meses** post-curso
- [ ] **Tracking de empleabilidad** (cambios de trabajo, ascensos)

**Tiempo:** 20 horas

**✅ Hito Fase 6:** Operación lista para impartir el curso

---

### ⚫ FASE 7: Postulación a SENCE (Semana 13-14)
**Objetivo:** Obtener código SENCE oficial

**Tareas:**

#### 7.1 Preparación de Documentación
- [ ] **Formulario F-01** completo
- [ ] **Carta de presentación**
- [ ] **CV del instructor** en formato SENCE
- [ ] **Material didáctico** completo
- [ ] **Carta Gantt** del curso
- [ ] **Presupuesto** detallado
- [ ] **Acreditación** como OTEC o alianza con uno

**Tiempo:** 25 horas

#### 7.2 Postulación
- [ ] **Registro en SENCE** (si no se está)
- [ ] **Carga en plataforma** SENCE
- [ ] **Seguimiento** del estado
- [ ] **Corrección de observaciones** (si las hay)

**Tiempo:** 15 horas

**✅ Hito Fase 7:** Código SENCE oficial asignado

---

## 📊 RESUMEN DE ESFUERZO

| Fase | Horas | Semanas | Prioridad |
|------|-------|---------|-----------|
| **1. Documentación Base** | 24h | 1-2 | 🔴 Crítica |
| **2. Expansión Contenido** | 130h | 3-5 | 🔴 Crítica |
| **3. Evaluación Integral** | 70h | 6-7 | 🔴 Crítica |
| **4. Certificación** | 35-65h | 8 | 🟠 Alta |
| **5. Cumplimiento Técnico** | 72h | 9-10 | 🟠 Alta |
| **6. Instructor y Operación** | 70h | 11-12 | 🟡 Media |
| **7. Postulación SENCE** | 40h | 13-14 | 🔴 Crítica |
| **TOTAL** | **441-471h** | **14 semanas** | - |

**Equivalente:** ~3-4 personas tiempo completo × 3.5 meses

---

## 🎯 HITOS PRINCIPALES (Milestones)

| # | Hito | Fecha Target | Criterio de Éxito |
|---|------|--------------|-------------------|
| M1 | Documentación SENCE completa | Semana 2 | Perfiles + Objetivos validados |
| M2 | 80h de contenido disponible | Semana 5 | Plataforma con cursos navegables |
| M3 | Sistema evaluación operativo | Semana 7 | Examen final con calificación |
| M4 | Certificados generándose | Semana 8 | Emitir 1 certificado de prueba |
| M5 | Plataforma técnicamente apta | Semana 10 | Auditoría WCAG pasa |
| M6 | Operación funcionando | Semana 12 | 1 cohorte de prueba completa |
| M7 | **Código SENCE obtenido** | **Semana 14** | **Curso oficialmente certificado** |

---

## 💰 PRESUPUESTO ESTIMADO

| Concepto | Costo |
|----------|-------|
| **Desarrollo de contenido** (440h × $15.000/h) | $6.600.000 |
| **Producción de videos** (15 × $200.000) | $3.000.000 |
| **Diseño y UX** | $1.500.000 |
| **Auditoría WCAG** | $500.000 |
| **Instructor certificado SENCE** (certificación 40h) | $800.000 |
| **Plataforma LMS** (Moodle hosting 1 año) | $300.000 |
| **Habilitación OTEC** (si se requiere) | $1.200.000 |
| **Postulación SENCE** | $200.000 |
| **Otros (contingencia 10%)** | $1.410.000 |
| **TOTAL** | **~$15.510.000 CLP** |

**Financiamiento SENCE disponible:**
- Franquicia tributaria: hasta 90% (empresas)
- Becas laborales (código 212): 100% (personas vulnerables)
- Cursos en línea (código 252): 100% (5 áreas focus)

**Costo neto para el estudiante: $0** (con becas o franquicia)

---

## 🎯 META FINAL

**Al completar las 7 fases:**

✅ Curso certificado SENCE con código oficial
✅ 80-120 horas de contenido profesional
✅ 100+ preguntas de evaluación
✅ Certificados verificables públicamente
✅ Cumplimiento WCAG 2.1 AA
✅ Plataforma técnicamente robusta
✅ Equipo docente certificado
✅ Operación escalable

**Resultado:** Plataforma educativa de clase mundial, reconocida oficialmente por el Estado de Chile, con potencial de escalar a miles de usuarios.

---

## 📋 CHECKLIST DE IMPLEMENTACIÓN RÁPIDA

### Esta semana (Semana 1):
- [ ] Redactar Perfil de Ingreso formal
- [ ] Redactar Perfil de Egreso formal
- [ ] Definir 3-5 Objetivos medibles
- [ ] Crear `docs/sence/` con estructura
- [ ] Asignar instructor y verificar certificación SENCE

### Próximas 2 semanas (Semana 2-3):
- [ ] Plan de estudios formal con 80h
- [ ] Cronograma de actividades
- [ ] Diseñar material descargable (PDFs)
- [ ] Producir 5 videos prototipo

### Siguiente mes (Semana 4-8):
- [ ] Expandir contenido de 0.4h a 80h
- [ ] Crear sistema de evaluación final
- [ ] Implementar generación de certificados
- [ ] Auditoría WCAG inicial

### Mes 3-4 (Semana 9-14):
- [ ] Cumplimiento técnico completo
- [ ] Operación funcionando con cohorte piloto
- [ ] Postulación a SENCE
- [ ] **Obtener código SENCE oficial**

---

*Plan elaborado el 31 de agosto de 2026*
*Basado en INFORME_SENCE_COMPLETO_2026 y análisis del curso actual*
*Compatible con stack: React 19 + TypeScript + Vite + FastAPI + InsForge*
