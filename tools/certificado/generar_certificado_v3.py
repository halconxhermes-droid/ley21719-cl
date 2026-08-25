#!/opt/data/.venv-pdf/bin/python
"""Certificado de Aprobación — Curso Ley 21.719 · Diseño premium v3.

Mejoras v3 sobre v2:
- Filigrana (guilloche) de fondo con círculos concéntricos sutiles
- Sello circular institucional (escudo + texto curvo)
- Tipografía serif elegante (Liberation Serif) para título y nombre
- Íconos vectoriales en las columnas de detalles (medalla, calendario, escudo)
- QR de verificación real (URL + código)
- Líneas de firma y fecha
- Paleta esmeralda unificada, sin elementos que chocan

Uso:
    /opt/data/.venv-pdf/bin/python generar_certificado_v3.py \
        --nombre "María González Carrasco" --puntaje 9 --total 10 --salida cert.pdf
"""
import argparse, hashlib, math, io
from datetime import date
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib.units import mm
from reportlab.pdfgen import canvas as pdfcanvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
import qrcode

# ── Fuentes ──
pdfmetrics.registerFont(TTFont("Serif-Bold", "/usr/share/fonts/truetype/liberation/LiberationSerif-Bold.ttf"))
pdfmetrics.registerFont(TTFont("Serif", "/usr/share/fonts/truetype/liberation/LiberationSerif-Regular.ttf"))
pdfmetrics.registerFont(TTFont("Serif-Italic", "/usr/share/fonts/truetype/liberation/LiberationSerif-Italic.ttf"))

# ── Paleta ──
EMERALD   = HexColor("#047857")
EMERALD_D = HexColor("#065f46")
EMERALD_L = HexColor("#d1fae5")
GOLD      = HexColor("#b08d3e")
INK       = HexColor("#0f172a")
SLATE_7   = HexColor("#334155")
SLATE_5   = HexColor("#64748b")
WHITE     = colors.white

MESES = {1:"enero",2:"febrero",3:"marzo",4:"abril",5:"mayo",6:"junio",
         7:"julio",8:"agosto",9:"septiembre",10:"octubre",11:"noviembre",12:"diciembre"}

def fecha_es(d): return f"{d.day} de {MESES[d.month]} de {d.year}"

def fit(c, txt, font, size_max, size_min, max_w):
    s = size_max
    while c.stringWidth(txt, font, s) > max_w and s > size_min:
        s -= 0.5
    return s

# ── Elementos gráficos ──

def filigrana(c, cx, cy, r_max):
    """Guilloché sutil: círculos concéntricos + anillos punteados."""
    c.saveState()
    c.setStrokeColor(EMERALD)
    for i, r in enumerate(range(24, int(r_max), 16)):
        c.setLineWidth(0.3)
        c.setStrokeAlpha(0.032 if i % 2 else 0.05)
        c.circle(cx, cy, r*mm, stroke=1, fill=0)
    c.restoreState()

