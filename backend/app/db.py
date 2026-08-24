"""SQLite / PostgreSQL dual-driver data layer for Ley 21.719 API.

Detecta automáticamente el motor a usar:
- Si DATABASE_URL está definido → PostgreSQL (InsForge prod)
- Si no → SQLite (desarrollo/local)

Mantiene la misma firma de funciones que el original para compatibilidad total
con tests y routers existentes.

Funciones críticas preservadas:
- init_db() → idempotente, no destruye checklist_progress
- get_conn() → retorna conexión abierta
- _modules_all, _quiz_by_module, etc. → mismas retornos
- Todo el contenido (módulos, quizzes, glosario, checklist) sigue siendo
  inyectado desde docs/*.json

Variables de entorno soportadas:
  DATABASE_URL           → postgresql://user:pass@host:port/db  (InsForge prod)
  LEY21719_DATA_DIR      → /data o ./data (override ruta SQLite default)
"""
from __future__ import annotations

import json
import os
import re
from pathlib import Path
from typing import Dict, List, Optional

# ── Determinar motor de base de datos ──────────────────────────────────────
DATABASE_URL = os.environ.get("DATABASE_URL", "").strip()
USE_PG = bool(DATABASE_URL and DATABASE_URL.startswith("postgresql://"))

# Config paths
DOCS_DIR = Path(__file__).resolve().parents[1].joinpath("docs")
docs_dir_env = os.environ.get("LEY21719_DOCS_DIR")
if docs_dir_env:
    DOCS_DIR = Path(docs_dir_env)

DATA_DIR = Path(os.environ.get("LEY21719_DATA_DIR", Path(__file__).resolve().parent.joinpath("data")))
DB_PATH = DATA_DIR / "app.db"
FINAL_TEST_JSON = DATA_DIR / "final_test.json"

VALID_ROLES = ["empresas", "ciudadanos", "desarrolladores", "instituciones-publicas"]

CHECKLIST_KEY_TO_ROLE = {
    "empresa": "empresas",
    "ciudadano": "ciudadanos",
    "desarrollador": "desarrolladores",
    "institucion": "instituciones-publicas",
}

SECTION_DEFAULTS: Dict[str, dict] = {
    "empresas": {
        "gobernanza": "Gobernanza y políticas",
        "derechos-arsop": "Derechos y solicitudes (ARSOP)",
        "seguridad-brechas": "Seguridad y brechas",
        "proveedores-transferencias": "Proveedores y transferencias",
        "cultura-cumplimiento": "Cultura y cumplimiento continuo",
    }
}


def _slug(s: str) -> str:
    s = s.lower()
    s = re.sub(r"[^a-z0-9]+", "-", s).strip("-")
    return s


def _vf_options(correcta: bool) -> tuple:
    """Return (options, correct_index) for V/F questions with empty opciones.

    When a quiz question has ``opciones: []`` and ``correcta: <bool>``,
    generate the standard Verdadero/Falso pair.  Verdadero is always
    id 0; Falso is id 1.  ``correcta: True`` → index 0 (Verdadero),
    ``correcta: False`` → index 1 (Falso).
    """
    options = [{"id": 0, "text": "Verdadero"}, {"id": 1, "text": "Falso"}]
    correct_index = 0 if correcta else 1
    return options, correct_index


# ── Conexión y helpers comunes ──────────────────────────────────────────────
if USE_PG:
    import psycopg
    from psycopg.rows import dict_row

    _pg_conn = None

    def get_conn():
        global _pg_conn
        if _pg_conn is None or _pg_conn.closed:
            _pg_conn = psycopg.connect(DATABASE_URL, autocommit=True, row_factory=dict_row)
        return _pg_conn

else:
    import sqlite3

    def get_conn():
        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row
        return conn


