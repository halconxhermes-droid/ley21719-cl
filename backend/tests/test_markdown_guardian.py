"""Test guardián: bullets del resumen nunca deben tener ** desbalanceado."""
from __future__ import annotations

import sqlite3
import pytest

from app.db import init_db, DB_PATH


def test_summary_bullets_markdown_balanced():
    """Cada bullet del resumen debe tener número par de ** (pairs de énfasis)."""
    init_db()
    conn = sqlite3.connect(DB_PATH)
    rows = conn.execute("SELECT id, levels_json FROM modules").fetchall()
    conn.close()

    for module_id, levels_json in rows:
        import json
        levels = json.loads(levels_json)
        bullets = levels.get("summary", {}).get("bullets", [])
        for i, b in enumerate(bullets):
            count = b.count("**")
            assert count % 2 == 0, (
                f"Módulo {module_id}, bullet {i}: ** desbalanceado ({count}) → {b!r}"
            )
