"""
Genera 6 informes restantes: sector-publico, retail, fintech, saas, transporte, completo.
Todos clase A → correcciones mínimas: recargo 50%, DPO voluntario, Art.82/126, "sin dilaciones indebidas".
"""
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent))
from pipeline_base import *
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate
import os, json

OUT = "/opt/data/ley21719-cl/media/informes_v3"
os.makedirs(OUT, exist_ok=True)

def build_pdf(filename, titulo_sector, resumen, kpis, secciones, checklist, footer_texto):
    """Construye PDF estándar con estructura esmeralda"""
    PDF_PATH = f"{OUT}/{filename}"
    doc = SimpleDocTemplate(PDF_PATH, pagesize=letter,
                            leftMargin=24*mm, rightMargin=18*mm,
                            topMargin=20*mm, bottomMargin=22*mm,
                            title=titulo_sector, author="Halconx")
    styles = get_styles()
    flow = portada(stitulo_sector=titulo_sector, doc_title="", resumen_ejecutivo=resumen, kpi_data=kpis)
    for h2, cuerpo in secciones:
        flow.append(Paragraph(h2, styles['h2']))
        flow.append(Paragraph(cuerpo, styles['body']))
    flow.append(tabla_sanciones(styles))
    flow.append(Spacer(1, 4*mm))
    flow.append(Paragraph(
        "Si la empresa no corrige la falla ordenada por la Agencia dentro de 60 días, la multa recibe un "
        "<b>recargo del 50%</b>. En grandes empresas que reinciden, las multas pueden alcanzar hasta el "
        "<b>4% de los ingresos brutos anuales</b>.", styles['body']))
    flow.append(caja_datos_clave(styles))
    flow.append(PageBreak())
    flow.append(Paragraph("Checklist de adecuación", styles['h2']))
    for i, (t_, d_) in enumerate(checklist, 1):
        flow.append(Paragraph(f"<b>{i}. {t_}</b>", ParagraphStyle('ck', parent=styles['body'], spaceAfter=1)))
        flow.append(Paragraph(d_, styles['body_tight']))
        flow.append(Spacer(1, 2.5*mm))
    flow.append(caja_alerta(
        titulo="Fuente oficial", texto=footer_texto,
        color_fondo=SLATE_50, color_borde=SLATE_300, color_texto=SLATE_700))
    doc.build(flow, onFirstPage=portada_especial, onLaterPages=header_footer)
    print("OK ->", PDF_PATH)
    return PDF_PATH

# === CONFIGURACIÓN POR SECTOR ===
KPI = [
    ("Vigencia plena", "01·12·2026", "Nuevo régimen sancionatorio operativo", ESMERALDA_50, ESMERALDA_800),
    ("Multa gravísima", "20.000 UTM", "~$1.400 millones pesos aprox.", VINO_50, VINO),
    ("Recargo", "+50%", "Multa si no subsana en 60 días", AMBAR_50, AMBAR),
]

# 1. SECTOR PÚBLICO
build_pdf(
    "informe-sector-publico-ley-21719-v3.pdf",
    "Órganos del Estado y Administraciones Públicas",
    "La Ley 21.719 introduce un régimen especial para la Administración del Estado: base legal de "
    "licitud diferenciada, deberes de transparencia activa y obligaciones reforzadas de seguridad "
    "en el tratamiento de datos ciudadanos.",
    KPI,
    [
        ("1. Régimen especial de licitud pública",
         "Bajo el Título IV, los organismos de la Administración del Estado, municipios y ministerios "
         "cuentan con una base legal de licitud diferenciada: están lícitamente facultados para tratar, "
         "comunicar y ceder datos para el cumplimiento de sus funciones legales, sin consentimiento "
         "individual cuando la ley lo autoriza."),
        ("2. Transparencia y deberes del Estado",
         "El principio de transparencia activa obliga a informar a los titulares sobre el tratamiento de "
         "sus datos, finalidades y derechos. Los perfiles obligatorios deben ser desempeñados por "
         "funcionarios titulares, no por personal externo."),
        ("3. Notificación de brechas sin dilaciones indebidas",
         "Ante una filtración de datos ciudadanos, la entidad debe notificar a la APDP sin dilaciones "
         "indebidas por el medio más expedito. Nunca se fija un plazo de 72 horas; el concepto es "
         "'sin dilaciones indebidas' evaluado caso a caso."),
    ],
    [
        ("Inventario RAT", "Mapear datos de ciudadanos, funcionarios y contratistas."),
        ("Perfiles titulares", "Designar responsables internos por área de tratamiento."),
        ("DPA con proveedores", "Auditar contratos cloud y prestadores de TI."),
        ("Protocolo de brechas", "Definir flujo de notificación a la APDP y ciudadanos."),
        ("Canales ARSOP", "Habilitar formulario de derechos en el sitio institucional."),
    ],
    "Ley 21.719 — Biblioteca del Congreso Nacional (BCN), idNorma=1209272.",
)