def sello_institucional(c, cx, cy, R):
    """Sello circular: doble aro dorado, texto curvo, escudo interior."""
    c.saveState()
    # aros
    c.setStrokeColor(GOLD); c.setLineWidth(1.6)
    c.circle(cx, cy, R, stroke=1, fill=0)
    c.setLineWidth(0.7)
    c.circle(cx, cy, R-2.2*mm, stroke=1, fill=0)
    c.circle(cx, cy, R-8.6*mm, stroke=1, fill=0)

    # texto curvo superior
    txt_sup = "PLATAFORMA EDUCATIVA · LEY 21.719"
    n = len(txt_sup)
    arc = 200  # grados que ocupa
    start = 90 + arc/2
    fs = 7.0
    for i, ch in enumerate(txt_sup):
        ang = math.radians(start - (arc/(n-1))*i)
        c.saveState()
        c.translate(cx + (R-5.2*mm)*math.cos(ang), cy + (R-5.2*mm)*math.sin(ang))
        c.rotate(math.degrees(ang) - 90)
        c.setFont("Serif-Bold", fs)
        c.setFillColor(EMERALD_D)
        c.drawCentredString(0, 0, ch)
        c.restoreState()

    # texto curvo inferior (invertido para leerse al derecho)
    txt_inf = "PROTECCIÓN DE DATOS PERSONALES · CHILE"
    n = len(txt_inf)
    arc_i = 150
    for i, ch in enumerate(txt_inf):
        ang = math.radians(270 + (arc_i/(n-1))*i - arc_i/2 + 180)  # corregido
        x = cx + (R-5.2*mm)*math.cos(ang)
        y = cy + (R-5.2*mm)*math.sin(ang)
        rot = math.degrees(ang) - 270
        c.saveState()
        c.translate(x, y)
        c.rotate(rot)
        c.setFont("Serif-Bold", 6.2)
        c.setFillColor(EMERALD_D)
        c.drawCentredString(0, 0, ch)
        c.restoreState()

    # estrella central superior e inferior del aro
    for ang_deg in (90, 270):
        ang = math.radians(ang_deg)
        c.setFillColor(GOLD)
        c.circle(cx + (R-5.4*mm)*math.cos(ang), cy + (R-5.4*mm)*math.sin(ang), 1.1*mm,
                 stroke=0, fill=1)

    # ── Escudo interior ──
    sw, sh = 13*mm, 15*mm          # tamaño escudo
    sx, sy = cx - sw/2, cy - sh/2 + 1.5*mm
    p = c.beginPath()
    p.moveTo(sx, sy+sh)
    p.lineTo(sx+sw, sy+sh)
    p.lineTo(sx+sw, sy+sh*0.45)
    p.curveTo(sx+sw, sy+sh*0.12, sx+sw*0.62, sy, sx+sw/2, sy-sh*0.10)
    p.curveTo(sx+sw*0.38, sy, sx, sy+sh*0.12, sx, sy+sh*0.45)
    p.close()
    c.setFillColor(EMERALD)
    c.drawPath(p, stroke=0, fill=1)
    # candado blanco dentro
    lw_, lh_ = 5.4*mm, 4.2*mm
    lx, ly = cx-lw_/2, sy+sh*0.28
    c.setFillColor(WHITE)
    c.roundRect(lx, ly, lw_, lh_, 1.1*mm, stroke=0, fill=1)
    c.setStrokeColor(WHITE); c.setLineWidth(1.5)
    c.arc(lx+lw_*0.18, ly+lh_*0.55, lx+lw_*0.82, ly+lh_*1.35, startAng=0, extent=180)
    c.setFillColor(WHITE)
    c.circle(cx, ly+lh_*0.48, 1.15*mm, stroke=0, fill=1)
    c.setFillColor(EMERALD_D)
    c.circle(cx, ly+lh_*0.48, 0.5*mm, stroke=0, fill=1)

    # laureles simplificados: dos arcos punteados a los lados del escudo
    c.setStrokeColor(GOLD); c.setLineWidth(0.9); c.setDash(1.2, 1.6)
    c.arc(cx-R+9*mm, cy-9*mm, cx-R+21*mm, cy+9*mm, startAng=300, extent=120)
    c.arc(cx+R-21*mm, cy-9*mm, cx+R-9*mm, cy+9*mm, startAng=60, extent=120)
    c.setDash()
    c.restoreState()

def icono_medalla(c, x, y, s=4.2):
    c.saveState(); c.translate(x, y)
    c.setStrokeColor(GOLD); c.setLineWidth(0.9)
    c.line(-s*0.35, s*0.75, 0, s*0.25); c.line(s*0.35, s*0.75, 0, s*0.25)
    c.setFillColor(GOLD)
    c.circle(0, -s*0.15, s*0.42, stroke=0, fill=1)
    c.setFillColor(WHITE)
    c.setFont("Helvetica-Bold", s*0.52)
    c.drawCentredString(0, -s*0.32, "★")
    c.restoreState()

