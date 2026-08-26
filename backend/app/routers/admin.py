"""Admin router (/api/v1/admin)

Panel de administración para el sistema de contraseñas temporales.
Controla: creación de licencias, seguimiento de uso, métricas de curso,
solicitudes de extensión de vencimiento.
"""
from __future__ import annotations

import secrets
from datetime import datetime, timedelta
from typing import Optional, List

from fastapi import APIRouter, HTTPException, Query

from app.db import (
    create_password,
    expire_password,
    get_password,
    get_active_passwords_near_expiry,
    update_password_usage,
)
from app.models import (
    PasswordCreate,
    PasswordResponse,
)

router = APIRouter(prefix="/admin", tags=["admin"])


# ======================================================================
# CONTRASEÑAS — CRUD BÁSICO
# ======================================================================

@router.get("/passwords/{code}", response_model=PasswordResponse)
def admin_get_password(code: str):
    """Obtener datos de una contraseña específica."""
    pw = get_password(code)
    if not pw:
        raise HTTPException(
            status_code=404,
            detail={"error": {"code": "NOT_FOUND", "message": f"Contraseña no encontrada: {code}"}}
        )
    return PasswordResponse(**pw)


@router.post("/passwords", response_model=PasswordResponse)
def admin_create_password(body: PasswordCreate):
    """Crear una nueva contraseña (licencia individual).

    Si no se especifica end_date, vence en 30 días.
    Si el código ya existe, se actualiza (reset de sesión).
    """
    end_date = body.end_date
    if not end_date:
        end_date = (datetime.now() + timedelta(days=30)).strftime("%Y-%m-%d %H:%M:%S")

    pw = create_password(
        code=body.code,
        user_email=body.user_email,
        end_date=end_date,
    )
    if "error" in pw:
        raise HTTPException(status_code=400, detail={"error": {"code": "CREATE_FAILED", "message": pw["error"]}})
    return PasswordResponse(**pw)


@router.post("/passwords/generate", response_model=PasswordResponse)
def admin_generate_password(user_email: Optional[str] = None, days_valid: int = 30):
    """Auto-generar una contraseña aleatoria de 8 caracteres alfanuméricos."""
    code = secrets.token_urlsafe(8).upper()[:8]  # Ej: "A3K9Z2M7"
    end_date = (datetime.now() + timedelta(days=days_valid)).strftime("%Y-%m-%d %H:%M:%S")
    pw = create_password(code=code, user_email=user_email, end_date=end_date)
    if "error" in pw:
        raise HTTPException(status_code=400, detail={"error": {"code": "CREATE_FAILED", "message": pw["error"]}})
    return PasswordResponse(**pw)


# ======================================================================
# CONTRASEÑAS — ACCIONES
# ======================================================================

@router.post("/passwords/{code}/expire")
def admin_expire_password(code: str):
    """Marcar una contraseña como vencida manualmente."""
    pw = get_password(code)
    if not pw:
        raise HTTPException(status_code=404, detail={"error": {"code": "NOT_FOUND", "message": "Contraseña no encontrada"}})
    pw = expire_password(code)
    return {"success": True, "password": PasswordResponse(**pw)}


# ======================================================================
# SEGUIMIENTO DE USO
# ======================================================================

@router.post("/passwords/{code}/usage")
def admin_record_usage(
    code: str,
    user_email: str = Query(...),
    module_id: str = Query(...),
    quiz_score: Optional[int] = None,
):
    """Registrar uso de una contraseña (incrementa sesiones, registra módulo visto)."""
    pw = get_password(code)
    if not pw:
        raise HTTPException(status_code=404, detail={"error": {"code": "NOT_FOUND", "message": "Contraseña no encontrada"}})
    pw = update_password_usage(code, user_email, module_id, quiz_score)
    return {"success": True, "password": PasswordResponse(**pw)}


# ======================================================================
# MÉTRICAS Y ALERTAS
# ======================================================================

@router.get("/alerts/near-expiry")
def admin_alerts_near_expiry(days: int = 7):
    """Lista de contraseñas activas que vencen en los próximos N días."""
    results = get_active_passwords_near_expiry(days)
    return {
        "count": len(results),
        "days_horizon": days,
        "passwords": results,
    }


@router.get("/metrics/summary")
def admin_metrics_summary():
    """Resumen de métricas: contraseñas activas, vencidas, uso reciente.

    TODO: implementar cálculos reales una vez que haya datos en producción.
    Por ahora retorna estructura placeholder para que el frontend pueda
    diseñar contra el contrato.
    """
    # Placeholder — reemplazar con queries reales
    return {
        "total_passwords_created": 0,
        "active_passwords": 0,
        "expired_passwords": 0,
        "total_sessions_recorded": 0,
        "unique_users": 0,
        "near_expiry": 0,
    }
