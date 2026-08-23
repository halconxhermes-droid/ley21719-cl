"""Pytest configuration and shared fixtures."""
from __future__ import annotations

import os
import sys
import tempfile
from pathlib import Path

import pytest

# Ensure backend/ is importable when running pytest from anywhere
BACKEND_DIR = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(BACKEND_DIR))


@pytest.fixture(scope="session")
def client():
    """TestClient for the FastAPI app (uses the real SQLite DB)."""
    from fastapi.testclient import TestClient

    from app.main import app

    with TestClient(app) as c:
        yield c


@pytest.fixture()
def anyio_backend():
    return "asyncio"
