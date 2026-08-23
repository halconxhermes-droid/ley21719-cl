"""Cross-cutting tests: error contract, CORS, OpenAPI, health."""
from __future__ import annotations


def test_health_endpoint(client):
    res = client.get("/health")
    assert res.status_code == 200
    assert res.json()["status"] == "ok"


def test_error_format_is_standard_everywhere(client):
    """Every error response must follow {error: {code, message}} per contract."""
    checks = [
        client.get("/api/v1/modules/no-existe"),
        client.get("/api/v1/quizzes/no-existe"),
        client.post("/api/v1/quizzes/empresa/submit", json={"answers": [0]}),
        client.get("/api/v1/checklist/no-role"),
        client.get("/api/v1/glossary/no-term"),
        client.post("/api/v1/final-test/submit", json={"answers": []}),
    ]
    for res in checks:
        assert res.status_code >= 400
        body = res.json()
        assert "error" in body, f"missing 'error' key in {res.request.url}"
        assert "code" in body["error"]
        assert "message" in body["error"]


def test_cors_headers_for_vite_dev_server(client):
    res = client.get(
        "/api/v1/modules",
        headers={"Origin": "http://localhost:5173"},
    )
    assert res.status_code == 200
    assert res.headers.get("access-control-allow-origin") == "http://localhost:5173"


def test_cors_preflight_from_vite_dev_server(client):
    res = client.options(
        "/api/v1/checklist/empresas",
        headers={
            "Origin": "http://localhost:5173",
            "Access-Control-Request-Method": "POST",
            "Access-Control-Request-Headers": "content-type",
        },
    )
    assert res.status_code in (200, 204)
    assert res.headers.get("access-control-allow-origin") == "http://localhost:5173"


def test_openapi_schema_available(client):
    res = client.get("/openapi.json")
    assert res.status_code == 200
    paths = res.json()["paths"]
    expected = [
        "/api/v1/modules",
        "/api/v1/modules/{id}",
        "/api/v1/quizzes/{module_id}",
        "/api/v1/quizzes/{module_id}/submit",
        "/api/v1/checklist/{rol}",
        "/api/v1/glossary",
        "/api/v1/glossary/{tid}",
        "/api/v1/final-test",
        "/api/v1/final-test/submit",
    ]
    for p in expected:
        assert p in paths, f"missing path {p} in openapi"
