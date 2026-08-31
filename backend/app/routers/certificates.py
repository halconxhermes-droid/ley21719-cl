"""
Endpoints para verificacion y generacion de certificados SENCE
"""
import json
import secrets
import hashlib
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional

from fastapi import APIRouter, HTTPException, Query, Response
from pydantic import BaseModel

router = APIRouter(prefix="/api/v1/certificates", tags=["certificates"])

# Almacenamiento de certificados (en produccion seria DB)
CERTIFICATES_DB = Path("/tmp/certificates_sence.json")

# Modelo de datos
class Certificado(BaseModel):
    codigo: str
    nombre: str
    run: str
    email: str
    curso: str
    codigo_sence: str
    nota_final: float
    horas: int
    fecha_emision: str
    instructor: str
    valido: bool = True


def _load_db() -> dict:
    """Carga la DB de certificados."""
    if CERTIFICATES_DB.exists():
        return json.loads(CERTIFICATES_DB.read_text())
    return {}


def _save_db(db: dict) -> None:
    """Guarda la DB de certificados."""
    CERTIFICATES_DB.write_text(json.dumps(db, indent=2, ensure_ascii=False))


def generar_codigo_unico() -> str:
    """Genera un codigo unico para el certificado."""
    timestamp = datetime.now(timezone.utc).strftime("%Y%m%d%H%M%S")
    random = secrets.token_hex(4).upper()
    return f"LEY21719-{timestamp}-{random}"


def generar_hash_verificacion(cert: Certificado) -> str:
    """Genera hash de verificacion del certificado."""
    data = f"{cert.codigo}{cert.run}{cert.curso}{cert.fecha_emision}"
    return hashlib.sha256(data.encode()).hexdigest()[:16].upper()


@router.get("/verify")
async def verify_certificate(cod: str = Query(..., min_length=10)):
    """
    Verifica la autenticidad de un certificado por codigo.
    Endpoint publico - no requiere autenticacion.
    """
    db = _load_db()
    cert_data = db.get(cod)

    if not cert_data:
        raise HTTPException(
            status_code=404,
            detail={
                "error": "NOT_FOUND",
                "message": "Codigo de certificado no encontrado",
            }
        )

    return cert_data


@router.post("/issue")
async def issue_certificate(
    nombre: str,
    run: str,
    email: str,
    curso: str = "Ley 21.719 - Proteccion de Datos Personales",
    codigo_sence: str = "PENDIENTE",
    nota_final: float = 5.0,
    horas: int = 80,
    instructor: str = "Instructor SENCE",
):
    """
    Emite un certificado oficial.
    Solo accesible para instructores certificados o admin.
    """
    # Generar codigo unico
    codigo = generar_codigo_unico()
    fecha_emision = datetime.now(timezone.utc).strftime("%Y-%m-%d")

    cert = Certificado(
        codigo=codigo,
        nombre=nombre,
        run=run,
        email=email,
        curso=curso,
        codigo_sence=codigo_sence,
        nota_final=nota_final,
        horas=horas,
        fecha_emision=fecha_emision,
        instructor=instructor,
        valido=True,
    )

    # Guardar en DB
    db = _load_db()
    db[codigo] = cert.dict()
    _save_db(db)

    return cert.dict()


@router.get("/{codigo}")
async def get_certificate(codigo: str):
    """Obtiene detalles completos de un certificado."""
    db = _load_db()
    cert = db.get(codigo)

    if not cert:
        raise HTTPException(status_code=404, detail="Certificado no encontrado")

    return cert


@router.post("/revoke/{codigo}")
async def revoke_certificate(codigo: str):
    """Revoca un certificado (solo admin)."""
    db = _load_db()
    if codigo not in db:
        raise HTTPException(status_code=404, detail="Certificado no encontrado")

    db[codigo]["valido"] = False
    _save_db(db)

    return {"message": "Certificado revocado", "codigo": codigo}


@router.get("/stats/summary")
async def get_stats():
    """Estadisticas de certificados emitidos."""
    db = _load_db()
    total = len(db)
    validos = sum(1 for c in db.values() if c.get("valido", True))
    revocados = total - validos

    notas = [c.get("nota_final", 0) for c in db.values() if c.get("valido", True)]
    promedio_nota = sum(notas) / len(notas) if notas else 0

    return {
        "total_emitidos": total,
        "validos": validos,
        "revocados": revocados,
        "nota_promedio": round(promedio_nota, 2),
        "cursos_unicos": len(set(c.get("curso") for c in db.values())),
    }
