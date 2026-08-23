"""Quizzes router (/api/v1/quizzes)"""
from __future__ import annotations

import json
from fastapi import APIRouter, HTTPException

from app.db import _quiz_by_module, _module_by_id
from app.models import (
    QuizResponse,
    QuizBody,
    QuizQuestion,
    QuizOption,
    QuizSubmitRequest,
    QuizSubmitResponse,
    QuizSubmitResult,
    QuizExplanation,
)

router = APIRouter(prefix="/quizzes", tags=["quizzes"])


@router.get("/{module_id}", response_model=QuizResponse)
def get_quiz(module_id: str):
    # Verify module exists
    mod = _module_by_id(module_id)
    if not mod:
        raise HTTPException(
            status_code=404,
            detail={
                "error": {
                    "code": "NOT_FOUND",
                    "message": f"Módulo no encontrado: {module_id}",
                    "details": {"resource": "module", "id": module_id},
                }
            },
        )

    row = _quiz_by_module(module_id)
    if not row:
        raise HTTPException(
            status_code=404,
            detail={
                "error": {
                    "code": "NOT_FOUND",
                    "message": f"Quiz no encontrado para el módulo: {module_id}",
                    "details": {"resource": "quiz", "moduleId": module_id},
                }
            },
        )

    raw_q = json.loads(row["questions_json"])
    # Stripping correct answer in GET response per contract
    public_questions = []
    for q in raw_q:
        public_questions.append(
            QuizQuestion(
                id=q["id"],
                text=q["text"],
                options=[QuizOption(id=o["id"], text=o["text"]) for o in q["options"]],
                explanation=q["explanation"],
            )
        )

    return QuizResponse(
        quiz=QuizBody(
            moduleId=module_id,
            questions=public_questions,
            totalQuestions=len(public_questions),
        )
    )


@router.post("/{module_id}/submit", response_model=QuizSubmitResponse)
def submit_quiz(module_id: str, payload: QuizSubmitRequest):
    row = _quiz_by_module(module_id)
    if not row:
        raise HTTPException(
            status_code=404,
            detail={
                "error": {
                    "code": "NOT_FOUND",
                    "message": f"Quiz no encontrado para el módulo: {module_id}",
                    "details": {"resource": "quiz", "moduleId": module_id},
                }
            },
        )

    questions = json.loads(row["questions_json"])
    if len(payload.answers) != len(questions):
        raise HTTPException(
            status_code=400,
            detail={
                "error": {
                    "code": "VALIDATION_ERROR",
                    "message": f"Se esperaban {len(questions)} respuestas, se recibieron {len(payload.answers)}",
                    "details": {
                        "field": "answers",
                        "expected": f"Array of length {len(questions)}",
                    },
                }
            },
        )

    score = 0
    correct_indices = []
    explanations = []

    for idx, (q, user_ans) in enumerate(zip(questions, payload.answers)):
        correct_idx = q["correctIndex"]
        if user_ans == correct_idx:
            score += 1
            correct_indices.append(idx)
        explanations.append(
            QuizExplanation(
                questionId=q["id"],
                correctIndex=correct_idx,
                explanation=q["explanation"],
            )
        )

    passed = (score / len(questions)) >= 0.7 if questions else False

    return QuizSubmitResponse(
        result=QuizSubmitResult(
            score=score,
            total=len(questions),
            passed=passed,
            correctIndices=correct_indices,
            explanations=explanations,
        )
    )
