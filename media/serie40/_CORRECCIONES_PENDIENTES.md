# 🔧 Correcciones pendientes — Serie 40 videos Ley 21.719

**Fecha:** 25-08-2026 · **Regla acordada:** los videos NO se editan en postproducción.
El dueño regenerará en Google Flow según esta lista. El resto queda tal cual.

---

## 🔴 Regenerar por texto corrupto (prioridad alta)

| # | Archivo | Problema detectado |
|---|---------|--------------------|
| 08 | `08-licitud-finalidad.mp4` | Formulario de consentimiento con texto inventado ("CONVENEAR", párrafos ilegibles) |
| 35 | `35-gravisimas-20000.mp4` | Lista bajo "INFRACCIÓN GRAVÍSIMA" con galimatías ("BX sruits", "agufici") |
| 30 | `30-acceso-rectificacion.mp4` | Campos del formulario corruptos: "Nueccion", "Prección", "Teamar" |
| 24 | `24-consentimiento-parental.mp4` | Texto de la banda amarilla ilegible (tema poco claro) |

## 🟡 Detalles menores (opcionales)

- **02** — Calendario con días en inglés (Th, Fr, Sa → deberían ser Lu, Ma, Mi, Ju, Vi, Sá)
- **38** — Dice "**BIEMETRIO**" (debería ser BIOMETRÍA); "POLITICAL OPINIONS" en inglés
- **13** — Ícono del diagrama con texto inventado "CONJUFRRY"
- **14** — Rótulos de UI en inglés (BLOCKED / BEST DEAL FREE OFFER)
- **31** — Panel completo en inglés (DATA PRIVACY SETTINGS, DELETE ACCOUNT, typo "petmanent")
- **17** — Etiqueta parcialmente tapada dice "BLOG" (debería ser BLOQUEO)
- **28 / 29** — Pantallas de sistema en inglés (CRITICAL BREACH / AUTOMATED SYSTEM) — pasan como UI técnica, opcional cambiar
- **16** — Ventana de navegador sin texto definido — verificar que se entienda "bloqueo temporal"

## ✅ Verificados OK (32 videos)

Escena coincide con el título del guion, voz en español, 10s, 16:9, sin errores graves.
Detalle completo en `_planilla_verificada.json`.

---

## 💡 Tips para regenerar en Flow (que el texto salga bien)

1. Pedir formularios/pantallas con **campos VACÍOS** (solo líneas grises de placeholder) y máximo 1-2 palabras reales
2. Usar palabras clave **cortas y sueltas**: "CONSENTIMIENTO", "BLOQUEADO" — la IA las escribe bien
3. **Evitar párrafos y listas dentro del video**: Flow inventa letras cuando el texto es largo — eso lo lleva la voz en off
