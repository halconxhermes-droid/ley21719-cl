"""SQLite-backed data layer loaded from docs/*.json at startup.

Keeps a single global Store instance. SQLite DB lives at app/data/app.db
and is recreated from the JSON sources on init_db().
"""
from __future__ import annotations

import json
import re
import sqlite3
from pathlib import Path
from typing import Dict, List, Optional

DOCS_DIR = Path(__file__).resolve().parents[2].joinpath("docs")
DATA_DIR = Path(__file__).resolve().parent.joinpath("data")
DB_PATH = DATA_DIR / "app.db"
FINAL_TEST_JSON = DATA_DIR / "final_test.json"

VALID_ROLES = ["empresas", "ciudadanos", "desarrolladores", "instituciones-publicas"]
# Map docs checklist keys -> API role slugs
CHECKLIST_KEY_TO_ROLE = {
    "empresa": "empresas",
    "ciudadano": "ciudadanos",
    "desarrollador": "desarrolladores",
    "institucion": "instituciones-publicas",
}

# Map internal empresa/... IDs to the API contract slug module IDs if needed
# Use the raw IDs from contenido.json
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


def get_conn() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db() -> None:
    """Create tables and load from docs/*.json + final_test source."""
    DATA_DIR.mkdir(parents=True, exist_ok=True)

    # Remove existing DB before recreate
    if DB_PATH.exists():
        DB_PATH.unlink()

    conn = get_conn()
    cur = conn.cursor()

    # Create tables
    cur.executescript(
        """
        CREATE TABLE modules (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            slug TEXT NOT NULL,
            ordering INTEGER NOT NULL,
            description TEXT NOT NULL,
            levels_json TEXT NOT NULL
        );
        CREATE TABLE quizzes (
            module_id TEXT PRIMARY KEY,
            questions_json TEXT NOT NULL
        );
        CREATE TABLE glossary (
            id TEXT PRIMARY KEY,
            term TEXT NOT NULL,
            definition TEXT NOT NULL,
            category TEXT,
            legal_ref TEXT,
            related_terms_json TEXT
        );
        CREATE TABLE checklist_items (
            role TEXT NOT NULL,
            section_id TEXT NOT NULL,
            item_id TEXT NOT NULL,
            item_order INTEGER NOT NULL,
            text TEXT NOT NULL,
            legal_ref TEXT,
            guide_url TEXT,
            PRIMARY KEY (role, item_id)
        );
        CREATE TABLE checklist_progress (
            role TEXT NOT NULL,
            item_id TEXT NOT NULL,
            completed INTEGER NOT NULL DEFAULT 0,
            PRIMARY KEY (role, item_id)
        );
        CREATE TABLE glossary_search (
            id TEXT PRIMARY KEY,
            category TEXT,
            letter TEXT
        );
        CREATE TABLE final_test (
            question_id TEXT PRIMARY KEY,
            module_id TEXT NOT NULL,
            text TEXT NOT NULL,
            options_json TEXT NOT NULL,
            correct_index INTEGER NOT NULL,
            explanation TEXT NOT NULL
        );
        """
    )

    # ---- Load modules from docs/contenido.json ----
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
        # Build description: first non-header line of contenido_md
        lines = [l.strip() for l in contenido_md.split("\n") if l.strip() and not l.strip().startswith("#")]
        description = lines[0][:200] if lines else titulo
        # Build bullets from markdown headers/content
        bullets = []
        for line in contenido_md.split("\n"):
            line = line.strip()
            if line.startswith("-") or line.startswith("*"):
                bullets.append(line.lstrip("-* ").strip())
        if not bullets:
            for line in lines[:3]:
                bullets.append(line[:120])
        key_terms = m.get("terminos_glosario", [])
        escenario = m.get("escenario", "")
        # Build legal articles: split markdown by section headings
        articles = []
        current_title = ""
        current_text = []
        for line in contenido_md.split("\n"):
            ls = line.strip()
            if ls.startswith("## "):
                if current_title:
                    articles.append(
                        {
                            "number": f"Sección {len(articles)+1}",
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
                    "number": f"Sección {len(articles)+1}",
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
        # Build levels object
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
                            [{"title": "Escenario destacado", "content": escenario}]
                            if escenario
                            else []
                        ),
                        "keyFacts": (
                            [{"icon": "pin", "text": f"Tiempo estimado: {minutos} min"}]
                            if minutos
                            else []
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
        # estimatedMinutes bundle for summary card
        estimated_bundle = {"summary": 3, "friendly": minutos, "legal": max(20, minutos * 2)}
        meta = {
            "estimatedMinutes": estimated_bundle,
            "level_hint": nivel,
        }
        # Store levels_json + meta in levels_json
        payload = {"levels": levels, "meta": meta}
        cur.execute(
            "INSERT INTO modules (id, title, slug, ordering, description, levels_json) VALUES (?,?,?,?,?,?)",
            (m_id, titulo, slug, idx, description, json.dumps(payload, ensure_ascii=False)),
        )

    # ---- Load quizzes from docs/quizzes.json ----
    with open(DOCS_DIR / "quizzes.json", "r", encoding="utf-8") as f:
        quizzes_doc = json.load(f)

    for mod_id, questions in (quizzes_doc.get("quizzes_por_modulo") or {}).items():
        q_rows = []
        for idx, q in enumerate(questions):
            q_rows.append(
                {
                    "id": f"{mod_id}-q{idx+1}",
                    "text": q.get("pregunta", ""),
                    "options": [{"id": i, "text": t} for i, t in enumerate(q.get("opciones", []))],
                    "correctIndex": int(q.get("correcta", 0)),
                    "explanation": q.get("explicacion_al_fallar", "") or q.get("explicacion", ""),
                }
            )
        cur.execute(
            "INSERT INTO quizzes (module_id, questions_json) VALUES (?,?)",
            (mod_id, json.dumps(q_rows, ensure_ascii=False)),
        )

    # ---- Load glossary from docs/glosario.json ----
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
        # Infer category heuristically if missing
        if not category:
            category = "juridica"
        # Infer letter
        letter = (term.strip()[0].upper() if term else "") or (t_id[0].upper() if t_id else "")
        legal_ref = legal_ref or None
        category = category or "general"
        cur.execute(
            "INSERT INTO glossary (id, term, definition, category, legal_ref, related_terms_json) VALUES (?,?,?,?,?,?)",
            (t_id, term, definition, category, legal_ref, json.dumps(related or [])),
        )

    # ---- Load checklist from docs/checklist.json ----
    with open(DOCS_DIR / "checklist.json", "r", encoding="utf-8") as f:
        checklist_doc = json.load(f)
    checklists = checklist_doc.get("checklists", {})
    for src_key, items in checklists.items():
        role = CHECKLIST_KEY_TO_ROLE.get(src_key, src_key)
        # Group items into sections: assign to a default section per role
        # Spread items across sections for richer UX
        section_ids = ["gobernanza", "derechos-arsop", "seguridad-brechas", "cultura-cumplimiento"]
        for idx, it in enumerate(items or []):
            sec = section_ids[idx % len(section_ids)]
            item_id = f"{role}-{sec}-{idx+1}"
            cur.execute(
                "INSERT INTO checklist_items (role, section_id, item_id, item_order, text, legal_ref, guide_url) VALUES (?,?,?,?,?,?,?)",
                (
                    role,
                    sec,
                    item_id,
                    idx + 1,
                    (it.get("item", "") or "").strip(),
                    it.get("referencia_modulo") or "",
                    None,
                ),
            )

    # ---- Build final_test: 10 questions from quizzes + docs test_final ----
    final_items: List[dict] = []
    # Load raw test_final if present (10 questions already)
    test_final_raw = quizzes_doc.get("test_final") or []
    # Map raw items to module assignment round-robin if no module info
    mod_ids = [m["id"] for m in modulos]
    for idx, q in enumerate(test_final_raw):
        mod_id = mod_ids[idx % len(mod_ids)]
        final_items.append(
            {
                "question_id": f"ft-{idx+1}",
                "module_id": mod_id,
                "text": q.get("pregunta", ""),
                "options": [{"id": i, "text": t} for i, t in enumerate(q.get("opciones", []))],
                "correct_index": int(q.get("correcta", 0)),
                "explanation": q.get("explicacion_al_fallar", "") or "",
            }
        )
    # Ensure exactly 10 by borrowing from quizzes if needed (already 10 here, keep as-is)
    if len(final_items) < 10:
        # Fill from quiz pool
        for mod_id, questions in (quizzes_doc.get("quizzes_por_modulo") or {}).items():
            for qi, q in enumerate(questions):
                if len(final_items) >= 10:
                    break
                final_items.append(
                    {
                        "question_id": f"ft-{len(final_items)+1}",
                        "module_id": mod_id,
                        "text": q.get("pregunta", ""),
                        "options": [{"id": i, "text": t} for i, t in enumerate(q.get("opciones", []))],
                        "correct_index": int(q.get("correcta", 0)),
                        "explanation": q.get("explicacion_al_fallar", "") or "",
                    }
                )
            if len(final_items) >= 10:
                break
    final_items = final_items[:10]

    for it in final_items:
        cur.execute(
            "INSERT INTO final_test (question_id, module_id, text, options_json, correct_index, explanation) VALUES (?,?,?,?,?,?)",
            (
                it["question_id"],
                it["module_id"],
                it["text"],
                json.dumps(it["options"], ensure_ascii=False),
                it["correct_index"],
                it["explanation"],
            ),
        )

    # Persist backend/app/data/final_test.json (required by task spec)
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

    conn.commit()
    conn.close()


# ---------------------------------------------------------------------------
# Lightweight accessors (used by routers)
# ---------------------------------------------------------------------------
def _modules_all():
    conn = get_conn()
    rows = conn.execute("SELECT * FROM modules ORDER BY ordering").fetchall()
    conn.close()
    return rows


def _module_by_id(mid: str):
    conn = get_conn()
    row = conn.execute("SELECT * FROM modules WHERE id = ?", (mid,)).fetchone()
    conn.close()
    return row


def _quiz_by_module(mid: str):
    conn = get_conn()
    row = conn.execute("SELECT * FROM quizzes WHERE module_id = ?", (mid,)).fetchone()
    conn.close()
    return row


def _glossary_all():
    conn = get_conn()
    rows = conn.execute("SELECT * FROM glossary ORDER BY term COLLATE NOCASE").fetchall()
    conn.close()
    return rows


def _glossary_by_id(tid: str):
    conn = get_conn()
    row = conn.execute("SELECT * FROM glossary WHERE id = ?", (tid,)).fetchone()
    conn.close()
    return row


def _checklist_items(role: str):
    conn = get_conn()
    rows = conn.execute(
        "SELECT * FROM checklist_items WHERE role = ? ORDER BY item_order",
        (role,),
    ).fetchall()
    conn.close()
    return rows


def _checklist_progress(role: str) -> Dict[str, int]:
    conn = get_conn()
    rows = conn.execute(
        "SELECT item_id, completed FROM checklist_progress WHERE role = ?", (role,)
    ).fetchall()
    conn.close()
    return {r["item_id"]: int(r["completed"]) for r in rows}


def _upsert_checklist_progress(role: str, items: List[dict]) -> None:
    conn = get_conn()
    for it in items:
        conn.execute(
            "INSERT INTO checklist_progress (role, item_id, completed) VALUES (?,?,?) "
            "ON CONFLICT(role, item_id) DO UPDATE SET completed=excluded.completed",
            (role, it["id"], 1 if it.get("completed") else 0),
        )
    conn.commit()
    conn.close()


def _final_test_questions():
    conn = get_conn()
    rows = conn.execute("SELECT * FROM final_test ORDER BY question_id").fetchall()
    conn.close()
    return rows


# Avoid tight import coupling — routers import these symbols directly
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
