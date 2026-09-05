# Historia Completa - Industria Energía: "El Vatio Inesperado"

---

## Introducción

**Protagonista:** Luis Ignacio "Lucho" Ferrada, 48 años, Subgerente de Tecnología y Datos en EnerSur SpA, una distribuidora eléctrica que cubre la zona centro-sur de Chile con 1.200.000 clientes y 600.000 medidores inteligentes instalados.

**Organización:** EnerSur SpA — empresa de distribución eléctrica con 18 años de operación, 850 empleados, ingresos anuales de $180.000 millones CLP.

**Contexto:** EnerSur completó en 2024 el despliegue de 600.000 medidores inteligentes en hogares de la zona centro-sur. El proyecto, valorado en $12.000 millones CLP, prometió a la Superintendencia de Electricidad y Combustibles (SEC) eficiencia operativa y mejor servicio. Pero la promesa vino con un problema que nadie anticipó: los datos de consumo horario no solo medían watts, sino que revelaban hábitos, presencias y hasta estados de salud.

---

## Capítulo 1: La Herencia Invisible

Lucho Ferrada llevaba treinta minutos caminando por los pasillos de EnerSur cuando se detuvo frente al mural de la empresa. Ahí estaban ellos: los 600.000 medidores inteligentes desplegados el año anterior, representados como pequeños íconos brillantes en un mapa satelital de Chile. Lucho era nuevo en el cargo de Subgerente de Tecnología y Datos, pero no nuevo en la empresa. Después de dieciocho años como ingeniero de proyectos, conocía cada rincón de EnerSur.

El llamado llegó en marzo, cuando el以前的 Subgerente se jubiló después de una carrera de treinta años. La directiva necesitaba a alguien que entendiera tanto la tecnología como la operación. Lucho encajaba. Lo que no sabía era lo que encontraría en su primer día de trabajo real.

El informe de la Dirección de Tecnología era grueso, profesional, lleno de gráficos de barras y líneas de tendencia. "Despliegue de Smart Meters: 100% completado", decía el resumen ejecutivo. "Eficiencia operativa: +18%". "Satisfacción del cliente: 4.2/5". Todo parecía en orden.

Fue en la tercera semana cuando el ingeniero junior, Bastián Quezada, se acercó a su oficina con una expresión que Lucho reconoció inmediatamente: la de alguien que había encontrado algo que no debería existir.

"Subgerente, necesito mostrarle algo", dijo Bastián, cerrando la puerta tras de sí. "Encontré esto en el servidor de analytics."

Lo que vio en la pantalla de Lucho lo cambió todo. Era una base de datos llamada "segmentacion_comercial" con campos que incluían: rut_cliente, consumo_2024_enero, consumo_2024_febrero, consumo_promedio_15min, presencia_estimada_noche, presencia_estimada_finde, indice_habitos_saludables, score_psicografico.

"¿Quién autorizó esto?", preguntó Lucho.

"El jefe de marketing", respondió Bastián. "Dice que la SEC lo pidió para 'mejora de servicio'."

Lucho no dijo nada. Tomó el pendrive que Bastián le extendió y se fue a caminar por el estacionamiento.

---

## Capítulo 2: El Reporte que No Debía Existir

Esa noche, Lucho durmió cuatro horas. No era la primera vez que veía datos de clientes siendo usados para fines no autorizados — en sus años en EnerSur había presionado varias veces sobre el uso de la base de datos de clientes para marketing directo. Pero esto era diferente. Los medidores inteligentes no solo medían consumo: medían vidas.

El consumo eléctrico doméstico a resolución de quince minutos permitía inferir cosas que un cliente nunca autorizó compartir. Si alguien usaba un ventilador toda la noche en verano, eso aparecía en los datos. Si un anciano vivía solo porque el consumo de la mañana era mínimo, eso aparecía también. Si una familia tenía un miembro con problemas respiratorios que usaba un CPAP, la huella del dispositivo era visible en el consumo nocturno.

Lucho pasó los siguientes días reconstruyendo la historia. En 2023, cuando el despliegue de smart meters estaba en su punto máximo, el Departamento de Marketing contrató a una consultancy externa para "optimizar la segmentación comercial". La consultoria, dirigida por un consultor junior llamado Andrés Muñoz, pidió acceso a los datos de consumo histórico. El entonces Subgerente de Tecnología — ahora jubilado — autorizó la extracción sin verificar el propósito ni el marco legal.

Andrés Muñoz usó los datos para construir perfiles psicográficos que luego vendió a tres empresas de retail y una aseguradora de salud. El precio de venta: $180 millones CLP. Cuando EnerSur descubrió el negocio, Muñoz ya había dejado la consultancy y la empresa matriz se disolvió.

