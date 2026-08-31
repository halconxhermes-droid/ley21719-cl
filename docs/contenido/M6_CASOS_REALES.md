# Módulo 6: Casos Reales y Jurisprudencia

**Duración total:** 10 horas
**Nivel:** Analizar - Evaluar
**Modalidad:** Online (Híbrido: 3h sincrónicas + 7h asincrónicas)

---

## 🎯 OBJETIVOS DEL MÓDULO

1. **OE-6.1:** Analizar casos emblemáticos internacionales
2. **OE-6.2:** Aplicar jurisprudencia de la Agencia a casos nuevos
3. **OE-6.3:** Evaluar lecciones aprendidas de errores
4. **OE-6.4:** Resolver simulaciones de incidentes

---

## 📚 CASO 1: GOOGLE STREET VIEW (ESPAÑA - 2010) (1 hora)

### Contexto
Google recopiló datos de redes WiFi mientras tomaba fotos para Street View.

### Hechos
- 2006-2010: Recolección masiva de datos
- 2010: Revelación pública
- Incluye: SSID, MAC addresses, payloads
- Google admitió la recolección "accidental"

### Análisis Legal
- **AEPD (España):** Multa de €900,000
- **Violación:** LOPD (Ley Orgánica de Protección de Datos)
- **Problemas:** Falta de consentimiento, transparencia
- **Google pidió disculpas** y eliminó datos

### Lecciones para Chile
- "Recolección accidental" no es defensa
- Importancia de Privacy by Design
- Necesidad de auditorías técnicas
- Reputación afectada por décadas

### Análisis del Grupo (30 min)
- ¿Cómo se pudo prevenir?
- ¿Qué medidas técnicas faltaban?
- ¿Cómo responder ante el descubrimiento?

---

## 📚 CASO 2: CAMBRIDGE ANALYTICA (EE.UU. - 2018) (1 hora)

### Contexto
Uso indebido de datos de Facebook para psicometría política.

### Hechos
- 2014-2015: App "This Is Your Digital Life"
- 270,000 usuarios dieron consentimiento
- **A través de Facebook Graph API:** se accedió a datos de 87 millones
- Usado para campaña de Trump 2016
- Revelado por Christopher Wylie en 2018

### Análisis Legal
- **FTC (EE.UU.):** Multa de $5,000 millones a Facebook
- **ICO (Reino Unido):** Multa de £500,000 (máximo)
- **Problemas:**
  - Consentimiento no informado
  - Finalidad engañosa
  - Transferencia no autorizada
  - Uso para profiling sin base legal

### Lecciones para Chile
- Consentimiento debe ser ESPECÍFICO
- No se puede cambiar finalidad sin nuevo consentimiento
- APIs que comparten datos requieren明示 consent
- Profilado político requiere base legal sólida

### Debate (30 min)
- ¿Debe Chile regular psicometría política?
- ¿Qué medidas técnicas habrían prevenido esto?

---

## 📚 CASO 3: EQUIFAX (EE.UU. - 2017) (1 hora)

### Contexto
Brecha masiva de datos de 147 millones de personas.

### Hechos
- Mayo-Julio 2017: Hackers explotaron vulnerabilidad en Apache Struts
- Datos robados: nombres, SSN, fechas de nacimiento, direcciones
- Descubierto 29 de julio, reportado público 7 de septiembre (40 días después)
- 209,000 números de tarjetas de crédito también robados

### Análisis Legal
- **FTC:** Acuerdo de $700 millones
- **Multas totales:** ~$1.4 mil millones
- **Críticas:**
  - Retraso en notificación
  - Vulnerabilidades conocidas sin parchear
  - Falta de cifrado en algunos datos

### Lecciones para Chile
- Parches de seguridad oportunos
- Plan de respuesta a incidentes
- Cifrado de datos sensibles
- Transparencia ante afectados

### Análisis Técnico (30 min)
- ¿Qué habría prevenido el ataque?
- ¿Cómo detectar la intrusión más rápido?

---

## 📚 CASO 4: LINKEDIN (IRLANDA - 2023) (45 min)

