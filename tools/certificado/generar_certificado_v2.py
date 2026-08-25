#!/opt/data/.venv-pdf/bin/python
"""Generador de certificado de aprobación — Curso Ley 21.719 v2.
Uso:
  /opt/data/.venv-pdf/bin/python generar_certificado_v2.py \
    --nombre "María González Carrasco" --puntaje 9 --total 10 --salida certificado.pdf
"""
from pathlib import Path
import argparse, hashlib
from datetime import date
from reportlab.lib import colors
from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib.units import mm
from reportlab.pdfgen import canvas as canvas_mod

# paleta oficial
EMERALD   = HexColor("#047857")
EMERALD_L = HexColor("#d1fae5")
EMERALD_D = HexColor("#065f46")
RED       = HexColor("#991B1B")
RED_L     = HexColor("#fee2e2")
INK       = HexColor("#0F172A")
SLATE_7   = HexColor("#334155")
SLATE_5   = HexColor("#64748B")
WHITE     = colors.white

MESES = {1:"enero",2:"febrero",3:"marzo",4:"abril",5:"mayo",6:"junio",
         7:"julio",8:"agosto",9:"septiembre",10:"octubre",11:"noviembre",12:"diciembre"}

def fecha_es(d: date) -> str:
    return f"{d.day} de {MESES[d.month]} de {d.year}"

def auto_font(c, text, font, max_size, min_size, max_width):
    sz = max_size
    while c.stringWidth(text, font, sz) > max_width and sz > min_size:
        sz -= 0.5
    return sz

def draw_rounded_rect(c, x, y, w, h, r, fill_color=None, stroke_color=None, lw=1.0):
    c.saveState()
    if fill_color:
        c.setFillColor(fill_color)
    if stroke_color:
        c.setStrokeColor(stroke_color)
        c.setLineWidth(lw)
    c.roundRect(x, y, w, h, r, fill=1 if fill_color else 0, stroke=1 if stroke_color else 0)
    c.restoreState()

