#!/opt/data/.venv-pdf/bin/python
"""Generador de prototipo de certificado de aprobación — Curso Ley 21.719.

Prototipo standalone (solo diseño local para aprobación del dueño).
NO se integra todavía a producción; NO almacena datos personales:
el nombre ingresado se usa únicamente para renderizar el PDF.

Uso:
    /opt/data/.venv-pdf/bin/python generar_certificado.py \
        --nombre "María González Carrasco" --puntaje 9 --total 10 \
        --salida certificado.pdf
"""

import argparse
import hashlib
from datetime import date
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib.units import mm
from reportlab.pdfgen import canvas as pdfcanvas

# --- Identidad visual del proyecto ---
EMERALD = HexColor("#047857")
RED = HexColor("#991B1B")
SLATE_700 = HexColor("#334155")
SLATE_500 = HexColor("#64748B")

MESES_ES = {
    1: "enero", 2: "febrero", 3: "marzo", 4: "abril", 5: "mayo", 6: "junio",
    7: "julio", 8: "agosto", 9: "septiembre", 10: "octubre", 11: "noviembre",
    12: "diciembre",
}


def fecha_es(d: date) -> str:
    """Fecha en español: '24 de agosto de 2026'."""
    return f"{d.day} de {MESES_ES[d.month]} de {d.year}"


def ajustar_fuente(c: pdfcanvas.Canvas, texto: str, fuente: str, size_inicial: float, ancho_max: float, min_size: float = 10):
    """Reduce el tamaño de la fuente hasta que el texto quepa en ancho_max."""
    size = size_inicial
    while c.stringWidth(texto, fuente, size) > ancho_max and size > min_size:
        size -= 0.5
    return size


