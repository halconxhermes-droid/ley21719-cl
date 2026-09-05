# Fase 2: Guión Tecnológico - Industria Tecnológica

## Historia Interactiva: "El Algoritmo Invisible"

### Protagonista

**Diego Morales**, 35 años, CTO de "Nexo Fintech", startup con 50.000 usuarios en Chile que ofrece servicios de inversión automatizada. Diego combina formación en ingeniería informática con especialización en finanzas, y toma decisiones técnicas priorizando la experiencia del usuario, pero ahora enfrenta la nueva realidad regulatoria de la Ley 21.719.

### Título

**"El Algoritmo Invisible"**

### Objetivo Pedagógico

Enseñar a profesionales tecnológicos:
- Cómo diseñar sistemas que recopilan datos personales cumpliendo la Ley 21.719
- Los protocolos de consentimiento para recolección de datos en aplicaciones
- La importancia del Registro de Actividades de Tratamiento (RAT) en desarrollo de software
- Cómo proceder ante una brecha de seguridad en servicios en la nube
- Cuándo es obligatorio designar un DPO en startups tecnológicas

### Estructura de los 7 Capítulos

#### Capítulo 1: El Despliegue

**Duración:** 8 minutos
**Escenario:** Diego presente en el lanzamiento de "Nexo v2.0", la nueva versión de su plataforma de inversión. La gran novedad es el "motor de perfilado" que sugiere carteras personalizadas basándose en el comportamiento del usuario en la app.
**Punto clave:** El motor recopila datos que podrían considerarse sensibles: frecuencia de inicio de sesión, horarios de transacción, montos promedio, tipos de activos preferidos.
**Elementos legales:** Art. 16 (datos sensibles), Art. 16 bis (profilado), Art. 15 ter (EIPD necesario antes de lanzar motor de IA).
**Decisión interactiva:** ¿Qué hace Diego al presentar el lanzamiento?

> - **A)** Presentar el motor tal cual está, confiando en la confianza del usuario
> - **B)** Pausar el lanzamiento hasta completar EIPD y obtener consentimiento explícito
> - **C)** Presentar con opt-out visible, pero sin EIPD completa

#### Capítulo 2: El Informe

**Duración:** 10 minutos
**Escenario:** Un informe técnico interno alerta a Diego sobre los riesgos legales. Un desarrollador junior descubrió que el perfilado podría clasificar datos bajo Art. 16 bis. Diego debe decidir: ¿sigue o no?

**Elementos legales:** Art. 16, 16 bis, 15 ter, 50.
**Decisión interactiva:** ¿Qué hace Diego ante el informe?

> - **A)** Ignorarlo para no retrasar el lanzamiento (la opinión del mercado es impaciente)
> - **B)** Detener el motor de perfilado y crear un plan de cumplimiento
> - **C)** Continuar pero añadir una capa de anonimización

#### Capítulo 3: El Consultor Tecnológico

**Duración:** 15 minutos
**Escenario:** Diego contacta a una consultora tecnológica para evaluar cumplimiento. El consultor revisa el código, la base de datos, los logs, los terceros (AWS, SendGrid, Stripe).
**Temas abordados:** RAT, EIPD, consentimiento, DPO, perfiles de usuario, anonimización.
**Diálogo clave:** "Diego, tu perfilado está infiriendo hábitos de consumo. Eso es dato sensible. Art. 16 bis. Necesitas EIPD antes de seguir."

#### Capítulo 4: La Brecha

**Duración:** 12 minutos
**Escenario:** AWS notifica a Nexo Fintech sobre un posible acceso no autorizado a la base de datos de usuarios. 30.000 cuentas vieron sus datos expuestos en un bucket S3 sin cifrado.
**Elementos:** Art. 14 quinquies (medidas seguridad), Art. 14 sexies (notificación 72h), Art. 15 ter (revisar EIPD).
**Simulación:** Diego debe: 1) Determinar alcance exacto, 2) Notificar APDP, 2) Comunicar a usuarios afectados, 3) Corregir brecha técnica.

#### Capítulo 5: La Fiscalización

**Duración:** 10 minutos
**Escenario:** Llega oficial de la APDP. Revisa RAT, EIPD, logs, consentimientos. ¿Cumple Diego?

**Hallazgos:** Sin RAT actualizado, sin EIPD para perfilado, sin DPO, sin consentimiento explícito para datos sensibles, logs inadecuados.
**Decisión interactiva:** ¿Cooperar o impugnar?

> - **A)** Cooperar totalmente, designar DPO y corregir en 60 días
> - **B)** Impugnar la multa alegando "buena fe tecnológica"
> - **C)** Negar tener fallas

#### Capítulo 6: La Multa

Cálculo:
- Falta RAT: 50 UTM
- Sin EIPD: +200 UTM (Art. 15 ter)
- Sin DPO: +200 UTM (Art. 50)
- Breach sin notificar: +1.000 UTM (Art. 14 sexies)
- Consentimiento viciado: +100 UTM (Art. 16)
- **Total base:** 1.550 UTM (~$104M CLP)

**Atenuantes:** Primera -20%, colaboración -15%, medidas -25% = **~632 UTM** (~$42M CLP).

#### Capítulo 7: La Transformación

Diego rediseña Nexo:
1. RAT completo documentado (42 tratamientos)
2. EIPD aprobada para perfilado
3. Consentimiento explícito al registrar
4. DPO designado (abogado + tech lead)
5. Cifrado AES-256 + TLS 1.3
6. Portal ARCO para usuarios
7. Sello APDP-SEC en camino

**Cierre:** "La privacidad no es un obstáculo para la innovación. Es el límite que nos hace diseñar soluciones mejores. Más éticas, más sostenibles, más confiables."

### Decisión Final del Usuario

> **A)** Lanzar motor de perfilado tal cual
> **B)** Esperar EIPD y consentimiento antes
> **C)** Lanzar con opt-out y mínimo viable de cumplimiento

**Recomendación:** B.

### Checklist de Compleción

- [ ] Fase 1: Investigación legal completada
- [ ] Fase 2: Guion narrativo creado
- [ ] Fase 3: Prompts de imagen/video definidos
- [ ] Fase 4: Simulador y quizzes JSON creados
- [ ] Fase 5: Revisión legal finalizada
- [ ] Fase 6: Integración en carpeta del proyecto