def _exec(sql: str, params: tuple = ()):
    """Execute SQL (same interface for both backends)."""
    conn = get_conn()
    cur = conn.cursor()
    if USE_PG:
        # psycopg uses %s placeholders — convert ? → %s
        pg_sql = sql.replace("?", "%s")
        cur.execute(pg_sql, params)
    else:
        cur.execute(sql, params)
    if not USE_PG:
        conn.commit()
    return cur


def _upsert(table: str, columns: List[str], values: tuple, conflict_cols: List[str]) -> None:
    """INSERT OR REPLACE compatible con ambos backends.

    SQLite: INSERT OR REPLACE INTO ... VALUES (...)
    Postgres: INSERT INTO ... VALUES (...) ON CONFLICT (...) DO UPDATE SET ...
    """
    if USE_PG:
        col_list = ", ".join(columns)
        val_ph = ", ".join(["%s"] * len(columns))
        set_clause = ", ".join([f"{c}=EXCLUDED.{c}" for c in columns if c not in conflict_cols])
        sql = (
            f"INSERT INTO {table} ({col_list}) VALUES ({val_ph}) "
            f"ON CONFLICT ({', '.join(conflict_cols)}) DO UPDATE SET {set_clause}"
        )
        _exec(sql, values)
    else:
        col_list = ", ".join(columns)
        val_ph = ", ".join(["?"] * len(columns))
        sql = f"INSERT OR REPLACE INTO {table} ({col_list}) VALUES ({val_ph})"
        _exec(sql, values)


def _fetchall(sql: str, params: tuple = ()):
    cur = _exec(sql, params)
    return cur.fetchall()


def _fetchone(sql: str, params: tuple = ()):
    cur = _exec(sql, params)
    return cur.fetchone()


