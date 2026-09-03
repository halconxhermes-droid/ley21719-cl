# Historias Interactivas - Ley 21.719 Chile

Paquete completo de 3 historias interactivas para enseñar la Ley 21.719 de Protección de Datos Personales de Chile de forma entretenida y efectiva.

## Contenido del Paquete

| Historia | Protagonista | Foco Educativo | Formato |
|----------|--------------|----------------|---------|
| 1. María y su Panadería Digital | María - Panadera | Cumplimiento PYME | 5 archivos |
| 2. El Caso de la Fotografía Perdida | Carlos - Fotógrafo | Derechos ARCO | 5 archivos |
| 3. Operación Cumplimiento Total | Sofía - Fiscalizadora | Sanciones y fiscalización | 5 archivos |

**Total: 22 archivos** (incluyendo README, resúmenes y 3 historias narrativas completas)

## Estructura de Cada Historia

```
historia_N/
├── historia_completa.md         # ✨ NARRATIVA COMPLETA (¡NUEVO!)
├── guion_detallado.md           # Estructura narrativa
├── prompts_imagenes/
│   └── escenas.md               # 4 prompts para generar imágenes
├── prompts_videos/
│   └── videos.md                # 2 prompts para generar videos
└── elementos_interactivos/
    ├── decisiones_clave.json    # Decisiones que afectan el progreso
    ├── quiz_interactivo.json    # Evaluación formativa
    ├── simulador_reclamo.json   # Paso a paso del ciudadano
    ├── arbol_decision.json      # Guía interactiva
    ├── caso_practico.json       # Escenario para fiscalizadores
    └── simulador_multas.json    # Cálculo de sanciones en UTM
```

## Las 3 Historias Completas

### 📖 Historia 1: María y su Panadería Digital
**Archivo:** `historia_1_pyme_adaptacion/historia_completa.md`

María es dueña de "Dulce Tradición", una panadería artesanal. Recibe una notificación de la Agencia de Protección de Datos Personales por una denuncia anónima. A través de 5 capítulos, María aprende:
- Qué es el registro de actividades de tratamiento
- Cómo implementar medidas de seguridad
- Cuándo es obligatorio designar un DPO
- Cómo hacer una EIPD
- Qué hacer ante una brecha de seguridad
- Cómo los atenuantes pueden reducir las sanciones

### 📖 Historia 2: El Caso de la Fotografía Perdida
**Archivo:** `historia_2_ciudadano_derechos/historia_completa.md`

Carlos es un fotógrafo de 28 años que descubre que su foto está siendo usada sin permiso para publicidad. A través de 5 capítulos, Carlos aprende:
- Cuáles son sus derechos ARCO (Acceso, Rectificación, Supresión, Oposición, Portabilidad)
- Cómo presentar una solicitud formal
- Qué pasa si la empresa no responde en 30 días
- Cuándo y cómo escalar a la APDP
- Cómo documentar evidencia de infracciones
- El proceso de denuncia formal

### 📖 Historia 3: Operación Cumplimiento Total
**Archivo:** `historia_3_agente_apd/historia_completa.md`

Sofía es oficial de fiscalización de la APDP. Recibe una denuncia anónima contra "EcoTienda SpA". A través de 5 capítulos, Sofía:
- Investiga una denuncia
- Realiza una auditoría presencial
- Detecta múltiples infracciones graves
- Calcula multas según gravedad y atenuantes
- Emite una resolución sancionatoria
- Verifica el cumplimiento de medidas correctivas

## Cobertura Legal Completa

| Artículo | Concepto | Historia |
|----------|----------|----------|
| Art. 3-4 | Principios y derechos del titular | 1, 2, 3 |
| Art. 5-9 | Derechos ARCO | 2 |
| Art. 11-12 | Procedimiento y consentimiento | 2 |
| Art. 14 | Obligaciones del responsable | 1, 3 |
| Art. 14 bis | Deber de secreto | 1, 3 |
| Art. 14 ter | Deber de información | 1, 3 |
| Art. 14 quinquies | Medidas de seguridad | 1, 3 |
| Art. 14 sexies | Notificación de brechas | 1, 3 |
| Art. 15 ter | EIPD | 1, 3 |
| Art. 16 | Datos sensibles | 1 |
| Art. 31-34 | Fiscalización | 3 |
| Art. 35 | Sanciones | 3 |
| Art. 36 | Procedimiento | 3 |
| Art. 38 | Prescripción | 3 |
| Art. 49 | Atenuantes y agravantes | 1, 3 |
| Art. 50 | DPO | 1, 3 |

## Cómo Usar

### Opción 1: Lectura Directa
Lee los archivos `historia_completa.md` de cada historia. Cada uno tiene 5 capítulos con decisiones interactivas, explicaciones legales, y simuladores embebidos.

### Opción 2: Generar Recursos Multimedia
Los prompts están optimizados para:
- **Imágenes:** Midjourney v6.0, DALL-E 3, Stable Diffusion XL
- **Videos:** Runway ML Gen-3, Pika Labs, Luma AI
- **Motion graphics:** After Effects, Blender, Vyond

### Opción 3: Implementar en Plataforma Web
Los JSON pueden convertirse a:
- Componentes React + TypeScript (stack actual del proyecto)
- Vue 3
- H5P (compatible Moodle/SENCE)
- Alpine.js / HTMX

## Datos Contextuales

- **Ley 21.719** publicada: 13 de diciembre de 2024
- **Vigencia plena:** 1 de diciembre de 2026
- **Reemplaza:** Ley 19.628
- **Crea:** Agencia de Protección de Datos Personales (APDP)
- **Multas máximas:** hasta 5.000 UTM (~$335 millones CLP)
- **Valor UTM 2026 (estimado):** ~$67.000 CLP

## Compatibilidad Técnica

- Stack actual: React 19 + TypeScript + Vite 6 + Tailwind 4 (frontend)
- Backend: FastAPI + Python 3.13 + SQLite/PostgreSQL
- Deploy: Netlify (frontend) + Fly.io (backend)
- Compatible con módulo SENCE para certificación

## Archivos de Resumen

- `RESUMEN_CORREO.md` - Resumen ejecutivo
- `RESUMEN_CORREO.emt` - Archivo de email (formato texto)
- `RELEASE_NOTES.md` - Notas de release
- `README.md` - Este archivo

---
*Proyecto: ley21719-cl - Plataforma educativa Ley 21.719*
*Fecha: Septiembre 2026*
*Versión: 1.0*
