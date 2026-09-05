# Fase 2: Guion - Historia 1 - Industria Manufactura

## Historia Interactiva: "El Turno del Riesgo"

### Protagonista
**Andrés Cortés** — Supervisor de producción en una planta manufacturera metalmecánica con 350 empleados, 15 años de experiencia en la industria. Conocedor de los riesgos operacionales y la importancia de la seguridad de datos.

### Título
**"El Turno del Riesgo: Un viaje por la protección de datos en la manufactura"**

### Objetivo Pedagógico
Enseñar a supervisores, gerentes de planta y personal operativo:
- Cómo proteger los datos de trabajadores y operaciones bajo Ley 21.719
- Los riesgos de manejar datos en entornos industriales
- Los protocolos de notificación de brechas en el sector manufacturero
- Cómo ejercer los derechos ARCO para trabajadores (a través de representación sindical o directa)

### Estructura de los 7 Capítulos

---

#### **Capítulo 1: El Incidente**
**Duración:** 10 minutos
**Escenario:** Miércoles 11 de septiembre, 6:00 hrs. Andrés llega a la planta para el turno de mañana cuando el sistema de control de acceso falla.

**Evento desencadenante:** El sistema de huella dactilar para entrada de personal no reconoce ninguna huella. Los 350 empleados no pueden entrar.

**Hallazgos iniciales:**
1. El servidor de control de acceso se reinició inesperadamente durante la noche
2. No hay logs de quién intentó entrar en las últimas 24 horas
3. El sistema de respaldo también presenta fallos
4. El personal está acumulado afuera de la planta, preocupado

**El llamado:** El supervisor de TI informa que podría ser un ataque ransomware al sistema de control, o simplemente un fallo de software después de la actualización automática de anoche.

---

#### **Capítulo 2: La Reunión de Crisis**
**Duración:** 15 minutos
**Escenario:** Andrés reúne al comité de emergencia: Jefe de planta, supervisor de TI, supervisor de Recursos Humanos, representante sindical y el DPO (si está disponible).

**Elementos legales:**
- **Art. 14** — Registro de actividades de tratamiento
- **Art. 14 quinquies** — Medidas de seguridad obligatorias (cifrado, control de acceso)
- **Art. 14 sexies** — Notificación de brechas (72 horas)
- **Art. 5** — Derecho de acceso (trabajadores a sus propios datos)
- **Art. 7** — Derecho a supresión (al terminar relación laboral)
- **Art. 16 bis** — Datos de salud (lesiones laborales, evaluaciones)
- **Art. 16 ter** — Datos biométricos (huella dactilar para control de acceso)

**Decisión interactiva:**
> ¿Qué hace Andrés primero?

| Opción | Acción | Impacto Legal |
|--------|--------|---------------|
| **A)** Esperar a que el sistema TI resuelva el problema antes de notificar a nadie | ❌ Vence las 72 horas → multa automática si fue brecha |
| **B)** Notificar a la Autoridad (APDP) inmediatamente como brecha de seguridad | ✅ Cumplimiento estricto, pero genera inspección |
| **C)** Intentar reactivar el sistema manualmente durante 24 horas antes de notificar | ⚠️ Riesgo de exceder plazo si es una brecha confirmada |

> **Camino correcto: Opción B con matices.**
> Andrés notifica a la APDP a las 3 horas (dentro del plazo legal), informando la falla del sistema biométrico y los datos potencialmente afectados. Simultáneamente, activa protocolo de ingreso manual con registro en papel.

---

#### **Capítulo 3: La Investigación Técnica**
**Duración:** 20 minutos
**Escenario:** El equipo de TI y el DPO analizan los hallazgos. Descubren:

**Hallazgos técnicos críticos:**
1. El servidor de control de acceso **no tenía cifrado activo** (Art. 14 quinquies)
2. No existía **política de respaldo** con frecuencia definida y testeada
3. Los **logs de auditoría** no eran inmutables (podrían ser alterados)
4. El sistema biométrico tenía **acceso con permisos de administrador superiores** a los necesarios
5. No existía **segmentación de redes** entre el sistema de control y la red corporativa

**Hallazgos normativos:**
1. No existía **RAT** (Registro de Actividades de Tratamiento) formalizado para los 12 tratamientos identificados
2. El consentimiento para tratamiento de datos biométricos (huella dactilar) no estaba documentado
3. No había **designado DPO** (Art. 50), al tener 350 trabajadores (por debajo del umbral de 500, pero cercano)
4. La política de privacidad entregada a nuevos empleados no mencionaba el sistema biométrico
5. El tratamiento de datos de salud ocupacional (lesiones, evaluaciones) no tenía base legal documentada

**Diálogo clave:**
> "Andrés, este servidor no tiene cifrado. Si alguien accede físicamente o mediante un ataque, tendrían acceso directo a los datos de todos los trabajadores. Además, el sistema biométrico no tiene registro de quién accedió y cuándo. Esto es una violación potencial de la Ley 21.719 y del Código del Trabajo."

---

#### **Capítulo 3 (continuación): La Notificación**

Andrés decide notificar a la APDP y activar el protocolo de emergencia.

**Protocolos seguidos:**
1. **Notificación a la APDP:** A las 3 horas del incidente (dentro de las 72h legales)
2. **Comunicación interna:** A todo el personal sobre la falla del sistema y alternativa de ingreso
3. **Comunicación al sindicato:** Sobre el ejercicio de derechos ARCO en representación de los trabajadores

