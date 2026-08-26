"""
GEN MERGED v5: contenido operativo del usuario (limpio de errores legales)
+ diseño esmeralda nuestro + componentes verificados (KeepTogether anti-corte).
"""
import sys, os, re, json
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from pipeline_base import (
    get_styles, portada, tabla_sanciones, tabla_sanciones_pesos, caja_datos_clave,
    caja_alerta, hoja_ruta, faq as comp_faq, glosario as comp_glosario,
    GLOSARIO_TERMINOS, header_footer, portada_especial,
    ESMERALDA, ESMERALDA_50, ESMERALDA_200, ESMERALDA_700, ESMERALDA_800,
    VINO, VINO_50, AMBAR, AMBAR_50, SLATE_50, SLATE_300,
)
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, KeepTogether, PageBreak

OUT = "/opt/data/ley21719-cl/media/informes_v3"
os.makedirs(OUT, exist_ok=True)

NUEVOS = json.load(open('/opt/data/tmp_backend_fix/nuevos_limpios.json'))

TITULOS = {
    'colegios': ("Colegios y Establecimientos Educacionales",
                 "Datos de menores con protección reforzada: consentimiento parental verificable, apps escolares, biometría y protocolo de brechas."),
    'fintech-banca': ("Fintech & Banca",
                      "KYC biométrico, scoring automatizado y datos financieros bajo el nuevo estándar de responsabilidad proactiva."),
    'completo': ("Resumen General de la Ley 21.719",
                 "Visión integral del nuevo marco: principios, bases de licitud, derechos ARSOP, régimen sancionatorio y hoja de ruta."),
    'retail-ecommerce': ("Retail & E-commerce — Canales digitales",
                         "Cookies opt-in, formularios granulares, remarketing y contratos DPA con agencias de marketing."),
    'saas-tecnologia': ("SaaS & Tecnología",
                        "El rol del encargado de tratamiento: DPA, seguridad de plataforma, IA y gestión de brechas."),
    'sector-publico': ("Órganos del Estado y Administración Pública",
                       "Régimen especial de licitud pública, transparencia activa y deberes reforzados de seguridad."),
    'servicios-generales': ("Servicios Generales & Facilities",
                            "Fuerza laboral masiva: control horario, videovigilancia, datos de clientes en instalaciones."),
    'transporte-logistica': ("Transporte & Logística",
                             "Geolocalización de flotas, última milla y seguridad de endpoints en terreno."),
}

VERBOS_CHECKLIST = (
    'Auditar', 'Implementar', 'Deshabilitar', 'Adaptar', 'Garantizar', 'Firmar',
    'Definir', 'Documentar', 'Designar', 'Establecer', 'Revisar', 'Mapear',
    'Probar', 'Capacitar', 'Publicar', 'Nombrar', 'Elaborar', 'Identificar',
    'Desplegar', 'Configurar', 'Bloquear', 'Minimizar', 'Cifrar', 'Limitar',
)

def juntar(parrafo):
    """Une líneas duras de un párrafo."""
    return re.sub(r'\s*\r?\n\s*', ' ', parrafo).strip()

def clasifica_gravedad(sit):
    s = sit.lower()
    if any(k in s for k in ('menor', 'sensible', 'exfiltraci', 'masiv', 'desobediencia', 'vende', 'venta', 'fraudulent')):
        return 'Gravísima'
    if any(k in s for k in ('sin dpa', 'sin base', 'brecha', 'premarcad', 'gps fuera', 'sin aviso', 'sin consentimiento')):
        return 'Grave'
    if any(k in s for k in ('formal', 'omisi', 'retención', 'no responder', 'rat desactualizado')):
        return 'Leve'
    return 'Grave'