def generar_certificado(nombre: str, puntaje: int, total: int, salida: Path) -> str:
    """Genera el certificado PDF A4 horizontal. Devuelve el código de verificación."""
    hoy = date.today()
    fecha_emision = fecha_es(hoy)
    # Código de verificación único corto: sha256(nombre+puntaje+fecha)[:8].upper()
    base_hash = f"{nombre}|{puntaje}/{total}|{hoy.isoformat()}"
    codigo_verif = hashlib.sha256(base_hash.encode("utf-8")).hexdigest()[:8].upper()

    w, h = landscape(A4)  # 297mm x 210mm horizontal
    c = pdfcanvas.Canvas(str(salida), pagesize=landscape(A4))
    c.setTitle("Certificado de Aprobación — Curso Ley 21.719")
    c.setAuthor("Plataforma educativa Ley 21.719")

    margen = 14 * mm

    # ---------- Marco decorativo doble línea verde esmeralda ----------
    c.setStrokeColor(EMERALD)
    c.setLineWidth(3)
    c.rect(margen, margen, w - 2 * margen, h - 2 * margen, fill=False)
    c.setLineWidth(1)
    gap = 2.2 * mm
    c.rect(margen + gap, margen + gap, w - 2 * (margen + gap), h - 2 * (margen + gap), fill=False)

    # Esquinas decorativas (pequeños cuadrados rojos sobre el marco interior)
    c.setFillColor(RED)
    lado = 2.6 * mm
    for cx, cy in (
        (margen + gap - lado / 2, margen + gap - lado / 2),
        (w - margen - gap - lado / 2, margen + gap - lado / 2),
        (margen + gap - lado / 2, h - margen - gap - lado / 2),
        (w - margen - gap - lado / 2, h - margen - gap - lado / 2),
    ):
        c.rect(cx, cy, lado, lado, fill=False, stroke=True)

    centro_x = w / 2
    ancho_util = w - 2 * (margen + gap + 8 * mm)

    # ---------- Encabezado ----------
    y = h - 34 * mm
    c.setFillColor(EMERALD)
    size = ajustar_fuente(c, "CERTIFICADO DE APROBACIÓN", "Helvetica-Bold", 30, ancho_util)
    c.setFont("Helvetica-Bold", size)
    c.drawCentredString(centro_x, y, "CERTIFICADO DE APROBACIÓN")

    # Adorno bajo el título
    y -= 5 * mm
    c.setStrokeColor(EMERALD)
    c.setLineWidth(1.2)
    c.line(centro_x - 30 * mm, y, centro_x - 12 * mm, y)
    c.line(centro_x + 12 * mm, y, centro_x + 30 * mm, y)
    c.setFillColor(RED)
    c.circle(centro_x, y + 0.8 * mm, 1.2 * mm, fill=True, stroke=False)

    # ---------- Nombre destacado ----------
    y -= 16 * mm
    nombre_limpio = nombre.strip()
    size_nombre = ajustar_fuente(c, nombre_limpio, "Helvetica-Bold", 34, ancho_util * 0.9, min_size=16)
    c.setFont("Helvetica-Bold", size_nombre)

    # Línea guía "Se otorga el presente certificado a:"
    c.setFillColor(SLATE_500)
    c.setFont("Helvetica-Oblique", 11)
    c.drawCentredString(centro_x, y + 13 * mm, "Se otorga el presente certificado a:")

    c.setFillColor(colors.HexColor("#0F172A"))
    c.drawCentredString(centro_x, y, nombre_limpio)
    subrayado_y = y - 3 * mm
    ancho_nombre = c.stringWidth(nombre_limpio, "Helvetica-Bold", size_nombre)
    c.setStrokeColor(EMERALD)
    c.setLineWidth(1.4)
    c.line(centro_x - ancho_nombre / 2, subrayado_y, centro_x + ancho_nombre / 2, subrayado_y)

    # ---------- Texto principal ----------
    y -= 12 * mm
    c.setFillColor(SLATE_700)
    c.setFont("Helvetica", 12.5)
    linea1 = "ha completado satisfactoriamente el curso de capacitación en la"
    linea2 = "Ley N° 21.719 sobre Protección de Datos Personales de Chile"
    c.drawCentredString(centro_x, y, linea1)
    y -= 8 * mm
    c.setFont("Helvetica-Bold", 13.5)
    c.setFillColor(EMERALD)
    c.drawCentredString(centro_x, y, linea2)

    # ---------- Detalles: puntaje, fecha, vigencia ----------
    y -= 17 * mm
    caja_ancho, caja_alto = 190 * mm, 17 * mm
    c.setFillGray(0.96)
    c.setStrokeColor(EMERALD)
    c.setLineWidth(0.6)
    c.roundRect(centro_x - caja_ancho / 2, y - caja_alto + 4 * mm, caja_ancho, caja_alto, 2 * mm, fill=1, stroke=1)

    col_x = [centro_x - caja_ancho / 2 + 12 * mm, centro_x - 20 * mm, centro_x + 55 * mm]
    etiquetas = ["PUNTAJE OBTENIDO", "FECHA DE EMISIÓN", "VIGENCIA DE LA LEY"]
    valores = [
        f"{puntaje} / {total}",
        fecha_emision,
        "Plena desde 01-12-2026",
    ]
    for x_col, etiq, valor in zip(col_x, etiquetas, valores):
        c.setFillColor(SLATE_500)
        c.setFont("Helvetica-Bold", 7.5)
        c.drawString(x_col, y - 3 * mm, etiq)
        c.setFillColor(colors.HexColor("#0F172A"))
        c.setFont("Helvetica-Bold", 11)
        c.drawString(x_col, y - 9.5 * mm, valor)

    # ---------- Pie: fuente oficial + disclaimer + código ----------
    pie_y = margen + 7.5 * mm
    c.setFillColor(SLATE_500)
    c.setFont("Helvetica", 7.5)
    c.drawCentredString(
        centro_x,
        pie_y,
        "Texto consolidado disponible en la Biblioteca del Congreso Nacional de Chile · BCN · idNorma=1209272   |   "
        "Documento de carácter informativo; no constituye asesoría legal.",
    )

    # Código de verificación (futuro QR opcional)
    cod_y = pie_y + 5.5 * mm
    c.setFillColor(SLATE_700)
    c.setFont("Helvetica", 8)
    c.drawCentredString(centro_x, cod_y, f"Código de verificación: {codigo_verif}")

    c.showPage()
    c.save()
    print(f"OK Certificado generado: {salida.resolve()}")
    print(f"   Nombre      : {nombre}")
    print(f"   Puntaje     : {puntaje}/{total}")
    print(f"   Fecha       : {fecha_emision}")
    print(f"   Código verif: {codigo_verif}")
    return codigo_verif


def main():
    parser = argparse.ArgumentParser(description="Genera certificado PDF de aprobación del curso Ley 21.719 (prototipo)")
    parser.add_argument("--nombre", required=True, help="Nombre completo de quien aprueba (solo para renderizar, no se almacena)")
    parser.add_argument("--puntaje", type=int, required=True, help="Puntaje obtenido")
    parser.add_argument("--total", type=int, required=True, help="Puntaje total posible")
    parser.add_argument("--salida", default="certificado.pdf", help="Ruta del PDF de salida")
    args = parser.parse_args()

    salida = Path(args.salida)
    salida.parent.mkdir(parents=True, exist_ok=True)
    if args.puntaje < 0 or args.total <= 0 or args.puntaje > args.total:
        parser.error("--puntaje debe estar entre 0 y --total")
    generar_certificado(args.nombre, args.puntaje, args.total, salida)


if __name__ == "__main__":
    main()
