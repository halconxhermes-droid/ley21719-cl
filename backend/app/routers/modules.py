"""Modules router (/api/v1/modules)"""
from __future__ import annotations

import json
from fastapi import APIRouter, HTTPException

from app.db import _modules_all, _module_by_id
from app.models import ModulesResponse, ModuleResponse, ModuleSummary, ModuleDetail, ModuleLevels

router = APIRouter(prefix="/modules", tags=["modules"])


@router.get("", response_model=ModulesResponse)
def get_modules():
    rows = _modules_all()
    summaries = []
    for r in rows:
        meta = json.loads(r["levels_json"]).get("meta", {})
        summaries.append(
            ModuleSummary(
                id=r["id"],
                title=r["title"],
                slug=r["slug"],
                order=r["ordering"],
                estimatedMinutes=meta.get(
                    "estimatedMinutes", {"summary": 3, "friendly": 15, "legal": 25}
                ),
                description=r["description"],
            )
        )
    return ModulesResponse(modules=summaries, total=len(summaries))


@router.get("/{id}", response_model=ModuleResponse)
def get_module_by_id(id: str):
    r = _module_by_id(id)
    if not r:
        raise HTTPException(
            status_code=404,
            detail={
                "error": {
                    "code": "NOT_FOUND",
                    "message": f"Módulo no encontrado: {id}",
                    "details": {"resource": "module", "id": id},
                }
            },
        )
    data = json.loads(r["levels_json"])
    levels = data.get("levels", {})
    detail = ModuleDetail(
        id=r["id"],
        title=r["title"],
        slug=r["slug"],
        order=r["ordering"],
        levels=levels,
    )
    return ModuleResponse(module=detail)
