# Wireframes — Ley 21.719 Web Educativa

## 1. Home + Selector de Rol (Pantalla de entrada)

### Estructura
```
┌─────────────────────────────────────────────────────────────────┐
│  HEADER                                                         │
│  [Logo Ley 21.719]          [Cuenta regresiva: XX días]         │
├─────────────────────────────────────────────────────────────────┤
│  HERO SECTION (Decide/Learn surface)                           │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  Ley 21.719: Protección de Datos Personales en Chile     │  │
│  │  Nueva ley en vigencia plena: 17 diciembre 2026          │  │
│  │                                                           │  │
│  │  ¿Quién eres? → Personaliza tu experiencia               │  │
│  │                                                           │  │
│  │  ┌─────────┐ ┌─────────┐ ┌──────────┐ ┌──────────────┐  │  │
│  │  │ EMPRESAS│ │CIUDADANOS│ │DESARROLL-│ │INST. PÚBLICAS│  │  │
│  │  │ Respons.│ │ Titulares│ │ADORES    │ │              │  │  │
│  │  │ tratamiento│ │ de datos│ │/TÉCNICOS │ │              │  │  │
│  │  └─────────┘ └─────────┘ └──────────┘ └──────────────┘  │  │
│  └───────────────────────────────────────────────────────────┘  │
├─────────────────────────────────────────────────────────────────┤
│  FOOTER                                                         │
│  [Enlace texto legal] [Glosario] [Accesibilidad] [Contacto]    │
└─────────────────────────────────────────────────────────────────┘
```

### Estados
- **Default**: Cards de rol con icono + label + descripción corta (1 línea)
- **Hover/Focus**: Elevación + borde acento + sombra suave
- **Seleccionado**: Checkmark visible, fondo acento 10%, persiste en localStorage
- **Mobile**: Stack vertical, touch target ≥ 48px

---

## 2. Vista Lectura Módulo (3 Niveles)

### Estructura
```
┌─────────────────────────────────────────────────────────────────┐
│  TOP BAR                                                        │
│  [← Volver]  [Módulo 3/8: Derechos ARCO]  [🔍 Buscar] [👤 Rol] │
├─────────────────────────────────────────────────────────────────┤
│  PROGRESO MÓDULO                                                │
│  [████████░░] 65%  •  Resumen → Explicación → Texto legal       │
├─────────────────────────────────────────────────────────────────┤
│  CONTENIDO (scroll vertical)                                    │
│                                                                 │
│  ┌─ NIVEL 1: RESUMEN EJECUTIVO (3 min) ─────────────────────┐  │
│  │  [Badge: "3 min"] Título del módulo                        │  │
│  │  3-4 bullets clave con iconos                              │  │
│  │  [Botón: "Ver explicación amigable →"]                     │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌─ NIVEL 2: EXPLICACIÓN AMIGABLE (15 min) ──────────────────┐  │
│  │  [Badge: "15 min"]                                         │  │
│  │  Texto explicativo con:                                     │  │
│  │  • Subtítulos claros                                       │  │
│  │  • Términos técnicos subrayados (click → glosario emergente)│ │
│  │  • Cajas "¿Qué pasa si...?" (escenarios reales)            │  │
│  │  • Cajas "Dato clave" con icono 📌                         │  │
│  │  [Botón: "Ver texto legal completo →"]                     │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌─ NIVEL 3: TEXTO LEGAL COMPLETO ────────────────────────────┐  │
│  │  [Badge: "Texto legal"]                                     │  │
│  │  Artículos completos con numeración oficial                 │  │
│  │  Términos técnicos linkados a glosario                      │  │
│  │  Botón "Descargar PDF"                                      │  │
│  └────────────────────────────────────────────────────────────┘  │
├─────────────────────────────────────────────────────────────────┤
│  NAVEGACIÓN INFERIOR                                            │
│  [← Módulo anterior]          [Quiz del módulo →]              │
└─────────────────────────────────────────────────────────────────┘
```

### Glosario Emergente (Tooltip/Modal)
```
┌────────────────────────────────────┐
│  Término: "Responsable del       │
│  tratamiento"           [×]       │
├────────────────────────────────────┤
│  Definición: Persona jurídica o   │
│  natural que decide finalidad y   │
│  medios del tratamiento...        │
│                                   │
│  [Ver en glosario completo →]     │
└────────────────────────────────────┘
```

---

## 3. Quiz Interactivo por Módulo

