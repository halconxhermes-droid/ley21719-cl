# Fase 5: Revisión Legal - Industria Finanzas

## Validación de Cumplimiento con la Ley 21.719 en el Sector Financiero

### Artículos Clave para el Sector Financiero

| Artículo | Requisito | Estado Verificación | Comentario |
|-------|-----------|---------------------|------------|
| **Art. 16** | Datos sensibles protegidos | ✅ Cumplido | En finanzas, datos de salud (seguros), biometría requieren protección reforzada |
| **Art. 16 bis** | Consentimiento explícito para datos sensibles | ⚠️ Revisar | Falta documentación en formularios de seguros y créditos |
| **Art. 16 ter** | Datos biométricos requieren consentimiento explícito | ❌ Pendiente | Firmas digitales y reconocimiento facial sin documentación adecuada |
| **Art. 14** | Registro de actividades de tratamiento | ⚠️ Revisar | RAT incompleto en muchas instituciones |
| **Art. 14 quinquies** | Medidas de seguridad obligatorias | ❌ Pendiente | Cifrado MFA, logs inmutables aún no implementados en todas |
| **Art. 14 sexies** | Notificación 72h de brechas | ✅ Referencia | Protocolo existe pero necesita ejercitación |
| **Art. 4-9** | Derechos ARCO (acceso, rectificación, supresión, oposición, portabilidad) | ⚠️ En proceso | Canales creados pero con tiempos de respuesta variables |
| **Art. 35** | Sanciones (1-5.000 UTM) | ✅ Referencia | Multas por infracciones gravísimas |
| **Art. 49** | Agravantes (reincidencia) | ✅ Referencia | Sanciones duplicadas por reincidencia |
| **Art. 50** | DPO obligatorio | ⚠️ Caso a caso | Depende tamaño del cliente (50.000+ = obligatorio) |
| **Art. 15 ter** | Evaluación de impacto | ❌ Pendiente | Necesario para scoring, perfiles automatizados, IA |
| **Art. 28** | Encargados de tratamiento | ❌ Pendiente | Terceros proveedores sin convenios formales |
| **Art. 12** | Consentimiento informado | ❌ Revisar | Muchas veces casillas pre-marcadas en contratación |

### Casos de Cumplimiento en la Historia "El Aviso Inesperado"

#### 1. Situación del Incidente
- **Brecha detectada:** Acceso no autorizado a base de datos de historial crediticio
- **Datos expuestos:** Historial crediticio, ingresos, transacciones, datos contacto, tarjetas (últimos 4 dígitos)
- **Plazo notificación:** APDP notificada a las 4 horas (cumplimiento 72h)
- **Plazo clientes:** Comunicación preparada pero escalonada (no masiva inmediata)

#### 2. Hallazgos Legales de la Auditoría Posterior

| Aspecto | Hallazgo | Estado |
|---------|----------|--------|
| **RAT (Art. 14)** | Registro incompleto, faltan 8 de 15 tratamientos críticos | ❌ Falta documentación |
| **Cifrado (Art. 14 quinquies)** | Servidor sin cifrado transparente en campos tarjeta | ❌ Incumplimiento técnico |
| **MFA (Art. 14 quinquies)** | Autenticación multifactor no obligatoria para todos accesos admin | ❌ Incumplimiento técnico |
| **DPO (Art. 50)** | Designado pero con carga excesiva (50.000+ clientes) | ⚠️ Proximidad a obligatoriedad |
| **Notificación (Art. 14 sexies)** | Dentro de las 72 horas | ✅ Cumplimiento correcto |
| **Terceros proveedores** | Convenios de tratamiento de datos pendientes (Art. 28) | ❌ Incumplimiento contractual |
| **Consentimiento (Art. 16/16 bis)** | Formularios con casillas pre-marcadas | ❌ Incumplimiento Art. 12 |
| **Evaluación impacto (Art. 15 ter)** | No realizada para sistemas de scoring | ❌ Pendiente requerida |

#### 3. Acciones Correctivas Obligatorias (Post-Incidente)

**Inmediatas (0-30 días):**
1. [ ] Aplicar todos los parches de seguridad pendientes (incluida la vulnerabilidad CVE)
2. [ ] Completar RAT formal para todos los tratamientos (15 categorías críticas)
3. [ ] Implementar MFA obligatoria para todos los accesos administrativos
4. [ ] Firmar convenios de tratamiento con terceros proveedores (Art. 28)
5. [ ] Actualizar políticas de privacidad (quitar casillas pre-marcadas, Art. 12)

**Corto plazo (30-90 días):**
6. [ ] Realizar Evaluación de Impacto (Art. 15 ter) para sistemas de scoring y perfiles de riesgo
7. [ ] Capacitación obligatoria al 100% personal bancario (mín. 8 hrs)
8. [ ] Implementar cifrado transparente en todas las bases de datos sensibles
9. [ ] Definir protocolos de notificación interna de brechas
10. [ ] Auditoría de todas las plataformas LMS y terceros por cumplimiento