def icono_calendario(c, x, y, s=4.2):
    c.saveState(); c.translate(x, y)
    c.setStrokeColor(EMERALD); c.setLineWidth(0.9)
    c.setFillColor(EMERALD_L)
    c.roundRect(-s*0.55, -s*0.55, s*1.1, s*1.0, 0.6, stroke=1, fill=1)
    c.setFillColor(EMERALD)
    c.rect(-s*0.55, s*0.18, s*1.1, s*0.37, stroke=0, fill=1)
    c.setLineWidth(1.1)
    c.line(-s*0.28, s*0.55, -s*0.28, s*0.78)
    c.line(s*0.28, s*0.55, s*0.28, s*0.78)
    c.setFillColor(EMERALD_D)
    for i in (-1, 0, 1):
        c.circle(i*s*0.26, -s*0.12, 0.16*s, stroke=0, fill=1)
    c.restoreState()

def icono_escudo(c, x, y, s=4.2):
    c.saveState(); c.translate(x, y)
    p = c.beginPath()
    w, h = s*1.05, s*1.2
    p.moveTo(-w/2, h/2); p.lineTo(w/2, h/2)
    p.lineTo(w/2, h*0.05)
    p.curveTo(w/2, -h*0.38, w*0.28, -h*0.5, 0, -h*0.58)
    p.curveTo(-w*0.28, -h*0.5, -w/2, -h*0.38, -w/2, h*0.05)
    p.close()
    c.setFillColor(EMERALD); c.drawPath(p, stroke=0, fill=1)
    c.setStrokeColor(WHITE); c.setLineWidth(1.1)
    c.line(-w*0.22, 0, -w*0.05, -h*0.22)
    c.line(-w*0.05, -h*0.22, w*0.24, h*0.18)
    c.restoreState()

