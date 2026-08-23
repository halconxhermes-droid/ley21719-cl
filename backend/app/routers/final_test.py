"""Final test router (/api/v1/final-test)."""
from __future__ import annotations

from typing import Dict

import json

from fastapi import APIRouter, HTTPException

from app.db import _final_test_questions
from app.models import (
    FinalTestResponse,
    FinalTestBody,
    FinalTestQuestion,
    FinalTestSubmitRequest,
    FinalTestSubmitResult,
    ModuleBreakdown,
    FinalTestSubmitResponse,
    QuizOption,
)

router = APIRouter(prefix="/final-test", tags=["final-test"])

PASS_THRESHOLD = 70


@router.get("", response_model=FinalTestResponse)
def get_final_test():
    rows = _final_test_questions()
    test_qs = []
    for r in rows:
        opts = json.loads(r["options_json"])
        test_qs.append(
            FinalTestQuestion(
                id=r["question_id"],
                moduleId=r["module_id"],
                text=r["text"],
                options=[QuizOption(**o) for o in opts],
            )
        )
    return FinalTestResponse(
        test=FinalTestBody(
            questions=test_qs,
            totalQuestions=len(test_qs),
            passThreshold=PASS_THRESHOLD,
        )
    )


@router.post("/submit", response_model=FinalTestSubmitResponse)
def final_test_submit(payload: FinalTestSubmitRequest):
    rows = _final_test_questions()
    total = len(rows)
    if len(payload.answers) != total:
        raise HTTPException(
            status_code=400,
            detail={
                "error": {
                    "code": "VALIDATION_ERROR",
                    "message": f"Se esperaban {total} respuestas, se recibieron {len(payload.answers)}",
                    "details": {"field": "answers", "expected": f"Array of length {total}"},
                }
            },
        )

    score = 0
    correct_by_module: Dict[str, int] = {}
    total_by_module: Dict[str, int] = {}

    for ans, qrow in zip(payload.answers, rows):
        mod_id = qrow["module_id"]
        total_by_module[mod_id] = total_by_module.get(mod_id, 0) + 1
        if ans == int(qrow["correct_index"]):
            score += 1
            correct_by_module[mod_id] = correct_by_module.get(mod_id, 0) + 1

    detail_by_module = []
    seen = list(dict.fromkeys(r["module_id"] for r in rows))
    for mod_id in seen:
        tot = total_by_module.get(mod_id, 0)
        corr = correct_by_module.get(mod_id, 0)
        detail_by_module.append(
            ModuleBreakdown(
                moduleId=mod_id,
                correct=corr,
                total=tot,
                percentage=int(corr / tot * 100) if tot else 0,
            )
        )

    percentage = int(score / total * 100) if total else 0
    passed = percentage >= PASS_THRESHOLD

    return FinalTestSubmitResponse(
        result=FinalTestSubmitResult(
            score=score,
            total=total,
            percentage=percentage,
            passed=passed,
            detailByModule=detail_by_module,
            certificateEligible=passed,
        )
    )