### Estructura
```
┌─────────────────────────────────────────────────────────────────┐
│  TOP BAR (igual que vista lectura)                              │
├─────────────────────────────────────────────────────────────────┤
│  QUIZ HEADER                                                    │
│  Pregunta 3 de 5  •  Módulo: Derechos ARCO                      │
│  [████████░░] 60%                                               │
├─────────────────────────────────────────────────────────────────┤
│  PREGUNTA                                                       │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  ¿Cuál es el plazo para responder una solicitud de acceso? │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                 │
│  OPCIONES (radio cards, una seleccionable)                      │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ ○  10 días hábiles                                         │ │
│  │ ○  15 días hábiles      ← Seleccionada (borde acento)      │ │
│  │ ○  30 días corridos                                        │ │
│  │ ○  5 días hábiles                                          │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                 │
│  [Responder]  (disabled hasta seleccionar)                      │
├─────────────────────────────────────────────────────────────────┤
│  FEEDBACK (tras click Responder)                                │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  ❌ Incorrecto. El plazo correcto es 30 días corridos     │ │
│  │  (Art. 14, Ley 21.719). Los días hábiles aplican solo...  │ │
│  │                                                            │ │
│  │  [Siguiente pregunta →]                                    │ │
│  └────────────────────────────────────────────────────────────┘ │
│  (Si correcto: ✅ + explicación breve + [Siguiente])            │
└─────────────────────────────────────────────────────────────────┘
```

### Estados de Opción
- **Default**: Borde gris, fondo blanco
- **Hover**: Fondo gris 5%
- **Selected**: Borde acento 2px, fondo acento 5%
- **Correcta (feedback)**: Verde, checkmark
- **Incorrecta (feedback)**: Roja, X + verde en correcta

---

## 4. Checklist Interactivo "¿Estoy listo?"

### Estructura
```
┌─────────────────────────────────────────────────────────────────┐
│  TOP BAR                                                        │
├─────────────────────────────────────────────────────────────────┤
│  CHECKLIST HEADER                                               │
│  Checklist: Empresas / Responsables de tratamiento             │
│  Progreso: 7/12 completados  [███████░░░] 58%                  │
├─────────────────────────────────────────────────────────────────┤
│  GRUPOS COLAPSABLES (accordion)                                 │
│                                                                 │
│  ▼ GOBERNANZA Y POLÍTICAS (3/4)                                 │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ ☑  Política de privacidad publicada y accesible            │ │
│  │ ☑  Delegado de protección de datos (DPO) designado         │ │
│  │ ☐  Registro de actividades de tratamiento (ROPA) actualizado│ │
│  │ ☐  Análisis de impacto (DPIA) para tratamientos de alto   │ │
│  │     riesgo                                                   │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ▶ DERECHOS DE TITULARES (2/3)                                  │
│  ▶ SEGURIDAD Y BRECHAS (1/2)                                    │
│  ▶ TRANSFERENCIAS INTERNACIONALES (1/1)                         │
│  ▶ PROVEEDORES Y ENCARGADOS (0/2)                               │
│                                                                 │
│  [Botón flotante: "Exportar PDF" / "Guardar progreso"]         │
└─────────────────────────────────────────────────────────────────┘
```

### Item de Checklist
```
┌────────────────────────────────────────────────────────────┐
│  ☐  Registro de actividades de tratamiento (ROPA)         │
│      actualizado                                           │
│      ─────────────────────────────────────────────────     │
│      [i]  Art. 19 Ley 21.719  •  Guía práctica: [Enlace]  │
└────────────────────────────────────────────────────────────┘
```
- Checkbox ≥ 24px touch target
- Texto principal + ayuda contextual (ley, guía)
- Click en texto también marca/desmarca

---

## 5. Glosario Completo

### Estructura
```
┌─────────────────────────────────────────────────────────────────┐
│  TOP BAR                                                        │
├─────────────────────────────────────────────────────────────────┤
│  GLOSARIO HEADER                                                │
│  Buscar términos... [🔍]    47 términos  [A-Z] [Categorías]    │
├─────────────────────────────────────────────────────────────────┤
│  LISTA ALFABÉTICA (scroll infinito o paginada)                  │
│                                                                 │
│  ┌─ A ───────────────────────────────────────────────────────┐ │
│  │  Acceso, derecho de      →  Ver definición               │ │
│  │  Anonimización             →  Ver definición             │ │
│  └────────────────────────────────────────────────────────────┘ │
│  ┌─ B ───────────────────────────────────────────────────────┐ │
│  │  Base de datos             →  Ver definición             │ │
│  │  Brecha de seguridad       →  Ver definición             │ │
│  └────────────────────────────────────────────────────────────┘ │
│  ...                                                            │
└─────────────────────────────────────────────────────────────────┘
```