### Contexto
Multa récord de €310 millones por prácticas de publicidad dirigida.

### Hechos
- 2018-2024: Recolección de datos para publicidad comportamental
- Sin base legal válida
- Sin consentimiento adecuado
- Transferencias a EE.UU. sin garantías

### Análisis Legal (RGPD)
- **DPC (Irlanda):** Multa de €310 millones
- **Base legal insuficiente:** Interés legítimo inválido
- **Falta de transparencia**
- **Transferencias ilegales a EE.UU.**

### Lecciones para Chile
- Interés legítimo NO es base universal
- Consentimiento debe ser explícito
- Transferencias a EE.UU. requieren CCT/BCR
- Publicidad comportamental está altamente regulada

---

## 📚 CASO 5: CASO CHILENO - SECTOR SALUD (2025) (1 hora)

### Contexto
[CASO HIPOTÉTICO BASADO EN TENDENCIAS] Hospital público chileno y filtración de datos de pacientes.

### Hechos
- Hospital pierde USB con datos de 50,000 pacientes
- Datos: RUT, diagnóstico, tratamiento
- Retraso de 2 meses en notificación
- Investigación revela falta de cifrado

### Análisis según Ley 21.719
- **Infracción gravísima** (Art. 35)
- Datos sensibles (Art. 2° letra g)
- Falta de medidas técnicas (Art. 14 quinquies)
- Notificación tardía (Art. 14 sexies)

### Multa Estimada
- Base: 5,000-10,000 UTM
- Con agravantes (retraso, datos sensibles): hasta 20,000 UTM
- **Multa estimada: $335M - $1,340M CLP**

### Lecciones
- Sector salud requiere medidas reforzadas
- Cifrado obligatorio en dispositivos móviles
- Plan de respuesta con plazos claros
- Responsabilidad del personal (capacitación)

### Discusión (30 min)
- ¿Cómo prevenir este caso?
- ¿Qué rol juega la dirección del hospital?

---

## 📚 CASO 6: CASO CHILENO - SECTOR RETAIL (2025) (45 min)

### Contexto
[CASO HIPOTÉTICO] Tienda departamental con filtración masiva de datos de clientes.

### Hechos
- Hackers acceden a base de datos de clientes
- 200,000 clientes afectados
- Datos: email, teléfono, historial de compras
- Ransomware solicita pago

### Respuesta
- Notificación inmediata a Agencia
- Comunicación a clientes en 48h
- Negativa a pagar ransomware
- Restauración desde backups

### Análisis Legal
- **Notificación correcta** (cumple Art. 14 sexies)
- **Comunicación adecuada** a titulares
- **Multa reducida** por colaboración
- **Multa estimada:** 1,000-3,000 UTM

### Lecciones
- Plan de respuesta a incidentes es crítico
- Backups son esenciales
- Negarse a pagar ransomware es mejor práctica
- Transparencia genera confianza

---

## 📚 CASO 7: CASO CHILENO - STARTUP TECH (2025) (45 min)

### Contexto
[CASO HIPOTÉTICO] Startup chilena usando AWS sin CCT adecuado.

### Hechos
- Migración a AWS US-East-1
- Sin CCT firmado explícitamente
- 50,000 usuarios chilenos
- Datos almacenados sin encriptar en algunos casos

### Análisis Legal
- **Transferencia ilegal** (Art. 27)
- **Falta de CCT** (Art. 28)
- **Medidas insuficientes** (Art. 14 quinquies)
- **Multa estimada:** 1,000-2,000 UTM

### Solución
- CCT estándar de AWS firmada
- Cifrado en reposo habilitado
- Migración a región más cercana
- Documentación en RAT

---

## 📚 CASO 8: CASO CHILENO - SECTOR PÚBLICO (2025) (45 min)

### Contexto
[CASO HIPOTÉTICO] Municipalidad y datos de permisos de circulación.

### Hechos
- Municipalidad comparte base de datos con empresa de marketing
- Sin base legal clara
- Sin consentimiento de contribuyentes
- 100,000 registros compartidos