**Contenido de la notificación a personal:**
> *"Estimado equipo: El día [fecha], nuestro sistema de control de acceso biométrico presentó fallas técnicas. Como medida de precaución y cumplimiento a la normativa de protección de datos, activamos un protocolo de ingreso alternativo con registro en papel. Sus datos biométricos (huellas dactilares) no se vieron comprometidos, pero tomamos esta medida preventiva. Ejercen sus derechos ARCO escribiendo a [email]. Plazo legal: 30 días hábiles para respuesta."*

---

#### **Capítulo 5: La Auditoría Post-Incidente**

Dos meses después, la APDP realiza una fiscalización para verificar el cumplimiento.

**Hallazgos de la auditoría:**
- **Positivos:** Notificación dentro de las 72 horas, documentación del incidente, protocolo creado
- **Negativos:** Falta de cifrado en servidores, RAT incompleto, consentimiento biométrico no documentado, DPO no designado

**Acciones correctivas obligatorias:**
1. Cifrado completo en todos los sistemas de control de acceso (plazo: 30 días)
2. Implementación de RAT formal (Art. 14) — 12 tratamientos identificados
3. Designación de DPO (Art. 50) — evaluar si superar los 500 trabajadores próximamente
4. Actualización de políticas de privacidad y consentimiento para biométricos
5. Capacitación al personal operativo en protección de datos
6. Segmentación de redes entre sistemas operacionales y corporativos

**Sanciones aplicables:**
- Multa provisional: 300 UTM (~$10M CLP) por gravisima infracción
- Con atenuantes (notificación oportuna): reducida a 150 UTM
- Orden de corrección: plazo 60 días para todas las acciones correctivas

---

#### **Capítulo 6: La Certificación**

Seis meses después, la planta solicita y obtiene el **Sello de Cumplimiento en Privacidad Industrial**, otorgado por la APDP en convenio con el Ministerio de Salud y la Dirección del Trabajo.

**Criterios para obtener el sello:**
- RAT completado para todos los tratamientos manufactureros (Art. 14)
- Cifrado en todos los sistemas con datos de trabajadores (Art. 14 quinquies)
- DPO designado y operativo (Art. 50) — evaluar umbral de 500 trabajadores
- Protocolos de notificación de brechas 72h operativos (Art. 14 sexies)
- Capacitación al 100% del personal (mín. 4 hrs/año)
- Evaluación de impacto (Art. 15 ter) para sistemas biométricos y IIoT
- Terceros proveedores con convenios de tratamiento (Art. 28)

**Beneficios obtenidos:**
- Reducción prima de seguro industrial en 20%
- Mejora en relación con sindicatos y representación trabajadora
- Reconocimiento público por Ministerio de Salud y DT
- Menor riesgo de litigios laborales por exposición de datos
- Ventaja competitiva al licitar contratos con empresas exigentes
- Posibilidad de ofrecer seguros de protección de identidad a trabajadores

---

#### **Capítulo 7: La Lección Final**

Andrés presenta un informe al directorio de la empresa sobre el estado de protección de datos y los aprendizajes del incidente.

**Cierre empático:**
> "La protección de datos en la manufactura no es solo una obligación legal bajo la Ley 21.719 —es un acto de respeto a la dignidad de cada trabajador que opera nuestras máquinas y cuyas vidas están entrelazadas con nuestros sistemas. Cada dato que protegemos es una oportunidad para construir confianza con el equipo que hace posible nuestra producción. La seguridad de datos en la industria es responsabilidad de todos, desde el supervisor de planta hasta el gerente general, y debe integrarse en la cultura de seguridad desde el diseño".

### Decisión Final del Usuario

> **¿Qué habría hecho tú?**
> 
> - **A)** Enfocarse solo en reparar el sistema biométrico y no tocar el tema de privacidad
> - **B)** Usar el incidente como oportunidad paratransformar la protección de datos en toda la planta
> - **C)** Centrarse solo en el aspecto técnico y ignorar las implicancias legales

> **Recomendación:** La opción B es la que transforma un problema regulatorio en una ventaja competitiva y de relación con el equipo.

---

## Apéndice: Glosario Manufacturero

| Término | Definición bajo Ley 21.719 |
|---------|----------------------------|
| **Ficha del trabajador** | Documento con datos personales y laborales (Art. 5-9) |
| **DPO industrial** | Delegado de Protección de Datos para empresas manufactureras |
| **RAT** | Registro de Actividades de Tratamiento (Art. 14) |
| **Brecha manufacturera** | Exposición no autorizada de datos de trabajadores o operaciones |
| **IIoT** | Internet Industrial de las Cosas (sistemas conectados en planta) |
| **OT vs IT** | Operative Technology (fábrica) vs Information Technology (oficina) |
| **Consentimiento biométrico** | Debe ser explícito y por escrito (Art. 16 ter) |
| **Dato de salud ocupacional** | Lesiones, evaluaciones, condiciones médicas relacionadas al trabajo |

---

*Historia 1 - Industria Manufactura - Ley 21.719*
*Compatible con: Web manufactura ley21719-cl, Ministerio de Salud, DT, SENCE*
*Duración estimada de narración: 70 minutos*
*Nivel: Mediante - Supervisores y gerentes de planta*