### Vista Definición (Modal o página)
```
┌─────────────────────────────────────────────────────────────────┐
│  DEFINICIÓN: ANONIMIZACIÓN                    [×] [↗ Compartir] │
├─────────────────────────────────────────────────────────────────┤
│  Categoría: Técnicas de protección    Art. 2 letra a)          │
│                                                                 │
│  Proceso mediante el cual los datos personales dejan de        │
│  estar asociados a un titular identificado o identificable,    │
│  de forma irreversible.                                        │
│                                                                 │
│  ───                                                            │
│  Términos relacionados:                                        │
│  • Seudonimización (diferencia: reversible)                    │
│  • Datos personales                                            │
│  • Tratamiento                                                 │
│                                                                 │
│  [Volver al glosario]                                          │
└─────────────────────────────────────────────────────────────────┘
```

---

## 6. Resultados Finales / Test Final

### Estructura
```
┌─────────────────────────────────────────────────────────────────┐
│  TOP BAR                                                        │
├─────────────────────────────────────────────────────────────────┤
│  TEST FINAL — 10 PREGUNTAS                                      │
│  Pregunta 7 de 10  •  Tiempo: 12:34                            │
├─────────────────────────────────────────────────────────────────┤
│  (Mismo layout que Quiz módulo, sin feedback inmediato)        │
└─────────────────────────────────────────────────────────────────┘
```

### Pantalla Resultados
```
┌─────────────────────────────────────────────────────────────────┐
│  RESULTADOS                                                     │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  🎉  8/10  (80%)                                         │  │
│  │  [████████████████░░]  Aprobado (≥70%)                   │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  Detalle por módulo:                                           │
│  ┌─────────────────┬──────┬──────┬──────────────────────────┐  │
│  │ Módulo          │ OK   │ Total│ %                        │  │
│  ├─────────────────┼──────┼──────┼──────────────────────────┤  │
│  │ Principios      │ 2    │ 2    │ 100% ✅                  │  │
│  │ Derechos ARCO   │ 1    │ 2    │ 50%  ⚠️                  │  │
│  │ ...             │      │      │                          │  │
│  └─────────────────┴──────┴──────┴──────────────────────────┘  │
│                                                                 │
│  [Reintentar falladas]  [Descargar certificado]  [Volver inicio]│
└─────────────────────────────────────────────────────────────────┘
```

---

## 7. Estados Globales y Componentes Transversales

### Cuenta Regresiva (Header persistente)
```
┌─────────────────────────────────────────────────────────────────┐
│  ⏳  Vigencia plena: 142 días  03:14:22                         │
└─────────────────────────────────────────────────────────────────┘
```
- Actualización cada segundo via JS
- Color cambia a rojo ≤ 30 días

### Selector de Rol (persistente, accesible desde header)
```
┌────────────────────────────────────┐
│  Mi rol: Empresas ▼                │
│  ┌──────────────────────────────┐  │
│  │ ✓ Empresas                   │  │
│  │   Ciudadanos                 │  │
│  │   Desarrolladores            │  │
│  │   Instituciones públicas     │  │
│  └──────────────────────────────┘  │
│  [Cambiar rol reinicia progreso]   │
└────────────────────────────────────┘
```

### Navegación Principal (Sidebar móvil / Top bar desktop)
- **Desktop**: Top bar fija con breadcrumb + acciones
- **Mobile**: Hamburger → drawer lateral con módulos, checklist, glosario, progreso

### Accesibilidad (WCAG AA)
- Contraste ≥ 4.5:1 texto normal, ≥ 3:1 texto grande
- Focus visible: outline 3px acento + offset 2px
- Skip links: "Saltar al contenido principal"
- ARIA labels en todos los controles
- Escalado texto hasta 200% sin pérdida función
- Navegación solo teclado completa

---

## Resumen de Vistas y Rutas

| Vista | Ruta | Props clave |
|-------|------|-------------|
| Home + Selector | `/` | `role?: string` |
| Lectura módulo | `/modulo/:id` | `level: 1\|2\|3`, `role` |
| Quiz módulo | `/modulo/:id/quiz` | `questions[]`, `moduleId` |
| Checklist | `/checklist` | `role`, `items[]` |
| Glosario | `/glosario` | `search?`, `category?` |
| Test final | `/test-final` | `questions[10]` |
| Resultados | `/resultados` | `score`, `detail[]` |