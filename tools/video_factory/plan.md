# Plan — Video Módulo Empresa · Ley 21.719

> **Tipo**: Concept explainer (diapositivas animadas + narración estilo Video Overview de NotebookLM)
> **Stack validado**: MoviePy 2.1.2 + Pillow + FFmpeg (Manim no compilaba sin root)
> **Resolución piloto**: 1280×720 @ 30 fps (preview); escalable a 1920×1080 cuando validemos el estilo
> **Duración objetivo**: ~3:30 – 4:30 min
> **Audiencia**: Responsables de datos en empresas (dueños de PYME, DPO, abogados corporativos)
> **Tema**: Obligaciones de la Ley 21.719 para empresas — qué DEBE hacer una empresa antes del 1 de diciembre de 2026

---

## 🎯 Concepto pedagógico (el "aha moment")

**Misconception típica**: "La Ley 21.719 es como la 19.628, sólo un poco más estricta."

**Aha moment que debe dejar el video**: La Ley 21.719 invierte la carga — **la empresa debe DEMOSTRAR cumplimiento** (responsabilidad proactiva, Art. 49), no esperar a que la Agencia se lo exija. Si no puedes probar que hiciste la EIPD, el DPO, el registro de transferencias, **la multa te la aplican igual aunque no haya pasado nada**.

**Pregunta conductora del video**: *"¿Puede tu empresa demostrar HOY que cumple la Ley 21.719?"*

---

## 🎨 Identidad visual

| Elemento | Valor | Uso |
|---|---|---|
| Fondo | `#1C1C1C` (gris oscuro casi negro) | Todas las escenas — coherencia premium |
| Acento primario | `#58C4DD` (azul cian) | Títulos, números de artículo, palabras clave |
| Acento secundario | `#83C167` (verde) | OK / cumplido / habilitado |
| Advertencia | `#FF6B6B` (rojo cálido) | Riesgos, sanciones, brechas |
| Highlight | `#FFD93D` (amarillo) | Datos que requieren atención, cifras |
| Texto cuerpo | `#EAEAEA` | Párrafos normales |
| Texto muted | `#888888` | Etiquetas secundarias, subtítulos |
| Fuente títulos | **DejaVu Sans Bold** (sans, ya instalada) | Título, headings |
| Fuente cuerpo | **DejaVu Sans** | Texto |
| Fuente mono | **DejaVu Sans Mono** | Artículos, referencias legales |
| Fuente números | **DejaVu Sans Bold** | Cifras, UTM, plazos |

**Reglas de opacidad**:
- Títulos: 1.0
- Texto explicativo: 1.0
- Etiquetas de soporte: 0.7
- Decoración/fondos secundarios: 0.3
- Líneas de referencia: 0.15

---

## 📐 Estructura de slides (escenas)

| # | Nombre | Duración | Qué muestra |
|---|---|---|---|
| 1 | **HOOK** | 8s | Frase provocadora "¿Puede tu empresa demostrar HOY que cumple la Ley 21.719?" + reloj cuenta atrás al 1-dic-2026 |
| 2 | **CONTEXTO** | 12s | Línea de tiempo: Ley 19.628 → Ley 21.719 → vigencia plena 1-dic-2026. Icono "antes vs después" |
| 3 | **PRINCIPIO CAMBIO** | 15s | El cambio clave: de "cumplir si te pillan" → "demostrar que cumples". Animación: candado cerrándose vs clipboard con check |
| 4 | **PRÁCTICA 1 — DPO** | 18s | Designar delegado de protección de datos. Art. 50 (voluntario) + Art. 49 (modelo prevención). Visual: organigrama con DPO destacado |
| 5 | **PRÁCTICA 2 — SEGURIDAD** | 18s | Medidas técnicas y organizativas. Art. 14 bis y 14 quinquies. Visual: escudo con capas |
| 6 | **PRÁCTICA 3 — EIPD** | 18s | Evaluación de impacto cuando hay alto riesgo. Art. 15 ter. Visual: embudo "datos → riesgo → decisión" |
| 7 | **PRÁCTICA 4 — TRANSFERENCIAS** | 22s | Transferencias internacionales. Art. 27 — sin esto es ilegal. Visual: mapa con flechas y candados |
| 8 | **SANCIONES** | 22s | Multas: 5.000 UTM mínimo hasta 2-4% ingresos (Art. 35, 37). Visual: barra de UTM, casos ejemplo |
| 9 | **PLAZOS** | 18s | 30 días respuesta titulares (Art. 11) + "sin dilaciones indebidas" para brechas (Art. 14 sexies). Visual: dos cronómetros |
| 10 | **CASO PRÁCTICO** | 35s | Caso "Brecha en base de 500 clientes" — paso a paso con los 4 requisitos del Art. 14 sexies |
| 11 | **CASO TRANSFERENCIA** | 30s | Caso "SaaS en EE.UU." — las 4 opciones del Art. 27 y por qué ninguna sin mecanismo = ilegal |
| 12 | **CHECKLIST FINAL** | 20s | Las 6 acciones clave aparecen una a una con check verde |
| 13 | **CIERRE + CTA** | 12s | "Esta ley ya no es opcional" + recordatorio fecha 1-dic-2026 + CTA al curso |

**Total**: ~248 segundos ≈ 4:08 min

---

## 🎙️ Narración (guion, NO es copy del slide)

