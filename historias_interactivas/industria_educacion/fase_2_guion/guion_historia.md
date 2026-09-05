# Fase 2: Guion - Historia 1 - Industria Educación

## Historia Interactiva: "El Caso del Portátil Olvidado"

### Protagonista
**Catalina Salazar** — Directora de una escuela municipal de Santiago con 450 estudiantes, desde hace 8 años.

### Título
**"El Portátil Olvidado: Un viaje por los datos de los estudiantes"**

### Objetivo Pedagógico
Enseñar a directivos y profesores:
- Cómo proteger los datos de estudiantes y apoderados bajo Ley 21.719
- Los riesgos de manejar datos de menores de edad
- Los protocolos de notificación de brechas en el sector educativo
- Cómo ejercer los derechos ARCO para estudiantes (a través de apoderados)

### Estructura de los 7 Capítulos

---

#### **Capítulo 1: El Incidentes**
**Duración:** 8 minutos
**Escenario:** Es viernes a las 16:00. Catalina está a punto de cerrar la oficina cuando recibe un llamado de emergencia: uno de los profesores, el Sr. Martínez, llamó alarmado —dejó una tablet con datos de estudiantes en un restaurante y el dispositivo se encuentra perdido.

**Evento desencadenante:** La tablet contiene:
- Fichas de 450 estudiantes (nombre, RUT apoderado, diagnósticos, calificaciones)
- Fotografías de estudiantes en actos cívicos
- Informes de psicopedagogía
- Datos de salud (alergias, medicación para TDAH)

**El llamado:** El restaurante ya llamó, el dispositivo está apagado y no tiene contraseña de encendido.

---

#### **Capítulo 2: La Reunión de Crisis**
**Duración:** 12 minutos
**Escenario:** Catalina reúne al equipo directivo: la coordinadora de convivencia, el encargado de TIC y la asesora jurídica.

**Elementos legales:**
- **Art. 14** — Registro de actividades de tratamiento
- **Art. 14 quinquies** — Medidas de seguridad obligatorias
- **Art. 14 sexies** — Notificación de brechas (72 horas)
- **Art. 5** — Derecho de acceso (apoderados)
- **Art. 7** — Derecho a supresión

**Decisión interactiva:**
> ¿Qué hace Catalina primero?

| Opción | Acción | Impacto Legal |
|--------|--------|---------------|
| **A)** Esperar a que encuentren la tablet antes de notificar a nadie | ❌ Riesgo de exceder las 72 horas → multa gravísima |
| **B)** Notificar al MINEDUC y a la APDP inmediatamente sin más dilaciones | ✅ Cumplimiento estricto, pero genera alerta pública |
| **C)** Intentar rastrear la tablet durante 24 horas antes de notificar | ⚠️ Vence el plazo de 72 horas → responsabilidad administrativa |

> **Camino correcto: Opción B con matices.**
> Catalina activa el protocolo de emergencia: notifica a la APDP a las 2 horas (dentro del plazo legal), mientras el equipo técnico intenta rastrear la tablet. Después de 24 horas sin hallazgos, notifica a los apoderados.

---

#### **Capítulo 3: La Investigación Técnica**
**Duración:** 15 minutos
**Escenario:** El equipo de TIC revisa la tablet y los sistemas. Descubren:

**Hallazgos críticos:**
1. La tablet **no tenía cifrado activo** (Art. 14 quinquies)
2. No existía **política de contraseñas fuertes** en el dispositivo
3. No había **audit log** que registrara quién accedió a los datos
4. La tablet tenía **respaldos automáticos** en la nube educativa sin cifrado
5. Los datos no estaban **anonimizados** para análisis estadísticos

**Hallazgos normativos:**
1. No existía **RAT** (Registro de Actividades de Tratamiento) formalizado
2. La política de privacidad entregada a apoderados no mencionaba este escenario
3. No había designado **DPO** (Art. 50), al tener más de 450 estudiantes (cercano al umbral)
4. El consentimiento para tratamiento de imágenes no estaba documentado

**Diálogo clave:**
> "Catalina, el dispositivo no tiene cifrado. Si alguien lo enciende y extrae la tarjeta SD, tendrían acceso directo a todos los datos de los estudiantes. Además, el respaldo en la nube no tiene política de retención ni anonimización. Esto es una receta para una brecha de seguridad grave."

---

#### **Capítulo 3: La Notificación**
**Duración:** 10 minutos
**Escenario:** Catalina decide notificar a la APDP y a los apoderados.

**Protocolos seguidos:**
1. **Notificación a la APDP:** A las 2 horas del incidente (dentro de las 72h legales)
2. **Notificación a apoderados:** A las 48 horas, con información detallada
3. **Comunicación interna:** A todo el cuerpo docente sobre buenas prácticas

**Contenido de la notificación a apoderados:**
> *"Estimado/a apoderado/a: El día [fecha], [establecimiento] sufrió una brecha de seguridad donde una tablet con datos de estudiantes se Extravió. Los datos podrían incluir nombre, RUT y contexto académico. Hemos activado protocolo de protección: (1) bloqueo remoto del dispositivo, (2) solicitud de cambio de contraseñas a todas las cuentas asociadas, (3) monitoreo de posibles usos ilícitos. Ejercen sus derechos ARCO escribiendo a [email]. Plazo legal: 30 días hábiles para respuesta."*

