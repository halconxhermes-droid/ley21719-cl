# Sistema de Calificación y Retroalimentación

**Curso:** Ley 21.719 - Protección de Datos Personales
**Versión:** 1.0 - Agosto 2026

---

## 📊 SISTEMA DE CALIFICACIÓN GENERAL

### Componentes de la Nota Final

| Componente | Ponderación | Tipo | Calificación |
|------------|-------------|------|-------------|
| **Quizzes por módulo** (6 quizzes) | 30% | Automática | Inmediata |
| **Foros y participación** | 5% | Manual (instructor) | 48h |
| **Casos prácticos** (5 casos) | 15% | Manual (rúbrica) | 72h |
| **Laboratorios técnicos** (3 labs) | 10% | Automática (código) | Inmediata |
| **Examen final** (50 preguntas) | 20% | Automática | Inmediata |
| **Proyecto final** | 20% | Manual (comité) | 7 días |
| **TOTAL** | **100%** | Mixto | Mixto |

### Escala de Calificación

| Nota | Porcentaje | Resultado | Equivalencia |
|------|------------|-----------|--------------|
| 7.0 | 90-100% | Aprobado con distinción | Excelente |
| 6.0 | 80-89% | Aprobado con distinción | Muy Bueno |
| 5.0 | 70-79% | Aprobado | Bueno |
| 4.0 | 60-69% | Reprobado | Suficiente (insuficiente) |
| 3.0 o menos | 0-59% | Reprobado | Insuficiente |

**Aprobación mínima:** 5.0 (70%)

### Fórmula de Cálculo

```python
nota_final = (
    (quizzes_avg * 0.30) +
    (participacion * 0.05) +
    (casos_promedio * 0.15) +
    (labs_promedio * 0.10) +
    (examen_nota * 0.20) +
    (proyecto_nota * 0.20)
)
```

---

## 📝 CALIFICACIÓN POR COMPONENTE

### 1. Quizzes por Módulo (30%)

**6 quizzes:**
- Quiz 1.1: 10 preguntas (Diagnóstico)
- Quiz 1.2: 8 preguntas (Principios)
- Quiz 1.3: 9 preguntas (Obligaciones)
- Quiz 1.4: 7 preguntas (EIPD)
- Quiz 1.5: 10 preguntas (Transferencias)
- Quiz 1.6: 10 preguntas (Sanciones)

**Total: 54 preguntas** (8 quizzes en realidad al sumar M2, M3, M4)

**Características:**
- Automáticas (se califican al instante)
- Sin límite de tiempo por pregunta (30 min por quiz)
- Se pueden repetir 2 veces (se toma la mejor nota)
- Feedback inmediato con explicación

**Cálculo:**
```
promedio_quizzes = (suma_notas_quizzes / 6) / 10 * 7
# Escala 1.0 a 7.0
```

### 2. Foros y Participación (5%)

**5 foros:**
- Foro M1: Consentimiento válido vs inválido
- Foro M2: Caso Facebook y Cambridge Analytica
- Foro M3: Pseudonimización en la práctica
- Foro M4: Cooperación interinstitucional
- Foro M5: Análisis caso emblemático

**Rúbrica (cada foro = 1 punto):**

| Criterio | Excelente (1) | Bueno (0.7) | Suficiente (0.5) | Insuficiente (0) |
|----------|---------------|-------------|------------------|-----------------|
| **Calidad de la participación** | Aporta ideas originales y análisis crítico | Aporta ideas relevantes | Participación básica | No participa |
| **Respuesta a otros** | Responde constructivamente a 2+ compañeros | Responde a 1 compañero | No responde a otros | Solo postea |
| **Uso de conceptos** | Integra 3+ conceptos del módulo | Integra 2 conceptos | Integra 1 concepto | No integra conceptos |

**Cálculo:**
```
participacion = (suma_puntos_foros / 5) * 7
```

### 3. Casos Prácticos (15%)

**5 casos prácticos:**
- Caso M1: Brecha en empresa retail
- Caso M2: Solicitudes ARSOP
- Caso M3: Implementación técnica
- Caso M4: Coordinación interinstitucional
- Caso M5: Defensa ante la Agencia

**Rúbrica (cada caso = 1 punto base, escala 1-7):**

| Criterio | Excelente (1) | Bueno (0.85) | Suficiente (0.7) | Insuficiente (<0.7) |
|----------|---------------|--------------|------------------|-------------------|
| **Identificación del problema** | Identifica todos los aspectos legales | Identifica la mayoría | Identifica algunos | No identifica |
| **Análisis legal** | Aplica correctamente todos los artículos relevantes | Aplica la mayoría | Aplica algunos | No aplica correctamente |
| **Solución propuesta** | Solución completa, viable y fundamentada | Solución correcta | Solución parcial | No propone solución |
| **Calidad de redacción** | Clara, profesional, bien estructurada | Clara | Aceptable | Deficiente |

