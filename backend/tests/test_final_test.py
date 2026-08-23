"""Tests for /api/v1/final-test endpoints."""
from __future__ import annotations

N_QUESTIONS = 10


def test_get_final_test_happy_path(client):
    res = client.get("/api/v1/final-test")
    assert res.status_code == 200
    test = res.json()["test"]
    assert test["totalQuestions"] == N_QUESTIONS
    assert test["passThreshold"] == 70
    assert len(test["questions"]) == N_QUESTIONS
    q = test["questions"][0]
    for key in ("id", "moduleId", "text", "options"):
        assert key in q
    assert len(q["options"]) >= 2
    # Correct answers must NOT be exposed
    assert "correctIndex" not in q
    assert "explanation" not in q


def test_final_test_questions_span_modules(client):
    test = client.get("/api/v1/final-test").json()["test"]
    module_ids = {q["moduleId"] for q in test["questions"]}
    assert len(module_ids) >= 2, "final test should combine questions from several modules"


def test_final_test_submit_structure_and_consistency(client):
    res = client.post("/api/v1/final-test/submit", json={"answers": [0] * N_QUESTIONS})
    assert res.status_code == 200
    result = res.json()["result"]
    assert {"score", "total", "percentage", "passed", "detailByModule", "certificateEligible"} <= set(
        result.keys()
    )
    assert result["total"] == N_QUESTIONS
    assert result["percentage"] == result["score"] * 10
    assert isinstance(result["passed"], bool)
    assert isinstance(result["certificateEligible"], bool)

    breakdown = result["detailByModule"]
    assert breakdown
    assert sum(b["total"] for b in breakdown) == N_QUESTIONS
    assert sum(b["correct"] for b in breakdown) == result["score"]
    for b in breakdown:
        expected_pct = int(b["correct"] / b["total"] * 100)
        assert b["percentage"] == expected_pct
        assert b["total"] > 0
        assert b["correct"] <= b["total"]


def test_final_test_submit_perfect_score(client):
    """Discover correct answers via stateless probing, then verify a perfect run."""
    n = N_QUESTIONS
    answers = []
    score_so_far = 0
    for pos in range(n):
        for opt in range(4):
            trial = list(answers) + [opt] + [0] * (n - len(answers) - 1)
            r = client.post("/api/v1/final-test/submit", json={"answers": trial})
            assert r.status_code == 200
            if r.json()["result"]["score"] == score_so_far + 1:
                answers.append(opt)
                score_so_far += 1
                break
        else:
            answers.append(0)  # no option increased the score; shouldn't happen

    final = client.post("/api/v1/final-test/submit", json={"answers": answers})
    result = final.json()["result"]
    assert result["score"] == n
    assert result["percentage"] == 100
    assert result["passed"] is True
    assert result["certificateEligible"] is True


def test_final_test_submit_wrong_length_400(client):
    res = client.post("/api/v1/final-test/submit", json={"answers": [0] * 5})
    assert res.status_code == 400
    err = res.json()["error"]
    assert err["code"] == "VALIDATION_ERROR"
    assert err["details"]["expected"] == "Array of length 10"


def test_final_test_submit_missing_answers_400(client):
    res = client.post("/api/v1/final-test/submit", json={})
    assert res.status_code == 400
    assert res.json()["error"]["code"] == "VALIDATION_ERROR"