def parsear_sector(txt):
    d = {}
    txt = re.sub(r'Ley N° 21\.719[^\n\r]*', '', txt)
    txt = re.sub(r'Página \d+ de \d+', '', txt)
    txt = re.sub(r'G U Í A[^\n\r]*\n?', '', txt)
    txt = re.sub(r'Audiencia:[^\n\r]*\n?', '', txt)
    txt = re.sub(r'Vegencia plena de la ley:[^\n\r]*\n?', '', txt)
    txt = txt.replace('\r\n', '\n')

    # RESUMEN EJECUTIVO
    i0, i1 = txt.find('Resumen ejecutivo'), txt.find('\n1. ')
    if i0 != -1 and i1 != -1:
        d['resumen'] = juntar(txt[i0+len('Resumen ejecutivo'):i1])

    # SECCIONES numeradas hasta Casos prácticos
    ic = txt.find('Casos prácticos')
    cuerpo = txt[i1:ic] if (ic != -1 and i1 != -1) else ''
    partes = re.split(r'\n(?=\d+\.\s+[A-ZÁÉÍÓÚÑ¿])', cuerpo)
    d['secciones'] = []
    for p in partes[1:]:
        m = re.match(r'\s*(\d+\.\s+[^\n]+)\n(.*)', p, re.S)
        if m:
            titulo = juntar(m.group(1))
            cuerpo_sec = juntar(m.group(2))[:1800]
            if len(cuerpo_sec) > 80:
                d['secciones'].append((titulo, cuerpo_sec))

    # CASOS
    d['casos'] = []
    ifq = txt.find('Preguntas frecuentes')
    seg_casos = txt[ic:ifq] if (ic != -1 and ifq != -1) else ''
    for m in re.finditer(r'CASO\s+(\d+)\s*·\s*([^\n]+)\n(.*?)(?=CASO\s+\d+\s*·|\Z)', seg_casos, re.S):
        situacion_m = re.search(r'Situación\.\s*(.*?)(?=La ley exige|$)', m.group(3), re.S)
        if situacion_m:
            d['casos'].append((juntar(situacion_m.group(1))[:220],))

    # FAQ + CHECKLIST (región mezclada por el orden de extracción)
    ig = txt.find('Glosario')
    seg_faq = txt[ifq:ig] if (ifq != -1 and ig != -1) else ''
    lineas = [l.strip() for l in seg_faq.split('\n') if l.strip()]
    d['faq'], d['checklist'] = [], []
    q_actual, a_buf = None, []
    def cierra_q():
        nonlocal q_actual, a_buf
        if q_actual:
            resp = juntar(' '.join(a_buf))
            # separar bullets de checklist que quedaron pegados al final de la respuesta
            d['faq'].append((q_actual, resp[:600]))
        q_actual, a_buf = None, []
    for l in lineas:
        if l.startswith(('Preguntas frecuentes', 'Anexo')):
            continue
        if l.startswith('¿'):
            cierra_q()
            q_actual = l.rstrip('?').strip() + '?'
            a_buf = []
        elif l.split(' ')[0] in VERBOS_CHECKLIST:
            cierra_q()
            d['checklist'].append(juntar(l))
        elif q_actual:
            a_buf.append(l)
    cierra_q()

    # GLOSARIO SECTORIAL
    ia = txt.find('Anexo')
    seg_g = txt[ig:ia] if (ig != -1 and ia != -1) else ''
    d['glosario'] = []
    for m in re.finditer(r'^([A-ZÁÉÍÓÚÑ][^\n—–-]{2,40})\s*[—–-]\s*(.+?)(?=^[A-ZÁÉÍÓÚÑ][^\n—–-]{2,40}\s*[—–-]|\Z)', seg_g, re.S | re.M):
        term = juntar(m.group(1))
        defi = juntar(m.group(2))[:280]
        if len(defi) > 30:
            d['glosario'].append((term, defi))
    return d