**Cálculo:**
```
casos_promedio = (suma_notas_casos / 5)
# Escala 1.0 a 7.0
```

### 4. Laboratorios Técnicos (10%)

**3 laboratorios:**
- Lab 1: Data Mapping Automático
- Lab 2: Cifrado Completo
- Lab 3: Sistema de Auditoría

**Características:**
- Automáticos (tests evalúan el código)
- 5 tests por laboratorio
- Plazo: 1 semana
- Reintentos: 3 máximo

**Rúbrica técnica (cada lab = 1 punto base):**

| Criterio | Puntos |
|----------|--------|
| Código compila sin errores | 0.2 |
| Pasa tests básicos (50%+) | 0.3 |
| Pasa tests avanzados (80%+) | 0.3 |
| Documentación clara | 0.1 |
| Buenas prácticas (cifrado, logs) | 0.1 |

**Cálculo:**
```
labs_promedio = (suma_notas_labs / 3) * 7
```

### 5. Examen Final (20%)

**Composición:**
- 50 preguntas de opción múltiple (70% del examen)
- 5 casos prácticos extensos (30% del examen)

**Ver:** `EXAMEN_FINAL.md` para detalles completos

**Cálculo:**
```
examen_nota = (
    (correctas_mc / 50 * 10 * 0.7) +  # 70% de 10 puntos
    (casos_promedio / 6 * 10 * 0.3)    # 30% de 10 puntos
) / 10 * 7
# Escala 1.0 a 7.0
```

### 6. Proyecto Final (20%)

**Estructura:** Plan de Cumplimiento Integral

**Rúbrica (6 criterios):**
- Diagnóstico: 15%
- Inventario (RAT): 15%
- Plan de Cumplimiento: 30%
- Implementación: 20%
- Monitoreo: 10%
- Presentación oral: 10%

**Cálculo:**
```
proyecto_nota = (
    (diagnostico * 0.15) +
    (inventario * 0.15) +
    (plan * 0.30) +
    (implementacion * 0.20) +
    (monitoreo * 0.10) +
    (presentacion * 0.10)
) / 6 * 7
# Escala 1.0 a 7.0
```

---

## 🔄 SISTEMA DE RETROALIMENTACIÓN

### Retroalimentación Inmediata (Automática)

**Para quizzes:**
- ✅ Respuesta correcta: "¡Correcto! [Explicación]"
- ❌ Respuesta incorrecta: "Incorrecto. La respuesta correcta es X. [Explicación detallada + referencia al artículo legal]"

**Para laboratorios:**
- Output del código con tests pasando/fallando
- Mensajes de error específicos
- Sugerencias de mejora

### Retroalimentación Diferida (Manual del Instructor)

**Para casos prácticos:**
- Comentarios por sección
- Calificación con rúbrica detallada
- Ejemplos de respuestas destacadas
- Sugerencias de profundización

**Para proyecto final:**
- Evaluación con rúbrica completa
- Comentarios por criterio
- Calificación de defensa oral
- Plan de mejora personalizada

### Retroalimentación entre Pares (Foros)

**Sistema de evaluación:**
- Cada estudiante responde a 2 compañeros
- Rúbrica simplificada
- Calificación promedio + bonus por calidad
- Solo aportes constructivos

---

## 📊 REPORTES DE PROGRESO

### Reporte Semanal (Automático)

**Cada lunes, el estudiante recibe:**

- Nota actual del curso
- Progreso por módulo (% completado)
- Tiempo dedicado (horas)
- Tareas pendientes
- Comparación con el promedio del curso

**Formato:** Email + dashboard en plataforma

### Reporte por Módulo (Al Finalizar)

**Incluye:**
- Nota del módulo
- Detalle por componente (quizzes, casos, labs)
- Áreas de mejora identificadas
- Recursos recomendados
- Tiempo dedicado vs esperado

### Reporte Final (Al Completar)

**Incluye:**
- Nota final del curso
- Desglose por componente
- Certificado (si aprobó)
- Recomendaciones de profundización
- Invitación a comunidad de egresados

---

## 🎯 SISTEMA DE APROBACIÓN Y RECUPERACIÓN

### Reglas de Aprobación

