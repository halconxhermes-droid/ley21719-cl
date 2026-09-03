# Historias Interactivas - Ley 21.719 Chile

Paquete completo de 3 historias interactivas para ensenar la Ley 21.719 de Proteccion de Datos Personales de Chile de forma entretenida y efectiva.

## Contenido del Paquete

| Historia | Protagonista | Foco Educativo | Archivos |
|----------|--------------|----------------|----------|
| 1. PYME Adaptacion | Maria (Panadera) | Cumplimiento empresarial | 5 archivos |
| 2. Ciudadano Derechos | Carlos (Fotografo) | Derechos ARCO | 5 archivos |
| 3. Agente APDP | Sofia (Fiscalizadora) | Sanciones y fiscalizacion | 5 archivos |

**Total: 17 archivos + 2 resumenes + este README = 20 archivos**

## Estructura de Cada Historia

```
historia_N/
├── guion_detallado.md          # Narrativa y estructura narrativa
├── prompts_imagenes/
│   └── escenas.md              # Prompts para generar 4 imagenes
├── prompts_videos/
│   └── videos.md               # Prompts para generar 2 videos
└── elementos_interactivos/
    ├── decisiones_clave.json   # Decisiones que afectan el progreso
    ├── quiz_interactivo.json   # Evaluacion formativa
    ├── simulador_reclamo.json  # Paso a paso del ciudadano
    ├── arbol_decision.json     # Guia interactiva
    ├── caso_practico.json      # Escenario para fiscalizadores
    └── simulador_multas.json   # Calculo de sanciones en UTM
```

## Como Usar

### Paso 1: Generar las Imagenes
Los prompts estan optimizados para Midjourney v6.0. Tambien funcionan en:
- DALL-E 3
- Stable Diffusion XL
- Leonardo AI / Ideogram
- Adobe Firefly

### Paso 2: Generar los Videos
Los prompts funcionan en:
- Runway ML Gen-3 Alpha
- Pika Labs
- Luma AI Dream Machine
- Kling AI
- O herramientas de motion graphics (After Effects, Blender)

### Paso 3: Implementar la Interactividad
Los JSON pueden convertirse a componentes:
- React (TypeScript) - Recomendado para tu proyecto
- Vue 3
- H5P (compatible Moodle/SENCE)
- Alpine.js / HTMX para version ligera

### Paso 4: Integrar en la Plataforma
Las historias se integran como modulos adicionales en:
- ley21719-cl.netlify.app
- Backend FastAPI ya existente
- Posibilidad de modulo SENCE para certificacion

## Archivos de Resumen

- `RESUMEN_CORREO.md` - Resumen ejecutivo en Markdown
- `RESUMEN_CORREO.emt` - Archivo de email (formato texto) listo para enviar

## Informacion Legal

Todas las historias se basan en el texto oficial de la Ley 21.719:
- Publicada: 13 de diciembre de 2024
- Vigencia plena: 1 de diciembre de 2026
- Reemplaza: Ley 19.628
- Crea: Agencia de Proteccion de Datos Personales

Articulos clave cubiertos:
- Art. 3-9: Principios y derechos ARCO
- Art. 11-16: Tratamiento y consentimiento
- Art. 14 bis-quinquies: Obligaciones del responsable
- Art. 14 sexies: Notificacion de brechas
- Art. 15 ter: EIPD
- Art. 31-38: Fiscalizacion y sanciones
- Art. 49-50: Atenuantes y DPO

---
*Proyecto: ley21719-cl - Plataforma educativa Ley 21.719*
*Fecha: Septiembre 2026*
*Compatible con stack React 19 + FastAPI + Python*