**Largo plazo (90 días+):**
11. [ ] Solicitar Sello de Cumplimiento en Privacidad Financiera (APDP-CMF)
12. [ ] Auditoría anual de todas las plataformas tecnológicas usadas
13. [ ] Implementar DPIA (Evaluación de Impacto) para nuevas tecnologías (IA, ML)
14. [ ] Crear cultura de privacidad en toda la institución financiera

#### 4. Sanciones Potenciales si no se Corrigen

| Infracción | Multa UTM | Daño Reputacional | Acciones APDP |
|------------|-----------|-------------------|---------------|
| Datos sensibles sin consentimiento (Art. 16 bis) | 500-1.000 UTM | Alta (medios financieros) | Inhabilitación temporal |
| Falta RAT (Art. 14) | 200-400 UTM | Media | Advertencia + plazos |
| Sin MFA obligatorio (Art. 14 quinquies) | 150-300 UTM | Media | Orden de corrección |
| Terceros sin convenios (Art. 28) | 200-500 UTM | Media | Suspensión de proveedores |
| Brecha sin notificación 72h (Art. 14 sexies) | 300-800 UTM | Alta | Denuncia pública |
| Sin DPO obligatorio (Art. 50) | 300-600 UTM | Media | Fiscalización permanente |
| Reincidencia (Art. 49) | +50% multa | Muy Alta | Sanciones ejemplarizantes |

**Cálculo estimado para banco con 250.000 clientes:**
- **Caso completo sin corregir:** 2.000 - 4.000 UTM (~$67M - $133M CLP)
- **Con notificación oportuna:** 600 - 1.200 UTM
- **Con colaboración inmediata y corrección:** 300 - 800 UTM

#### 5. Fundamentos Legales para Decisiones en la Historia

**¿Por qué Roberto notificó en 4 horas?**
> "El Art. 14 sexies establece claramente el plazo de 72 horas. Notificar con antelación demuestra buena fe y permite a la APDP comenzar sus investigaciones mientras mitigamos daños. El silencio administrativo o la espera excediendo el plazo conlleva multas automáticas y pérdida de credibilidad ante accionistas y clientes."

**¿Por qué realizará la Evaluación de Impacto (Art. 15 ter)?**
> "El Art. 15 ter es obligatorio cuando el tratamiento implique profiling automatizado, toma de decisiones basadas en IA o monitoreo sistemático. Nuestros sistemas de scoring y perfiles de riesgo entran en esta categoría. Realizarla evita sanciones y demuestra compromiso con la protección de datos desde el diseño."

**¿Por qué firmará convenios con terceros proveedores?**
> "El Art. 28 establece que el responsable debe asegurar que el encargadoTratamiento de datos cumpla con la ley. Terceros proveedores (gateway de pago, proveedor de cloud, analytics) deben tener convenios formales que definan responsabilidades, medidas de seguridad y derechos del titular. Sin estos convenios, el banco es responsable por cualquier incumplimiento del tercero."

### Checklist de Revisión Legal - Finanzas

- [ ] RAT completado para todos los tratamientos financieros (15 categorías críticas)
- [ ] Cifrado activo en todas las bases de datos con datos sensibles (Art. 14 quinquies)
- [ ] MFA obligatoria para todos accesos administrativos y transacciones críticas
- [ ] DPO designado y operativo (evalúe si institución >50.000 clientes o tarjetas significativas)
- [ ] Políticas de privacidad sin casillas pre-marcadas (Art. 12)
- [ ] Consentimiento explícito por separado para cada tipo de dato sensible (Art. 16 bis)
- [ ] Protocolos de notificación de brechas 72h operativos (Art. 14 sexies)
- [ ] Portal/Canales ejercicio de derechos ARCO operativos y con tiempos definidos
- [ ] Evaluación de impacto (Art. 15 ter) para sistemas de scoring, IA, profiling
- [ ] Terceros proveedores con convenios de tratamiento de datos (Art. 28)
- [ ] Capacitación anual obligatoria al personal (min. 8 hrs/año)
- [ ] Retención de datos con fechas de eliminación definidas (respeto a Art. 14)

### Conclusión de la Revisión Legal

La historia "El Aviso Inesperado" demuestra que:
1. **Notificación oportuna salva multas** (cumplir 72h = buena fe, mitigar hasta 70% multa)
2. **Incidentes revelan brechas estructurales** (RAT, cifrado, MFA, terceros, consentimiento)
3. **Acciones correctivas evitan reincidencia** (sanciones Art. 49 si no se corrigen)
4. **Sector financiero requiere estándares reforzados** (datos sensibles = protección alta)
5. **Ley 21.719 es aplicable y exigible** (multas reales, auditorías activas por APDP y CMF)

---
*Revisión Legal completa para Industria Finanzas - Ley 21.719*
*Fecha: Septiembre 2026*
*Validación: Marcos legales vigentes desde 1-12-2026*
*Entidades reguladoras: APDP, CMF, SBS (Perú referencia)*