**Para aprobar el curso completo:**
- Nota final ≥ 5.0
- Aprobación en TODOS los módulos (≥ 4.0 en cada uno)
- Asistencia ≥ 80%
- Participación en ≥ 3 de 5 foros

**Si no se cumple alguno:**
- **Recuperación:** Una sola oportunidad por módulo
- **Plazo:** 30 días después de finalizado el curso
- **Costo:** Sin costo adicional

### Proceso de Recuperación

**Para quizzes:**
- Puede repetir el quiz 2 veces adicionales
- Se toma la mejor nota

**Para casos prácticos:**
- Puede reenviar el caso con correcciones
- Calificación nueva reemplaza la anterior

**Para examen final:**
- Una sola oportunidad adicional
- Debe esperar 30 días
- Puede incluir 10 preguntas nuevas

**Para proyecto final:**
- Una oportunidad de rehacer
- Con feedback detallado
- Plazo: 60 días

---

## 🏆 SISTEMA DE RECONOCIMIENTOS

### Distinciones por Desempeño

| Nota Final | Distinción |
|-----------|------------|
| 9.0-10.0 | **Summa Cum Laude** ⭐⭐⭐ |
| 8.0-8.9 | **Magna Cum Laude** ⭐⭐ |
| 7.0-7.9 | **Cum Laude** ⭐ |
| 5.0-6.9 | Aprobado |

### Certificaciones Adicionales

**Al completar el curso con nota ≥ 7.0:**
- ✅ Certificado del Curso (SENCE)
- ✅ Insignia digital LinkedIn
- ✅ Carta de recomendación (si nota ≥ 8.0)
- ✅ Ingreso a comunidad Alumni

**Reconocimientos especiales:**
- 🏆 Mejor Proyecto del Cohorte
- 🏆 Mejor Participación en Foros
- 🏆 Mejor Desempeño en Examen
- 🏆 Mejor Evolución (mayor mejora entre módulos)

---

## 📚 HERRAMIENTAS DE APOYO

### Para el Estudiante

**Calculadora de nota:**
- Dashboard en plataforma
- Muestra proyección de nota final
- Alerta si está en riesgo

**Banco de preguntas:**
- ~200 preguntas de práctica
- Modo estudio y modo examen
- Feedback inmediato

**Glosario interactivo:**
- 50+ términos
- Definiciones y ejemplos
- Búsqueda por palabra clave

### Para el Instructor

**Panel de control:**
- Notas de todos los estudiantes
- Detección de estudiantes en riesgo
- Estadísticas de preguntas (más falladas)
- Tiempos de respuesta

**Reportes automatizados:**
- Notas pendientes de calificación
- Retroalimentaciones enviadas
- Casos enviados vs calificados
- Alertas de plazos

---

## 📊 ESTADÍSTICAS Y MÉTRICAS

### Métricas de Calidad SENCE

**SENCE espera:**
- Tasa de aprobación ≥ 70%
- Tasa de deserción ≤ 20%
- Satisfacción ≥ 80%
- Tasa de finalización ≥ 75%

**Sistema de monitoreo:**
- Reportes quincenales
- Alertas tempranas
- Intervención si es necesario
- Encuesta de satisfacción al finalizar

### Métricas de Mejora Continua

**Recolectadas mensualmente:**
- Preguntas con mayor tasa de error
- Temas que requieren refuerzo
- Tiempos promedio de finalización
- Satisfacción por módulo
- Comentarios de estudiantes

**Usadas para:**
- Actualizar quizzes
- Reforzar materiales
- Ajustar cronograma
- Mejorar instrucción

---

## 🔧 IMPLEMENTACIÓN TÉCNICA

### Stack Recomendado

**Frontend:**
- React 19 + TypeScript
- Tailwind CSS (ya integrado)
- Componentes de quiz con feedback inmediato
- Dashboard de progreso

**Backend:**
- FastAPI + Python (ya integrado)
- PostgreSQL (InsForge)
- Sistema de auto-calificación
- Generación de certificados PDF

**Almacenamiento:**
- Notas por estudiante
- Historial de quizzes
- Retroalimentaciones
- Certificados emitidos

### APIs Necesarias

```python
# Estructura de endpoints
GET  /api/grades/{student_id}
POST /api/grades/{student_id}/submit
GET  /api/grades/{student_id}/progress
GET  /api/certificates/{student_id}
POST /api/cases/{case_id}/submit
GET  /api/forum/{forum_id}/posts
POST /api/labs/{lab_id}/submit
```

---

*Sistema completo de calificación y retroalimentación*
*Compatible con requisitos SENCE*
*Diseñado para tasa de aprobación ≥ 70% y satisfacción ≥ 80%*
