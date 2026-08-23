# Style Guide — Ley 21.719 Web Educativa

Tokens de diseño y guía de componentes para la plataforma educativa sobre la Ley 21.719 de Protección de Datos Personales de Chile.

---

## 1. Identidad Visual y Postura

- **Superficie principal**: Decidir / Aprender (`Decide/Learn`) y Operar (`Operate` en checklists y tests).
- **Paleta**: Sobria institucional chilena (Azules institucionales, grises neutros de alta legibilidad, acentos en azul marino profundo y azul cobalto con toques de alerta formal).
- **Accesibilidad**: WCAG AA garantizado (contraste mínimo 4.5:1 para texto normal, 3:1 para texto grande).

---

## 2. Paleta de Colores (Design Tokens)

### Neutros (Escala Slate / Gray)
```css
--color-slate-50:  #f8fafc;
--color-slate-100: #f1f5f9;
--color-slate-200: #e2e8f0;
--color-slate-300: #cbd5e1;
--color-slate-400: #94a3b8;
--color-slate-500: #64748b;
--color-slate-600: #475569;
--color-slate-700: #334155;
--color-slate-800: #1e293b;
--color-slate-900: #0f172a;
```

### Primarios (Institucionales - Azul Chile)
```css
--color-primary-50:  #e0f2fe;
--color-primary-100: #bae6fd;
--color-primary-500: #0ea5e9;  /* Azul base intermedio (focus ring) */
--color-primary-600: #0284c7;  /* Azul institucional (Cobalto) */
--color-primary-700: #0369a1;  /* Azul oscuro principal */
--color-primary-800: #075985;
--color-primary-900: #0c4a6e;  /* Azul marino institucional */
```

### Semánticos y Estados
```css
--color-success-bg:  #dcfce7;
--color-success-text: #166534;
--color-success-border: #bbf7d0;

--color-warning-bg:  #fef9c3;
--color-warning-text: #854d0e;
--color-warning-border: #fef08a;

--color-error-bg:    #fee2e2;
--color-error-text:  #991b1b;
--color-error-border: #fecaca;

--color-info-bg:     #e0f2fe;
--color-info-text:   #0369a1;
--color-info-border: #bae6fd;
```

---

## 3. Tipografía (Escala Tipográfica)

- **Familia tipográfica principal**: `Inter, system-ui, -apple-system, sans-serif`
- **Familia tipográfica mono (técnica/artículos)**: `JetBrains Mono, ui-monospace, monospace`

### Escala
```css
--font-size-xs:   0.75rem;   /* 12px */
--font-size-sm:   0.875rem;  /* 14px */
--font-size-base: 1rem;      /* 16px */
--font-size-lg:   1.125rem;  /* 18px */
--font-size-xl:   1.25rem;   /* 20px */
--font-size-2xl:  1.5rem;    /* 24px */
--font-size-3xl:  1.875rem;  /* 30px */
--font-size-4xl:  2.25rem;   /* 36px */

--font-weight-normal: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;

--line-height-tight: 1.25;
--line-height-base: 1.5;
--line-height-relaxed: 1.75;
```

---

## 4. Espaciado y Radii

### Espaciado (Grid de 4px / 8px)
```css
--space-1: 0.25rem; /* 4px */
--space-2: 0.5rem;  /* 8px */
--space-3: 0.75rem; /* 12px */
--space-4: 1rem;    /* 16px */
--space-6: 1.5rem;  /* 24px */
--space-8: 2rem;    /* 32px */
--space-12: 3rem;   /* 48px */
--space-16: 4rem;   /* 64px */
```

### Radii
```css
--radius-sm:  0.25rem; /* 4px */
--radius-md:  0.5rem;  /* 8px */
--radius-lg:  0.75rem; /* 12px */
--radius-full: 9999px;
```

### Sombras (Elevation)
```css
--shadow-sm:  0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-md:  0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
--shadow-lg:  0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
```

---

## 5. Componentes de UI

### Botones (Buttons)
- **Primary**: Fondo `--color-primary-700`, texto blanco, hover `--color-primary-800`, active `--color-primary-900`.
- **Secondary**: Fondo blanco, borde `--color-slate-300`, texto `--color-slate-700`, hover fondo `--color-slate-50`.
- **Ghost**: Sin fondo, texto `--color-primary-700`, hover fondo `--color-primary-50`.
- **Focus ring**: `outline: 3px solid var(--color-primary-500); outline-offset: 2px;`
- **Touch target mínimo**: 44px de altura.

### Cards de Rol
- Estado default: Borde `--color-slate-200`, sombra `--shadow-sm`, padding `--space-6`.
- Hover: Borde `--color-primary-500`, sombra `--shadow-md`.
- Seleccionado: Borde 2px `--color-primary-700`, fondo `--color-primary-50` (atenuado).

### Quiz Options (Radio Cards)
- Contenedor con borde `--color-slate-200`, radio `--radius-md`, padding `--space-4`.
- Transición suave de borde y fondo.
- Estado correcto / incorrecto con iconos y colores semánticos definidos.

### Badge de Progreso
- Barra con fondo `--color-slate-100`, barra interna `--color-primary-600`, radio `--radius-full`, altura 8px.
- Etiqueta de porcentaje en texto `--font-size-sm`, peso medium.

### Glosario Tooltip / Popover
- Fondo blanco, sombra `--shadow-lg`, borde `--color-slate-200`, radio `--radius-md`, ancho máximo 320px.
- Botón de cierre superior derecho (X).

---

## 6. Pautas de Accesibilidad (WCAG AA)
1. **Contraste de color**: Verificado en todos los estados interactivos.
2. **Navegación por teclado**: Orden lógico de tabulación (`tabindex="0"`), focus visible explícito.
3. **Lectores de pantalla**: Uso de etiquetas `aria-label`, `aria-expanded`, roles ARIA en acordeones y modales.
4. **Motion**: Respeto estricto a `prefers-reduced-motion` desactivando transiciones pesadas.