# 2. RETAIL-ECOMMERCE
build_pdf(
    "informe-retail-ecommerce-ley-21719-v3.pdf",
    "Retail & E-commerce",
    "Las tiendas online y físicas tratan datos masivos de clientes: historial de compras, ubicación, "
    "preferencias y métodos de pago. La Ley 21.719 exige consentimiento explícito, transparencia en "
    "el uso de cookies y canales ágiles para el ejercicio de derechos.",
    KPI,
    [
        ("1. Consentimiento explícito en la tienda",
         "El consentimiento debe ser libre, específico, informado y otorgado mediante acción clara. "
         "Se acabó el consentimiento tácito: cada finalidad requiere aceptación por separado."),
        ("2. Cookies y banners web",
         "Los banners deben ofrecer botones iguales para Aceptar, Rechazar y Configurar. Cero casillas "
         "pre-marcadas por defecto."),
        ("3. Derechos ARSOP para el cliente",
         "El comprador puede acceder, rectificar, suprimir, oponerse y portar sus datos mediante canales "
         "que el retailer debe responder sin dilaciones indebidas."),
    ],
    [
        ("Inventario RAT", "Mapear datos de clientes, suscriptores y leads."),
        ("Banners de cookies", "Auditar cumplimiento de botones iguales."),
        ("DPA con pasarelas de pago", "Contratos con procesadores de tarjetas."),
        ("Protocolo de brechas", "Definir responsable y comunicación a clientes."),
        ("Canales ARSOP", "Habilitar autogestión de datos en la cuenta de cliente."),
    ],
    "Ley 21.719 — BCN idNorma=1209272.",
)

# 3. FINTECH-BANCA
build_pdf(
    "informe-fintech-banca-ley-21719-v3.pdf",
    "Fintech & Banca",
    "El sector financiero maneja datos de altísimo riesgo: scores crediticios, movimientos, deudas y "
    "perfilamiento. La Ley 21.719 regula decisiones automatizadas, tratamiento de datos financieros y "
    "obligaciones reforzadas de seguridad.",
    KPI,
    [
        ("1. Decisiones automatizadas (credit scoring)",
         "Los ciudadanos tienen derecho a no ser sometidos a decisiones 100% automatizadas que los afecten "
         "(ej. denegación de crédito), salvo excepciones legales con revisión humana."),
        ("2. Datos financieros sensibles",
         "Su tratamiento requiere base legal específica y medidas técnicas reforzadas. La vigilancia de "
         "la APDP es activa en este sector."),
        ("3. DPO y notificación de brechas",
         "El Delegado de Protección de Datos (DPO) es generalmente voluntario (Art. 50), aunque ciertos "
         "establecimientos financieros pueden tener obligación por excepción legal. Ante una brecha, "
         "notificar a la APDP sin dilaciones indebidas."),
    ],
    [
        ("Inventario RAT", "Mapear datos crediticios, transaccionales y KYC."),
        ("Explicabilidad IA", "Documentar lógica de scoring y revisión humana."),
        ("DPA con bureaus", "Contratos con centrales de riesgo."),
        ("Protocolo de brechas", "Definir responsable y comunicación a clientes afectados."),
        ("Canales ARSOP", "Habilitar portal de derechos del cliente."),
    ],
    "Ley 21.719 — BCN idNorma=1209272.",
)