def generar(nombre, puntaje, total, salida: Path, url_verif="https://proteccion-datoscursos.netlify.app/verificar"):
    hoy = date.today()
    ftxt = fecha_es(hoy)
    codigo = hashlib.sha256(f"{nombre}|{puntaje}/{total}|{hoy.isoformat()}".encode()).hexdigest()[:8].upper()

    W, H = landscape(A4)
    c = pdfcanvas.Canvas(str(salida), pagesize=(W, H))
    c.setTitle("Certificado de Aprobación — Curso Ley 21.719")
    c.setAuthor("Plataforma educativa Ley 21.719")

    # fondo
    c.setFillColor(HexColor("#fbfdfc")); c.rect(0, 0, W, H, stroke=0, fill=1)

    MX = 12*mm; GAP = 3*mm

    # filigrana central
    filigrana(c, W*0.56, H*0.46, 68)

    # marco triple: exterior grueso, filete dorado, interior fino
    c.setStrokeColor(EMERALD); c.setLineWidth(2.6)
    c.rect(MX, MX, W-2*MX, H-2*MX)
    c.setStrokeColor(GOLD); c.setLineWidth(1.0)
    c.rect(MX+GAP, MX+GAP, W-2*(MX+GAP), H-2*(MX+GAP))
    c.setStrokeColor(EMERALD); c.setLineWidth(0.5)
    g2 = GAP+1.8*mm
    c.rect(MX+g2, MX+g2, W-2*(MX+g2), H-2*(MX+g2))

    # esquinas: cuadrados dorados girados 45°
    for ex in (MX+GAP, W-MX-GAP):
        for ey in (MX+GAP, H-MX-GAP):
            c.saveState(); c.translate(ex, ey); c.rotate(45)
            c.setFillColor(GOLD); c.rect(-1.7*mm, -1.7*mm, 3.4*mm, 3.4*mm, stroke=0, fill=1)
            c.restoreState()

    # franja lateral izquierda esmeralda
    fw = 44*mm
    c.setFillColor(EMERALD); c.rect(0, 0, fw, H, stroke=0, fill=1)
    c.setStrokeColor(colors.Color(1,1,1,alpha=0.25)); c.setLineWidth(0.7)
    c.line(fw, 10*mm, fw, H-10*mm)
    # texto vertical
    c.saveState(); c.translate(20*mm, H/2); c.rotate(90)
    c.setFont("Serif-Bold", 15)
    c.setFillColor(colors.Color(1,1,1,alpha=0.92))
    c.drawCentredString(0, 0, "C E R T I F I C A D O   D E   A P R O B A C I Ó N")
    # línea decorativa blanca
    c.setStrokeColor(colors.Color(1,1,1,alpha=0.5)); c.setLineWidth(0.8)
    c.line(-72*mm, -7*mm, 72*mm, -7*mm)
    c.setFont("Serif-Italic", 8.2)
    c.setFillColor(colors.Color(1,1,1,alpha=0.85))
    c.drawCentredString(0, -13*mm, "Protección de Datos Personales · Chile")
    c.restoreState()

    CX = fw + (W-fw)/2      # centro de la zona útil derecha
    UL = W - fw - 2*(MX+g2) - 6*mm

    # ── Encabezado ──
    y = H - 26*mm
    c.setFillColor(EMERALD_D)
    c.setFont("Serif-Bold", 15)
    c.drawCentredString(CX, y, "PLATAFORMA EDUCATIVA LEY 21.719")

    y -= 11*mm
    sz_t = fit(c, "CERTIFICADO DE APROBACIÓN", "Serif-Bold", 33, 22, UL)
    c.setFont("Serif-Bold", sz_t)
    c.setFillColor(INK)
    c.drawCentredString(CX, y, "CERTIFICADO DE APROBACIÓN")

    # adorno: línea—rombo—línea
    y -= 5.2*mm
    c.setStrokeColor(GOLD); c.setLineWidth(1.1)
    c.line(CX-40*mm, y, CX-6*mm, y); c.line(CX+6*mm, y, CX+40*mm, y)
    c.saveState(); c.translate(CX, y); c.rotate(45)
    c.setFillColor(GOLD); c.rect(-1.5*mm, -1.5*mm, 3*mm, 3*mm, stroke=0, fill=1)
    c.restoreState()

    # ── Otorgamiento + nombre ──
    y -= 10.5*mm
    c.setFont("Serif-Italic", 12.5)
    c.setFillColor(SLATE_5)
    c.drawCentredString(CX, y, "Se otorga el presente certificado a")

    nombre_limpio = nombre.strip()
    y -= 15*mm
    sz_n = fit(c, nombre_limpio, "Serif-Bold", 40, 17, UL*0.94)
    c.setFont("Serif-Bold", sz_n)
    c.setFillColor(EMERALD_D)
    c.drawCentredString(CX, y, nombre_limpio)
    aw = c.stringWidth(nombre_limpio, "Serif-Bold", sz_n)
    c.setStrokeColor(GOLD); c.setLineWidth(1.3)
    c.line(CX-aw/2, y-3.6*mm, CX+aw/2, y-3.6*mm)

    # ── Cuerpo ──
    y -= 12.5*mm
    c.setFont("Serif", 12)
    c.setFillColor(SLATE_7)
    c.drawCentredString(CX, y, "por haber completado satisfactoriamente el curso de capacitación en la")
    y -= 8.6*mm
    c.setFont("Serif-Bold", 14.5)
    c.setFillColor(EMERALD)
    c.drawCentredString(CX, y, "Ley N° 21.719 sobre Protección de Datos Personales de Chile")

    # ── Caja de detalles con íconos ──
    y -= 15*mm
    bw, bh = 196*mm, 27*mm
    bx, by = CX-bw/2, y-bh
    c.setFillColor(HexColor("#f6faf8"))
    c.setStrokeColor(EMERALD); c.setLineWidth(0.8)
    c.roundRect(bx, by, bw, bh, 3.5*mm, stroke=1, fill=1)
    c.setStrokeColor(GOLD); c.setLineWidth(0.6)
    c.roundRect(bx+1.4*mm, by+1.4*mm, bw-2.8*mm, bh-2.8*mm, 2.6*mm, stroke=1, fill=0)

    cols_x = [bx+27*mm, bx+bw*0.47, bx+bw-33*mm]
    etiqs  = ["PUNTAJE OBTENIDO", "FECHA DE EMISIÓN", "VIGENCIA DE LA LEY"]
    vals   = [f"{puntaje} / {total}", ftxt, "Plena desde 01-12-2026"]
    icons  = [icono_medalla, icono_calendario, icono_escudo]

    for xx, etiq, val, ic in zip(cols_x, etiqs, vals, icons):
        ic(c, xx, by+bh-7.8*mm, 4.8)          # ícono más grande
        c.setFont("Helvetica-Bold", 7.4)
        c.setFillColor(SLATE_5)
        c.drawString(xx+7.5*mm, by+bh-9.2*mm, etiq)
        c.setFont("Helvetica-Bold", 11.8)
        c.setFillColor(INK)
        c.drawString(xx+7.5*mm, by+bh-17*mm, val)

    # separadores verticales finos
    c.setStrokeColor(HexColor("#dbe7e2")); c.setLineWidth(0.7)
    for xx in (bx+bw*0.335, bx+bw*0.66):
        c.line(xx, by+4*mm, xx, by+bh-4*mm)

    # ── QR + código + firmas + pie ──
    qr_data = f"{url_verif}?cod={codigo}"
    img = qrcode.make(qr_data, box_size=8, border=1).get_image()
    buf = io.BytesIO(); img.save(buf, format="PNG"); buf.seek(0)
    from reportlab.lib.utils import ImageReader
    qr_side = 17*mm
    qx = MX + g2 + 7*mm; qy = MX + g2 + 7*mm
    c.drawImage(ImageReader(buf), qx, qy, qr_side, qr_side)
    c.setStrokeColor(EMERALD); c.setLineWidth(0.6)
    c.rect(qx, qy, qr_side, qr_side)
    c.setFont("Helvetica-Bold", 6.4); c.setFillColor(SLATE_7)
    c.drawCentredString(qx+qr_side/2, qy-3.2*mm, f"CÓDIGO {codigo}")
    c.setFont("Helvetica", 5.6); c.setFillColor(SLATE_5)
    c.drawCentredString(qx+qr_side/2, qy-6.2*mm, "Escanea para verificar")

    # firmas (dos líneas)
    fy = MX + 16*mm
    sig1, sig2 = CX-bw/2+30*mm, CX+bw/2-30*mm
    for sx_ in (sig1, sig2):
        c.setStrokeColor(SLATE_5); c.setLineWidth(0.8)
        c.line(sx_-26*mm, fy, sx_+26*mm, fy)
    c.setFont("Serif-Italic", 9.5); c.setFillColor(SLATE_7)
    c.drawCentredString(sig1, fy+3*mm, "Director Académico")
    c.drawCentredString(sig2, fy+3*mm, "Instructor Principal")
    c.setFont("Helvetica", 6.8); c.setFillColor(SLATE_5)
    c.drawCentredString(sig1, fy-4*mm, "Plataforma Educativa Ley 21.719")
    c.drawCentredString(sig2, fy-4*mm, f"Emitido el {ftxt}")

    # pie BCN centrado en zona derecha
    py = MX + 6.5*mm
    c.setFont("Helvetica", 6.6); c.setFillColor(SLATE_5)
    c.drawCentredString(CX, py,
        "Texto consolidado: Biblioteca del Congreso Nacional de Chile · BCN · idNorma=1209272   |   "
        "Documento informativo; no constituye asesoría legal.")

    # sello institucional en esquina superior derecha (SIN tocar el título)
    sello_institucional(c, W - MX - 17*mm, H - MX - 20*mm, 13.5*mm)

    c.showPage(); c.save()
    print(f"OK {salida}")
    print(f"  Nombre : {nombre}")
    print(f"  Puntaje: {puntaje}/{total} | Fecha: {ftxt} | Código: {codigo}")

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--nombre", required=True)
    ap.add_argument("--puntaje", type=int, required=True)
    ap.add_argument("--total", type=int, required=True)
    ap.add_argument("--salida", default="certificado_v3.pdf")
    a = ap.parse_args()
    if not (0 <= a.puntaje <= a.total and a.total > 0):
        ap.error("--puntaje debe estar entre 0 y --total")
    Path(a.salida).parent.mkdir(parents=True, exist_ok=True)
    generar(a.nombre, a.puntaje, a.total, Path(a.salida))

if __name__ == "__main__":
    main()
