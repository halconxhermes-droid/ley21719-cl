"""
Informe SERVICIOS GENERALES v4 — contenido ampliado (casos, pesos, hoja de ruta, FAQ, glosario).
"""
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent))
from pipeline_base import *
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, KeepTogether, PageBreak, Spacer
import os

OUT = "/opt/data/ley21719-cl/media/informes_v3"
os.makedirs(OUT, exist_ok=True)

doc = SimpleDocTemplate(
    f"{OUT}/informe-servicios-generales-ley-21719-v3.pdf", pagesize=letter,
    leftMargin=24*mm, rightMargin=18*mm, topMargin=20*mm, bottomMargin=22*mm,
    title="Informe Servicios Generales — Ley 21.719", author="Halconx")
styles = get_styles()
flow = []

flow += portada(
    stitulo_sector="Servicios Generales & Facilities",
    doc_title="Informe Servicios Generales",
    resumen_ejecutivo=(
        "Las empresas de servicios, mantenimiento, seguridad y facilities gestionan datos de empleados, "
        "clientes y prestadores. La Ley 21.719 eleva los requerimientos de registro de tratamiento, "
        "videovigilancia, datos laborales y notificación de brechas sin dilaciones indebidas."),
    kpi_data=[
        ("Vigencia plena", "01·12·2026", "Nuevo régimen sancionatorio operativo", ESMERALDA_50, ESMERALDA_800),
        ("Multa gravísima", "20.000 UTM", "~$1.400 millones pesos aprox.", VINO_50, VINO),
        ("Recargo", "+50%", "Multa si no subsana en 60 días", AMBAR_50, AMBAR),
    ])

# --- 1. DATOS LABORALES ---
flow.append(Paragraph("1. Datos de trabajadores y contratistas", styles['h2']))
flow.append(Paragraph(
    "Nómina, evaluaciones, control horario, salud laboral y cámaras de seguridad conforman el "
    "núcleo de tratamiento del sector. Cada finalidad requiere <b>base legal documentada</b> en el "
    "Registro de Actividades de Tratamiento (RAT). El interés legítimo debe ser ponderado y no "
    "sirve para datos sensibles.", styles['body']))
flow.append(Paragraph(
    "<b>Videovigilancia:</b> solo con finalidad de seguridad informada, avisos visibles, sin audio, "
    "y acceso restringido. Las imágenes deben borrarse según plazos definidos.", styles['body']))

# --- 2. BRECHAS ---
flow.append(Paragraph("2. Notificación de brechas de seguridad", styles['h2']))
flow.append(Paragraph(
    "Ante un incidente (robo de notebooks con nómina, hackeo de cámara, filtración de listas de "
    "personal), la empresa debe notificar a la APDP <b>sin dilaciones indebidas</b>. La ley no fija "
    "plazo de 72 horas ni otro plazo horario; el estándar operativo interno debe apuntar a horas.", styles['body']))
flow.append(caja_alerta(
    titulo="⚠ Diferencia clave Art. 82 vs Art. 126",
    texto=("El <b>Art. 82</b> establece el régimen de multas (leves ≤5.000 UTM, graves ≤10.000 UTM, gravísimas "
           "≤20.000 UTM). El <b>Art. 126</b> define la competencia de la Agencia para fiscalizar e instruir "
           "procedimientos sancionatorios. Son normas complementarias, no duplicadas."),
    color_fondo=ESMERALDA_50, color_borde=ESMERALDA, color_texto=ESMERALDA))

# --- 3. CONTRATOS Y ENCARGADOS ---
flow.append(Paragraph("3. Contratos con clientes y subcontratistas", styles['h2']))
flow.append(Paragraph(
    "Cuando la empresa trata datos por cuenta de clientes (limpieza en instalaciones con registro de "
    "acceso, seguridad con cámaras, mantenimiento con credenciales), opera como <b>encargado</b> y "
    "necesita DPA firmado. Si además tiene clientes propios, es <b>responsable</b> de sus propios tratamientos.", styles['body']))
