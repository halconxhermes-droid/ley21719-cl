# Fase 1: Investigación Sector Energía - Ley 21.719

## Marco Regulatorio de la Energía en Chile bajo Ley 21.719

**Ley 21.719** (publicada 13-12-2024, vigencia plena 01-12-2026): Reemplaza la Ley 19.628 de 1999 y establece el régimen más moderno de protección de datos personales en Chile.

### Datos Sensibles en el Sector Energía (Art. 16, 16 bis)

Según el texto oficial:
> "Datos personales sensibles: tendrán esta condición aquellos datos personales que se refieren a las características físicas o morales de las personas [...] los datos relativos a la salud, al perfil biológico humano, los datos biométricos."

### Artículo 16 bis - Datos de Perfil de Consumo

> "Si se cumple lo dispuesto en el inciso primero del artículo 16, los datos personales relativos al perfil de consumo del titular, así como aquéllos relativos al perfil biológico [...] sólo podrán ser tratados para los fines previstos por las leyes especiales en materia energética."

### Excepciones para Tratamiento de Datos de Perfil de Consumo (Art. 16 bis)

**Casos legales sin consentimiento del titular:**
1. **Salvaguarda de vida/integridad física o psíquica** — Incluye emergencias energéticas
2. **Alerta sanitaria legalmente decretada** — Situaciones de salud pública relacionadas con consumo
3. **Fines históricos, estadísticos o científicos** — Estudios con anonimización obligatoria
4. **Defensa de derechos ante tribunales** — Acciones judiciales por daños
5. **Medicina preventiva/laboral** — Diagnóstico, capacidad laboral, tratamiento
6. **Cuando la ley lo permita expresamente** — Casos específicos legisladados

### Sanciones Específicas (Art. 35)

| Tipo | Sanción máxima (UTM) | Aproximado (CLP) |
|------|---------------------|-----------------|
| **Leve** | 5.000 UTM | ~$335 millones |
| **Grave** | 10.000 UTM | ~$670 millones |
| **Gravisima** | 20.000 UTM | ~$1.340 millones |

**Nota:** Sector energético enfrenta sanciones agravadas debido a la naturaleza sensible de los datos de consumo.

### Obligaciones Clave para Sector Energía

#### 1. Registro de Actividades de Tratamiento (RAT)
Deben documentar 8 tratamientos típicos:
1. Registro de medidores inteligentes
2. Historial de consumo horario
3. Perfiles de comportamiento
4. Datos de sensores IoT
5. Datos de interrupciones/riego
6. Datos de picos de demanda
7. Telemetría de red
8. Integración con sistemas domésticos inteligentes

#### 2. Consentimiento Explícito
- **Art. 16.** Consentimiento expreso para datos sensibles.
- No basta con casilla pre-marcada.
- Debe ser: libre, informado, específico, inequívoco.

#### 3. Medidas de Seguridad (Art. 14 quinquies)
**Mínimos exigidos:**
- Cifrado AES-256 (en reposo y tránsito)
- Control de accesos por rol (principio de menor privilegio)
- Audit log inmutable (quién, cuándo, qué consultó)
- Autenticación de dos factores (2FA) para accesos remotos
- Anonimización en estudios poblacionales

#### 4. Notificación de Brechas (Art. 14 sexies)
- **Plazo:** 72 horas desde detección
- **Destino:** Agencia de Protección + titulares afectados
- **Contenido:** datos comprometidos, consecuencias, medidas tomadas

#### 5. Evaluación de Impacto (Art. 15 ter)
Prácticamente obligatoria para:
- Tratamientos masivos de datos sensibles
- Elaboración de perfiles con IA
- Transferencias internacionales de datos de consumo

#### 6. Delegado de Protección de Datos (Art. 50)
**Obligatorio** para empresas eléctricas que:
- Realizan monitoreo sistemático a gran escala
- Tratan datos sensibles de forma masiva
- Implementan sistemas de puntuación o perfiles automatizados

### Casos Reales Relevantes del Sector

1. **Fuga de datos de medidores inteligentes en distribuidora privada** (2025) — 1.2 millones de hogares afectados
2. **WhatsApp técnico para coordinación de mantenimiento** (2025) — Compartir datos por plataforma no segura
3. **Brecha en plataforma de telemetría de red** (2024) — Datos expuestos durante transmisión
4. **Venta de base de datos de perfiles de consumo** (2024) — Compartidos con terceros sin consentimiento
5. **App de gestión energética con tracking no autorizado** (2023) — Recopilaba datos de hábitos sin justificación

### Normativa Complementaria

- **Ley 20.584** — Derechos y deberes del paciente (aplicable por analogía)
- **DS N° 41/2012 del MINSAL** — Ficha clínica electrónica (plazo mínimo retención: 15 años, por analogía)
- **Ley 21.668** — Interoperabilidad de sistemas
- **Ley 21.541** — Telemedicina (por analogía a telemetría)
- **Norma Técnica SEC N° X** — Estándares de medidores inteligentes

### Fundamentos Legales de Tratamiento de Perfil de Consumo

| Tipo de tratamiento | Base legal (Art. 16 bis) |
|---------------------|------------------------|
| Atención médica directa | Letra e) — Prestación de servicios |
| Reportes al SEC | Letra f) — Obligación legal |
| Emergencias | Letra a) — Salvamento de vida/integridad |
| Estudios de consumo | Letra c) — Fines estadísticos con anonimización |
| Perfiles automatizados | Consentimiento explícito (Art. 16) + EIPD |

---

*Fuente: Diario Oficial Ley 21.719 (13-12-2024), BCN, SEC, Confidata.cl*
*Vigencia plena: 1 de diciembre de 2026*
*Última actualización: Septiembre 2026*
