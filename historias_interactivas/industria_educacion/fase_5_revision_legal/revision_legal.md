# Fase 5: Revisión Legal - Industria Educación

## Validación de Cumplimiento con la Ley 21.719 en el Sector Educativo

### Artículos Clave para el Sector Educativo

| Artículo | Requisito | Estado Verificación | Comentario |
|-------|-----------|---------------------|------------|
| **Art. 16** | Datos sensibles protegidos | ✅ Cumplido | En educación, datos de salud, religión, orientación sexual requieren protección reforzada |
| **Art. 16 bis** | Consentimiento explícito para datos sensibles | ⚠️ Revisar | Falta documentación en formularios de admisión |
| **Art. 50** | Designación DPO obligatoria | ❌ Pendiente | Establecimientos >1.000 estudiantes o redes escolares |
| **Art. 14** | Registro de actividades de tratamiento | ⚠️ Revisar | RAT incompleto en muchos establecimientos |
| **Art. 14 quinquies** | Medidas de seguridad obligatorias | ❌ Pendiente | Cifrado en dispositivos, logs de auditoría |
| **Art. 14 sexies** | Notificación 72h de brechas | ⚠️ En proceso | Protocolos internos aún en desarrollo |
| **Art. 5** | Derecho de acceso | ✅ Estándar | Apoderados pueden acceder a expediente completo |
| **Art. 7** | Derecho a supresión | ✅ Estándar | Con excepción de registros académicos permanentes |
| **Art. 9** | Derecho a portabilidad | ✅ Estándar | Datos en formato estructurado |
| **Art. 8** | Derecho a opresión | ✅ Estándar | Especialmente para marketing educativo |
| **Art. 12** | Consentimiento informado | ❌ Revisar | Muchas veces casillas pre-marcadas |
| **Art. 35** | Sanciones (1-5.000 UTM) | ✅ Referencia | Multas por infracciones gravísimas |
| **Art. 49** | Agravantes (reincidencia) | ✅ Referencia | Sanciones duplicadas por reincidencia |
| **Art. 50** | DPO obligatorio | ⚠️ Caso a caso | Depende tamaño del establecimiento |
| **Art. 15 ter** | Evaluación de impacto | ❌ Pendiente | Necesario para LMS, profiling, reconocimiento facial |

### Casos de Cumplimiento en la Historia "El Portátil Olvidado"

#### 1. Situación del Incidente
- **Brecha detectada:** Tablet con datos de 450 estudiantes perdida sin cifrado
- **Datos expuestos:** Nombres, RUT apoderados, calificaciones, diagnósticos, fotografías
- **Plazo notificación:** APDP notificada a las 2 horas (cumplimiento 72h)
- **Plazo apoderados:** Notificados a las 48 horas con información completa

#### 2. Hallazgos Legales de la Auditoría Posterior

| Aspecto | Hallazgo | Estado |
|---------|----------|--------|
| **RAT (Art. 14)** | Registro incompleto, faltan 3 tratamientos | ❌ Falta documentación |
| **Cifrado (Art. 14 quinquies)** | Dispositivo sin cifrado activo | ❌ Incumplimiento técnico |
| **DPO (Art. 50)** | No designado aún (450 estudiantes, umbral cercano) | ⚠️ Proximidad a obligatoriedad |
| **Consentimiento (Art. 16/16 bis)** | Formularios con casillas pre-marcadas | ❌ Incumplimiento Art. 12 |
| **Notificación (Art. 14 sexies)** | Dentro de las 72 horas | ✅ Cumplimiento correcto |
| **Derechos ARCO (Art. 5-9)** | Canal creado para solicitudes | ✅ Implementado |

#### 3. Acciones Correctivas Obligatorias (Post-Incidente)

**Inmediatas (0-30 días):**
1. [ ] Cifrar todos los dispositivos institucionales (Art. 14 quinquies)
2. [ ] Implementar RAT completo (Art. 14)
3. [ ] Designar DPO (Art. 50) — evaluar si superar los 1.000 estudiantes
4. [ ] Actualizar políticas de privacidad (quitar casillas pre-marcadas)
5. [ ] Capacitación obligatoria al 100% cuerpo docente

**Corto plazo (30-90 días):**
6. [ ] Crear portal web para ejercicio de derechos ARCO
7. [ ] Implementar política de retención de datos con fechas de eliminación
8. [ ] Actualizar formularios de consentimiento informado
9. [ ] Establecer protocolos de notificación de brechas internas
10. [ ] Auditar terceras plataformas LMS por cumplimiento

