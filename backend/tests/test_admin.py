"""Tests para el router admin (/api/v1/admin).

Cubre:
- Creación de contraseñas (manual y auto-generada)
- Consulta de contraseña por código
- Expiración manual
- Registro de uso
- Alertas de vencimiento próximo
"""
from __future__ import annotations

import pytest
from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


class TestAdminCreatePassword:
    """POST /api/v1/admin/passwords"""

    def test_create_password_manual_ok(self):
        """Crear contraseña manual con código, email y fecha."""
        response = client.post(
            "/api/v1/admin/passwords",
            json={
                "code": "TEST-MANUAL-001",
                "user_email": "test@example.com",
                "end_date": "2026-12-31 23:59:59",
            },
        )
        assert response.status_code == 200
        data = response.json()
        assert data["code"] == "TEST-MANUAL-001"
        assert data["user_email"] == "test@example.com"
        assert data["status"] == "active"
        assert data["total_sessions"] == 0
        assert "courses_accessed" in data

    def test_create_password_default_expiry(self):
        """Crear contraseña sin end_date → vence en 30 días."""
        response = client.post(
            "/api/v1/admin/passwords",
            json={"code": "TEST-DEFAULT-001"},
        )
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "active"
        assert data["end_date"] is not None

    def test_create_password_duplicate_updates(self):
        """Código duplicado actualiza en vez de duplicar."""
        code = "TEST-DUP-001"
        r1 = client.post("/api/v1/admin/passwords", json={"code": code})
        assert r1.status_code == 200
        r2 = client.post("/api/v1/admin/passwords", json={"code": code, "user_email": "new@example.com"})
        assert r2.status_code == 200
        assert r2.json()["user_email"] == "new@example.com"


class TestAdminGeneratePassword:
    """POST /api/v1/admin/passwords/generate"""

    def test_generate_password_ok(self):
        """Auto-generar contraseña retorna código aleatorio de 8 caracteres."""
        response = client.post("/api/v1/admin/passwords/generate")
        assert response.status_code == 200
        data = response.json()
        assert "code" in data
        assert len(data["code"]) == 8
        assert data["status"] == "active"

    def test_generate_password_with_email_and_days(self):
        """Generar con email y días de validez personalizados."""
        response = client.post(
            "/api/v1/admin/passwords/generate",
            params={"user_email": "gen@example.com", "days_valid": 7},
        )
        assert response.status_code == 200
        data = response.json()
        assert data["user_email"] == "gen@example.com"


class TestAdminGetPassword:
    """GET /api/v1/admin/passwords/{code}"""

    def test_get_password_ok(self):
        """Obtener contraseña existente."""
        client.post("/api/v1/admin/passwords", json={"code": "TEST-GET-001"})
        response = client.get("/api/v1/admin/passwords/TEST-GET-001")
        assert response.status_code == 200
        assert response.json()["code"] == "TEST-GET-001"

    def test_get_password_not_found(self):
        """Código inexistente retorna 404."""
        response = client.get("/api/v1/admin/passwords/NONEXISTENT")
        assert response.status_code == 404
        assert response.json()["error"]["code"] == "NOT_FOUND"


class TestAdminExpirePassword:
    """POST /api/v1/admin/passwords/{code}/expire"""

    def test_expire_password_ok(self):
        """Marcar contraseña como vencida."""
        client.post("/api/v1/admin/passwords", json={"code": "TEST-EXPIRE-001"})
        response = client.post("/api/v1/admin/passwords/TEST-EXPIRE-001/expire")
        assert response.status_code == 200
        assert response.json()["success"] is True
        assert response.json()["password"]["status"] == "expired"

    def test_expire_nonexistent(self):
        """Expirar código inexistente → 404."""
        response = client.post("/api/v1/admin/passwords/FAKE-CODE/expire")
        assert response.status_code == 404


class TestAdminRecordUsage:
    """POST /api/v1/admin/passwords/{code}/usage"""

    def test_record_usage_ok(self):
        """Registrar uso incrementa sesiones y registra módulo."""
        client.post("/api/v1/admin/passwords", json={"code": "TEST-USAGE-001"})
        response = client.post(
            "/api/v1/admin/passwords/TEST-USAGE-001/usage",
            params={"user_email": "user@test.com", "module_id": "modulo-1", "quiz_score": 80},
        )
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert data["password"]["total_sessions"] >= 1

    def test_record_usage_without_score(self):
        """Registrar uso sin score de quiz."""
        client.post("/api/v1/admin/passwords", json={"code": "TEST-USAGE-002"})
        response = client.post(
            "/api/v1/admin/passwords/TEST-USAGE-002/usage",
            params={"user_email": "user@test.com", "module_id": "modulo-2"},
        )
        assert response.status_code == 200

    def test_record_usage_nonexistent_password(self):
        """Usar contraseña inexistente → 404."""
        response = client.post(
            "/api/v1/admin/passwords/FAKE/usage",
            params={"user_email": "x@x.com", "module_id": "modulo-1"},
        )
        assert response.status_code == 404


class TestAdminAlerts:
    """GET /api/v1/admin/alerts/near-expiry"""

    def test_alerts_default_7_days(self):
        """Alertas con horizonte por defecto (7 días)."""
        response = client.get("/api/v1/admin/alerts/near-expiry")
        assert response.status_code == 200
        data = response.json()
        assert "count" in data
        assert "days_horizon" in data
        assert data["days_horizon"] == 7
        assert "passwords" in data

    def test_alerts_custom_days(self):
        """Alertas con horizonte personalizado."""
        response = client.get("/api/v1/admin/alerts/near-expiry", params={"days": 14})
        assert response.status_code == 200
        assert response.json()["days_horizon"] == 14


class TestAdminMetrics:
    """GET /api/v1/admin/metrics/summary"""

    def test_metrics_summary_ok(self):
        """Resumen de métricas retorna estructura completa."""
        response = client.get("/api/v1/admin/metrics/summary")
        assert response.status_code == 200
        data = response.json()
        # Estructura placeholder — reemplazar con cálculos reales
        assert "total_passwords_created" in data
        assert "active_passwords" in data
        assert "expired_passwords" in data
        assert "total_sessions_recorded" in data
        assert "unique_users" in data
        assert "near_expiry" in data
