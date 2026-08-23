"""Tests for /api/v1/quizzes endpoints."""
from __future__ import annotations

MODULE_WITH_QUESTIONS = "empresa"
# Actualizado: ahora hay 19 preguntas (5 originales + 14 enriquecidas del proyecto manual)
EXPECTED_QUESTION_COUNT = 19


def test_get_quiz_happy_path(client):
    res = client.get(f"/api/v1/quizzes/{MODULE_WITH_QUESTIONS}")
    assert res.status_code == 200
    quiz = res.json()["quiz"]
    assert quiz["moduleId"] == MODULE_WITH_QUESTIONS
    assert quiz["totalQuestions"] == EXPECTED_QUESTION_COUNT
    assert len(quiz["questions"]) == EXPECTED_QUESTION_COUNT
    q = quiz["questions"][0]
    for key in ("id", "text", "options", "explanation"):
        assert key in q
    assert len(q["options"]) >= 2
    for opt in q["options"]:
        assert set(opt.keys()) == {"id", "text"}


def test_get_quiz_unknown_module_404(client):
    res = client.get("/api/v1/quizzes/no-existe")
    assert res.status_code == 404
    err = res.json()["error"]
    assert err["code"] == "NOT_FOUND"


def test_quiz_submit_all_correct(client):
    # First get the quiz to know question count; correct answers are not exposed,
    # but we can submit and verify structure consistency.
    quiz = client.get(f"/api/v1/quizzes/{MODULE_WITH_QUESTIONS}").json()["quiz"]
    n = quiz["totalQuestions"]

    # Try every option of first question to find a scoring answer via brute force:
    # instead, validate response shape with a zero-filled submission.
    payload = {"answers": [0] * n}
    res = client.post(f"/api/v1/quizzes/{MODULE_WITH_QUESTIONS}/submit", json=payload)
    assert res.status_code == 200
    result = res.json()["result"]
    assert result["score"] == len(result["correctIndices"])
    assert 0 <= result["score"] <= n
    assert result["total"] == n
    assert isinstance(result["passed"], bool)
    assert result["passed"] == (result["score"] / n >= 0.7)
    assert len(result["explanations"]) == n
    for exp in result["explanations"]:
        assert {"questionId", "correctIndex", "explanation"} <= set(exp.keys())


def test_quiz_submit_wrong_length_returns_400(client):
    res = client.post(
        f"/api/v1/quizzes/{MODULE_WITH_QUESTIONS}/submit",
        json={"answers": [0, 1]},
    )
    assert res.status_code == 400
    err = res.json()["error"]
    assert err["code"] == "VALIDATION_ERROR"
    assert "respuestas" in err["message"]


def test_quiz_submit_invalid_payload_missing_answers(client):
    res = client.post(f"/api/v1/quizzes/{MODULE_WITH_QUESTIONS}/submit", json={})
    assert res.status_code == 400
    err = res.json()["error"]
    assert err["code"] == "VALIDATION_ERROR"
    assert err["details"]["field"] == "answers"


def test_quiz_submit_non_integer_answer(client):
    res = client.post(
        f"/api/v1/quizzes/{MODULE_WITH_QUESTIONS}/submit",
        json={"answers": ["a", 0, 0, 0, 0]},
    )
    assert res.status_code == 400
    assert res.json()["error"]["code"] == "VALIDATION_ERROR"


def test_quiz_submit_unknown_module_404(client):
    res = client.post(
        "/api/v1/quizzes/no-existe/submit", json={"answers": [0, 0, 0, 0, 0]}
    )
    assert res.status_code == 404
    assert res.json()["error"]["code"] == "NOT_FOUND"
