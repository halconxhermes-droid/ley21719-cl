FROM python:3.13-slim

WORKDIR /app

# Dependencias (capa cacheable)
COPY requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Código + contenido
COPY app/ /app/app/
COPY docs/ /app/docs/

# Usuario no-root y directorio de datos persistente
RUN useradd -m appuser && mkdir -p /data && chown -R appuser:appuser /data /app
USER appuser

ENV PORT=8000
ENV HOST=0.0.0.0
ENV LEY21719_DATA_DIR=/data

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s \
  CMD python -c "import urllib.request;urllib.request.urlopen('http://127.0.0.1:8000/health')" || exit 1

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
