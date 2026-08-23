# Mockup HTML — Ley 21.719 Web Educativa

Mockup navegable autocontenido: `mockups/index.html`.

## Vistas incluidas (SPA por JS básico)
1. **Home + Selector de rol** — 4 cards de audiencia; el rol persiste en localStorage.
2. **Lectura de módulo** — 3 niveles (Resumen 3 min / Explicación amigable 15 min / Texto legal), con términos de glosario emergente y cajas "¿Qué pasa si...?".
3. **Quiz del módulo** — radio-cards, feedback explicativo al fallar.
4. **Checklist "¿Estoy listo?"** — acordeones por sección, progreso por rol, persistencia localStorage.
5. **Glosario** — búsqueda + lista A–Z + modal de definición con términos relacionados.
6. **Test final** — 10 preguntas, sin feedback inmediato.
7. **Resultados** — puntaje global, detalle por módulo, acciones.

## Interacciones implementadas
- Cuenta regresiva en vivo a la vigencia plena (17-dic-2026 00:00 CLST) en el header, actualizada cada segundo.
- Selector de rol persistente que personaliza checklist y textos.
- Glosario emergente: click en `<button class="term">` abre modal con definición.
- Quiz: selección → responder → feedback explicativo → siguiente; resultado final.
- Checklist: toggle de items recalcula % por sección y global.
- Accesibilidad: focus visible, `aria-*`, skip-link, contraste AA, `prefers-reduced-motion` respetado.

## Datos
El mockup usa datos embebidos (`window.MOCK_DATA`) que replican el contrato de `api-contract.md`. El equipo Frontend debe reemplazarlos por las llamadas REST reales.

## Navegación rápida para revisión
Desde el footer hay accesos directos a todas las vistas ("Accesos de revisión") para no depender del flujo completo.
