"""Tests for /api/v1/glossary endpoints."""
from __future__ import annotations


def test_get_glossary_full_list(client):
    res = client.get("/api/v1/glossary")
    assert res.status_code == 200
    data = res.json()
    assert data["total"] >= 20
    assert data["total"] == len(data["terms"])
    term = data["terms"][0]
    for key in ("id", "term", "definition"):
        assert key in term


def test_get_glossary_search_q_matches(client):
    res = client.get("/api/v1/glossary", params={"q": "dato"})
    assert res.status_code == 200
    data = res.json()
    assert data["total"] >= 1
    assert all(
        ("dato" in t["term"].lower() or "dato" in t["definition"].lower())
        for t in data["terms"]
    )


def test_get_glossary_search_no_results(client):
    res = client.get("/api/v1/glossary", params={"q": "zzzznada"})
    assert res.status_code == 200
    assert res.json()["terms"] == []
    assert res.json()["total"] == 0


def test_get_glossary_term_detail_happy_path(client):
    # First obtain a valid term id from the list
    terms = client.get("/api/v1/glossary").json()["terms"]
    tid = terms[0]["id"]
    res = client.get(f"/api/v1/glossary/{tid}")
    assert res.status_code == 200
    term = res.json()["term"]
    assert term["id"] == tid
    assert term["definition"]
    assert isinstance(term.get("relatedTerms"), list)
    for rel in term["relatedTerms"]:
        assert {"id", "term"} <= set(rel.keys())


def test_get_glossary_term_404_contract_error(client):
    res = client.get("/api/v1/glossary/termino-inexistente")
    assert res.status_code == 404
    err = res.json()["error"]
    assert err["code"] == "NOT_FOUND"
