"""Tests de persistencia: el progreso del checklist debe sobrevivir restarts."""
from __future__ import annotations

import sqlite3

from fastapi.testclient import TestClient


def test_progress_survives_reinit(client: TestClient):
    """Guardar progreso, re-ejecutar init_db(), y verificar que persiste."""
    from app.db import init_db

    # 1. Guardar progreso vía API
    resp = client.post(
        "/api/v1/checklist/empresas",
        json={"items": [{"id": "empresas-gobernanza-1", "completed": True}]},
    )
    assert resp.status_code == 200

    # 2. Simular restart de la app (init_db ya NO debe borrar la DB)
    init_db()

    # 3. El progreso debe seguir ahí
    resp2 = client.get("/api/v1/checklist/empresas")
    assert resp2.status_code == 200
    data = resp2.json()
    items = [it for s in data["checklist"]["sections"] for it in s["items"]]
    saved = [it for it in items if it["id"] == "empresas-gobernanza-1"]
    assert saved and saved[0]["completed"] is True, "progreso perdido tras init_db()"


def test_content_resent_not_duplicated(client: TestClient):
    """Re-seed no duplica contenido (INSERT OR REPLACE idempotente)."""
    from app.db import DB_PATH, init_db

    init_db()
    conn = sqlite3.connect(DB_PATH)
    n_modules = conn.execute("SELECT COUNT(*) FROM modules").fetchone()[0]
    conn.close()
    assert n_modules == 4, f"esperados 4 módulos, hay {n_modules}"