El breach afectaba a 80.000 clientes cuyos perfiles de consumo incluían las variables más sensibles.

---

## Capítulo 3: La Llamada que lo Cambió Todo

Un martes a las 9:47 de la mañana, el teléfono de Lucho vibró. Era Cristóbal Reyes, periodista de CIPER Chile, conocido por destapar casos de corrupción institucional. "Ingeniero Ferrada, ¿puede comentarme sobre los 80.000 perfiles de consumo que su empresa vendió a empresas de retail?"

Lucho sintió que el suelo se movía. No era una llamada de la SEC, era peor: era un periodista que sabía más de lo que debería.

"¿Dónde obtuvo esa información?", preguntó Lucho.

"Fuentes públicas, ingeniero. Y también tengo el documento de la consultoría que detalla la venta."

Lucho colgó y se sentó. Por un momento pensó en la opción más fácil: negar, diluir, esperar que pasara. En Chile, los casos de protección de datos solían morir en la burocracia. Las multas existían, pero los procesos duraban años.

Pero entonces recordó algo que le dijo su padre cuando era niño: "El watt que ahorras en silencio lo pagas con intereses después."

Llamó a María González, consultora de protección de datos personales que había conocido en un seminario de la APDP dos años antes. María atiende desde su oficina en Providencia, un espacio pequeño lleno de libros de derecho y posters de regulaciones europeas. Cuando Lucho le contó la situación, María no se inmutó. Había escuchado versiones de esta historia antes.

"Lucho, esto es un Art. 14 sexies en toda regla", dijo María, sentándose en su silla giratoria. "Ochenta mil clientes, breach por consultor subcontratado, y lo más grave: los datos no estaban encriptados."

"¿Cuánto es la multa?", preguntó Lucho.

María abrió una tabla en su computador. "Depende de muchos factores. Pero mirando lo que me cuentas: RAT desactualizado, breach sin notificar, sin consentimiento, sin DPO, sin EIPD. Estamos hablando de un mínimo de 1.650 UTM en multas base, unos $110 millones de pesos."

Lucho sintió el peso de cada utm.

---

## Capítulo 4: Los Setenta y Dos Horas

María le dio un plazo: seventy-two hours. Eso era lo que tenían para notificar a la Agencia de Protección de Datos Personales bajo el Art. 14 sexies de la Ley 21.719.

"No notificar agravó la infracción", dijo María por teléfono. "Pero notificar ahora, antes de que sea público, demuestra buena fe. El Art. 49 te da atenuantes por colaboración."

Esa noche, Lucho no fue a casa. Se quedó en la oficina de EnerSur con María, un abogado interno, y el equipo de seguridad informática. Juntos redactaron la notificación a la APDP.

La notificación debía incluir: naturaleza del breach, datos comprometidos, número de afectados, consecuencias potenciales, y medidas adoptadas. Lucho leyó cada línea tres veces antes de enviar.

A las 11:58 PM, presionó "enviar".

Cuarenta y siete minutos después, llegó el acuse de recibo de la APDP. "Notificación recibida. Número de caso: APDP-2026-EN-04712. Se asignará fiscalizador en 5 días hábiles."

Lucho se reclinó en su silla. "Ahora qué", preguntó.

"Ahí empieza el trabajo real", respondió María.

---

## Capítulo 5: El Oficial que No Sonreía

El oficial de la APDP llegó dos semanas después. Se llamaba Rodrigo Vega, treinta y cinco años, mirada analítica, carpeta bajo el brazo. No sonreía, pero tampoco era hostil. Era la neutralidad hecha persona.

El proceso de auditoría duró cuatro días. Rodrigo revisó el RAT — que resultó ser un documento de 2023 que no mencionaba los medidores inteligentes ni los tratamientos de segmentación comercial. Revisó los controles de acceso — que permitieron que un consultor externo exportara 80.000 registros sin supervisión. Revisó la encriptación — que no existía para los datos en tránsito entre los medidores y el servidor central.

"¿Cuándo se designó el Delegado de Protección de Datos?", preguntó Rodrigo.

"No tenemos DPO", respondió la Gerente Legal de EnerSur, Francisca Muñoz. "No creímos que fuera necesario."

Rodrigo escribió algo en su carpeta. No dijo nada.

La reunión final fue en la sala de directorio de EnerSur, con la presencia del Gerente General, la Gerente Legal, Lucho, y María como asesora externa. Rodrigo presentó sus hallazgos con la precisión de alguien que había hecho esto demasiadas veces.

