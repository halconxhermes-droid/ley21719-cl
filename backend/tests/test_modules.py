"""Tests for GET /api/v1/modules and GET /api/v1/modules/{id}."""
from __future__ import annotations

EXPECTED_MODULE_IDS = ["empresa", "ciudadano", "desarrollador", "institucion"]


def test_get_modules_returns_200_and_list(client):
    res = client.get("/api/v1/modules")
    assert res.status_code == 200
    data = res.json()
    assert "modules" in data
    assert isinstance(data["modules"], list)
    assert len(data["modules"]) == 4


def test_get_modules_total_field(client):
    res = client.get("/api/v1/modules")
    data = res.json()
    assert data["total"] == len(data["modules"]) == 4


def test_get_modules_ordered_and_fields(client):
    res = client.get("/api/v1/modules")
    modules = res.json()["modules"]
    orders = [m["order"] for m in modules]
    assert orders == sorted(orders) == [1, 2, 3, 4]
    for m in modules:
        for key in ("id", "title", "slug", "order", "estimatedMinutes", "description"):
            assert key in m, f"missing {key} in module summary"
        est = m["estimatedMinutes"]
        assert set(est.keys()) >= {"summary", "friendly", "legal"}
        assert all(isinstance(v, int) and v > 0 for v in est.values())


def test_get_module_by_id_happy_path_all_levels(client):
    res = client.get("/api/v1/modules/empresa")
    assert res.status_code == 200
    mod = res.json()["module"]
    assert mod["id"] == "empresa"
    levels = mod["levels"]
    assert set(levels.keys()) == {"summary", "friendly", "legal"}
    # summary level structure
    assert isinstance(levels["summary"]["bullets"], list)
    assert levels["summary"]["bullets"]
    assert isinstance(levels["summary"]["estimatedMinutes"], int)
    # friendly level structure
    assert isinstance(levels["friendly"]["sections"], list)
    assert levels["friendly"]["sections"]
    section = levels["friendly"]["sections"][0]
    assert {"heading", "content"} <= set(section.keys())
    # legal level structure
    assert isinstance(levels["legal"]["articles"], list)
    assert levels["legal"]["articles"]
    article = levels["legal"]["articles"][0]
    assert {"number", "title", "text"} <= set(article.keys())


def test_get_module_by_id_404_contract_error(client):
    res = client.get("/api/v1/modules/no-existe")
    assert res.status_code == 404
    err = res.json()["error"]
    assert err["code"] == "NOT_FOUND"
    assert "no-existe" in err["message"] or "Módulo no encontrado" in err["message"]


def test_get_module_each_real_id(client):
    for mid in EXPECTED_MODULE_IDS:
        res = client.get(f"/api/v1/modules/{mid}")
        assert res.status_code == 200, mid
        assert res.json()["module"]["id"] == mid
