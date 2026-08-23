"""FastAPI application entrypoint — Ley 21.719 educational API.

Base path /api/v1. CORS enabled for the Vite dev frontend
(http://localhost:5173). Errors follow design/api-contract.md format.
"""
from __future__ import annotations

import logging

from fastapi import FastAPI, HTTPException, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.db import init_db
from app.routers import checklist, final_test, glossary, modules, quizzes

logger = logging.getLogger("ley21719")

# Initialize database (loads docs/*.json into SQLite on startup)
init_db()

app = FastAPI(
    title="Ley 21.719 API",
    description="API educativa sobre la Ley 21.719 de Protección de Datos Personales (Chile)",
    version="1.0.0",
)

# CORS for local Vite dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:4173",  # vite preview
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers under /api/v1
API_PREFIX = "/api/v1"
app.include_router(modules.router, prefix=API_PREFIX)
app.include_router(quizzes.router, prefix=API_PREFIX)
app.include_router(checklist.router, prefix=API_PREFIX)
app.include_router(glossary.router, prefix=API_PREFIX)
app.include_router(final_test.router, prefix=API_PREFIX)


# ---------------------------------------------------------------------------
# Standard error handling per api-contract.md section 6
# ---------------------------------------------------------------------------
def _error_response(status_code: int, code: str, message: str, details=None) -> JSONResponse:
    body = {"error": {"code": code, "message": message}}
    if details is not None:
        body["error"]["details"] = details
    return JSONResponse(status_code=status_code, content=body)


@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    # HTTPExceptions raised with a dict detail already follow contract shape
    if isinstance(exc.detail, dict) and "error" in exc.detail:
        return JSONResponse(status_code=exc.status_code, content=exc.detail)
    # Map plain HTTPException codes to contract codes
    code_map = {
        400: "VALIDATION_ERROR",
        404: "NOT_FOUND",
        409: "CONFLICT",
        422: "UNPROCESSABLE_ENTITY",
        500: "INTERNAL_ERROR",
    }
    code = code_map.get(exc.status_code, "INTERNAL_ERROR")
    message = exc.detail if isinstance(exc.detail, str) else "Error inesperado"
    return _error_response(exc.status_code, code, message)


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = exc.errors()
    first = errors[0] if errors else {}
    field = ".".join(str(loc) for loc in first.get("loc", []) if loc != "body") or None
    msg_type = first.get("type", "value_error")
    expected = {
        "int_type": "int[]",
        "int_parsing": "int[]",
        "missing": "required field",
        "list_type": "array",
        "model_attributes_type": "object with required fields",
    }.get(msg_type, msg_type)
    return _error_response(
        400,
        "VALIDATION_ERROR",
        f"Payload inválido: {first.get('msg', 'error de validación')}",
        {"field": field, "expected": expected},
    )


@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    logger.exception("Unhandled error: %s", exc)
    return _error_response(500, "INTERNAL_ERROR", "Error interno del servidor")


@app.get("/")
def root():
    return {
        "name": "Ley 21.719 API",
        "version": "1.0.0",
        "docs": "/docs",
        "base": "/api/v1",
    }


@app.get("/health")
def health():
    return {"status": "ok"}
