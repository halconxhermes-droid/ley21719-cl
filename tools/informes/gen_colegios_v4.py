"""
Informe COLEGIOS v4 — Reescritura completa + contenido ampliado.
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
    f"{OUT}/informe-colegios-ley-21719-v3.pdf", pagesize=letter,
    leftMargin=24*mm, rightMargin=18*mm, topMargin=20*mm, bottomMargin=22*mm,
    title="Informe Colegios — Ley 21.719", author="Halconx")
styles = get_styles()
flow = []

# --- PORTADA ---
flow += portada(
    stitulo_sector="Colegios y Establecimientos Educacionales",
    doc_title="Informe Colegios",
    resumen_ejecutivo=(
        "Los establecimientos educacionales tratan datos especialmente sensibles: menores de edad, "
        "notas, fichas de salud escolar, conducta y situación socioeconómica de las familias. "
        "La Ley 21.719 eleva el estándar de cuidado y fija responsabilidades directas para "
        "sostenedores, directivos y proveedores tecnológicos de la comunidad educativa."),
    kpi_data=[
        ("Vigencia plena", "01·12·2026", "Nuevo régimen sancionatorio operativo", ESMERALDA_50, ESMERALDA_800),
        ("Multa gravísima", "20.000 UTM", "~$1.400 millones pesos aprox.", VINO_50, VINO),
        ("Recargo", "+50%", "Multa si no subsana en 60 días", AMBAR_50, AMBAR),
    ])

# --- 1. DATOS DE MENORES ---
flow.append(Paragraph("1. Datos de menores: protección reforzada", styles['h2']))
flow.append(Paragraph(
    "El tratamiento de datos de niños, niñas y adolescentes (NNA) recibe protección reforzada. "
    "Debe responder siempre al <b>interés superior del menor</b>, ser proporcionado y contar con "
    "autorización verificable del padre, madre o tutor legal.", styles['body']))
flow.append(Paragraph(
    "<b>Prohibición comercial:</b> queda prohibida la publicidad dirigida y el perfilamiento "
    "comercial de menores en plataformas escolares, apps de comunicación con apoderados y "
    "herramientas de aprendizaje digital.", styles['body']))
flow.append(Paragraph(
    "<b>Datos biométricos escolares:</b> la huella dactilar o facial para control de asistencia "
    "constituye dato biométrico sujeto a medidas reforzadas de seguridad y consentimiento "
    "explícito. No debe almacenarse indefinidamente.", styles['body']))
flow.append(caja_alerta(
    titulo="⚠ Alto riesgo presumido",
    texto=("Cuando un tratamiento compromete datos de menores se presume el alto riesgo: exige Evaluación "
           "de Impacto (DPIA) previa y medidas técnicas reforzadas (cifrado, control de acceso, bitácoras)."),
    color_fondo=AMBAR_50, color_borde=AMBAR, color_texto=AMBAR))

# --- 2. NOTIFICACIÓN DE BRECHAS ---
flow.append(Paragraph("2. Notificación de brechas de seguridad", styles['h2']))
flow.append(Paragraph(
    "Ante una filtración de la plataforma de notas, exposición de fichas o compromiso de dispositivos "
    "con datos escolares, el establecimiento debe notificar a la APDP <b>sin dilaciones indebidas</b> "
    "y por el medio más expedito posible.", styles['body']))
flow.append(caja_alerta(
    titulo="🚨 Corrección clave respecto a versiones anteriores",
    texto=("La ley NO fija un plazo de 72 horas ni ningún otro plazo horario. La notificación debe hacerse "
           "'sin dilaciones indebidas', concepto que la APDP evaluará caso a caso según la gravedad y "
           "capacidad técnica del establecimiento. Planifica protocolos que permitan notificar en horas, no días."),
    color_fondo=ESMERALDA_50, color_borde=ESMERALDA, color_texto=ESMERALDA))
flow.append(Paragraph(
    "Si el riesgo para los afectados es alto, además corresponde <b>notificar directamente a los padres, "
    "madres y apoderados</b>, explicando en lenguaje claro qué datos se vieron comprometidos y qué medidas "
    "tomar.", styles['body']))
flow.append(Paragraph(
    "<b>Protocolo sugerido:</b> el director es responsable interno; debe contar con cadena de escalamiento "
    "documentada (directiva → sostenedor → proveedor TI → APDP → apoderados).", styles['body']))

# --- 3. CONSENTIMIENTO ---
flow.append(Paragraph("3. Consentimiento y derechos ARSOP de la comunidad escolar", styles['h2']))
flow.append(Paragraph(
    "Las autorizaciones para uso de imágenes en redes sociales, salidas a terreno o publicaciones "
    "deben ser <b>explícitas y específicas por finalidad</b>. El consentimiento tácito ya no es válido.", styles['body']))
flow.append(Paragraph(
    "Padres y estudiantes titulares de datos pueden ejercer derechos ARSOP (Acceso, Rectificación, "
    "Supresión, Oposición y Portabilidad) mediante canales que el establecimiento debe mantener "
    "operativos y responder sin dilaciones indebidas.", styles['body']))

# --- 4. PROVEEDORES ---
flow.append(Paragraph("4. Proveedores tecnológicos y contratos de tratamiento", styles['h2']))
flow.append(Paragraph(
    "Plataformas de notas, apps de comunicación, cámaras de videovigilancia y sistemas de matrícula "
    "deben operar bajo <b>contratos de encargo de tratamiento (DPA)</b> que regulen finalidad, seguridad, "
    "subcontratación y borrado al término del servicio.", styles['body']))
flow.append(Paragraph(
    "El DPO es generalmente voluntario (Art. 50), pero sostenedores grandes pueden designarlo "
    "voluntariamente como buena práctica. Los proveedores con acceso a datos de menores deben "
    "firmar cláusula específica de protección.", styles['body']))

# --- 5. SANCIONES ---
flow.append(Paragraph("5. Régimen sancionatorio aplicable", styles['h2']))
flow.append(tabla_sanciones(styles))
flow.append(Spacer(1, 4*mm))
flow.append(Paragraph(
    "En grandes sostenedores que reinciden, las multas pueden calcularse como hasta el <b>4% de los "
    "ingresos brutos anuales</b>. Si la infracción ordenada no se subsana en plazo, aplica un "
    "<b>recargo del 50%</b> sobre la multa.", styles['body']))
flow.append(KeepTogether(caja_datos_clave(styles)))
flow.append(Spacer(1, 4*mm))

# --- 6. CASOS TÍPICOS ---
flow.append(seccion_casos(styles, [
    ("App escolar que comparte datos de conducta con empresa publicitaria", "Gravísima"),
    ("Fichas médicas de alumnos en servidor sin cifrar", "Gravísima"),
    ("Cámaras de seguridad filmando fuera del recinto escolar", "Grave"),
    ("Uso de fotos de alumnos en Instagram institucional sin autorización parental", "Grave"),
    ("Retención indefinida de expedientes una vez egresado el alumno", "Leve"),
    ("No responder solicitud de acceso a expediente dentro de plazo razonable", "Leve"),
    ("Sin DPA con plataforma de matrícula cloud", "Grave"),
    ("App de comunicación con apoderados que vende datos estadísticos a terceros", "Gravísima"),
]))

# --- 7. SANCIONES EN PESOS ---
flow.append(Paragraph("6. Equivalencia multas en pesos", styles['h2']))
flow.append(tabla_sanciones_pesos(styles))

# --- 8. CHECKLIST ---
flow.append(PageBreak())
flow.append(Paragraph("7. Checklist de adecuación para colegios", styles['h2']))
checklist = [
    ("Inventario RAT", "Mapear todos los datos tratados: alumnos, apoderados, funcionarios, postulantes. Clasificar sensibles vs. regulares."),
    ("Base legal por finalidad", "Documentar la base legal de cada tratamiento (consentimiento NNA, obligación legal, interés legítimo)."),
    ("Consentimientos NNA", "Revisar y actualizar formatos de autorización parental verificable para cada finalidad."),
    ("DPA con proveedores", "Auditar contratos con plataformas de notas, apps, servicios cloud. Incluir cláusula de borrado al fin."),
    ("Protocolo de brechas", "Definir responsable (director), canales APDP y comunicación a apoderados; simular al menos 1 vez al año."),
    ("DPIA de alto riesgo", "Evaluar tratamientos biométricos, masivos o de menores (asistencia, salud, conducta)."),
    ("Canales ARSOP", "Publicar formulario accesible de derechos y plazos internos de respuesta."),
    ("Capacitación", "Formar a directivos y personal en manejo de datos de menores y notificación de brechas."),
    ("Retención y eliminación", "Definir plazos claros de conservación y procedimiento de borrado post-egreso."),
    ("Cámaras y videovigilancia", "Auditar alcance: solo dentro del recinto, sin audio ilegal, avisos visibles a alumnos."),
]
for i, (t_, d_) in enumerate(checklist, 1):
    flow.append(KeepTogether([
        Paragraph(f"<b>{i}. {t_}</b>", ParagraphStyle('ck', parent=styles['body'], spaceAfter=1)),
        Paragraph(d_, styles['body_tight']),
        Spacer(1, 2.5*mm),
    ]))

# --- HOJA DE RUTA ---
flow.append(KeepTogether(hoja_ruta(styles)))

# --- FAQ ---
flow.append(PageBreak())
flow.append(faq(styles, [
    ("¿El consentimiento de apoderados cubre a todos los hijos?",
     "Sí, pero debe ser renovado cuando cambie la finalidad. Por ejemplo: autorizar imagen para la web "
     "es diferente a autorizar participación en video promocional."),
    ("¿Se puede usar cara o huella para tomar asistencia?",
     "Sí, con consentimiento explícito documentado, cifrado de los datos biométricos y eliminación "
     "al finalizar cada año lectivo. No usarlos para otros fines."),
    ("¿Qué pasa si un proveedor extranjero tiene datos de alumnos chilenos?",
     "El proveedor debe firmar DPA y garantizar que los datos se procesan bajo estándares equivalentes. "
     "La transfers internacionales requieren-base legal específica."),
    ("¿Puede el sostenedor compartir fichas médicas con el departamento de salud del municipio?",
     "Solo si existe base legal (obligación legal) y se informa a los apoderados. El interes legítimo "
     "no basta para datos sensibles de salud."),
]))

# --- GLOSARIO ---
flow.append(KeepTogether(glosario(styles)))

# --- FOOTER ---
flow.append(Spacer(1, 6*mm))
flow.append(caja_alerta(
    titulo="Fuente oficial",
    texto="Ley 21.719, Biblioteca del Congreso Nacional (BCN), idNorma=1209272. "
          "Documento orientativo; ante dudas específicas consultar siempre el texto vigente.",
    color_fondo=SLATE_50, color_borde=SLATE_300, color_texto=SLATE_700))

doc.build(flow, onFirstPage=portada_especial, onLaterPages=header_footer)
print("OK colegios v4")