def build(sector):
    cfg_txt = parsear_sector(NUEVOS[sector]['texto'])
    titulo, bajada = TITULOS[sector]
    styles = get_styles()
    flow = []

    # PORTADA (identidad esmeralda, igual para los 8)
    kpis = [
        ("Vigencia plena", "01·12·2026", "Régimen sancionatorio operativo", ESMERALDA_50, ESMERALDA_800),
        ("Multa gravísima", "20.000 UTM", "~$1.400 millones aprox.", VINO_50, VINO),
        ("Recargo", "+50%", "Si no subsana en 60 días", AMBAR_50, AMBAR),
    ]
    flow += portada(stitulo_sector=titulo, doc_title=titulo,
                    resumen_ejecutivo=bajada, kpi_data=kpis)

    # RESUMEN EJECUTIVO (del usuario)
    flow.append(Paragraph("Resumen ejecutivo", styles['h2']))
    flow.append(caja_alerta(
        titulo="Lo esencial en 30 segundos",
        texto=cfg_txt.get('resumen', '')[:900],
        color_fondo=ESMERALDA_50, color_borde=ESMERALDA_700, color_texto=ESMERALDA_800))
    flow.append(Spacer(1, 4*mm))

    # SECCIONES OPERATIVAS (del usuario)
    for t_, c_ in cfg_txt['secciones'][:6]:
        flow.append(KeepTogether([
            Paragraph(t_, styles['h2']),
            Paragraph(c_, styles['body']),
        ]))

    flow.append(PageBreak())

    # CASOS PRÁCTICOS (del usuario, con gravedad inferida)
    if cfg_txt['casos']:
        flow.append(Paragraph("Casos típicos del sector", styles['h2']))
        pares = [(c[0], clasifica_gravedad(c[0])) for c in cfg_txt['casos']]
        # reusar tabla estilo seccion_casos manual (para no depender de firma distinta)
        rows = [[Paragraph('<b>Situación</b>', styles['body']),
                 Paragraph('<b>Gravedad probable</b>', styles['body'])]]
        cmap = {'leve': ('cell_verde'), 'grave': ('cell_ambar'), 'gravísima': ('cell_vino')}
        for sit, gra in pares:
            st = styles[cmap[gra.lower()]]
            rows.append([Paragraph(sit, styles['body_tight']), Paragraph(gra, st)])
        t = Table(rows, colWidths=[112*mm, 48*mm])
        est = [('BACKGROUND',(0,0),(-1,0), ESMERALDA_800),
               ('TEXTCOLOR',(0,0),(-1,0), colors.white),
               ('GRID',(0,0),(-1,-1),0.5,SLATE_300),
               ('VALIGN',(0,0),(-1,-1),'TOP'),
               ('LEFTPADDING',(0,0),(-1,-1),8),
               ('TOPPADDING',(0,0),(-1,-1),5),
               ('BOTTOMPADDING',(0,0),(-1,-1),5)]
        for i in range(1, len(rows)):
            est.append(('BACKGROUND',(0,i),(-1,i), SLATE_50 if i % 2 else colors.white))
        t.setStyle(TableStyle(est))
        flow.append(t)
        flow.append(Spacer(1, 4*mm))

    # TABLA SANCIONES + PESOS (nuestros, verificados)
    flow.append(Paragraph("Régimen sancionatorio", styles['h2']))
    flow.append(tabla_sanciones(styles))
    flow.append(Spacer(1, 3*mm))
    flow.append(tabla_sanciones_pesos(styles))
    flow.append(Spacer(1, 3*mm))
    flow.append(KeepTogether(caja_datos_clave(styles)))
    flow.append(PageBreak())

    # CHECKLIST (del usuario; si vino vacío, fallback nuestro mínimo)
    flow.append(Paragraph("Checklist de implementación sectorial", styles['h2']))
    items = cfg_txt['checklist'][:10] or ["Mapear tratamientos en el RAT", "Firmar DPA con proveedores críticos"]
    for i, item in enumerate(items, 1):
        flow.append(KeepTogether([
            Paragraph(f"<b>{i}.</b> {item}", styles['body']),
            Spacer(1, 2*mm),
        ]))

    # HOJA DE RUTA (nuestra)
    flow.append(Spacer(1, 3*mm))
    flow.append(hoja_ruta(styles))

    # FAQ (del usuario)
    if cfg_txt['faq']:
        flow.append(Spacer(1, 3*mm))
        flow.append(comp_faq(styles, cfg_txt['faq'][:6]))

    # GLOSARIO (sectorial del usuario + común)
    flow.append(Spacer(1, 3*mm))
    flow.append(comp_glosario(styles, (cfg_txt['glosario'] + GLOSARIO_TERMINOS)[:14]))

    # FUENTE
    flow.append(Spacer(1, 4*mm))
    flow.append(caja_alerta(
        titulo="Fuente oficial",
        texto="Ley 21.719 — Biblioteca del Congreso Nacional de Chile (idNorma=1209272). "
              "Documento orientativo de trabajo; ante dudas específicas consultar siempre el texto vigente.",
        color_fondo=SLATE_50, color_borde=SLATE_300, color_texto=ESMERALDA_800))

    path = f"{OUT}/informe-{sector}-ley-21719-v3.pdf"
    doc = SimpleDocTemplate(path, pagesize=letter,
                            leftMargin=24*mm, rightMargin=18*mm,
                            topMargin=20*mm, bottomMargin=22*mm,
                            title=f"Informe {titulo} — Ley 21.719", author="Halconx")
    doc.build(flow, onFirstPage=portada_especial, onLaterPages=header_footer)
    print(f"OK {sector}: {path}")
    return path

for sec in ['colegios','completo','fintech-banca','retail-ecommerce','saas-tecnologia',
            'sector-publico','servicios-generales','transporte-logistica']:
    try:
        build(sec)
    except Exception as e:
        print(f"FALLO {sec}: {e}")
print("DONE")
