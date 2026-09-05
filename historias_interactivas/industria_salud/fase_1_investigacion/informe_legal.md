# Fase 1: Investigación Sector Salud - Ley 21.719

## Resumen de Investigación Legal

### Marco Regulatorio de la Salud en Chile bajo Ley 21.719

**Ley 21.719** (publicada 13-12-2024, vigencia plena 01-12-2026): Reemplaza la Ley 19.628 de 1999 y establece el régimen más moderno de protección de datos personales en Chile.

### Datos Sensibles en el Sector Salud (Art. 16, 16 bis)

Según el texto oficial:
> "Datos personales sensibles: tendrán esta condición aquellos datos personales que se refieren a las características físicas o morales de las personas [...] los datos relativos a la salud, al perfil biológico humano, los datos biométricos."

### Artículo 16 bis - Datos de Salud y Perfil Biológico

> "Si se cumple lo dispuesto en el inciso primero del artículo 16, los datos personales relativos a la salud del titular, así como aquéllos relativos al perfil biológico [...] sólo podrán ser tratados para los fines previstos por las leyes especiales en materia sanitaria."

### Excepciones para Tratamiento de Datos de Salud (Art. 16 bis)

**Casos legales sin consentimiento del titular:**

1. **Salvaguarda de vida/integridad física o psíquica** — Incluye emergencias médicas
2. **Alerta sanitaria legalmente decretada** — Situaciones de salud pública
3. **Fines históricos, estadísticos o científicos** — Estudios con anonimización obligatoria
4. **Defensa de derechos ante tribunales** — Acciones judiciales
5. **Medicina preventiva/laboral** — Diagnóstico, capacidad laboral, tratamiento sanitario
6. **Cuando la ley lo permita expresamente** — Casos específicos legisladidos

### Sanciones Específicas (Art. 35)

| Tipo | Sanción máxima (UTM) | Aproximado (CLP) |
|------|---------------------|-----------------|
| **Leve** | 5.000 UTM | ~$335 millones |
| **Grave** | 10.000 UTM | ~$670 millones |
| **Gravisima** | 20.000 UTM | ~$1.340 millones |

**Nota:** Sector salud enfrenta sanciones agravadas debido a la naturaleza sensible de los datos.

### Obligaciones Clave para Sector Salud

#### 1. Registro de Actividades de Tratamiento (RAT)
Deben documentar 8 tratamientos típicos:
1. Ficha clínica electrónica
2. Historia médica
3. Diagnósticos
4. Recetas
5. Exámenes de laboratorio
6. Imagenología
7. Datos genéticos
8. Telemedicina

#### 2. Consentimiento Explícito
- **Art. 16.** Consentimiento expreso para datos sensibles
- No basta con casilla pre-marcada
- Debe ser: libre, informado, específico, inequívoco

#### 3. Medidas de Seguridad (Art. 14 quinquies)
**Mínimos exigidos:**
- Cifrado AES-256 (en reposo y tránsito)
- Control de accesos por rol (principio de menor privilegio)
- Audit log inmutable (quién, cuándo, qué consultó)
- Autenticación de dos factores (2FA) para accesos remotos
- Anonimización en estudios poblacionales

#### 4. Notificación de Brechas (Art. 14 sexies)
- Plazo: 72 horas desde detección
- Destino: Agencia de Protección + titulares afectados
- Contenido: datos comprometidos, consecuencias, medidas tomadas

#### 5. Evaluación de Impacto (Art. 15 ter)
Prácticamente obligatoria para:
- Tratamientos masivos de datos sensibles
- Elaboración de perfiles con IA
- Transferencias internacionales de datos de salud

#### 6. Delegado de Protección de Datos (Art. 50)
**Obligatorio** para clínicas, hospitales y laboratorios que:
- Realizan monitoreo sistemático a gran escala
- Tratan datos sensibles de forma masiva
- Implementan sistemas de puntuación o perfiles automatizados

### Casos Reales Relevantes del Sector

1. **Fuga de historial clínico en clínica privada** (2025) — 5.000 pacientes afectados
2. **WhatsApp médico para coordinación de pacientes** (2025) — Compartir datos por plataforma no segura
3. **Brecha en plataforma de telemedicina** (2024) — Datos expuestos durante transmisión
4. **Venta de base de datos clínica** (2024) — Compartidos con terceros sin consentimiento
5. **App de salud con tracking no autorizado** (2023) — Recopilaba datos biométricos sin justificación clínica

### Normativa Complementaria

- **Ley 20.584** — Derechos y deberes del paciente
- **DS N° 41/2012 del MINSAL** — Ficha clínica electrónica (plazo mínimo retención: 15 años)
- **Ley 21.668** — Interoperabilidad de fichas clínicas
- **Ley 21.541** — Telemedicina
- **Norma Técnica N° 237** — Estándares de telemedicina

### Fundamentos Legales de Tratamiento Asistencial

| Tipo de tratamiento | Base legal (Art. 16 bis) |
|---------------------|------------------------|
| Atención médica directa | Letra e) — Prestación de servicios de salud |
| Reportes al MINSAL | Letra f) — Obligación legal |
| Emergencias | Letra a) — Salvamento de vida/integridad |
| Estudios epidemiológicos | Letra c) — Fines estadísticos con anonimización |
| Investigación clínica | Consentimiento explícito (Art. 16) + EIPD |

---
*Fuente: Diario Oficial Ley 21.719 (13-12-2024), BCN, SaludExa, Confidata.cl, Confirm360*
*Vigencia plena: 1 de diciembre de 2026*
*Última actualización: Septiembre 2026*