Hallazgos: RAT inexistente, breach no notificado en plazo, datos sin encriptación, ausencia de DPO, consentimiento viciado para tratamiento comercial.

Puntaje de cumplimiento: 0 de 6 obligaciones verificadas.

---

## Capítulo 6: La Matemática de la Culpa

La multa base era de 1.650 UTM, aproximadamente $110 millones de pesos al tipo de cambio de 2026.

María había preparado una estrategia de defensa basada en atenuantes. Primera infracción — no habían tenido un caso anterior de protección de datos. Colaboración espontánea — habían notificado antes de que el caso se hiciera público. Implementación rápida — en las dos semanas transcurridas desde el breach habían contratado un DPO interim, encriptado los datos de consumo, y suspendido el uso comercial de perfiles.

Cuando María terminó de presentar los atenuantes, el Gerente General de EnerSur preguntó: "¿Cuál es el número final?"

Rodrigo revisó sus notas. "Con las cuatro atenuantes aplicables, la multa se reduce a aproximadamente 496 UTM, unos $33 millones de pesos."

El Gerente General asintió. Era menos de lo que habían temido, pero seguía siendo una cifra significativa. Más importante era lo que venía después.

"Tienen noventa días para corregir los hallazgos", dijo Rodrigo. "La APDP hará seguimiento."

---

## Capítulo 7: El Vatio que Quedó

Seis meses después, Lucho Ferrada presentaba el informe final a la APDP desde la misma sala de directorio donde había recibido la sanción. El DPO designado era ahora Patricia Ruiz, una abogado con un diplomado en protección de datos de la Universidad de Chile. El RAT había sido reconstruido desde cero, con 47 tratamientos documentados y sus respectivas bases legales. Los datos de consumo estaban encriptados con AES-256 en reposo y TLS 1.3 en tránsito. El portal de derechos ARCO para clientes estaba operativo desde septiembre.

El Sello APDP-SEC — la certificación que la SEC otorga a empresas eléctricas que demuestran cumplimiento en protección de datos — había sido aprobado en octubre, después de una auditoría externa independiente.

"¿Qué aprendimos?", preguntó la Gerente General en la reunión de cierre.

Lucho pensó su respuesta. "Que un medidor inteligente no solo mide watts. Mide cómo vive la gente. Y eso merece el mismo cuidado que el tendido eléctrico."

El Gerente General asintió. En la pantalla del proyector, el mapa satelital de Chile mostraba los 600.000 medidores inteligentes como pequeños puntos de luz. Pero ahora, cada punto llevaba una capa invisible de protección que antes no existía.

---

## Epílogo

> "Cuando llegamos a este caso, EnerSur tenía un problema de datos y un problema de cultura", dijo María González en una entrevista posterior. "La diferencia entre quienes se recuperan y quienes desaparecen no está en el tamaño de la multa. Está en si la organización entiende que la protección de datos no es un costo operacional — es un contrato de confianza con cada cliente."

Para Lucho Ferrada, la historia terminó de otra manera. Después de treinta años en el sector eléctrico, había aprendido algo que ningún manual de ingeniería enseñaba: que detrás de cada kilowatt hay una familia, y cada familia tiene derecho a que sus hábitos más íntimos permanezcan en la oscuridad.

---

## Lecciones Aprendidas

- **Art. 14 (RAT):** Todo tratamiento de datos personales debe estar registrado antes de iniciar. No se puede desplegar tecnología y registarla después.
- **Art. 14 quinquies (Seguridad):** Los datos de smart meters requieren encriptación desde el diseño, no como parche posterior.
- **Art. 14 sexies (Brechas):** Setenta y dos horas es poco tiempo. Tener un protocolo de breach ready es la única forma de cumplir.
- **Art. 15 ter (EIPD):** Todo despliegue masivo de tecnología que procesa datos sensibles necesita una evaluación de impacto antes de запуска.
- **Art. 16 (Consentimiento):** Consentimiento genérico no es consentimiento válido. La granularidad no es opcional.
- **Art. 50 (DPO):** El Delegado de Protección de Datos no es un lujo — es un requisito legal para monitoreo masivo.
- **Art. 49 (Atenuantes):** La buena fe se demuestra con acciones, no con intenciones. Notificar antes de ser públicos es la mejor estrategia.

---

*Historia Energía - Industria Energía - Ley 21.719*
*Compatible con: Web educativa ley21719-cl, Módulo SENCE*
*Duración estimada de narración: 68 minutos*
*Nivel: Avanzado - Profesionales del sector energía*
*Versión narrativa: Filial 2 + Filial 3, septiembre 2026*