flow.append(Paragraph(
    "El DPO es voluntario (Art. 50) salvo excepción legal; designarlo voluntariamente es buena "
    "práctica en empresas con múltiples clientes.", styles['body']))

# --- 4. SANCIONES ---
flow.append(Paragraph("4. Régimen sancionatorio aplicable", styles['h2']))
flow.append(tabla_sanciones(styles))
flow.append(Spacer(1, 4*mm))
flow.append(Paragraph(
    "Si la empresa no corrige la falla ordenada por la Agencia dentro de 60 días, la multa recibe un "
    "<b>recargo del 50%</b>. En grandes empresas que reinciden, las multas pueden alcanzar hasta el "
    "<b>4% de los ingresos brutos anuales</b>.", styles['body']))
flow.append(KeepTogether(caja_datos_clave(styles)))
flow.append(Spacer(1, 4*mm))

# --- CASOS ---
flow.append(seccion_casos(styles, [
    ("Venta de listas de personal de clientes a terceros", "Gravísima"),
    ("Cámaras con audio oculto en dependencias", "Gravísima"),
    ("Entregar acceso de ex-trabajador a sistema con datos de clientes", "Grave"),
    ("Control horario biométrico sin información ni base legal clara", "Grave"),
    ("No borrar imágenes de videovigilancia en plazos definidos", "Leve"),
    ("RAT desactualizado o inexistente", "Leve"),
]))

# --- PESOS + CHECKLIST ---
flow.append(PageBreak())
flow.append(Paragraph("Equivalencia de multas en pesos", styles['h2']))
flow.append(tabla_sanciones_pesos(styles))
flow.append(Spacer(1, 6*mm))
flow.append(Paragraph("Checklist de adecuación para servicios generales", styles['h2']))
checklist = [
    ("Inventario RAT", "Mapear datos de empleados, clientes y prestadores; clasificar sensibles."),
    ("Política de videovigilancia", "Avisos, sin audio, plazos de borrado y accesos registrados."),
    ("DPA bidireccionales", "Contratos con clientes donde actúan como encargados y con sus propios proveedores."),
    ("Protocolo de brechas", "Responsable, cadena de escalamiento, canales APDP; simulacro anual."),
    ("Canales ARSOP", "Formulario de derechos para trabajadores y clientes."),
    ("Retención laboral", "Plazos claros para expedientes de ex-trabajadores y postulantes."),
]
for i, (t_, d_) in enumerate(checklist, 1):
    flow.append(KeepTogether([
        Paragraph(f"<b>{i}. {t_}</b>", ParagraphStyle('ck', parent=styles['body'], spaceAfter=1)),
        Paragraph(d_, styles['body_tight']),
        Spacer(1, 2.5*mm),
    ]))
flow.append(Spacer(1, 4*mm))
flow.append(hoja_ruta(styles))

# --- FAQ ---
flow.append(Spacer(1, 6*mm))
flow.append(faq(styles, [
    ("¿Puedo grabar audio en las cámaras de seguridad?",
     "No se recomienda: el audio captura conversaciones y eleva el riesgo. La práctica aceptada es "
     "video sin audio, avisos visibles y plazos cortos de conservación."),
    ("¿La empresa puede revisar correos corporativos de trabajadores?",
     "Solo con política interna informada, finalidad legítima (prevención de faltas graves) y "
     "proporcionalidad. Revisar todo sin aviso carece de base legal."),
    ("¿Qué hago si un cliente pide borrar todos sus datos?",
     "Debe atenderse la solicitud ARSOP sin dilaciones indebidas, salvo obligación legal de retención "
     "(ej. tributaria), que debe explicarse al titular."),
]))

# --- GLOSARIO + FUENTE ---
flow.append(glosario(styles))
flow.append(Spacer(1, 4*mm))
flow.append(caja_alerta(
    titulo="Fuente oficial",
    texto="Ley 21.719, Biblioteca del Congreso Nacional (BCN), idNorma=1209272.",
    color_fondo=SLATE_50, color_borde=SLATE_300, color_texto=SLATE_700))

doc.build(flow, onFirstPage=portada_especial, onLaterPages=header_footer)
print("OK servicios v4")
