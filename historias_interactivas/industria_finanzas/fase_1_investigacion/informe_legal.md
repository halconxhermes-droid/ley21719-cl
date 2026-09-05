# Fase 1: Investigación Sector Finanzas - Ley 21.719

## Marco Regulatorio Financiero y Protección de Datos

### Ley 21.719 y el Sector Financiero en Chile

La **Ley 21.719** (publicada 13-12-2024, vigencia plena 01-12-2026) se aplica plenamente al sector financiero, regulando el tratamiento de datos personales de clientes, usuarios de servicios bancarios, tarjetas de crédito, seguros y demás productos financieros.

### Datos Sensibles en el Ámbito Financiero (Art. 16)

**Datos sensibles tratados por instituciones financieras:**
- **Art. 16:** Origen étnico, afiliación política/sindical, convicciones ideológicas/religiosas
- **Art. 16 bis:** Datos de salud (al solicitar seguros de vida, salud, invalidez)
- **Art. 16 ter:** Datos biométricos (firma digital, reconocimiento facial para autorización de transacciones)

### Categorías de Datos Tratados en el Sector Financiero

1. **Datos identificativos:** Nombre, RUT, fecha de nacimiento, dirección, estado civil
2. **Datos de contacto:** Teléfono, email, domicilio
3. **Datos de ingresos:** Sueldo, historial patronal, declaraciones de renta
4. **Historial crediticio:** Deudas, pagos, morosidades, comportamiento de pago
5. **Datos de transacciones:** Fechas, montos, comerciantes, tipos de productos comprados
6. **Datos de perfiles de riesgo:** Scoring crediticio, calificaciones de riesgo
7. **Datos biométricos:** Firmas digitales, huella dactilar para autorización de pagos
8. **Datos de contacto comercial:** Historiales de llamadas, interacciones con el banco
9. **Datos de seguros:** Cobertura, beneficiarios, condiciones preexistentes
10. **Datos de inversión:** Perfil de inversor, tolerancia al riesgo, historial de operaciones

### Normativa Financiera Complementaria

- **Ley 18.840** — Sobre instituciones financieras y solidarias
- **Ley 19.628** — Sobre protección de consumidores (Ley del Consumidor)
- **Circular 3.635** — CMF (Comisión Mercado Financiero) sobre protección de datos
- **Reglamento BCE 386** — Banco Central sobre ciberseguridad
- **Basilea III** — Capacidad de capital y gestión de riesgos (incluye riesgos operativos de datos)

### Obligaciones Clave para Instituciones Financieras

#### 1. Registro de Actividades (Art. 14)
**Tratamientos típicos:**
- Apertura y gestión de cuentas corrientes y de ahorro
- Créditos personales, hipotecarios y comerciales
- Emisión y gestión de tarjetas de crédito/débito
- Operaciones de inversión y fondos mutuos
- Seguros de vida, salud, automóvil
- Cambio y remesas monetarias
- Apertura de cuentas para extranjeros
- Gestión de cobranza y recuperación de cartera

#### 2. Consentimiento Informado (Art. 12, 16)
**Desafíos específicos:**
- **Tarjetas de crédito:** Firma electrónica o consentimiento al activar
- **Créditos hipotecarios:** Consentimiento expreso para uso de garantías
- **Seguros:** Consentimiento por escrito para datos de salud (Art. 16 bis)
- **Perfil de riesgo:** Consentimiento para elaboración de scoring
- **NO se permiten casillas pre-marcadas** (Art. 12)

#### 3. Medidas de Seguridad (Art. 14 quinquies)
**Requerimientos técnicos críticos para finanzas:**
- **Cifrado AES-256** en tránsito y reposo para todas las bases de datos
- **Control de acceso por roles** (atención al cliente, gerencia, riesgo, TI)
- **Logs de auditoría** inmutables para todas las transacciones y accesos
- **Autenticación multifactor (MFA)** obligatoria para acceso remoto y transacciones
- **Segmentación de redes** (separación Banca-Riesgo-Atención al cliente)
- **Protocolos de respuesta a incidentes** con tiempos definidos