---

#### **Capítulo 5: La Auditoría Post-Incidente**
**Duración:** 8 minutos
**Escenario:** Cuatro semanas después, la APDP realiza una fiscalización para verificar el cumplimiento.

**Hallazgos de la auditoría:**
- **Positivos:** Notificación dentro de las 72 horas, documentación del incidente, protocolo creado
- **Negativos:** Falta de cifrado en dispositivos móviles, RAT incompleto, DPO no designado aún

**Acciones correctivas obligatorias:**
1. Cifrado completo en todos los dispositivos institucionales (plazo: 30 días)
2. Implementación de RAT formal (Art. 14)
3. Designación de DPO (Art. 50) — próximamente por superar los 1.000 estudiantes
4. Actualización de políticas de privacidad y consentimiento
3. Capacitación al cuerpo docente en protección de datos

### 🔀 **PUNTO DE DECISIÓN 3: ¿Qué decisión toma la escuela?**

| Opción | Consecuencia |
|--------|--------------|
| **A)** Asumir el incidente como "isolado" y no hacer cambios estructurales | ❌ Altamente probable nueva brecha, sanciones futuras |
| **B)** Implementar medidas técnicas inmediatas y políticas de privacidad completas | ✅ Reduce riesgo a casi cero, mejora reputación |
| **C)** Culpar al profesor Sr. Martínez y no tocar el sistema | ⚠️ Soluciona lo inmediato pero no aborda causas estructurales |

> **Camino correcto: Opción B.**
> La escuela decide una transformación integral de protección de datos, convirtiéndose en modelo de referencia para otras instituciones municipales.

---

#### **Capítulo 6: La Certificación**
**Duración:** 6 minutos
**Escenario:** Seis meses después, la escuela solicita y obtiene el **Sello de Cumplimiento en Privacidad Educativa**, otorgado por la APDP en convenio con el MINEDUC.

**Criterios para obtener el sello:**
- Cumplimiento del RAT (Art. 14) al 100%
- Cifrado en todos los dispositivos (Art. 14 quinquies)
- Designación de DPO (Art. 50)
- Protocolos de notificación de brechas (Art. 14 sexies)
- Capacitación al 100% del personal
- Portal para ejercicio de derechos ARCO

**Beneficios:**
- Reconocimiento público por MINEDUC
- Ventaja competitiva al captar familias exigentes
- Posible bonificación en convenios con isapres/funcionarios públicos
- Menor prima de seguro de ciberseguridad

---

#### **Capítulo 7: La Lección Final**
**Duración:** 5 minutos
**Escenario:** Catalina presenta un informe al consejo municipal sobre el estado de protección de datos en establecimientos municipales.

**Cierre empático:**
> "La privacidad de los datos de nuestros estudiantes no es solo una obligación legal bajo la Ley 21.719 —es un acto de respeto a su dignidad y futuro. Cada dato que protegemos es una oportunidad para construir confianza con las familias que depositan en nosotros lo más valioso: el bienestar de sus hijos".

### Decisión Final del Usuario

> **¿Qué habría hecho tú?**
> 
> - **A)** Enfocarse solo en recuperar la tablet y minimizar el tema
> - **B)** Usar el incidente como oportunidad para transformar la protección de datos en toda la escuela
> - **C)** Culpar al profesor y seguir igual

> **Recomendación:** La opción B es la que transforma un problema en una oportunidad de mejora institucional.

---

## Apéndice: Glosario Educativo

| Término | Definición bajo Ley 21.719 |
|---------|----------------------------|
| **Ficha del estudiante** | Documento con datos personales y académicos (Art. 5-9) |
| **Apoderado** | Representante legal del menor (derechos ARCO por Art. 5°) |
| **RAT** | Registro de Actividades de Tratamiento (Art. 14) |
| **Brecha educativa** | Exposición no autorizada de datos de estudiantes |
| **DPO educativo** | Delegado de Protección de Datos para establecimientos |
| **LMS** | Learning Management System (Moodle, Google Classroom, etc.) |
| **Profiling** | Elaboración de perfiles estudiantes para segmentación |
| **Consentimiento apoderado** | Debe ser informado, específico y por escrito |

---

*Historia 1 - Industria Educación - Ley 21.719*
*Compatible con: Web educativa ley21719-cl, MINEDUC, SENCE*
*Duración estimada de narración: 66 minutos*
*Nivel: Mediante - Directivos y equipos educativos*

---

## Checklist de Compleción

- [ ] Fase 1: Investigación legal completada
- [ ] Fase 2: Guion narrativo creado
- [ ] Fase 3: Prompts de imagen/video definidos
- [ ] Fase 4: Simulador y quizzes JSON creados
- [ ] Fase 5: Revisión legal finalizada
- [ ] Fase 6: Integración en carpeta del proyecto