### Análisis Legal
- **Régimen especial público** (Art. 24)
- **Transferencia no autorizada**
- **Falta de base legal**
- **Infracción grave** (Art. 35)
- **Multa estimada:** 2,000-5,000 UTM

### Lección
- Sector público tiene restricciones adicionales
- Datos fiscales requieren protección reforzada
- Cualquier compartición debe tener base legal

---

## 📚 CASO 9: UBER (BRASIL - LGPD 2022) (45 min)

### Contexto
Multa a Uber por no cumplir con derecho de acceso.

### Hechos
- 2020: Usuario solicita acceso a sus datos
- Uber tarda 6 meses en responder
- Información incompleta
- ANPD multa a Uber

### Análisis Legal (LGPD)
- **Derecho de acceso** (Art. 18 LGPD)
- **Plazo de respuesta** violado
- **Información incompleta**
- **Multa: R$ 10,000,000**

### Lecciones para Chile
- Plazos de respuesta son obligatorios
- Derecho de acceso es amplio
- Información debe ser completa
- Respuesta tardía = multa

---

## 📚 CASO 10: CASO CHILENO - DECISIÓN AGENCIA (2025) (1 hora)

### Contexto
[CASO HIPOTÉTICO] Primera decisión importante de la Agencia de Protección de Datos Chilena.

### Hechos
- Empresa X denuncia a empresa Y
- Conflicto por uso de datos para marketing
- Agencia investiga y falla

### Decisión (Hipotética)
- **Infracción grave de empresa Y**
- **Multa: 3,000 UTM ($201M CLP)**
- **Orden de cesar tratamiento**
- **Plazo de cumplimiento: 30 días**

### Análisis Crítico
- **Primer precedente** en Chile
- **Criterios de interpretación**
- **Aplicación de la nueva ley**
- **Impacto en la industria**

---

## 🎯 ANÁLISIS COMPARATIVO DE CASOS

| Caso | País | Multa | Tipo de Infracción | Lección Principal |
|------|------|-------|-------------------|-------------------|
| Google Street View | España | €900K | Recolección ilegal | Privacy by Design |
| Cambridge Analytica | EE.UU. | $5B | Consentimiento engañoso | Consentimiento específico |
| Equifax | EE.UU. | $1.4B | Vulneración masiva | Respuesta a incidentes |
| LinkedIn | Irlanda | €310M | Publicidad comportamental | Base legal válida |
| Salud Chile | Chile | $335M-$1.34B | Datos sensibles | Medidas reforzadas |
| Retail Chile | Chile | $67M-$201M | Brecha con respuesta | Plan de respuesta |
| Startup Chile | Chile | $67M-$134M | Transferencia ilegal | CCT necesario |
| Público Chile | Chile | $134M-$335M | Compartir sin base | Restricciones públicas |
| Uber | Brasil | R$10M | Derecho de acceso | Plazos de respuesta |
| Agencia Chile | Chile | $201M | Primer precedente | Interpretación legal |

---

## 🎯 ACTIVIDADES DEL MÓDULO 6

| Actividad | Horas | Tipo |
|-----------|-------|------|
| Lectura de 10 casos | 4h | Asincrónico |
| 2 videos de análisis | 2h | Asincrónico |
| 2 debates sincrónicos | 2h | Sincrónico |
| Ensayo analítico | 1.5h | Asincrónico |
| Quiz | 0.5h | Asincrónico |
| **TOTAL** | **10h** | Mixto |

---

## 📊 EVALUACIÓN DEL MÓDULO 6

- **Quiz 6.1:** 10 preguntas sobre casos
- **Ensayo:** Análisis de 1 caso (500 palabras)
- **Foro:** Discusión sobre lecciones aprendidas
- **Simulación:** 1 incidente (trabajo en grupo)

**Ponderación:** 7% de la nota final

---

*Manual del Módulo 6: Casos Reales y Jurisprudencia*
*Versión: 1.0 - Agosto 2026*
*10 casos documentados | 10 horas | Enfoque práctico*
