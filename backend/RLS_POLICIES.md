# Row Level Security (RLS) Policies

## Aplicadas: 8/24/2026

Se habilitó RLS en 7 tablas críticas:
- modules, quizzes, checklist_items, checklist_progress, final_test, glossary, glossary_search

## Políticas:
- `read_public`: SELECT USING (true) — contenido legible sin login (sitio educativo)
- Escritura (INSERT/UPDATE/DELETE): solo project_admin (requiere auth)

## Razón:
Sitio educativo público por diseño (ley21719.cl) — el contenido DEBE ser
público-lectura. La escritura está protegida: sin token válido → 401.

## Advertencias:
- InsForge Advisor marca rls-permissive como "critical" (falso positivo para este caso)
- Suprimido con razón "accepted_risk" en todas las tablas
- El scan puede tardar 24h en reflejar las supresiones