**Largo plazo (90 días+):**
11. [ ] Solicitar Sello de Cumplimiento en Privacidad Educativa (APDP-MINEDUC)
12. [ ] Auditar anual de todas las plataformas tecnológicas usadas
13. [ ] Implementar DPIA (Evaluación de Impacto) para nuevas tecnologías
14. [ ] Crear cultura de privacidad en toda la comunidad educativa

#### 4. Sanciones Potenciales si no se Corrigen

| Infracción | Multa UTM | Daño Reputacional | Acciones APDP |
|------------|-----------|-------------------|---------------|
| Datos sensibles sin consentimiento (Art. 16 bis) | 500-1.000 UTM | Alta (medios locales) | Inhabilitación temporal |
| Falta RAT (Art. 14) | 100-300 UTM | Media | Advertencia + plazos |
| Sin DPO obligatorio (Art. 50) | 200-500 UTM | Media | Fiscalización permanente |
| Falta cifrado dispositivo (Art. 14 quinquies) | 150-400 UTM | Media | Orden de corrección |
| Brecha sin notificación 72h (Art. 14 sexies) | 300-800 UTM | Alta | Denuncia pública |
| Reincidencia (Art. 49) | +50% multa | Muy Alta | Sanciones ejemplarizantes |

**Cálculo estimado para establecimiento de 450 estudiantes:**
- **Caso completo sin corregir:** 1.500 - 3.000 UTM (~$80M - $160M CLP)
- **Con atenuantes (se corrigió rápido):** 500 - 1.000 UTM
- **Con colaboracion inmediata:** 200 - 500 UTM

#### 5. Fundamentos Legales para Decisiones en la Historia

**¿Por qué Catalina notificó en 2 horas?**
> "El Art. 14 sexies establece claramente el plazo de 72 horas. Notificar con antelación demuestra buena fe y permite a la APDP comenzar sus investigaciones mientras mitigamos daños. El silencio administrativo o la espera excediendo el plazo conlleva multas automáticas y pérdida de credibilidad."

**¿Por qué designará DPO próximamente?**
> "El Art. 50 es obligatorio cuando el tratamiento implique vigilancia sistemática a gran escala. Con 450 estudiantes y uso de LMS, recopilación de calificaciones, datos de salud y plataforma digital, estamos en el umbral. Designarlo dentro de los próximos 6 meses evita sanciones y demuestra compromiso proactivo."

**¿Por qué actualizar formularios de consentimiento?**
> "El Art. 12 exige que el consentimiento sea libre, informado, específico e inequívoco. Las casillas pre-marcadas son nulas de pleno derecho. Además, el Art. 16 bis para datos sensibles requiere consentimiento explícito por escrito, no casillas genéricas de 'acepto términos'."

### Checklist de Revisión Legal - Educación

- [ ] RAT completado para todos los tratamientos (matrícula, calificaciones, salud, LMS, convivencia)
- [ ] Cifrado activo en todos los dispositivos (laptops, tablets, servidores)
- [ ] DPO designado (evalúe si establecimiento >1.000 estudiantes o red escolar)
- [ ] Políticas de privacidad sin casillas pre-marcadas (Art. 12)
- [ ] Consentimiento explícito por separado para cada tipo de dato (Art. 16 bis)
- [ ] Protocolo de notificación de brechas 72h (Art. 14 sexies)
- [ ] Portal/Canales ejercicio de derechos ARCO operativos
- [ ] Capacitación anual obligatoria al personal (min. 4 hrs/año)
- [ ] Evaluación de impacto (Art. 15 ter) para LMS, profiling, reconocimiento facial
- [ ] Retención de datos con fechas de eliminación definidas
- [ ] Portal apoderados para solicitar acceso/rectificación/supresión

### Conclusión de la Revisión Legal

La historia "El Portátil Olvidado" demuestra que:
1. **Notificación oportuna salva multas** (cumplir 72h = buena fe)
2. **Incidentes revelan brechas estructurales** (RAT, cifrado, DPO, consentimiento)
3. **Acciones correctivas evitan reincidencia** (sanciones Art. 49 si no se corrigen)
4. **Sector educativo requiere estándares reforzados** (menores = protección reforzada)
5. **Ley 21.719 es aplicable y exigible** (multas reales, auditorías activas)

---
*Revisión Legal completa para Industria Educación - Ley 21.719*
*Fecha: Septiembre 2026*
*Validación: Marcos legales vigentes desde 1-12-2026*