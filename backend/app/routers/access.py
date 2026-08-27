"""Access router (/api/v1/access)

Gate de acceso para la plataforma. Valida una combinación de
correo + código (contraseña temporal) contra la tabla `passwords`.

Contrato:
  POST /api/v1/access/verify
    body:  { "email": str, "code": str }
    resp:  { "token": str }           (200 si válido)
            raise 401 si inválido/expirado
"""
from __future__ import annotations

import secrets
from datetime import datetime
from typing import Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr

from app.db import get_password, update_password_usage

router = APIRouter(prefix="/access", tags=["access"])


class AccessVerifyRequest(BaseModel):
    email: str
    code: str


class AccessVerifyResponse(BaseModel):
    token: str


def _is_expired(pw: dict) -> bool:
    """Retorna True si la contraseña está vencida por fecha."""
    end = pw.get("end_date")
    if not end:
        return False
    try:
        # Acepta tanto YYYY-MM-DD como ISO timestamp
        end_dt = datetime.fromisoformat(str(end).replace("Z", "+00:00"))
    except ValueError:
        # Formato YYYY-MM-DD HH:MM:SS
        end_dt = datetime.strptime(str(end), "%Y-%m-%d %H:%M:%S")
    return datetime.now() > end_dt


@router.post("/verify", response_model=AccessVerifyResponse)
def access_verify(body: AccessVerifyRequest):
    """Validar correo + código y devolver un token de sesión.

    Reglas:
      - El código debe existir en passwords.
      - El estado debe ser 'active'.
      - No debe estar vencido por fecha.
      - El correo (si está registrado en la licencia) debe coincidir.
    """
    code = body.code.strip().upper()
    email = body.email.strip().lower()

    pw = get_password(code)
    if not pw:
        raise HTTPException(
            status_code=401,
            detail={"error": {"code": "INVALID_CREDENTIALS", "message": "Correo o contraseña incorrectos."}},
        )

    if pw.get("status") != "active":
        raise HTTPException(
            status_code=401,
            detail={"error": {"code": "LICENSE_EXPIRED", "message": "Esta licencia ha expirado o fue revocada."}},
        )

    if _is_expired(pw):
        raise HTTPException(
            status_code=401,
            detail={"error": {"code": "LICENSE_EXPIRED", "message": "Esta licencia ha vencido."}},
        )

    # Si la licencia tiene un correo registrado, debe coincidir
    lic_email = (pw.get("user_email") or "").strip().lower()
    if lic_email and lic_email != email:
        raise HTTPException(
            status_code=401,
            detail={"error": {"code": "INVALID_CREDENTIALS", "message": "Correo o contraseña incorrectos."}},
        )

    # Generar token de sesión (opaco, firmado por la app)
    token = secrets.token_urlsafe(32)

    # Registrar el acceso (incrementa sesiones, actualiza last_connection)
    update_password_usage(code, email, module_id="login", quiz_score=None)

    return AccessVerifyResponse(token=token)
