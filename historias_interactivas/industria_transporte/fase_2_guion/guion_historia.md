# Fase 2: Guión Transporte

## Historia Interactiva: "El Viaje Inesperado"

### Protagonista

**Felipe Santander**, 44 años, Gerente General de "TransRuta SpA", empresa de transporte interregional con 3.500 pasajeros diarios, 180 buses, 320 conductores. 22 años en la industria, oriundo de Rancagua, lideró la expansión digital de la empresa.

### Título

**"El Viaje Inesperado"**

### Objetivo Pedagógico

Enseñar a profesionales de transporte:
- Cómo gestionar datos de pasajeros y conductores bajo Ley 21.719
- Los protocolos para geolocalización continua y consentimiento
- La importancia de RAT en sistemas de tracking
- Cómo proceder ante breach de datos de viaje
- Cuándo designar DPO en empresas de transporte

### Estructura de los 7 Capítulos

#### Capítulo 1: El Bus Inteligente

**Duración:** 8 minutos
**Escenario:** Implementación de sistema de tracking GPS + WiFi gratuito en 180 buses. El sistema recopila: ubicación continua de cada pasajero conectado, datos de viaje, perfil de uso, datos biométricos (huella para abordar con tarjeta).
**Punto clave:** 200.000 pasajeros mensuales son geolocalizados sin consentimiento explícito individual.
**Elementos legales:** Art. 16 (datos sensibles biométricos), Art. 14 (RAT), Art. 50 (DPO obligatorio con 50K+ usuarios).
**Decisión interactiva:** ¿Cómo lanza Felipe el sistema?

> - **A)** Lanzar como "mejora del servicio" sin consentimiento
> - **B)** Lanzar con consentimiento explícito + opt-out
> - **C)** Suspender hasta tener EIPD completa

#### Capítulo 2: La Denuncia

**Duración:** 10 minutos
**Escenario:** Un pasajero abogado (Carolina Vidal) publica en redes: "TransRuta sabe dónde estoy cada segundo. Nadie me preguntó."
**Elementos:** Art. 7-8 (derechos ARCO), Art. 16 (consentimiento), Ley 21.553 (transporte).
**Decisión interactiva:** ¿Qué hace Felipe?

> - **A)** Negar y defender "es por seguridad vial"
> - **B)** Auditar el sistema y suspender tracking
> - **C)** Ofrecer opción de exclusión masiva

#### Capítulo 3: El Consultor

**Duración:** 15 minutos
**Escenario:** Felipe contacta a consultora legal. Revisa tracking, datos biométricos, RAT, DPO.
**Diálogo clave:** "Felipe, el tracking continuo de pasajeros sin consentimiento es ilegal bajo Art. 16. Y el sistema de huella biométrica para abordar requiere EIPD individual."

#### Capítulo 4: La Brecha

**Duración:** 12 minutos
**Escenario:** Un atacante accede a la base de datos de tracking de 80.000 pasajeros. Datos: nombres, RUT, ubicaciones continuas de 6 meses, datos de pago, perfiles de viaje.
**Elementos:** Art. 14 quinquies, 14 sexies, 15 ter.
**Simulación:** Felipe debe: 1) Notificar APDP en 72h, 2) Comunicar a 80.000 afectados, 3) Corregir sistema.

#### Capítulo 5: La Fiscalización

**Duración:** 10 minutos
**Escenario:** Oficial APDP audita TransRuta.

**Hallazgos:** RAT desactualizado, tracking sin consentimiento, sin DPO, sin EIPD para IA de ruteo, breach no notificado.
**Decisión interactiva:** ¿Cooperar totalmente?

#### Capítulo 6: La Multa

| Infracción | UTM |
|------------|-----|
| RAT desactualizado | 50 |
| Tracking sin consentimiento | 300 |
| Breach sin notificar 72h | 1.000 |
| Sin DPO | 200 |
| Sin EIPD ruteo IA | 200 |
| **TOTAL** | **1.750** |

**Atenuantes:** Primera -20%, colaboración -15%, implementación rápida -25%, sector transporte crítico -10% = **~721 UTM** (~$48M CLP).

#### Capítulo 7: La Transformación

Felipe implementa:
1. RAT completo (45 tratamientos)
2. Consentimiento granular por uso (tracking, marketing, etc.)
3. EIPD para IA de ruteo
4. DPO (abogado + tech)
5. Cifrado AES-256
6. Portal ARCO para pasajeros
7. Sello APDP-MTT

**Cierre:** "Un pasajero que confía es un pasajero que vuelve. La confianza no se gana con tracking obligatorio."

### Decisión Final del Usuario

> **A)** Lanzar tracking como "mejora del servicio"
> **B)** Lanzar con consentimiento y opt-out
> **C)** Suspender hasta cumplir la ley

**Recomendación:** C es la única legal. B es aceptable con matices.

### Checklist de Compleción

- [ ] Fase 1: Investigación legal completada
- [ ] Fase 2: Guion narrativo creado
- [ ] Fase 3: Prompts de imagen/video definidos
- [ ] Fase 4: Simulador y quizzes JSON creados
- [ ] Fase 5: Revisión legal finalizada
- [ ] Fase 6: Integración en carpeta del proyecto
