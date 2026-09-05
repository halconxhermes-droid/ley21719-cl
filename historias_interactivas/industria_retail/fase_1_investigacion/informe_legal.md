# Fase 1: Investigación Sector Retail - Ley 21.719

## Marco Regulatorio del Comercio y Protección de Datos

### Ley 21.719 y el Sector Retail en Chile

La **Ley 21.719** (publicada 13-12-2024, vigencia plena 01-12-2026) se aplica plenamente al sector retail, regulando el tratamiento de datos personales de clientes en comercio electrónico, tiendas físicas, programas de fidelización y marketing directo.

### Datos Sensibles en el Ámbito Retail (Art. 16)

**Datos sensibles tratados por empresas retail:**
- **Art. 16:** Origen étnico, afiliación política/sindical, convicciones ideológicas/religiosas
- **Art. 16 bis:** Datos de salud (productos dietéticos, cosméticos, farmaceuticos)
- **Art. 16 ter:** Datos biométricos (reconocimiento facial para identificación de clientes VIP, pagos biométricos)

### Categorías de Datos Tratados en Retail

1. **Datos identificativos:** Nombre, RUT, fecha de nacimiento, dirección
2. **Datos de contacto:** Teléfono, email, domicilio
3. **Datos de transacciones:** Fechas, montos, productos comprados, medios de pago
4. **Datos de comportamiento de compra:** Historial, categorías favoritas, frecuencia
5. **Datos de preferencias:** Categorías de productos, marcas, rangos de precios
6. **Datos de ubicación:** Direcciones de envío, tiendas visitadas, geolocalización en apps
7. **Datos de perfilado:** Perfil de cliente, segmentación para ofertas
8. **Datos de interacción:** Llamadas a call center, chats en línea, devoluciones
9. **Datos de devolución/reclamo:** Motivos, frecuencias, productos devueltos
10. **Datos de pago:** Últimos 4 dígitos, tipo de tarjeta, banco emisor
11. **Datos biométricos:** Para programas VIP, pago biométrico
12. **Datos de redes sociales:** Interacciones con la marca, comentarios, valoraciones

### Normativa Complementaria del Retail

- **Ley 19.496** — Ley de Protección al Consumidor
- **Ley 19.628** — Protección de Datos Personales (será reemplazada por Ley 21.719)
- **Ley 19.799** — Firma Electrónica
- **Circular 1.892 SERNAC** — Sobre comercio electrónico
- **Decreto 3.331** — Reglamento sobre comercio electrónico
- **Ley 20.606** — Composición nutricional de los alimentos (vinculada a datos de salud)
- **Reglamento Sanitario** — Productos cosméticos, alimentos, medicamentos (datos de salud)

### Tipos de Empresas Retail

| Segmento | Datos típicos | Sensibilidad |
|----------|---------------|--------------|
| **Tiendas por departamento** | Historial de compras, perfilado | Media |
| **Supermercados** | Datos de consumo alimentario, hábitos | Media-Alta |
| **Comercio electrónico** | Comportamiento web, cookies, ubicación | Alta |
| **Farmacias** | Datos de salud (medicamentos recetados) | Alta |
| **Tiendas de cosmética** | Datos de salud (alergias, piel), perfilado | Alta |
| **Tiendas de ropa** | Tallas, preferencias, historial de devoluciones | Media |
| **Electrónica** | Datos técnicos, garantías, devoluciones | Media |
| **Joyería** | Datos de poder adquisitivo, ubicación | Media |
| **Mejoramiento del hogar** | Datos técnicos, ubicación de proyectos | Media |

### Obligaciones Clave para Empresas Retail

#### 1. Registro de Actividades (Art. 14)
**Tratamientos típicos:**
- Programas de fidelización (tarjetas de puntos, descuentos)
- Marketing directo (email, SMS, llamadas)
- Perfilado para ofertas personalizadas
- Análisis de ventas y comportamiento de compra
- Gestión de devoluciones y post-venta
- Atención al cliente (call center, chat, redes sociales)
- Comercio electrónico con cookies y tracking
- Encuestas de satisfacción
- Programas de descuento para empleados

#### 2. Consentimiento Informado (Art. 12, 16)
**Desafíos específicos:**
- **Casillas pre-marcadas:** NO permitidas (Art. 12) → muchas empresas aún las usan
- **Marketing por correo/email:** Requiere consentimiento específico (Art. 12)
- **Cookies de tracking:** Requieren consentimiento granular (Art. 12)
- **Datos de salud (cosméticos, alimentos):** Consentimiento explícito (Art. 16 bis)
- **Perfilado automatizado:** Derecho a saber y oponer (Art. 8)

