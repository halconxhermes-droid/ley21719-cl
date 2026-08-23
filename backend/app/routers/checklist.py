"""Checklist router (/api/v1/checklist)"""
from __future__ import annotations

from typing import Dict, List

from fastapi import APIRouter, HTTPException

from app.db import (
    VALID_ROLES,
    _checklist_items,
    _checklist_progress,
    _upsert_checklist_progress,
)
from app.models import (
    ChecklistResponse,
    ChecklistBody,
    ChecklistSection,
    ChecklistItem,
    ChecklistProgress,
    ChecklistSubmitRequest,
    ChecklistSubmitResponse,
    ChecklistSubmitBody,
)

router = APIRouter(prefix="/checklist", tags=["checklist"])

# Section titles for API output (matching contract structure)
SECTION_TITLES = {
    "gobernanza": "Gobernanza y políticas",
    "derechos-arsop": "Derechos y solicitudes (ARSOP)",
    "seguridad-brechas": "Seguridad y brechas",
    "proveedores-transferencias": "Proveedores y transferencias",
    "cultura-cumplimiento": "Cultura y cumplimiento continuo",
}


def _build_checklist_response(role: str) -> ChecklistResponse:
    items_rows = _checklist_items(role)
    progress_map = _checklist_progress(role)

    # Group by section
    sections_map: Dict[str, List[dict]] = {}
    for r in items_rows:
        sec = r["section_id"]
        sections_map.setdefault(sec, []).append(r)

    sections = []
    total_completed = 0
    total_items = len(items_rows)

    for sec_id, items in sorted(sections_map.items()):
        sec_items = []
        for it in items:
            completed = bool(progress_map.get(it["item_id"], 0))
            if completed:
                total_completed += 1
            sec_items.append(
                ChecklistItem(
                    id=it["item_id"],
                    text=it["text"],
                    legalRef=it["legal_ref"] or None,
                    guideUrl=it["guide_url"],
                    completed=completed,
                )
            )
        sections.append(
            ChecklistSection(
                id=sec_id,
                title=SECTION_TITLES.get(sec_id, sec_id.replace("-", " ").title()),
                order=list(SECTION_TITLES.keys()).index(sec_id) + 1 if sec_id in SECTION_TITLES else 99,
                items=sec_items,
            )
        )

    pct = int((total_completed / total_items * 100)) if total_items else 0
    return ChecklistResponse(
        checklist=ChecklistBody(
            role=role,
            sections=sections,
            progress=ChecklistProgress(
                completed=total_completed, total=total_items, percentage=pct
            ),
        )
    )


@router.get("/{rol}", response_model=ChecklistResponse)
def get_checklist(rol: str):
    if rol not in VALID_ROLES:
        raise HTTPException(
            status_code=404,
            detail={
                "error": {
                    "code": "NOT_FOUND",
                    "message": f"Rol inválido o no soportado: {rol}. Roles válidos: {', '.join(VALID_ROLES)}",
                    "details": {"resource": "checklist", "role": rol, "valid": VALID_ROLES},
                }
            },
        )
    return _build_checklist_response(rol)


@router.post("/{rol}", response_model=ChecklistSubmitResponse)
def update_checklist(rol: str, payload: ChecklistSubmitRequest):
    if rol not in VALID_ROLES:
        raise HTTPException(
            status_code=404,
            detail={
                "error": {
                    "code": "NOT_FOUND",
                    "message": f"Rol inválido o no soportado: {rol}",
                    "details": {"resource": "checklist", "role": rol, "valid": VALID_ROLES},
                }
            },
        )

    # Upsert progress
    _upsert_checklist_progress(rol, [it.model_dump() for it in payload.items])

    # Return updated progress
    items_rows = _checklist_items(rol)
    progress_map = _checklist_progress(rol)
    completed = sum(1 for it in items_rows if progress_map.get(it["item_id"], 0))
    total = len(items_rows)
    pct = int((completed / total * 100)) if total else 0

    return ChecklistSubmitResponse(
        checklist=ChecklistSubmitBody(
            role=rol,
            progress=ChecklistProgress(completed=completed, total=total, percentage=pct),
        )
    )