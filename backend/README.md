# Ley 21.719 Backend (FastAPI)

Backend oficial de la web educativa sobre la **Ley 21.719 de Protección de Datos Personales de Chile** (vigencia plena: 1 de diciembre de 2026).

## Stack Tecnológico
- **Python 3.13**
- **FastAPI** (con tipado Pydantic v2 y validaciones estrictas)
- **SQLite** (poblado automáticamente al iniciar con los JSON oficiales en `docs/`)
- **pytest** + `TestClient` (cobertura completa de tests de integración y contrato)
- **uv** (gestión rápida de entorno virtual y dependencias)

---

## Estructura del Proyecto
```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py          # Aplicación FastAPI, CORS y manejadores de error estándar
│   ├── db.py            # SQLite + cargador inicial de docs/*.json
│   ├── models.py        # Schemas Pydantic alineados con api-contract.md
│   ├── routers/
│   │   ├── __init__.py
│   │   ├── modules.py   # GET /api/v1/modules, GET /api/v1/modules/{id}
│   │   ├── quizzes.py   # GET /api/v1/quizzes/{module_id}, POST .../submit
│   │   ├── checklist.py # GET/POST /api/v1/checklist/{rol}
│   │   ├── glossary.py  # GET /api/v1/glossary, GET /api/v1/glossary/{tid}
│   │   └── final_test.py# GET /api/v1/final-test, POST .../submit
│   └── data/
│       ├── app.db       # Base de datos SQLite generada
│       └── final_test.json # Banco de 10 preguntas para el test final
├── tests/
│   ├── conftest.py      # Fixtures compartidas (TestClient)
│   ├── test_modules.py
│   ├── test_quizzes.py
│   ├── test_checklist.py
│   ├── test_glossary.py
│   ├── test_final_test.py
│   └── test_contract.py   # Tests de CORS, OpenAPI, formato de errores
└── pyproject.toml / pytest.ini
```

---

## Instalación y Ejecución

### 1. Activar entorno virtual e instalar dependencias con `uv`
```bash
cd backend
uv venv .venv
source .venv/bin/activate
uv pip install -e .  # o pip install fastapi uvicorn pydantic pytest httpx
```

### 2. Levantar servidor de desarrollo
```bash
uvicorn app.main:app --reload --port 8000
```
La API estará disponible en `http://localhost:8000/api/v1`. Documentación interactiva en `http://localhost:8000/docs`.

### 3. Ejecutar la suite de tests (pytest)
```bash
.venv/bin/pytest -v
```
*(Todos los tests deben pasar en verde).*
