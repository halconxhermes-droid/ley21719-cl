"""
Pipeline unificado de rediseño de informes PDF — Ley 21.719
Paleta: Esmeralda Consultoría (idéntica al sitio web)
- Primary: #047857 (esmeralda)
- Acentos: #991B1B (vino errores), #b45309 (ámbar advertencia), #34d399/#6ee7b7/#d1fae5 (verdes light)
- Neutrales: #0f172a → #94a3b8 → #f8fafc
"""
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.units import mm, cm
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak,
    KeepTogether, Frame, PageTemplate, BaseDocTemplate
)
from reportlab.pdfgen import canvas
import json
from pathlib import Path

# === PALETA ESMERALDA ===
ESMERALDA = colors.HexColor("#047857")
ESMERALDA_50 = colors.HexColor("#f0fdf4")
ESMERALDA_100 = colors.HexColor("#dcfce7")
ESMERALDA_200 = colors.HexColor("#bbf7d0")
ESMERALDA_600 = colors.HexColor("#16a34a")
ESMERALDA_700 = colors.HexColor("#15803d")
ESMERALDA_800 = colors.HexColor("#166534")
ESMERALDA_900 = colors.HexColor("#14532d")

VINO = colors.HexColor("#991B1B")
VINO_50 = colors.HexColor("#fef2f2")
VINO_200 = colors.HexColor("#fecaca")

AMBAR = colors.HexColor("#b45309")
AMBAR_50 = colors.HexColor("#fffbeb")
AMBAR_200 = colors.HexColor("#fde68a")

SLATE_900 = colors.HexColor("#0f172a")
SLATE_700 = colors.HexColor("#334155")
SLATE_600 = colors.HexColor("#475569")
SLATE_500 = colors.HexColor("#64748b")
SLATE_400 = colors.HexColor("#94a3b8")
SLATE_300 = colors.HexColor("#cbd5e1")
SLATE_200 = colors.HexColor("#e2e8f0")
SLATE_100 = colors.HexColor("#f1f5f9")
SLATE_50 = colors.HexColor("#f8fafc")

# === ESTILOS ===
def get_styles():
    base = getSampleStyleSheet()
    styles = {}
    styles['titulo_sector'] = ParagraphStyle('titulo_sector', parent=base['Heading1'],
        fontSize=28, textColor=SLATE_900, spaceAfter=8, fontName='Helvetica-Bold', leading=32)
    styles['kicker'] = ParagraphStyle('kicker', parent=base['Normal'],
        fontSize=9, textColor=ESMERALDA, fontName='Helvetica-Bold',
        spaceAfter=4, letterSpacing=2.2)
    styles['sector_label'] = ParagraphStyle('sector_label', parent=base['Heading2'],
        fontSize=16, textColor=ESMERALDA, spaceAfter=12, fontName='Helvetica-Bold', leading=20)
    styles['h2'] = ParagraphStyle('h2', parent=base['Heading2'],
        fontSize=14, textColor=SLATE_900, spaceBefore=14, spaceAfter=6,
        fontName='Helvetica-Bold', leading=18)
    styles['h3'] = ParagraphStyle('h3', parent=base['Heading3'],
        fontSize=12, textColor=ESMERALDA_800, spaceBefore=10, spaceAfter=4,
        fontName='Helvetica-Bold', leading=15)
    styles['body'] = ParagraphStyle('body', parent=base['Normal'],
        fontSize=10, textColor=SLATE_700, fontName='Helvetica',
        alignment=TA_JUSTIFY, leading=14, spaceAfter=8)
    styles['body_tight'] = ParagraphStyle('body_tight', parent=styles['body'],
        fontSize=9.5, leading=13)
    styles['lead'] = ParagraphStyle('lead', parent=base['Normal'],
        fontSize=11, textColor=SLATE_600, fontName='Helvetica',
        alignment=TA_JUSTIFY, leading=15, spaceAfter=10)
    styles['footer'] = ParagraphStyle('footer', parent=base['Normal'],
        fontSize=8, textColor=SLATE_400, fontName='Helvetica', alignment=TA_CENTER)
    styles['cell_verde'] = ParagraphStyle('cell_verde', parent=base['Normal'],
        fontSize=9, textColor=ESMERALDA_800, fontName='Helvetica-Bold')
    styles['cell_vino'] = ParagraphStyle('cell_vino', parent=base['Normal'],
        fontSize=9, textColor=VINO, fontName='Helvetica-Bold')
    styles['cell_ambar'] = ParagraphStyle('cell_ambar', parent=base['Normal'],
        fontSize=9, textColor=AMBAR, fontName='Helvetica-Bold')
    return styles