#### 4. Evaluación de Impacto (Art. 15 ter)
**Obligatoria para:**
- Implementación de perfiles de scoring automatizados
- Plataformas de big data para segmentación de clientes
- Sistemas de toma de decisiones automatizadas (IA/ML)
- Reconocimiento facial para autorización de transacciones
- Monitoreo conductual de clientes

#### 5. Derechos del Titular
**Aplicación a productos financieros:**
- **Acceso:** Cliente puede solicitar ver todos sus datos en poder del banco
- **Rectificación:** Corregir datos erróneos (historial crediticio, ingresos reportados)
- **Supresión:** Solicitar eliminación de datos una vez vencida la obligación legal
- **Oposición:** Oponerse a uso de datos para ofertas no solicitadas (marketing)
- **Portabilidad:** Recibir datos en formato estructurado para cambiar de banco

#### 6. Delegado de Protección de Datos (Art. 50)
**Obligatorio para:**
- Bancos y instituciones financieras con más de 50.000 clientes
- Empresas de tarjetas de crédito con base de clientes significativa
- Fintechs con más de 100.000 usuarios activos
- Sociedades de garantía mutua
- Compañías de seguros

### Fundamentos Legales para Tratamiento Financiero

| Tipo de tratamiento | Base legal |
|---------------------|------------|
| Apertura de cuenta bancaria | Contrato + obligación legal (Ley 18.840) |
| Historial crediticio | Legítimo interés + reporte a centrales riesgo |
| Tarjetas de pago | Consentimiento al activar + contrato |
| Seguros de vida/salud | Consentimiento explícito (Art. 16 bis) |
| Perfiles de riesgo | Consentimiento + opción de exclusión |
| Transacciones comerciales | Ejecución de contrato + legítimo interés |
| Datos biométricos | Consentimiento explícito (Art. 16 ter) |
| Datos de salud (seguros) | Consentimiento explícito + base legal específica |

### Riesgos Específicos del Sector Financiero

1. **Valor económico de los datos** — Datos financieros se venden en mercados negros a alto precio
2. **Vulnerabilidad de clientes** — Personas sobreendeudadas, terceras edad, baja alfabetización digital
3. **Responsabilidad por fraudes** — Instituciones deben responder por brechas de seguridad
4. **Transferencias internacionales** — Datos a sucursales extranjeras o plataformas en la nube
5. **Cumplimiento normativo dual** — Ley 21.719 + regulaciones CMF/Banco Central

### Brechas de Seguridad Comunes en Finanzas

1. **Phishing y ingeniería social** — Clientes engañados para dar credenciales
2. **Acceso no autorizado a bases de datos** — Exfiltración de historiales crediticios
3. **Tarjetas clonadas** — Datos de banda magnética comprometidos
4. **Personal interno malintencionado** — Venta de datos a terceros
5. **Vulnerabilidades en APIs** — Exposición de datos a través de interfaces programáticas
6. **Ransomware** — Cifrado de bases de datos y solicitud de rescate

### Marco Comparativo: Chile vs Internacional

| Aspecto | Ley 21.719 (Chile) | GDPR (UE) | CCPA/CPRA (California) |
|---------|--------------------|-----------|------------------------|
| **Multas máximas** | 1-5.000 UTM (~$33-167M CLP) | 4% global turnover o 20M EUR | 7.500 USD por violación intencional |
| **Consentimiento** | Informado, específico, inequívoco | Granular, revocable en cualquier momento | Informado, específico |
| **Derechos ARCO** | Acceso, rectificación, supresión, oposición, portabilidad | Mismos + derecho a limitación, oposición | Acceso, eliminación, opt-out |
| **Notificación brecha** | 72 horas a APDP | 72 horas a autoridad | Sin plazo específico pero "rápido" |
| **Menores** | Representado por apoderado | Representado por padres/tutores | Representado por padres/tutores |

---
*Fuente: Ley 21.719 (Diario Oficial 13-12-2024), BCM/CMF, SBS (Perú), ANATEL (Brasil)*
*Vigencia plena: 1 de diciembre de 2026*
*Actualizado: Septiembre 2026*