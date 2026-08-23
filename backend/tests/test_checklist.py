"""Tests for /api/v1/checklist endpoints."""
from __future__ import annotations

VALID_ROLE = "empresas"
INVALID_ROLE = "rol-inexistente"


def test_get_checklist_happy_path(client):
    res = client.get(f"/api/v1/checklist/{VALID_ROLE}")
    assert res.status_code == 200
    checklist = res.json()["checklist"]
    assert checklist["role"] == VALID_ROLE
    assert isinstance(checklist["sections"], list)
    assert checklist["sections"]
    section = checklist["sections"][0]
    for key in ("id", "title", "order", "items"):
        assert key in section
    item = section["items"][0]
    for key in ("id", "text", "completed"):
        assert key in item
    progress = checklist["progress"]
    assert {"completed", "total", "percentage"} <= set(progress.keys())
    assert progress["total"] > 0


def test_get_checklist_all_roles_valid(client):
    for role in ["empresas", "ciudadanos", "desarrolladores", "instituciones-publicas"]:
        res = client.get(f"/api/v1/checklist/{role}")
        assert res.status_code == 200, role
        body = res.json()["checklist"]
        assert body["role"] == role
        assert len(body["sections"]) >= 1
        assert body["progress"]["total"] >= 5


def test_get_checklist_invalid_role_404_contract_error(client):
    res = client.get(f"/api/v1/checklist/{INVALID_ROLE}")
    assert res.status_code == 404
    err = res.json()["error"]
    assert err["code"] == "NOT_FOUND"
    assert INVALID_ROLE in err["message"] or "Rol" in err["message"]


def test_post_checklist_persists_progress(client):
    # Get checklist and mark first two items completed
    checklist = client.get(f"/api/v1/checklist/{VALID_ROLE}").json()["checklist"]
    items = [i for s in checklist["sections"] for i in s["items"]]
    first_two = [{"id": i["id"], "completed": True} for i in items[:2]]

    res = client.post(f"/api/v1/checklist/{VALID_ROLE}", json={"items": first_two})
    assert res.status_code == 200
    body = res.json()["checklist"]
    assert body["role"] == VALID_ROLE
    assert body["progress"]["completed"] >= 2
    expected_pct = int(body["progress"]["completed"] / body["progress"]["total"] * 100)
    assert body["progress"]["percentage"] == expected_pct

    # Verify persistence via GET: those two items must now be completed=True
    updated = client.get(f"/api/v1/checklist/{VALID_ROLE}").json()["checklist"]
    flat = {i["id"]: i["completed"] for s in updated["sections"] for i in s["items"]}
    marked_ids = {i["id"] for i in first_two}
    for iid in marked_ids:
        assert flat[iid] is True
    assert updated["progress"]["completed"] == sum(1 for v in flat.values() if v)


def test_post_checklist_can_unmark_items(client):
    checklist = client.get(f"/api/v1/checklist/{VALID_ROLE}").json()["checklist"]
    items = [i for s in checklist["sections"] for i in s["items"]]
    payload = [{"id": i["id"], "completed": False} for i in items]

    res = client.post(f"/api/v1/checklist/{VALID_ROLE}", json={"items": payload})
    assert res.status_code == 200
    body = res.json()["checklist"]
    assert body["progress"]["completed"] == 0
    assert body["progress"]["percentage"] == 0

    # Restore one item so other tests see a realistic state (not required, but tidy)
    client.post(
        f"/api/v1/checklist/{VALID_ROLE}",
        json={"items": [{"id": items[0]["id"], "completed": True}]},
    )


def test_post_checklist_invalid_role_404(client):
    res = client.post(
        f"/api/v1/checklist/{INVALID_ROLE}", json={"items": []}
    )
    assert res.status_code == 404
    assert res.json()["error"]["code"] == "NOT_FOUND"


def test_post_checklist_missing_items_field_400(client):
    res = client.post(f"/api/v1/checklist/{VALID_ROLE}", json={})
    assert res.status_code == 400
    err = res.json()["error"]
    assert err["code"] == "VALIDATION_ERROR"