> Texto para TTS edge. Ritmo pausado y profesional. Cada bloque numerado va en la escena del mismo número.

1. "¿Puede tu empresa demostrar HOY que cumple la Ley 21.719? Si la respuesta es no, tienes hasta el primero de diciembre de 2026 para reaccionar."

2. "La Ley 19.628 quedó atrás. La nueva Ley 21.719 es un cambio de paradigma. Entra en vigencia plena el primero de diciembre de 2026, y desde ese día la Agencia de Protección de Datos Personales va a fiscalizar."

3. "El cambio clave: antes esperabas a que te pillaran. Hoy tienes que demostrar que cumples. Es responsabilidad proactiva. Eso lo dice el Artículo 49."

4. "Primera obligación: designar un delegado de protección de datos. El Artículo 50 lo permite de forma voluntaria. El Artículo 49 exige un modelo de prevención de infracciones. Si tienes datos sensibles o alto volumen, el DPO ya no es opcional."

5. "Segunda: medidas de seguridad. Artículos 14 bis y 14 quinquies. No es solo un antivirus. Son controles técnicos y organizativos proporcionales al riesgo."

6. "Tercera: evaluación de impacto, la EIPD. Artículo 15 ter. Obligatoria cuando el tratamiento sea probablemente de alto riesgo. Sin EIPD, no hay tratamiento legal."

7. "Cuarta: transferencias internacionales. Artículo 27. Sin cláusulas contractuales, sin consentimiento expreso, sin país con adecuación, la transferencia a Estados Unidos hoy es ilegal."

8. "Las sanciones duelen. Desde cinco mil UTM, hasta dos a cuatro por ciento de los ingresos anuales. Artículos 35 y 37. No es un costo menor."

9. "Los plazos también importan. Treinta días corridos, prorrogables una vez, para responder al titular. Artículo 11. Y notificación sin dilaciones indebidas para brechas. Artículo 14 sexies."

10. "Caso real. Una empresa sufre una brecha con quinientos clientes. ¿Qué hacer? Primero, registrar la vulneración. Segundo, notificar a la Agencia sin dilaciones. Tercero, comunicar a cada titular afectado. Cuarto, adoptar medidas correctivas en sesenta días."

11. "Otro caso. Quieres mover datos a un proveedor SAA S en Estados Unidos. ¿Opciones? Primero, consentimiento expreso del titular. Segundo, cláusulas contractuales vinculantes. Tercero, esperar a que Estados Unidos tenga adecuación. Hoy no la tiene. Cuarta: no hacer nada. La cuarta opción te convierte en infractor. Artículo 27 y 28."

12. "Tu checklist de implementación. Verificar si requieres un DPO de forma obligatoria. Implementar el proceso de EIPD. Actualizar contratos con terceros. Mecanismos de consentimiento explícito. Auditoría de seguridad. Y procedimiento interno para notificación de brechas."

13. "Esta ley ya no es opcional. La fecha clave ya está escrita: primero de diciembre de 2026. Empieza hoy. Te vemos en el siguiente módulo del curso."

---

## 🎬 Animaciones — patrones a repetir

| Patrón | Uso | Detalle |
|---|---|---|
| **Fade-in + scale up** | Títulos | de 0.85 a 1.0 en 0.4s, opacidad 0→1 |
| **Slide-in desde izquierda** | Bullets | `x: -100% → 0` en 0.5s |
| **Pulse en números clave** | UTM, plazos, artículos | scale 1.0 → 1.15 → 1.0 en 0.6s |
| **Draw line** | Conectores en diagramas | trazo 0→1 en 1.0s |
| **Highlight box** | Around key terms | rectángulo amarillo fade-in 0.3s |
| **Count up** | Cronómetros y plazos | número incrementa de 0 al valor en 1.5s |
| **Cierre del bloque** | Salida limpia | FadeOut de todo el grupo en 0.5s + 0.3s wait |

---

## 📤 Entregables del piloto

| Archivo | Contenido |
|---|---|
| `out/ley21719-empresa-preview.mp4` | Video preview 480p (rápido de revisar) |
| `out/ley21719-empresa-hd.mp4` | Video final 720p con audio + subtítulos quemados |
| `out/audio/track.mp3` | Narración TTS por bloques |
| `out/subs.ass` | Subtítulos sincronizados |
| `out/scripts/blocks.json` | Bloques narrados con timestamps y legalRef |

---

## ⚠️ Trazabilidad legal (Regla 0)

Cada afirmación jurídica del guion lleva `legalRef` en `blocks.json`. El especialista valida antes de publicar.

| Bloque | Cita legal |
|---|---|
| 1 | Vigencia plena: 1 dic 2026 (Ley 21.719, disposiciones transitorias) |
| 2 | Comparativa 19.628 → 21.719 |
| 3 | Art. 49 — modelo de prevención |
| 4 | Art. 50 (DPO voluntario) + Art. 49 (prevención) |
| 5 | Art. 14 bis y 14 quinquies (seguridad) |
| 6 | Art. 15 ter (EIPD) |
| 7 | Art. 27 (transferencias) |
| 8 | Art. 35 y 37 (sanciones, UTM, %) |
| 9 | Art. 11 (30 días) + Art. 14 sexies (brechas) |
| 10 | Art. 14 sexies (procedimiento breach) |
| 11 | Art. 27 y 28 (transferencias ilegales) |
| 12 | Checklist operativo |
| 13 | Cierre |