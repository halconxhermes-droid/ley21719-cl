# Fase 2: Guion - Historia 1 - Industria Finanzas

## Historia Interactiva: "El Aviso Inesperado"

### Protagonista
**Roberto Salinas** — Gerente General de un banco regional con 12 años en el sistema financiero chileno. Está a punto de jubilarse y ha dedicado su carrera a mejorar la relación del banco con sus clientes.

### Título
**"El Aviso Inesperado: Un viaje por la protección de datos en banca"**

### Objetivo Pedagógico
Enseñar a gerentes, ejecutivos y funcionarios bancarios:
- Cómo proteger los datos financieros de los clientes bajo Ley 21.719
- Los riesgos de manejar datos sensibles en el sector financiero
- Los protocolos de notificación de brechas en el sector financiero
- Cómo ejercer los derechos ARCO para clientes bancarios

### Estructura de los 7 Capítulos

---

#### **Capítulo 1: El Incidente**
**Duración:** 10 minutos
**Escenario:** Lunes 9 de septiembre, 9:00 hrs. Roberto acaba de llegar a su oficina cuando recibe una llamada urgente del equipo de ciberseguridad: "Sistema de detección de intrusiones ha alertado sobre acceso no autorizado a la base de datos de historial crediticio. Podría ser una brecha."

**Evento desencadenante:** El acceso no autorizado potencial afecta:
- Historial crediticio de 250.000 clientes
- Ingresos declarados (sueldos, declaraciones de renta)
- Historial de transacciones últimos 12 meses
- Datos de contacto (teléfonos, correos electrónicos)
- Datos de tarjetas de crédito (últimos 4 dígitos, fechas de vencimiento)

**El llamado:** El equipo técnico aún está investigando el vector de ataque. Podría ser un phishing interno, una vulnerabilidad sin parchear o acceso privilegiado indebido.

---

#### **Capítulo 2: La Reunión de Crisis**
**Duración:** 15 minutos
**Escenario:** Roberto reúne al Comité de Crisis: Jefe de Ciberseguridad, Gerente de Riesgos, Gerente de Relaciones Públicas, Asesor Jurídico y el DPO (Delegado de Protección de Datos).

**Elementos legales:**
- **Art. 14** — Registro de actividades de tratamiento
- **Art. 14 quinquies** — Medidas de seguridad obligatorias
- **Art. 14 sexies** — Notificación de brechas (72 horas)
- **Art. 4-9** — Derechos ARCO (acceso, rectificación, supresión, oposición, portabilidad)
- **Art. 35** — Sanciones (1-5.000 UTM)
- **Art. 49** — Agravantes por reincidencia

**Decisión interactiva:**
> ¿Qué hace Roberto primero?

| Opción | Acción | Impacto Legal |
|--------|--------|---------------|
| **A)** Esperar a tener certeza total del alcance antes de notificar | ❌ Vence el plazo de 72 horas → multa automática |
| **B)** Notificar a la CMF y a la APDP con información preliminar | ✅ Cumplimiento legal, mantiene transparencia |
| **C)** Intentar ocultar el incidente a clientes y regulatorios | ⚠️ Si se descubre, sanciones triplicadas + daño reputacional irreparable |

> **Camino correcto: Opción B con matices.**
> Roberto emite una declaración preliminar a la APDP a las 4 horas (dentro del plazo legal), informando que hay una investigación en curso, sin especificar detalles técnicos que podrían obstaculizar la investigación. Simultáneamente, prepara comunicación formal a clientes.

---

#### **Capítulo 3: La Investigación Técnica**
**Duración:** 20 minutos
**Escenario:** El equipo de ciberseguridad y el DPO analizan los hallazgos. Descubren:

**Hallazgos críticos técnicos:**
1. **Servidor de historial crediticio tenía vulnerabilidad sin parchear** (CVE-2024-XXXX)
2. **Acceso no autorizado potencial** a través de credenciales de un tercero proveedor
3. **No existía cifrado transparente** en el campo número de tarjeta en algunos módulos
4. **Logs de auditoría** existían pero no eran inmutables (podrían ser alterados)
5. **Autenticación multifactor (MFA)** no estaba obligatoria para todos los accesos administrativos

**Hallazgos normativos:**
1. **RAT (Registro de Actividades de Tratamiento)** incompleto: faltan 8 de 15 tratamientos críticos
2. **Política de privacidad** actualizada recientemente pero no comunicada a todos los gerentes de sucursal
3. **DPO designado** pero con carga de trabajo excesiva (50.000+ clientes, recién designado hace 3 meses)
4. **Consentimiento para perfilado** (scoring de riesgo) no estaba debidamente documentado
5. **Terceros proveedores** no habían firmado convenios de tratamiento de datos (Art. 28)

**Diálogo clave:**
> "Roberto, este servidor no tenía el parche de seguridad crítico aplicado. Además, las credenciales del proveedor tenían permisos superiores a los necesarios. Y lo más preocupante: los logs de auditoría no son inmutables, lo que significa que si alguien los borró, no tendríamos evidencia para la APDP ni para la fiscalía."

---

#### **Capítulo 4: La Notificación a la APDP**
**Duración:** 10 minutos
**Escenario:** Roberto emite la notificación formal a la Agencia de Protección de Datos Personales.

**Protocolos seguidos:**
1. **Notificación a la APDP:** A las 4 horas del incidente (dentro de las 72h legales)
2. **Información incluida:**
   - Categoría y cantidad de datos personales afectados
   - Medidas tomadas para mitigar el incidente
   - Consecuencias probables para los titulares
   - Acciones correctivas adoptadas
   - Contacto para consultas adicionales

