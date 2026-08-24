#!/usr/bin/env python3
"""Seed del contenido en PostgreSQL de InsForge + verificación.

1. Obtiene DSN real (URL enmascarada + password) vía API OSS de InsForge.
2. Ejecuta app.db.init_db() contra Postgres (seed idempotente desde docs/*.json).
3. Verifica conteos por tabla.

La contraseña NUNCA se imprime ni se escribe a disco.
"""
from __future__ import annotations

import json
import re
import sys
import urllib.request
from pathlib import Path

BACKEND_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = BACKEND_DIR.parent

# ── 1. Credenciales del proyecto (.insforge/project.json) ──────────────────
with open(PROJECT_ROOT / ".insforge" / "project.json") as f:
    proj = json.load(f)

API_KEY = proj["api_key"]
OSS_HOST = proj["oss_host"]


def oss_fetch(path: str) -> dict:
    req = urllib.request.Request(
        f"{OSS_HOST}{path}",
        headers={"Authorization": f"Bearer {API_KEY}", "Content-Type": "application/json"},
    )
    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.loads(resp.read().decode())


def splice_password(masked_url: str, password: str) -> str:
    return re.sub(r"^(postgresql://[^:]+:)[^@]+(@)", lambda m: f"{m.group(1)}{password}{m.group(2)}", masked_url)


# ── 2. Obtener DSN real ─────────────────────────────────────────────────────
print("→ Obteniendo connection string...")
meta = oss_fetch("/api/metadata/database-connection-string")
masked = meta["connectionURL"]
print(f"  host: {masked.split('@')[1].split('/')[0]}")

print("→ Obteniendo database password...")
pw_body = oss_fetch("/api/metadata/database-password")
password = pw_body.get("databasePassword", "")
if not password or re.fullmatch(r"\*+", password):
    print("ERROR: password enmascarado o vacío")
    sys.exit(1)

DSN = splice_password(masked, password)
print(f"  DSN armado OK (len={len(DSN)}, password oculto)")

# ── 3. Seed: ejecutar init_db() contra Postgres ────────────────────────────
import os

os.environ["DATABASE_URL"] = DSN
sys.path.insert(0, str(BACKEND_DIR))

import psycopg  # noqa: E402

from app import db as appdb  # noqa: E402

assert appdb.USE_PG, "app.db no detectó Postgres"
print("→ app.db en modo Postgres ✓")

print("→ Ejecutando init_db() (seed idempotente desde docs/*.json)...")
appdb.init_db()
print("✓ init_db() completado")

# ── 4. Verificación de conteos ──────────────────────────────────────────────
conn = psycopg.connect(DSN)
cur = conn.cursor()
print("\n=== Conteos en PostgreSQL (InsForge) ===")
expected = {"modules": 4, "quizzes": 4, "final_test": 10}
ok = True
for table in ["modules", "quizzes", "glossary", "checklist_items", "checklist_progress", "final_test"]:
    cur.execute(f"SELECT COUNT(*) FROM {table}")
    n = cur.fetchone()[0]
    mark = ""
    if table in expected:
        good = n == expected[table]
        ok = ok and good
        mark = "✓" if good else f"✗ (esperado {expected[table]})"
    print(f"  {table:20s} {n:5d} {mark}")

# Smoke test: progreso persiste tras re-init
print("\n→ Smoke test persistencia: INSERT progreso → init_db() → SELECT")
cur.execute(
    "INSERT INTO checklist_progress (role, item_id, completed) VALUES ('empresas','smoke-test-item',1) "
    "ON CONFLICT (role, item_id) DO UPDATE SET completed=EXCLUDED.completed"
)
conn.commit()
appdb.init_db()  # re-seed no debe borrar progreso
cur.execute("SELECT completed FROM checklist_progress WHERE role='empresas' AND item_id='smoke-test-item'")
row = cur.fetchone()
if row and row[0] == 1:
    print("✓ Progreso sobrevive al re-seed")
else:
    print("✗ PROGRESO PERDIDO")
    ok = False
# limpiar smoke test
cur.execute("DELETE FROM checklist_progress WHERE item_id='smoke-test-item'")
conn.commit()
conn.close()

print("\n" + ("✅ SEED POSTGRES COMPLETO Y VERIFICADO" if ok else "❌ HAY FALLOS — revisar"))
sys.exit(0 if ok else 1)