# === HEADER / FOOTER ===
def header_footer(canvas_obj, doc):
    canvas_obj.saveState()
    page_num = canvas_obj.getPageNumber()
    if page_num > 1:
        # Franja superior
        canvas_obj.setFillColor(SLATE_50)
        canvas_obj.rect(0, doc.pagesize[1] - 18*mm, doc.pagesize[0], 18*mm, fill=1, stroke=0)
        canvas_obj.setFillColor(ESMERALDA)
        canvas_obj.rect(0, doc.pagesize[1] - 4*mm, doc.pagesize[0], 4*mm, fill=1, stroke=0)
        # Texto header
        canvas_obj.setFillColor(SLATE_700)
        canvas_obj.setFont('Helvetica-Bold', 8)
        canvas_obj.drawString(18*mm, doc.pagesize[1] - 11*mm, "LEY 21.719 · INFORME SECTORIAL")
        canvas_obj.setFont('Helvetica', 8)
        canvas_obj.setFillColor(SLATE_500)
        canvas_obj.drawRightString(doc.pagesize[0] - 18*mm, doc.pagesize[1] - 11*mm,
                                   "Fuente: BCN idNorma 1209272")
    # Footer
    canvas_obj.setFillColor(SLATE_100)
    canvas_obj.rect(0, 0, doc.pagesize[0], 14*mm, fill=1, stroke=0)
    canvas_obj.setFillColor(ESMERALDA)
    canvas_obj.rect(0, 14*mm, doc.pagesize[0], 1*mm, fill=1, stroke=0)
    canvas_obj.setFont('Helvetica', 7.5)
    canvas_obj.setFillColor(SLATE_500)
    canvas_obj.drawString(18*mm, 8*mm,
        "Documento de trabajo · Verificar siempre contra el texto legal vigente en www.bcn.cl/leychile")
    canvas_obj.drawRightString(doc.pagesize[0] - 18*mm, 8*mm, f"Página {page_num}")
    canvas_obj.drawCentredString(doc.pagesize[0]/2, 4*mm,
        "Ley 21.719 · Protección de Datos Personales · Chile")
    canvas_obj.restoreState()

def portada_especial(canvas_obj, doc):
    """Header/footer específico para la portada (página 1)"""
    canvas_obj.saveState()
    # Franja superior esmeralda full-width
    canvas_obj.setFillColor(ESMERALDA_900)
    canvas_obj.rect(0, doc.pagesize[1] - 32*mm, doc.pagesize[0], 32*mm, fill=1, stroke=0)
    canvas_obj.setFillColor(ESMERALDA)
    canvas_obj.rect(0, doc.pagesize[1] - 36*mm, doc.pagesize[0], 4*mm, fill=1, stroke=0)
    # Banda lateral esmeralda (como propuesta A)
    canvas_obj.setFillColor(ESMERALDA)
    canvas_obj.rect(0, 0, 14*mm, doc.pagesize[1], fill=1, stroke=0)
    canvas_obj.setFillColor(ESMERALDA_700)
    canvas_obj.rect(13*mm, 0, 1*mm, doc.pagesize[1], fill=1, stroke=0)
    # Footer simple portada
    canvas_obj.setFillColor(SLATE_50)
    canvas_obj.rect(0, 0, doc.pagesize[0], 16*mm, fill=1, stroke=0)
    canvas_obj.setFillColor(ESMERALDA)
    canvas_obj.rect(0, 16*mm, doc.pagesize[0], 1*mm, fill=1, stroke=0)
    canvas_obj.setFont('Helvetica-Bold', 9)
    canvas_obj.setFillColor(ESMERALDA)
    canvas_obj.drawString(24*mm, 9*mm, "LEY 21.719 · GUÍA SECTORIAL DE ADECUACIÓN")
    canvas_obj.setFont('Helvetica', 8)
    canvas_obj.setFillColor(SLATE_500)
    canvas_obj.drawString(24*mm, 5*mm,
        "Documento técnico — verificar contra texto legal vigente en BCN")
    canvas_obj.restoreState()

# === COMPONENTES REUTILIZABLES ===
def card_semaforo(titulo, valor, subtitulo, color_fondo, color_texto):
    """Card con valor destacado (verde/vino/ámbar)"""
    hex_color = color_texto.hexval() if hasattr(color_texto, 'hexval') else str(color_texto)
    t = Table(
        [[Paragraph(f'<font size="22" color="{hex_color}"><b>{valor}</b></font>', ParagraphStyle('', fontName='Helvetica-Bold'))],
         [Paragraph(f'<font size="9.5" color="#334155"><b>{titulo}</b></font>', ParagraphStyle(''))],
         [Paragraph(f'<font size="8" color="#64748b">{subtitulo}</font>', ParagraphStyle(''))]],
        colWidths=[55*mm])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), color_fondo),
        ('BOX', (0,0), (-1,-1), 0.5, SLATE_300),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    return t