# 4. SAAS-TECNOLOGÍA
build_pdf(
    "informe-saas-tecnologia-ley-21719-v3.pdf",
    "SaaS & Tecnología",
    "Las empresas de software tratan datos por cuenta de terceros (clientes). La Ley 21.719 distingue "
    "entre responsable y encargado del tratamiento, exigiendo contratos DPA y privacidad desde el diseño.",
    KPI,
    [
        ("1. Responsable vs encargado",
         "El cliente es responsable del tratamiento; el proveedor SaaS es encargado y debe actuar según "
         "contrato de encargo (DPA) que regule finalidad, seguridad y borrado."),
        ("2. Privacy by Design",
         "La seguridad y privacidad deben integrarse desde el primer día de diseño del producto, no como "
         "parche posterior."),
        ("3. DPO voluntario y brechas",
         "El DPO es voluntario (Art. 50) salvo obligación contractual o legal. Ante incidente, notificar "
         "a la APDP sin dilaciones indebidas y coordinar con el cliente responsable."),
    ],
    [
        ("Inventario RAT", "Mapear datos procesados por cuenta de clientes."),
        ("DPA estándar", "Plantilla de contrato de encargo de tratamiento."),
        ("Cifrado en reposo/tránsito", "Auditar controles técnicos del producto."),
        ("Protocolo de brechas", "Definir flujo de escalamiento al cliente responsable."),
        ("Canales ARSOP", "Habilitar portal de derechos para el responsable."),
    ],
    "Ley 21.719 — BCN idNorma=1209272.",
)

# 5. TRANSPORTE-LOGÍSTICA
build_pdf(
    "informe-transporte-logistica-ley-21719-v3.pdf",
    "Transporte & Logística",
    "El sector mueve datos de clientes, conductores y rutas, incluyendo geolocalización y biométrica de "
    "conductores. La Ley 21.719 exige base legal para el rastreo, seguridad de flotas y notificación "
    "de brechas en plazos razonables (sin dilaciones indebidas).",
    KPI,
    [
        ("1. Geolocalización y conductores",
         "El rastreo GPS de vehículos y dispositivos de conductores requiere base legal específica, "
         "finalidad acotada y proporcionalidad. Evitar vigilancia indiscriminada."),
        ("2. Datos de clientes y envíos",
         "El historial de envíos, direcciones y métodos de pago deben tratarse con finalidad legítima y "
         "borrarse al término del servicio cuando proceda."),
        ("3. Notificación sin dilaciones indebidas",
         "Ante filtración de datos de clientes o conductores, notificar a la APDP sin dilaciones indebidas. "
         "No se fija plazo de 72 horas; planificar protocolos que permitan notificar en horas."),
    ],
    [
        ("Inventario RAT", "Mapear datos de clientes, conductores y rutas."),
        ("Política GPS", "Documentar finalidad y proporcionalidad del rastreo."),
        ("DPA con subcontratistas", "Auditar transportistas y almacenes."),
        ("Protocolo de brechas", "Definir responsable y comunicación a afectados."),
        ("Canales ARSOP", "Habilitar portal de derechos para clientes."),
    ],
    "Ley 21.719 — BCN idNorma=1209272.",
)

# 6. COMPLETO (RESUMEN GENERAL)
build_pdf(
    "informe-completo-ley-21719-v3.pdf",
    "Resumen General de la Ley 21.719",
    "Visión integral del nuevo marco de protección de datos personales en Chile: principios, derechos "
    "ARSOP, obligaciones de las organizaciones, régimen sancionatorio y hoja de ruta de implementación.",
    KPI,
    [
        ("1. Principios rectores",
         "Licitud y finalidad, minimización, calidad y seguridad, responsabilidad proactiva y privacidad "
         "desde el diseño. El consentimiento debe ser explícito; el tácito ya no es válido."),
        ("2. Derechos ARSOP y notificación",
         "Acceso, Rectificación, Supresión, Oposición y Portabilidad. Ante brechas, notificar a la APDP "
         "sin dilaciones indebidas y a los afectados cuando el riesgo sea alto."),
        ("3. Régimen sancionatorio",
         "Multas de hasta 20.000 UTM para infracciones gravísimas, más recargo del 50% si no se subsana. "
         "En grandes empresas reincidentes, hasta 4% de ingresos brutos anuales."),
    ],
    [
        ("Diagnóstico (días 1-30)", "Inventario RAT y mapa de datos."),
        ("Políticas (días 31-60)", "Actualizar privacidad, DPA y canales ARSOP."),
        ("Cultura (días 61-90)", "Capacitar equipos y probar planes de incidentes."),
        ("DPO", "Evaluar designación voluntaria (Art. 50)."),
        ("MPI", "Implementar Modelo de Prevención como atenuante."),
    ],
    "Ley 21.719 — BCN idNorma=1209272. Resumen ejecutivo.",
)