def generar_certificado(nombre, puntaje, total, salida):
    hoy = date.today()
    fecha_txt = fecha_es(hoy)
    cod_hash  = hashlib.sha256(f"{nombre}|{puntaje}/{total}|{hoy.isoformat()}".encode()).hexdigest()[:8].upper()

    W, H = landscape(A4)
    c = canvas_mod.Canvas(str(salida), pagesize=landscape(A4))
    c.setTitle("Certificado de Aprobación — Curso Ley 21.719")
    c.setAuthor("Plataforma educativa Ley 21.719")

    MX = 16*mm        # margen exterior
    GAP = 2.4*mm      # espacio entre marcos

    # ── Fondo principal (blanco limpio) ──
    c.setFillColor(WHITE)
    c.rect(0, 0, W, H, fill=1, stroke=0)

    # ── Franja lateral izquierda esmeralda ──
    c.setFillColor(EMERALD)
    c.rect(0, 0, 48*mm, H, fill=1, stroke=0)

    # Texto vertical "CERTIFICADO"
    c.saveState()
    c.translate(18*mm, H/2)
    c.rotate(90)
    c.setFillColor(HexColor("#34d399"))
    c.setFont("Helvetica-Bold", 13)
    c.drawCentredString(0, 0, "C E R T I F I C A D O")
    c.restoreState()

    # ── Marco doble verde ──
    c.setStrokeColor(EMERALD)
    c.setLineWidth(2.4)
    c.rect(MX, MX, W-2*MX, H-2*MX, fill=0, stroke=1)
    c.setLineWidth(0.8)
    c.rect(MX+GAP, MX+GAP, W-2*(MX+GAP), H-2*(MX+GAP), fill=0, stroke=1)

    CX = W / 2 + 10*mm   # centro_x desplazado a la derecha por la franja
    UL = W - MX - GAP - 10*mm  # ancho usable derecho

    # ── Título principal ──
    y = H - 38*mm
    c.setFillColor(EMERALD_D)
    sz = auto_font(c, "CERTIFICADO DE APROBACIÓN", "Helvetica-Bold", 36, 22, UL)
    c.setFont("Helvetica-Bold", sz)
    c.drawCentredString(CX, y, "CERTIFICADO DE APROBACIÓN")

    # línea decorativa bajo título
    y -= 6*mm
    c.setStrokeColor(EMERALD)
    c.setLineWidth(2)
    c.line(CX - 38*mm, y, CX + 38*mm, y)

    # ── "Se otorga el presente certificado a:" ──
    y -= 16*mm
    c.setFillColor(SLATE_5)
    c.setFont("Helvetica-Oblique", 12)
    c.drawCentredString(CX, y, "Se otorga el presente certificado a:")

    # ── Nombre del alumno (grande, centrado, color oscuro) ──
    y -= 20*mm
    nombre_limpio = nombre.strip()
    sz_n = auto_font(c, nombre_limpio, "Helvetica-Bold", 44, 18, UL*0.92)
    c.setFont("Helvetica-Bold", sz_n)
    c.setFillColor(INK)
    c.drawCentredString(CX, y, nombre_limpio)

    # Subrayado del nombre (esmeralda)
    ancho_n = c.stringWidth(nombre_limpio, "Helvetica-Bold", sz_n)
    c.setStrokeColor(EMERALD)
    c.setLineWidth(2)
    c.line(CX - ancho_n/2, y - 4*mm, CX + ancho_n/2, y - 4*mm)

    # ── Texto del curso ──
    y -= 14*mm
    c.setFillColor(SLATE_7)
    c.setFont("Helvetica", 12.5)
    c.drawCentredString(CX, y, "ha completado satisfactoriamente el curso de capacitación en la")
    y -= 9*mm
    c.setFillColor(EMERALD)
    c.setFont("Helvetica-Bold", 14)
    c.drawCentredString(CX, y, "Ley N° 21.719 sobre Protección de Datos Personales de Chile")

    # ── Caja de detalles (3 columnas, centrada) ──
    y -= 18*mm
    caja_w = 200*mm
    caja_h = 26*mm
    caja_y = y - caja_h
    draw_rounded_rect(c, CX-caja_w/2, caja_y, caja_w, caja_h, 4*mm,
                      fill_color=HexColor("#f8fafc"), stroke_color=EMERALD, lw=0.7)

    etiqs = ["PUNTAJE", "FECHA DE EMISIÓN", "VIGENCIA"]
    vals  = [f"{puntaje} / {total}", fecha_txt, "Plena desde 01-12-2026"]
    cols  = [CX - caja_w/2 + 20*mm, CX - 18*mm, CX + caja_w/2 - 60*mm]

    for x, etiq, val in zip(cols, etiqs, vals):
        # etiqueta
        c.setFillColor(SLATE_5)
        c.setFont("Helvetica-Bold", 7.5)
        c.drawString(x, caja_y + caja_h - 8*mm, etiq)
        # valor
        c.setFillColor(INK)
        c.setFont("Helvetica-Bold", 12)
        c.drawString(x, caja_y + 5*mm, val)

    # ── Pie de página ──
    pie_y = MX + 10*mm
    c.setFillColor(SLATE_5)
    c.setFont("Helvetica", 7)
    c.drawCentredString(
        CX, pie_y,
        "Fuente oficial: Biblioteca del Congreso Nacional de Chile · BCN · idNorma=1209272   |   "
        "Documento de carácter informativo; no constituye asesoría legal.")

    # Código de verificación
    c.setFillColor(SLATE_7)
    c.setFont("Helvetica-Bold", 8)
    c.drawCentredString(CX, pie_y + 5.5*mm, f"Código de verificación: {cod_hash}")

    # ── Sellos de seguridad (esquinas del marco interior) ──
    c.setFillColor(EMERALD)
    for sx, sy in [(MX+GAP, MX+GAP), (W-MX-GAP, MX+GAP),
                   (MX+GAP, H-MX-GAP), (W-MX-GAP, H-MX-GAP)]:
        c.circle(sx, sy, 3.2*mm, fill=1, stroke=0)

    c.showPage()
    c.save()
    print(f"OK: {salida}")
    print(f"  Nombre: {nombre}")
    print(f"  Puntaje: {puntaje}/{total}")
    print(f"  Fecha: {fecha_txt}")
    print(f"  Código: {cod_hash}")

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--nombre", required=True)
    ap.add_argument("--puntaje", type=int, required=True)
    ap.add_argument("--total", type=int, required=True)
    ap.add_argument("--salida", default="certificado.pdf")
    args = ap.parse_args()
    if args.puntaje < 0 or args.total <= 0 or args.puntaje > args.total:
        ap.error("puntaje debe estar entre 0 y total")
    Path(args.salida).parent.mkdir(parents=True, exist_ok=True)
    generar_certificado(args.nombre, args.puntaje, args.total, Path(args.salida))

if __name__ == "__main__":
    main()
