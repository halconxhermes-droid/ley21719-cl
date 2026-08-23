FROM python:3.13-slim

WORKDIR /app

# Instalar dependencias
COPY app/ /app/app/
COPY docs/ /app/docs/

# Instalar FastAPI y uvicorn
RUN pip install --no-cache-dir \
    fastapi>=0.115.0 \
    uvicorn[standard]>=0.30.0 \
    pydantic>=2.9.0 \
    pytest>=8.0.0

EXPOSE 8000

ENV PORT=8000
ENV HOST=0.0.0.0

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]