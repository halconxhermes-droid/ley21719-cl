# Plan de imágenes explicativas — Curso Ley 21.719

## Objetivo
Crear imágenes explicativas en **español latino** con **formato unificado** (1920×1080, paleta oscura consistente, tipografía grande) que ilustren conceptos clave del curso y puedan usarse en:

1. **Videos del curso** — Slides adicionales que se pueden intercalar entre escenas.
2. **Material complementario** — PDFs, README, página web, posts sociales.
3. **Cheatsheets** — Resumen visual de los derechos ARCO+, checklist técnico, etc.

---

## Formato unificado (aplicado a TODAS las imágenes)

| Atributo | Valor |
|---|---|
| Resolución | **1920 × 1080 px** (Full HD 16:9) |
|Color de fondo | `#0F172A` (azul oscuro) |
|Color de acento | `#3B82F6` (azul brillante) |
|Color secundario | `#F59E0B` (ámbar — alerta) |
|Color de éxito | `#10B981` (verde) |
|Color de texto principal | `#F1F5F9` (blanco hueso) |
|Color de texto secundario | `#94A3B8` (gris claro) |
|Familia tipográfica | `Inter` (sans-serif) |
|Título | 96 px, peso 700 |
|Subtítulo | 48 px, peso 500 |
|Cuerpo | 36 px, peso 400 |
|Padding interno | 100 px |
|Border-radius (tarjetas) | 24 px |

---

## Imágenes a crear

### Módulo `ciudadano` — Derechos del titular

| # | Archivo | Concepto | Dónde se usará |
|---|---|---|---|
| C1 | `ciudadano_derechos_arco.png` | Los 6 derechos ARCO+ en tarjetas visuales | Slide adicional en escena `03_derechos_arco` y como resumen del módulo |
| C2 | `ciudadano_plazo_30_dias.png` | Línea de tiempo de 30 días corridos para respuesta | Slide adicional en escenas `04_acceso` y `12_agencia` |
| C3 | `ciudadano_flujo_reclamacion.png` | Diagrama de flujo: titular → empresa → Agencia | Material complementario (PDF) y escena `12_agencia` |
| C4 | `ciudadano_datos_sensibles.png` | Lista de datos sensibles con íconos | Escena `09_datos_sensibles` |

### Módulo `desarrollador` — Implementación técnica

| # | Archivo | Concepto | Dónde se usará |
|---|---|---|---|
| D1 | `desarrollador_arquitectura_capas.png` | Diagrama de las 5 capas de arquitectura recomendadas | Escena `11_arquitectura` (slide intermedio) y como diagrama clave del módulo |
| D2 | `desarrollador_endpoints_arco.png` | Tabla de endpoints HTTP para derechos ARCO+ | Escena `07_arco_endpoints` y como referencia rápida |
| D3 | `desarrollador_flujo_brecha.png` | Línea de tiempo del plan de respuesta a brechas (4 fases) | Escena `09_brechas` |
| D4 | `desarrollador_checklist_tecnico.png` | Checklist visual con los 7 requisitos técnicos | Escena `12_checklist_tecnico` (sustituye el texto plano) |

### Módulo `institucion` — Sector público

| # | Archivo | Concepto | Dónde se usará |
|---|---|---|---|
| I1 | `institucion_marco_juridico.png` | Pirámide de normativa aplicable (Constitución → Ley 21.719 → Ley 18.575) | Escena `03_marco_juridico` |
| I2 | `institucion_responsable.png` | Quién es el responsable en cada tipo de organismo (municipalidad, ministerio, universidad) | Escena `04_responsable` |
| I3 | `institucion_periodo_transitorio.png` | Cuenta regresiva: 60 días antes del 1 dic 2026 | Escena `06_periodo_transitorio` |
| I4 | `institucion_obligaciones_dpo.png` | Checklist de obligaciones especiales (DPO, registro, informes) | Escena `05_obligaciones` |

**Total: 12 imágenes** (4 por módulo × 3 módulos)

---

## Ubicación física de los archivos

```
/opt/data/ley21719-cl/tools/video_factory/out/img/
├── ciudadano/
│   ├── ciudadano_derechos_arco.png
│   ├── ciudadano_plazo_30_dias.png
│   ├── ciudadano_flujo_reclamacion.png
│   └── ciudadano_datos_sensibles.png
├── desarrollador/
│   ├── desarrollador_arquitectura_capas.png
│   ├── desarrollador_endpoints_arco.png
│   ├── desarrollador_flujo_brecha.png
│   └── desarrollador_checklist_tecnico.png
└── institucion/
    ├── institucion_marco_juridico.png
    ├── institucion_responsable.png
    ├── institucion_periodo_transitorio.png
    └── institucion_obligaciones_dpo.png
```

---

## Mapeo a los videos

Estas imágenes pueden intercalarse como **slides de fondo** (overlays) en los videos ya generados. Para hacerlo se requeriría modificar `make_module.py` para aceptar una imagen de fondo opcional por escena. Eso queda fuera del scope actual; las imágenes quedan como material reutilizable.

## Cómo se generan
- **Lenguaje:** Python con `Pillow` (PIL).
- **Tipografía:** fuente `Inter` descargada como `.ttf`; fallback a `DejaVuSans-Bold` (siempre presente en el sistema).
- **Renderizado:** mediante script `make_images.py` que produce las 12 imágenes de forma idempotente.
