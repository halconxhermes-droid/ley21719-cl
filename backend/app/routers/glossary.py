"""Glossary router (/api/v1/glossary)"""
from __future__ import annotations

import json
from typing import List, Optional

from fastapi import APIRouter, HTTPException, Query

from app.db import _glossary_all, _glossary_by_id
from app.models import (
    GlossaryResponse,
    GlossaryTerm,
    GlossaryTermResponse,
    GlossaryTermRelated,
    GlossaryTermDetail,
)


router = APIRouter(prefix="/glossary", tags=["glossary"])


@router.get("", response_model=GlossaryResponse)
def get_glossary(
    q: str | None = None,
    category: str | None = None,
    letter: str | None = None,
    limit: int = 100,
):
    terms = _glossary_all()
    results: List[GlossaryTerm] = []

    for r in terms:
        q_match = not q or q.lower() in r["term"].lower()
        cat_match = not category or category.lower() == (r["category"] or "").lower()
        let_match = not letter or (
            letter.upper() == (r["id"].upper()[0] if r["id"] else "")
        )
        if q_match and cat_match and let_match:
            results.append(
                GlossaryTerm(
                    id=r["id"],
                    term=r["term"],
                    definition=r["definition"],
                    category=r["category"] or None,
                    legalRef=r["legal_ref"] or None,
                )
            )
            if len(results) >= limit:
                break

    # If len(letter) param present and >1 ignore - we just accept raw filters
    return GlossaryResponse(terms=results, total=len(results))


@router.get("/{tid}", response_model=GlossaryTermResponse)
def get_glossary_term(tid: str):
    row = _glossary_by_id(tid)
    if not row:
        raise HTTPException(
            status_code=404,
            detail={
                "error": {
                    "code": "NOT_FOUND",
                    "message": f"Término no encontrado: {tid}",
                    "details": {"resource": "term", "id": tid},
                }
            },
        )
    related = json.loads(row["related_terms_json"])
    related_models: List[GlossaryTermRelated] = [
        GlossaryTermRelated(id=r, term=r) for r in related
    ]
    return GlossaryTermResponse(
        term=GlossaryTermDetail(
            id=row["id"],
            term=row["term"],
            definition=row["definition"],
            category=row["category"] or None,
            legalRef=row["legal_ref"] or None,
            relatedTerms=related_models,
        )
    )