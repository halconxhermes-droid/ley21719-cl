# Row Level Security (RLS) — Configuración final

## Estado: ✅ Advisor limpio (0 critical · 0 warning · 0 info) — 8/24/2026

## Arquitectura de acceso

El navegador NUNCA habla directo con Postgres. Toda consulta pasa por la
Netlify Function (`frontend/netlify/functions/api.ts`) usando la clave admin
(`INSFORGE_API_KEY`). Por eso las tablas NO necesitan políticas públicas.

```
Usuario → Netlify (frontend + function adapter con Bearer admin)
              ↓
        InsForge REST /api/database/records/*
              ↓
        Postgres (RLS: solo project_admin)
```

## Políticas aplicadas (7 tablas)

`modules`, `quizzes`, `checklist_items`, `checklist_progress`,
`final_test`, `glossary`, `glossary_search`:

```sql
ALTER TABLE <tabla> ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_admin_access" ON <tabla> FOR ALL
  USING ((SELECT auth.role()) = 'project_admin');
```

- `(SELECT auth.role())` envuelto en subquery → evaluación única (perf).
- `anon` y `authenticated` → sin políticas → **acceso denegado por defecto**.
- Solo el adapter con Bearer admin lee/escribe.

## Verificaciones realizadas

| Test | Resultado |
|------|-----------|
| Web lee módulos vía adapter | ✅ 200 |
| Anon intenta leer tabla directa | ✅ 401 bloqueado |
| Admin (Bearer) lee | ✅ OK |
| Admin PATCH checklist | ✅ 204 |
| POST checklist desde la web | ✅ persiste |
| InsForge Advisor scan | ✅ 0/0/0 |

## Supresiones registradas

- `missing-rls-index` → false_positive: las políticas filtran por auth.role(),
  no por columnas de texto; tablas con ≤39 filas (índice nunca se usaría).

## Historia (por qué se llegó aquí)

1. Scan inicial: 7× rls-disabled → se habilitó RLS.
2. Política read_public USING(true): funcional pero Advisor la marcaba
   crítica (permissive). Se suprimió como accepted_risk.
3. Solución definitiva: eliminar read_public y crear allow_admin_access.
   El navegador no accede directo a la BD ⇒ no requiere lectura anónima.
4. Optimización (SELECT envuelto) + supresión documentada del falso positivo
   de índices ⇒ scan 100% limpio.