# ── Init DB (idempotent schema + seed) ──────────────────────────────────────
def init_db() -> None:
    """Create tables (IF NOT EXISTS) and seed content from docs/*.json.

    PERSISTENCIA: la base NUNCA se borra en arranque. El contenido se
    re-siembra solo si las tablas están vacías (INSERT OR REPLACE), y la
    tabla checklist_progress (progreso de usuarios) jamás se toca aquí.
    """
    if not USE_PG:
        DATA_DIR.mkdir(parents=True, exist_ok=True)

    # ── Create tables (IF NOT EXISTS: safe on restart/redeploy) ────────────
    _exec(
        """
        CREATE TABLE IF NOT EXISTS modules (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            slug TEXT NOT NULL,
            ordering INTEGER NOT NULL,
            description TEXT NOT NULL,
            levels_json TEXT NOT NULL
        )
    """
    )
    _exec(
        """
        CREATE TABLE IF NOT EXISTS quizzes (
            module_id TEXT PRIMARY KEY,
            questions_json TEXT NOT NULL
        )
    """
    )
    _exec(
        """
        CREATE TABLE IF NOT EXISTS glossary (
            id TEXT PRIMARY KEY,
            term TEXT NOT NULL,
            definition TEXT NOT NULL,
            category TEXT,
            legal_ref TEXT,
            related_terms_json TEXT
        )
    """
    )
    _exec(
        """
        CREATE TABLE IF NOT EXISTS checklist_items (
            role TEXT NOT NULL,
            section_id TEXT NOT NULL,
            item_id TEXT NOT NULL,
            item_order INTEGER NOT NULL,
            text TEXT NOT NULL,
            legal_ref TEXT,
            guide_url TEXT,
            PRIMARY KEY (role, item_id)
        )
    """
    )
    _exec(
        """
        CREATE TABLE IF NOT EXISTS checklist_progress (
            role TEXT NOT NULL,
            item_id TEXT NOT NULL,
            completed INTEGER NOT NULL DEFAULT 0,
            PRIMARY KEY (role, item_id)
        )
    """
    )
    _exec(
        """
        CREATE TABLE IF NOT EXISTS glossary_search (
            id TEXT PRIMARY KEY,
            category TEXT,
            letter TEXT
        )
    """
    )
    _exec(
        """
        CREATE TABLE IF NOT EXISTS final_test (
            question_id TEXT PRIMARY KEY,
            module_id TEXT NOT NULL,
            text TEXT NOT NULL,
            options_json TEXT NOT NULL,
            correct_index INTEGER NOT NULL,
            explanation TEXT NOT NULL
        )
    """
    )

    # ── Load modules from docs/contenido.json ──────────────────────────────
    with open(DOCS_DIR / "contenido.json", "r", encoding="utf-8") as f:
        contenido = json.load(f)

    modulos = contenido.get("modulos", [])
    for idx, m in enumerate(modulos, start=1):
        m_id = m["id"]
        titulo = m.get("titulo", m_id.title())
        contenido_md = m.get("contenido_md", "")
        nivel = m.get("nivel", "amigable")
        minutos = int(m.get("tiempo_lectura_min", 10))
        slug = _slug(titulo)

        lines = [l.strip() for l in contenido_md.split("\n") if l.strip() and not l.strip().startswith("#")]
        description = lines[0][:200] if lines else titulo

        bullets = []
        for line in contenido_md.split("\n"):
            line = line.strip()
            if line.startswith("-") or line.startswith("*"):
                bullets.append(re.sub(r"^[-\*]+\\s+", "", line))
        if not bullets:
            for line in lines[:3]:
                bullets.append(line[:120])

        key_terms = m.get("terminos_glosario", [])
        escenario = m.get("escenario", "")

        articles = []
        current_title = ""
        current_text = []
        for line in contenido_md.split("\n"):
            ls = line.strip()
            if ls.startswith("## "):
                if current_title:
                    articles.append(
                        {
                            "number": f"Sección {len(articles) + 1}",
                            "title": current_title,
                            "text": "\n".join(current_text).strip(),
                        }
                    )
                current_title = ls.lstrip("# ").strip()
                current_text = []
            elif current_title:
                current_text.append(line)
        if current_title:
            articles.append(
                {
                    "number": f"Sección {len(articles) + 1}",
                    "title": current_title,
                    "text": "\n".join(current_text).strip(),
                }
            )
        if not articles:
            articles = [
                {
                    "number": "Artículo único",
                    "title": titulo,
                    "text": contenido_md[:1200],
                }
            ]

        levels = {
            "summary": {
                "title": "Resumen ejecutivo",
                "estimatedMinutes": 3,
                "bullets": bullets[:5] if bullets else [description],
                "keyTerms": key_terms[:6],
            },
            "friendly": {
                "title": "Explicación amigable",
                "estimatedMinutes": minutos,
                "sections": [
                    {
                        "heading": "¿Qué debes saber?",
                        "content": contenido_md[:1200],
                        "scenarios": (
                            [{"title": "Escenario destacado", "content": escenario}] if escenario else []
                        ),
                        "keyFacts": (
                            [{"icon": "pin", "text": f"Tiempo estimado: {minutos} min"}] if minutos else []
                        ),
                    }
                ],
                "glossaryTerms": key_terms,
            },
            "legal": {
                "title": "Texto legal completo",
                "articles": articles,
            },
        }

        estimated_bundle = {"summary": 3, "friendly": minutos, "legal": max(20, minutos * 2)}
        meta = {"estimatedMinutes": estimated_bundle, "level_hint": nivel}
        payload = {"levels": levels, "meta": meta}

        _upsert(
            "modules",
            ["id", "title", "slug", "ordering", "description", "levels_json"],
            (m_id, titulo, slug, idx, description, json.dumps(payload, ensure_ascii=False)),
            ["id"],
        )

    # ── Load quizzes from docs/quizzes.json ─────────────────────────────────
    with open(DOCS_DIR / "quizzes.json", "r", encoding="utf-8") as f:
        quizzes_doc = json.load(f)

    for mod_id, questions in (quizzes_doc.get("quizzes_por_modulo") or {}).items():
        q_rows = []
        for idx, q in enumerate(questions):
            raw_opts = q.get("opciones", [])
            raw_correcta = q.get("correcta", 0)
            if not raw_opts and isinstance(raw_correcta, bool):
                opts, cidx = _vf_options(raw_correcta)
            else:
                opts = [{"id": i, "text": t} for i, t in enumerate(raw_opts)]
                cidx = int(raw_correcta)
            q_rows.append(
                {
                    "id": f"{mod_id}-q{idx + 1}",
                    "text": q.get("pregunta", ""),
                    "options": opts,
                    "correctIndex": cidx,
                    "explanation": q.get("explicacion_al_fallar", "") or q.get("explicacion", ""),
                }
            )
        _upsert(
            "quizzes",
            ["module_id", "questions_json"],
            (mod_id, json.dumps(q_rows, ensure_ascii=False)),
            ["module_id"],
        )

    # ── Load glossary from docs/glosario.json ───────────────────────────────
    with open(DOCS_DIR / "glosario.json", "r", encoding="utf-8") as f:
        glosario_doc = json.load(f)

    terminos = glosario_doc.get("terminos", [])
    for t in terminos:
        t_id = t.get("id", "")
        term = t.get("termino", "")
        definition = t.get("definicion", "")
        legal_ref = t.get("legalRef") or t.get("legal_ref") or None
        category = t.get("category") or t.get("categoria") or None
        related = t.get("relatedTerms") or t.get("related_terms") or []
        if isinstance(related, list) and related and isinstance(related[0], dict):
            related = [r.get("id", "") for r in related]
        if not category:
            category = "juridica"
        letter = (term.strip()[0].upper() if term else "") or (t_id[0].upper() if t_id else "")
        legal_ref = legal_ref or None
        category = category or "general"
        _upsert(
            "glossary",
            ["id", "term", "definition", "category", "legal_ref", "related_terms_json"],
            (t_id, term, definition, category, legal_ref, json.dumps(related or [])),
            ["id"],
        )

    # ── Load checklist from docs/checklist.json ─────────────────────────────
    with open(DOCS_DIR / "checklist.json", "r", encoding="utf-8") as f:
        checklist_doc = json.load(f)

    checklists = checklist_doc.get("checklists", {})
    for src_key, items in checklists.items():
        role = CHECKLIST_KEY_TO_ROLE.get(src_key, src_key)
        section_ids = ["gobernanza", "derechos-arsop", "seguridad-brechas", "cultura-cumplimiento"]
        for idx, it in enumerate(items or []):
            sec = section_ids[idx % len(section_ids)]
            item_id = f"{role}-{sec}-{idx + 1}"
            _upsert(
                "checklist_items",
                ["role", "section_id", "item_id", "item_order", "text", "legal_ref", "guide_url"],
                (
                    role,
                    sec,
                    item_id,
                    idx + 1,
                    (it.get("item", "") or "").strip(),
                    it.get("referencia_modulo") or "",
                    None,
                ),
                ["role", "item_id"],
            )

    # ── Build final_test ────────────────────────────────────────────────────
    final_items: List[dict] = []
    test_final_raw = quizzes_doc.get("test_final") or []
    mod_ids = [m["id"] for m in modulos]
    for idx, q in enumerate(test_final_raw):
        mod_id = mod_ids[idx % len(mod_ids)]
        raw_opts = q.get("opciones", [])
        raw_correcta = q.get("correcta", 0)
        if not raw_opts and isinstance(raw_correcta, bool):
            opts, cidx = _vf_options(raw_correcta)
        else:
            opts = [{"id": i, "text": t} for i, t in enumerate(raw_opts)]
            cidx = int(raw_correcta)
        final_items.append(
            {
                "question_id": f"ft-{idx + 1}",
                "module_id": mod_id,
                "text": q.get("pregunta", ""),
                "options": opts,
                "correct_index": cidx,
                "explanation": q.get("explicacion_al_fallar", "") or "",
            }
        )
    if len(final_items) < 10:
        for mod_id, questions in (quizzes_doc.get("quizzes_por_modulo") or {}).items():
            for qi, q in enumerate(questions):
                if len(final_items) >= 10:
                    break
                raw_opts = q.get("opciones", [])
                raw_correcta = q.get("correcta", 0)
                if not raw_opts and isinstance(raw_correcta, bool):
                    opts, cidx = _vf_options(raw_correcta)
                else:
                    opts = [{"id": i, "text": t} for i, t in enumerate(raw_opts)]
                    cidx = int(raw_correcta)
                final_items.append(
                    {
                        "question_id": f"ft-{len(final_items) + 1}",
                        "module_id": mod_id,
                        "text": q.get("pregunta", ""),
                        "options": opts,
                        "correct_index": cidx,
                        "explanation": q.get("explicacion_al_fallar", "") or "",
                    }
                )
            if len(final_items) >= 10:
                break
    final_items = final_items[:10]

    for it in final_items:
        _upsert(
            "final_test",
            ["question_id", "module_id", "text", "options_json", "correct_index", "explanation"],
            (
                it["question_id"],
                it["module_id"],
                it["text"],
                json.dumps(it["options"], ensure_ascii=False),
                it["correct_index"],
                it["explanation"],
            ),
            ["question_id"],
        )

    # Export final_test JSON (required by task spec)
    final_export = [
        {
            "id": it["question_id"],
            "moduleId": it["module_id"],
            "pregunta": it["text"],
            "opciones": [o["text"] for o in it["options"]],
            "correcta": it["correct_index"],
            "explicacion": it["explanation"],
        }
        for it in final_items
    ]
    with open(FINAL_TEST_JSON, "w", encoding="utf-8") as f:
        json.dump(final_export, f, ensure_ascii=False, indent=2)