def tabla_sanciones(styles):
    """Tabla con las 3 categorías de infracciones"""
    data = [
        [Paragraph('<b>Categoría</b>', styles['body']),
         Paragraph('<b>Sanción máxima</b>', styles['body']),
         Paragraph('<b>Ejemplos típicos</b>', styles['body'])],
        [Paragraph('Leve', styles['cell_verde']),
         Paragraph('5.000 UTM', styles['cell_verde']),
         Paragraph('Incumplir plazos, no entregar información clara', styles['body_tight'])],
        [Paragraph('Grave', styles['cell_ambar']),
         Paragraph('10.000 UTM', styles['cell_ambar']),
         Paragraph('Tratar datos sin base legal, vulnerar seguridad', styles['body_tight'])],
        [Paragraph('Gravísima', styles['cell_vino']),
         Paragraph('20.000 UTM', styles['cell_vino']),
         Paragraph('Uso fraudulento, filtración intencional de datos sensibles', styles['body_tight'])],
    ]
    t = Table(data, colWidths=[35*mm, 35*mm, 90*mm])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), ESMERALDA_800),
        ('TEXTCOLOR', (0,0), (-1,0), colors.white),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (-1,0), 10),
        ('BACKGROUND', (0,1), (-1,1), ESMERALDA_50),
        ('BACKGROUND', (0,2), (-1,2), AMBAR_50),
        ('BACKGROUND', (0,3), (-1,3), VINO_50),
        ('GRID', (0,0), (-1,-1), 0.5, SLATE_300),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
    ]))
    return t

def caja_datos_clave(styles):
    """Caja con datos clave del nuevo régimen (esmeralda)"""
    inner = [
        [Paragraph('<b>📅 Vigencia plena</b>', styles['cell_verde'])],
        [Paragraph('1 de diciembre de 2026', styles['body_tight'])],
        [Spacer(1, 4)],
        [Paragraph('<b>⚖ Notificación de brechas</b>', styles['cell_verde'])],
        [Paragraph('<i>Sin dilaciones indebidas</i> a la Agencia y a los afectados', styles['body_tight'])],
        [Spacer(1, 4)],
        [Paragraph('<b>👤 Delegado de Protección de Datos (DPO</b>', styles['cell_verde'])],
        [Paragraph('Generalmente voluntario (Art. 50); obligatorio por excepción legal', styles['body_tight'])],
        [Spacer(1, 4)],
        [Paragraph('<b>📈 Reincidencia (grandes empresas</b>', styles['cell_verde'])],
        [Paragraph('Hasta 2%–4% de los ingresos brutos anuales', styles['body_tight'])],
        [Spacer(1, 4)],
        [Paragraph('<b>➕ Recargo por no subsanar</b>', styles['cell_verde'])],
        [Paragraph('50% adicional si no corrige en 60 días', styles['body_tight'])],
    ]
    t = Table(inner, colWidths=[160*mm])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), ESMERALDA_50),
        ('BOX', (0,0), (-1,-1), 0.8, ESMERALDA_700),
        ('LEFTPADDING', (0,0), (-1,-1), 12),
        ('RIGHTPADDING', (0,0), (-1,-1), 12),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LINEABOVE', (0,2), (-1,2), 0.3, ESMERALDA_200),
        ('LINEABOVE', (0,5), (-1,5), 0.3, ESMERALDA_200),
        ('LINEABOVE', (0,8), (-1,8), 0.3, ESMERALDA_200),
        ('LINEABOVE', (0,11), (-1,11), 0.3, ESMERALDA_200),
    ]))
    return t

def caja_alerta(titulo, texto, color_fondo, color_borde, color_texto):
    """Caja de alerta con borde de color"""
    hex_color = color_texto.hexval() if hasattr(color_texto, 'hexval') else str(color_texto)
    inner = Table(
        [[Paragraph(f'<font color="{hex_color}"><b>{titulo}</b></font>', ParagraphStyle(''))],
         [Paragraph(texto, ParagraphStyle('alerta', fontSize=9, textColor=SLATE_700, leading=12))]],
        colWidths=[160*mm])
    inner.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), color_fondo),
        ('BOX', (0,0), (-1,-1), 1, color_borde),
        ('LEFTPADDING', (0,0), (-1,-1), 10),
        ('RIGHTPADDING', (0,0), (-1,-1), 10),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
    ]))
    return inner

# === CONSTRUCTOR DE PORTADA ===
def portada(stitulo_sector, resumen_ejecutivo, kpi_data, doc_title=""):
    """Retorna lista de flowables para la portada"""
    styles = get_styles()
    flow = []
    flow.append(Spacer(1, 18*mm))
    flow.append(Paragraph("LEY 21.719 · GUÍA TÉCNICA SECTORIAL", styles['kicker']))
    flow.append(Spacer(1, 4*mm))
    flow.append(Paragraph(stitulo_sector, styles['titulo_sector']))
    flow.append(Paragraph("Adecuación operativa al nuevo marco de protección de datos personales",
                         styles['sector_label']))
    flow.append(Spacer(1, 6*mm))
    flow.append(Paragraph(resumen_ejecutivo, styles['lead']))
    flow.append(Spacer(1, 10*mm))
    # KPIs semáforo (3 cards)
    cards_row = [card_semaforo(*kpi) for kpi in kpi_data]
    flow.append(Table([cards_row], colWidths=[c._colWidths[0] for c in cards_row]))
    flow.append(Spacer(1, 12*mm))
    flow.append(Paragraph("Datos clave del nuevo régimen", styles['h2']))
    flow.append(caja_datos_clave(styles))
    flow.append(PageBreak())
    return flow