**Comunicación a clientes (preparada pero no masiva aún):**
> *"Estimado cliente: El día [fecha], [banco] detectó un incidente de seguridad que pudo haber afectado algunos de sus datos personales. Hemos activado nuestros protocolos de emergencia y estamos investigando el caso. Más información en: [sitio web seguro]. Ejercen sus derechos ARCO escribiendo a [email protected]. Plazo legal: 30 días hábiles para respuesta."*

---

#### **Capítulo 5: La Auditoría y Sanciones**
**Duración:** 12 minutos
**Escenario:** Dos meses después, la APDF realiza una fiscalización para verificar el cumplimiento.

**Hallazgos de la auditoría:**
- **Positivos:** Notificación dentro de las 72 horas, documentación del incidente, protocolo creado
- **Negativos:** RAT incompleto, servidor sin parche, logs no inmutables, terceros sin convenios

**Decisiones de la APDP:**
1. **Multa provisional:** 350 UTM (~$18.5M CLP) por gravisima infracción (Art. 35)
2. **Orden de corrección:** Plazo 60 días para:
   - Aplicar todos los parches de seguridad pendientes
   - Completar RAT para todos los tratamientos
   - Firmar convenios con terceros proveedores
   - Implementar MFA obligatoria para accesos administrativos
3. **Seguimiento:** Auditoría de seguimiento en 6 meses
4. **Posible agravante** si se comprueba reincidencia (Art. 49): multa hasta 500 UTM

**Diálogo con Roberto:**
> "El hecho de que hayan notificado dentro de las 72 horas y hayan tenido documentación preliminar mitiga significativamente la multa. Sin notificación, habrían sido 1.000 UTM mínimo. Sin embargo, el servidor sin parche y los terceros sin convenios son incumplimientos estructurales que deben corregirse de inmediato."

---

#### **Capítulo 6: La Transformación**
**Duración:** 8 minutos
**Escenario:** Seis meses después, el banco ha implementado un programa integral de protección de datos y solicita el **Sello de Cumplimiento en Privacidad Financiera**, otorgado por la APDP en convenio con la CMF.

**Criterios para obtener el sello:**
- RAT completado para todos los tratamientos financieros (Art. 14)
- Cifrado en todas las bases de datos con datos sensibles (Art. 14 quinquies)
- DPO plenamente operativo con carga de trabajo adecuada (Art. 50)
- Protocolos de notificación de brechas 72h operativos (Art. 14 sexies)
- MFA obligatoria para todos los accesos administrativos y transacciones críticas
- Capacitación al 100% del personal bancario (mín. 8 hrs/año)
- Evaluación de impacto (Art. 15 ter) para sistemas de scoring y perfiles de riesgo
- Terceros proveedores con convenios de tratamiento de datos (Art. 28)

**Beneficios obtenidos:**
- Reducción de prima de seguro de ciberseguridad en 25%
- Mejora en rating de riesgo por parte de agencias internacionales
- Reconocimiento público por CMF y APDP
- Mayor satisfacción de clientes (encuestas NPS +15%)
- Ventaja competitiva al captar carteras de alto patrimonio exigentes
- Posibilidad de ofrecer seguros de protección de identidad a clientes

---

#### **Capítulo 7: La Lección Final**
**Duración:** 5 minutos
**Escenario:** Roberto presenta un informe al directorio del banco sobre el estado de protección de datos y los aprendizajes del incidente.

**Cierre empático:**
> "La protección de datos en banca no es solo una obligación legal bajo la Ley 21.719 —es el pilar fundamental de la confianza en el sistema financiero. Cada cliente que deposita su historial crediticio, sus ingresos y su confianza en nosotros, espera que protejamos no solo su dinero, sino también su dignidad y privacidad. El incidente nos enseñó que la seguridad de datos es una responsabilidad de todos, desde el guardia de seguridad hasta el propio gerente general".

### Decisión Final del Usuario

> **¿Qué habría hecho tú?**
> 
> - **A)** Enfocarse solo en minimizar el daño reputacional y no tocar el sistema
> - **B)** Usar el incidente como oportunidad paratransformar la seguridad y privacidad en toda la institución
> - **C)** Culpar al proveedor externo y no asumir responsabilidad institucional

> **Recomendación:** La opción B es la que transforma un problema regulatorio en una ventaja competitiva y de reputación.

---

## Apéndice: Glosario Financiero

| Término | Definición bajo Ley 21.719 |
|---------|----------------------------|
| **Historial crediticio** | Registro de comportamiento de pago y deudas (Art. 5-9) |
| **Scoring de riesgo** | Evaluación automatizada de capacidad de pago |
| **Datos sensibles finanzas** | Salud (seguros), orientación sexual (beneficiarios), datos biométricos |
| **RAT** | Registro de Actividades de Tratamiento (Art. 14) |
| **DPO financiero** | Delegado de Protección de Datos para instituciones financieras |
| **MFA** | Autenticación Multifactor (Art. 14 quinquies) |
| **Central de Riesgo** | Entidad que recopila historial crediticio (equivalente a Experian/Equifax) |
| **Brecha financiera** | Exposición no autorizada de datos de clientes bancarios |
| **Perfil de cliente** | Segmentación basada en comportamiento y datos personales |

---

*Historia 1 - Industria Finanzas - Ley 21.719*
*Compatible con: Web financiera ley21719-cl, CMF, APDP, SENCE*
*Duración estimada de narración: 70 minutos*
*Nivel: Mediante - Gerentes y ejecutivos bancarios*

---

## Checklist de Compleción

- [ ] Fase 1: Investigación legal completada
- [ ] Fase 2: Guion narrativo creado
- [ ] Fase 3: Prompts de imagen/video definidos
- [ ] Fase 4: Simulador y quizzes JSON creados
- [ ] Fase 5: Revisión legal finalizada
- [ ] Fase 6: Integración en carpeta del proyecto