# ── Lightweight accessors (same names & return types as original) ──────────
def _modules_all():
    return _fetchall("SELECT * FROM modules ORDER BY ordering")


def _module_by_id(mid: str):
    return _fetchone("SELECT * FROM modules WHERE id = ?", (mid,))


def _quiz_by_module(mid: str):
    return _fetchone("SELECT * FROM quizzes WHERE module_id = ?", (mid,))


def _glossary_all():
    if USE_PG:
        return _fetchall("SELECT * FROM glossary ORDER BY term")
    return _fetchall("SELECT * FROM glossary ORDER BY term COLLATE NOCASE")


def _glossary_by_id(tid: str):
    return _fetchone("SELECT * FROM glossary WHERE id = ?", (tid,))


def _checklist_items(role: str):
    return _fetchall(
        "SELECT * FROM checklist_items WHERE role = ? ORDER BY item_order",
        (role,),
    )


def _checklist_progress(role: str) -> Dict[str, int]:
    rows = _fetchall(
        "SELECT item_id, completed FROM checklist_progress WHERE role = ?", (role,)
    )
    return {r["item_id"]: int(r["completed"]) for r in rows}


def _upsert_checklist_progress(role: str, items: List[dict]) -> None:
    for it in items:
        _exec(
            "INSERT INTO checklist_progress (role, item_id, completed) VALUES (?,?,?) "
            "ON CONFLICT(role, item_id) DO UPDATE SET completed=excluded.completed",
            (role, it["id"], 1 if it.get("completed") else 0),
        )


def _final_test_questions():
    return _fetchall("SELECT * FROM final_test ORDER BY question_id")


# ── Export ──────────────────────────────────────────────────────────────────
__all__ = [
    "VALID_ROLES",
    "SECTION_DEFAULTS",
    "init_db",
    "get_conn",
    "DATA_DIR",
    "DB_PATH",
    "FINAL_TEST_JSON",
    "_modules_all",
    "_module_by_id",
    "_quiz_by_module",
    "_glossary_all",
    "_glossary_by_id",
    "_checklist_items",
    "_checklist_progress",
    "_upsert_checklist_progress",
    "_final_test_questions",
]