#### 3. Medidas de Seguridad (Art. 14 quinquies)
**Requerimientos técnicos:**
- Cifrado de bases de datos de clientes y transacciones
- Tokenización de datos de tarjetas (PCI-DSS como estándar mínimo)
- Control de acceso por roles
- Logs de auditoría para accesos
- Protocolos de respuesta a incidentes
- Seguridad en e-commerce (TLS 1.3, certificados válidos)
- Protección contra ataques DDoS y SQL injection

#### 4. Evaluación de Impacto (Art. 15 ter)
**Obligatoria para:**
- Implementación de sistemas de recomendación automatizados
- Perfiles de cliente con IA/ML
- Monitoreo conductual web (cookies, fingerprinting)
- Programas de fidelización con perfilado masivo
- Reconocimiento facial en tiendas físicas

#### 5. Derechos del Titular
**Aplicación a clientes retail:**
- **Acceso:** Conocer todos los datos de la empresa sobre el cliente
- **Rectificación:** Corregir datos erróneos (direcciones, datos de contacto)
- **Supresión:** Solicitar eliminación de datos de programas de fidelización
- **Oposición:** Oponerse a marketing, perfilado, ofertas
- **Portabilidad:** Recibir historial de compras en formato estructurado

#### 6. Delegado de Protección de Datos (Art. 50)
**Obligatorio para:**
- Cadenas de retail con más de 1.000 empleados o 100.000 clientes
- Empresas de comercio electrónico con más de 100.000 usuarios activos
- Empresas con programa de fidelización masivo
- Empresas que usan IA/ML para perfilado

### Casos Reales del Sector Retail

1. **Filtración de bases de datos de clientes** — Empresa retail expuso datos de 5 millones de clientes
2. **Venta de bases de datos a terceros** — Marketing cruzado sin consentimiento
3. **Reconocimiento facial en tiendas** — Sin consentimiento explícito
4. **Cookies de tracking invasivo** — Sin banner de consentimiento granular
5. **Suscripción a newsletters no solicitada** — Casillas pre-marcadas
6. **Filtración de historiales de salud (farmacia)** — Sin cifrado
7. **Perfilado discriminatorio** — Segmentación por origen étnico o religión

### Fundamentos Legales para Tratamiento Retail

| Tipo de tratamiento | Base legal |
|---------------------|------------|
| Tarjeta de fidelización | Contrato (Art. 4°) |
| Marketing por email | Consentimiento específico (Art. 12) |
| Análisis de ventas | Interés legítimo (Art. 4°) |
| Devoluciones y post-venta | Obligación legal + contrato |
| Programa de descuentos para empleados | Relación laboral (consentimiento tácito) |
| Cookies de análisis | Consentimiento granular (Art. 12) |
| Perfilado para ofertas | Consentimiento + opción de oposición (Art. 8) |
| Datos de salud (cosméticos) | Consentimiento explícito (Art. 16 bis) |
| Reconocimiento facial | Consentimiento explícito (Art. 16 ter) |

### Riesgos Específicos del Sector Retail

1. **Valor comercial de los datos** — Bases de datos se venden a competidores
2. **Vulnerabilidad de consumidores** — Especialmente adultos mayores, baja alfabetización digital
3. **Volumen masivo de datos** — Millones de transacciones diarias
4. **Plataformas de e-commerce** — Múltiples proveedores con datos en la nube
5. **Marketing agresivo** — Presión por personalizar ofertas vs privacidad

### Marco Comparativo Internacional

| Aspecto | Ley 21.719 (Chile) | GDPR (UE) | LGPD (Brasil) |
|---------|--------------------|-----------|---------------|
| **Marketing por email** | Requiere consentimiento | Opt-in obligatorio | Opt-in obligatorio |
| **Cookies** | Consentimiento granular | Consentimiento granular | Consentimiento |
| **Perfilado** | Derecho a oposición | Derecho a explicación + oposición | Derecho a oposición |
| **Datos de salud (cosméticos)** | Consentimiento explícito | Consentimiento explícito | Consentimiento explícito |
| **DPO obligatorio** | Según tamaño/riesgo | Cualquier empresa de perfilado | DPO para empresas grandes |
| **Multas máximas** | 1-5.000 UTM | 4% global turnover | 2% facturación Brasil |

---
*Fuente: Ley 21.719 (Diario Oficial 13-12-2024), BCN, SERNAC, SII*
*Vigencia plena: 1 de diciembre de 2026*
*Actualizado: Septiembre 2026*