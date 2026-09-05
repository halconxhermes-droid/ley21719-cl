"""
make_module.py — Genera un video del curso Ley 21.719 a partir de un módulo.

Uso:
    python make_module.py <module_id>
    # module_id ∈ {ciudadano, desarrollador, institucion}

Lee plans.json, genera frames con anim.py, narración con edge-tts,
sincroniza con audio, quema subtítulos y ensambla el .mp4 final.

Diseño parametrizable: la única información distinta por módulo es
las 13 escenas (id, duración, narración) y los textos del header.
"""
from __future__ import annotations
import sys
import os
import json
import asyncio
import subprocess
import shutil
from pathlib import Path
from typing import List, Dict, Any
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).parent
sys.path.insert(0, str(ROOT / "render"))
from anim import W, H, BG, PRIMARY, SECONDARY, WARN, HIGHLIGHT, TEXT, MUTED, FONT_DIR

FPS = 30
OUT_DIR = ROOT / "out"
FRAMES_DIR = OUT_DIR / "frames"
AUDIO_DIR = OUT_DIR / "audio"


# ===================== ESCENAS REUTILIZABLES =====================
# Estructura visual común a los 3 módulos nuevos (mismo patrón del piloto "empresa").
# Cada escena se compone de: header (título/subtítulo) + contenido + countdown a 1 dic 2026.

def header(draw, scene_title: str, scene_subtitle: str, t: float, mod_title: str):
    """Header común: línea superior, título y subtítulo de la escena."""
    # Banda superior con módulo
    draw.rectangle([0, 0, W, 60], fill=(20, 20, 20))
    f_mod = ImageFont.truetype(f"{FONT_DIR}/DejaVuSans-Bold.ttf", 22)
    draw.text((40, 18), f"LEY 21.719 — {mod_title.upper()}", font=f_mod, fill=PRIMARY)
    # Título escena
    f_title = ImageFont.truetype(f"{FONT_DIR}/DejaVuSans-Bold.ttf", 56)
    bbox = draw.textbbox((0, 0), scene_title, font=f_title)
    tw = bbox[2] - bbox[0]
    draw.text(((W - tw) // 2, 90), scene_title, font=f_title, fill=TEXT)
    # Subtítulo escena
    f_sub = ImageFont.truetype(f"{FONT_DIR}/DejaVuSans.ttf", 30)
    if scene_subtitle:
        bbox = draw.textbbox((0, 0), scene_subtitle, font=f_sub)
        sw = bbox[2] - bbox[0]
        draw.text(((W - sw) // 2, 160), scene_subtitle, font=f_sub, fill=MUTED)
    return 220  # y donde comienza el contenido


def countdown(draw, t: float):
    """Cuenta regresiva al 1 de diciembre de 2026 (esquina inferior derecha)."""
    import datetime
    target = datetime.date(2026, 12, 1)
    today = datetime.date(2026, 8, 30)  # fecha de referencia (cambia por diferencia de días)
    days_left = (target - today).days
    if days_left < 0:
        days_left = 0
    f_cd = ImageFont.truetype(f"{FONT_DIR}/DejaVuSans-Bold.ttf", 26)
    draw.text((W - 360, H - 70), "VIGENCIA: 1 DIC 2026", font=f_cd, fill=HIGHLIGHT)
    f_d = ImageFont.truetype(f"{FONT_DIR}/DejaVuSans-Bold.ttf", 36)
    draw.text((W - 360, H - 40), f"{days_left} días", font=f_d, fill=TEXT)


def write_frames_module(module_id: str, mod_title: str, mod_subtitle: str,
                        scene_id: str, narration: str, duration: float, render_func):
    """Escribe los frames de una escena para un módulo no-empresa."""
    frame_dir = FRAMES_DIR / f"{module_id}_{scene_id}"
    frame_dir.mkdir(parents=True, exist_ok=True)
    total_frames = int(duration * FPS)
    for i in range(total_frames):
        t = i / FPS
        img = Image.new("RGB", (W, H), BG)
        draw = ImageDraw.Draw(img)
        render_func(draw, t, duration, mod_title, mod_subtitle)
        img.save(frame_dir / f"frame_{i:05d}.png")
    return frame_dir


# ===================== RENDERIZADORES POR TIPO DE ESCENA =====================

def render_hook(draw, t, dur, mod_title, mod_subtitle):
    """Escena 1: pregunta conductora + countdown."""
    y = header(draw, mod_title, mod_subtitle[:60] + ("..." if len(mod_subtitle) > 60 else ""), t, mod_title)
    f_big = ImageFont.truetype(f"{FONT_DIR}/DejaVuSans-Bold.ttf", 64)
    hook = ""
    if mod_title.startswith("TUS"):
        hook = "¿Sabías que TIENES derechos\nsobre tus datos personales?"
    elif mod_title.startswith("IMPLE"):
        hook = "¿Tu código cumple la\nLey 21.719?"
    else:
        hook = "¿Tu institución está\npreparada para la Ley 21.719?"
    # Efecto de aparición
    alpha = min(1.0, t / 1.5)
    for i, line in enumerate(hook.split("\n")):
        bbox = draw.textbbox((0, 0), line, font=f_big)
        lw = bbox[2] - bbox[0]
        y_line = y + 60 + i * 90
        # Simular fade con desplazamiento sutil
        x_off = int((1 - alpha) * 30)
        draw.text(((W - lw) // 2 + x_off, y_line), line, font=f_big, fill=TEXT)
    # Caja destacada abajo
    box_y = y + 280
    draw.rectangle([W//2 - 380, box_y, W//2 + 380, box_y + 80],
                   outline=PRIMARY, width=3)
    f_box = ImageFont.truetype(f"{FONT_DIR}/DejaVuSans-Bold.ttf", 28)
    msg = "Plazo fatal: 1 de diciembre de 2026"
    bbox = draw.textbbox((0, 0), msg, font=f_box)
    mw = bbox[2] - bbox[0]
    draw.text(((W - mw) // 2, box_y + 28), msg, font=f_box, fill=PRIMARY)
    countdown(draw, t)


def render_contexto(draw, t, dur, mod_title, mod_subtitle):
    """Escena 2: contexto de la ley."""
    y = header(draw, "Contexto de la ley", "Por qué esta ley importa", t, mod_title)
    f_main = ImageFont.truetype(f"{FONT_DIR}/DejaVuSans.ttf", 36)
    txt = ""
    if mod_title.startswith("TUS"):
        txt = ("Antes de la Ley 21.719, la Ley 19.628 era tibia.\n"
               "No había agencia, no había fiscalización.\n"
               "Ahora tú tienes derechos REALES y un aliado:")
    elif mod_title.startswith("IMPLE"):
        txt = ("Esta ley es CÓDIGO que debes escribir.\n"
               "Seguridad, modelos de datos, derechos del usuario,\n"
               "todo cambia. Vamos a los detalles técnicos.")
    else:
        txt = ("La Ley 21.719 aplica a TODOS los responsables.\n"
               "Empresas, instituciones públicas, organismos del Estado.\n"
               "Municipalidades, ministerios, universidades: todos.")
    for i, line in enumerate(txt.split("\n")):
        draw.text((100, y + 50 + i * 60), line, font=f_main, fill=TEXT)
    # Acento destacado
    if mod_title.startswith("TUS"):
        f_acc = ImageFont.truetype(f"{FONT_DIR}/DejaVuSans-Bold.ttf", 48)
        draw.text((100, y + 280), "La Agencia de Protección de Datos", font=f_acc, fill=PRIMARY)
    elif mod_title.startswith("IMPLE"):
        f_acc = ImageFont.truetype(f"{FONT_DIR}/DejaVuSans-Bold.ttf", 48)
        draw.text((100, y + 280), "Privacidad desde el diseño", font=f_acc, fill=PRIMARY)
    else:
        f_acc = ImageFont.truetype(f"{FONT_DIR}/DejaVuSans-Bold.ttf", 48)
        draw.text((100, y + 280), "Aplicación transversal al Estado", font=f_acc, fill=PRIMARY)


def render_topic_card(draw, t, dur, mod_title, mod_subtitle, title, body_lines, accent_color=PRIMARY):
    """Render genérico: título + bullets con animación secuencial."""
    y = header(draw, title, "", t, mod_title)
    f_title = ImageFont.truetype(f"{FONT_DIR}/DejaVuSans-Bold.ttf", 44)
    # Animación de aparición
    if "title_appear" not in render_topic_card.__dict__:
        pass
    draw.text((80, y), title, font=f_title, fill=accent_color)
    # Bullets
    f_bul = ImageFont.truetype(f"{FONT_DIR}/DejaVuSans.ttf", 30)
    n = len(body_lines)
    appear_t = t / dur  # 0..1
    for i, line in enumerate(body_lines):
        if appear_t > i / n:
            alpha = min(1.0, (appear_t - i / n) * 3)
            color = TEXT if alpha > 0.8 else MUTED
            draw.text((100, y + 80 + i * 50), f"• {line}", font=f_bul, fill=color)


def render_caso(draw, t, dur, mod_title, mod_subtitle, title, intro, options):
    """Render de caso práctico: contexto + opciones listadas."""
    y = header(draw, title, "Caso práctico", t, mod_title)
    f_intro = ImageFont.truetype(f"{FONT_DIR}/DejaVuSans.ttf", 28)
    # Multilinea intro
    intro_lines = []
    words = intro.split()
    cur = ""
    for w in words:
        if len(cur + " " + w) > 65:
            intro_lines.append(cur)
            cur = w
        else:
            cur = (cur + " " + w).strip()
    if cur:
        intro_lines.append(cur)
    for i, line in enumerate(intro_lines):
        draw.text((80, y + 30 + i * 42), line, font=f_intro, fill=TEXT)
    # Opciones numeradas
    f_opt = ImageFont.truetype(f"{FONT_DIR}/DejaVuSans-Bold.ttf", 30)
    f_opt_text = ImageFont.truetype(f"{FONT_DIR}/DejaVuSans.ttf", 28)
    y_opt = y + 60 + len(intro_lines) * 42
    for i, opt in enumerate(options):
        appear = min(1.0, max(0, (t - 1.0 - i * 0.8) / 0.5))
        if appear > 0:
            num_color = PRIMARY if appear > 0.8 else MUTED
            txt_color = TEXT if appear > 0.8 else MUTED
            draw.text((100, y_opt + i * 60), f"{i+1}.", font=f_opt, fill=num_color)
            draw.text((140, y_opt + i * 60), opt, font=f_opt_text, fill=txt_color)


def render_checklist(draw, t, dur, mod_title, mod_subtitle, items):
    """Render de checklist: items con check animado."""
    y = header(draw, "Checklist de implementación", "Verifica punto por punto", t, mod_title)
    f_item = ImageFont.truetype(f"{FONT_DIR}/DejaVuSans-Bold.ttf", 28)
    f_check = ImageFont.truetype(f"{FONT_DIR}/DejaVuSans-Bold.ttf", 30)
    appear_t = t / dur
    n = len(items)
    for i, item in enumerate(items):
        if appear_t > i / n:
            alpha = min(1.0, (appear_t - i / n) * 4)
            check_y = y + 50 + i * 55
            check_color = SECONDARY if alpha > 0.5 else MUTED
            # Caja del check
            draw.rectangle([80, check_y, 110, check_y + 30], outline=check_color, width=2)
            if alpha > 0.7:
                # X dentro del check
                draw.line([85, check_y + 5, 105, check_y + 25], fill=SECONDARY, width=3)
                draw.line([105, check_y + 5, 85, check_y + 25], fill=SECONDARY, width=3)
            color = TEXT if alpha > 0.6 else MUTED
            draw.text((130, check_y), item, font=f_item, fill=color)


def render_cierre(draw, t, dur, mod_title, mod_subtitle):
    """Escena 13: cierre con CTA."""
    y = header(draw, "Hemos terminado", "", t, mod_title)
    f_msg = ImageFont.truetype(f"{FONT_DIR}/DejaVuSans-Bold.ttf", 56)
    if mod_title.startswith("TUS"):
        msg = "TUS DATOS SON TUYOS.\nCONOCE TUS DERECHOS."
    elif mod_title.startswith("IMPLE"):
        msg = "EL CÓDIGO DE HOY\nDEFINE EL MAÑANA."
    else:
        msg = "EL SECTOR PÚBLICO\nDEBE LIDERAR."
    for i, line in enumerate(msg.split("\n")):
        bbox = draw.textbbox((0, 0), line, font=f_msg)
        lw = bbox[2] - bbox[0]
        alpha = min(1.0, (t - 0.5 - i * 0.3) / 0.5)
        if alpha > 0:
            x_off = int((1 - alpha) * 50)
            color = PRIMARY if i == 0 else TEXT
            draw.text(((W - lw) // 2 + x_off, y + 100 + i * 100), line, font=f_msg, fill=color)
    # CTA
    f_cta = ImageFont.truetype(f"{FONT_DIR}/DejaVuSans-Bold.ttf", 32)
    if t > 3:
        cta = "Te vemos en el siguiente módulo del curso."
        bbox = draw.textbbox((0, 0), cta, font=f_cta)
        cw = bbox[2] - bbox[0]
        draw.text(((W - cw) // 2, H - 180), cta, font=f_cta, fill=HIGHLIGHT)
    countdown(draw, t)


# ===================== GENERADORES DE ESCENAS ESPECÍFICAS =====================

def scene_ciudadano_03_arco(draw, t, dur, mod_title=None, mod_subtitle=None):
    body = [
        "Acceso: obtén una copia de tus datos",
        "Rectificación: corrige datos incorrectos",
        "Cancelación: el derecho al olvido",
        "Oposición: rechaza tratamientos",
        "Portabilidad: llévate tus datos a otro servicio",
        "Bloqueo: suspensión temporal durante disputas"
    ]
    render_topic_card(draw, t, dur, "TUS DERECHOS BAJO LA LEY 21.719", "Lo que la ley garantiza",
                      "Seis derechos ARCO+", body, PRIMARY)


def scene_ciudadano_04_acceso(draw, t, dur, mod_title=None, mod_subtitle=None):
    body = [
        "Solicitud por escrito o medios electrónicos",
        "Copia de TODOS tus datos, sin excepciones",
        "Gratuito, una vez al año como mínimo",
        "Plazo: 30 días corridos, prorrogables una vez",
        "Si se niegan: reclamación ante la Agencia"
    ]
    render_topic_card(draw, t, dur, "TUS DERECHOS BAJO LA LEY 21.719", "",
                      "1. Derecho de acceso", body, PRIMARY)


def scene_ciudadano_05_rectif(draw, t, dur, mod_title=None, mod_subtitle=None):
    body = [
        "Si tus datos son incorrectos o están desactualizados",
        "Puedes exigir que los corrijan sin demora",
        "La empresa debe responder en plazo legal",
        "Incluye datos derivados (dirección, teléfono, etc.)",
        "La corrección debe comunicarse a terceros"
    ]
    render_topic_card(draw, t, dur, "TUS DERECHOS BAJO LA LEY 21.719", "",
                      "2. Derecho de rectificación", body, SECONDARY)


def scene_ciudadano_06_cancel(draw, t, dur, mod_title=None, mod_subtitle=None):
    body = [
        "El famoso derecho al OLVIDO",
        "Solicita la eliminación de tus datos",
        "Excepciones: obligaciones legales vigentes",
        "Excepciones: contratos en curso",
        "Excepciones: interés público legítimo",
        "La empresa debe demostrar la base legal"
    ]
    render_topic_card(draw, t, dur, "TUS DERECHOS BAJO LA LEY 21.719", "",
                      "3. Derecho de cancelación", body, WARN)


def scene_ciudadano_07_portab(draw, t, dur, mod_title=None, mod_subtitle=None):
    body = [
        "Tus datos en formato ESTRUCTURADO",
        "Legible por máquina (JSON, XML, CSV)",
        "Para llevártelos a otro servicio",
        "Portabilidad sin costo adicional",
        "Bloqueo: suspensión temporal en disputas",
        "Mientras se resuelve la controversia"
    ]
    render_topic_card(draw, t, dur, "TUS DERECHOS BAJO LA LEY 21.719", "",
                      "4 y 5. Portabilidad y bloqueo", body, PRIMARY)


def scene_ciudadano_08_menores(draw, t, dur, mod_title=None, mod_subtitle=None):
    body = [
        "Esta ley protege ESPECIALMENTE a menores",
        "Consentimiento verificable para datos de menores",
        "El interés superior del menor siempre prevalece",
        "Representantes legales deben autorizar",
        "Prohibido perfilado de menores para marketing",
        "Sanciones agravadas si se trata a menores sin control"
    ]
    render_topic_card(draw, t, dur, "TUS DERECHOS BAJO LA LEY 21.719", "",
                      "Protección de menores", body, SECONDARY)


def scene_ciudadano_09_sensibles(draw, t, dur, mod_title=None, mod_subtitle=None):
    body = [
        "Salud, orientación sexual, religión",
        "Opinión política, afiliación sindical",
        "Datos biométricos: huella, rostro, iris",
        "Genéticos y de salud mental",
        "Requieren consentimiento EXPLÍCITO y por escrito",
        "Sin tu autorización clara: nulo"
    ]
    render_topic_card(draw, t, dur, "TUS DERECHOS BAJO LA LEY 21.719", "",
                      "Datos sensibles", body, WARN)


def scene_ciudadano_10_caso_correo(draw, t, dur, mod_title=None, mod_subtitle=None):
    render_caso(draw, t, dur, "TUS DERECHOS BAJO LA LEY 21.719", "",
                "Caso: correos no deseados",
                "Una empresa te envía correos publicitarios sin tu consentimiento. ¿Qué hacer?",
                ["Solicita el cese por escrito a la empresa",
                 "Si siguen enviando: presenta reclamación ante la Agencia",
                 "Espera el plazo legal de respuesta",
                 "La Agencia puede investigar y sancionar",
                 "Tienes derecho a indemnización si hay daño"])


def scene_ciudadano_11_caso_rechazo(draw, t, dur, mod_title=None, mod_subtitle=None):
    render_caso(draw, t, dur, "TUS DERECHOS BAJO LA LEY 21.719", "",
                "Caso: se niegan tus datos",
                "Una empresa se niega a entregarte una copia de tus datos personales. ¿Qué hacer?",
                ["Reitera tu solicitud por escrito certificado",
                 "Adjunta copia de tu identificación",
                 "Si rechazan: presenta reclamación ante la Agencia",
                 "La Agencia puede ordenar el acceso y sancionar",
                 "Multas desde 5.000 UTM hasta el 2-4% de ingresos"])


def scene_ciudadano_12_agencia(draw, t, dur, mod_title=None, mod_subtitle=None):
    body = [
        "Órgano técnico, independiente del Gobierno",
        "Fiscaliza el cumplimiento de la Ley 21.719",
        "Recibe reclamaciones y denuncias",
        "Puede ordenar medidas cautelares si hay riesgo",
        "Sanciona con multas proporcionales a la infracción",
        "Promueve la educación y buenas prácticas"
    ]
    render_topic_card(draw, t, dur, "TUS DERECHOS BAJO LA LEY 21.719", "",
                      "La Agencia de Protección de Datos", body, PRIMARY)


# --- DESARROLLADOR ---

def scene_dev_03_design(draw, t, dur, mod_title=None, mod_subtitle=None):
    body = [
        "Privacidad desde el DISEÑO, no al final",
        "Evalúa cada nueva funcionalidad ANTES de codificar",
        "Minimización: solo los datos estrictamente necesarios",
        "Propósito claro: define para qué se usará cada dato",
        "Documenta la decisión en una EIPD si es alto riesgo",
        "Revisión por pares: que otro desarrollador revise"
    ]
    render_topic_card(draw, t, dur, "IMPLEMENTACIÓN TÉCNICA DE LA LEY 21.719", "",
                      "Privacidad desde el diseño", body, PRIMARY)


def scene_dev_04_seguridad(draw, t, dur, mod_title=None, mod_subtitle=None):
    body = [
        "Artículo 14 quinquies: medidas técnicas y organizativas",
        "Cifrado en tránsito: TLS 1.3 mínimo",
        "Cifrado en reposo: AES-256 para datos sensibles",
        "Logs de acceso inmutables y firmados",
        "Control de acceso por rol (RBAC)",
        "Auditoría continua: alertas ante accesos anómalos"
    ]
    render_topic_card(draw, t, dur, "IMPLEMENTACIÓN TÉCNICA DE LA LEY 21.719", "",
                      "Modelo de seguridad", body, PRIMARY)


def scene_dev_05_sensibles(draw, t, dur, mod_title=None, mod_subtitle=None):
    body = [
        "Biometría: huella, rostro, iris, voz",
        "Salud: historiales clínicos, resultados de exámenes",
        "Financieros: cuentas, saldos, transacciones",
        "Requieren cifrado ADICIONAL (AES-256 + HSM)",
        "Acceso JUST-IN-TIME con aprobación",
        "Artículo 16 ter: consentimiento expreso obligatorio"
    ]
    render_topic_card(draw, t, dur, "IMPLEMENTACIÓN TÉCNICA DE LA LEY 21.719", "",
                      "Datos sensibles", body, WARN)


def scene_dev_06_consent(draw, t, dur, mod_title=None, mod_subtitle=None):
    body = [
        "Consentimiento GRANULAR, no 'todo o nada'",
        "Switches separados por tipo de tratamiento",
        "Marketing, analítica, terceros: cada uno su toggle",
        "Registro inmutable del consentimiento (timestamp + versión)",
        "Fácil de revocar: un click, no un email",
        "Doble opt-in para marketing y comunicaciones comerciales"
    ]
    render_topic_card(draw, t, dur, "IMPLEMENTACIÓN TÉCNICA DE LA LEY 21.719", "",
                      "Consentimiento granular", body, SECONDARY)


def scene_dev_07_endpoints(draw, t, dur, mod_title=None, mod_subtitle=None):
    body = [
        "GET /api/v1/datos/export — portabilidad",
        "DELETE /api/v1/datos — cancelación (con verificación de excepciones)",
        "PATCH /api/v1/datos — rectificación",
        "POST /api/v1/consentimiento — gestión de consentimiento",
        "POST /api/v1/brechas — notificación de brechas",
        "Autenticación robusta: OAuth 2.0 + 2FA"
    ]
    render_topic_card(draw, t, dur, "IMPLEMENTACIÓN TÉCNICA DE LA LEY 21.719", "",
                      "Endpoints ARCO+", body, PRIMARY)


def scene_dev_08_registro(draw, t, dur, mod_title=None, mod_subtitle=None):
    body = [
        "Cada operación sobre datos personales: REGISTRADA",
        "Quién accedió, qué hizo, cuándo, por qué",
        "Logs inmutables: append-only con firma criptográfica",
        "Conservación: mínimo el plazo legal aplicable",
        "Acceso a logs: solo personal autorizado y auditado",
        "Trazabilidad: cada cambio queda vinculado al usuario"
    ]
    render_topic_card(draw, t, dur, "IMPLEMENTACIÓN TÉCNICA DE LA LEY 21.719", "",
                      "Registro de operaciones", body, SECONDARY)


def scene_dev_09_brechas(draw, t, dur, mod_title=None, mod_subtitle=None):
    body = [
        "Detección: monitoreo continuo de anomalías",
        "Contención: aislar el sistema afectado inmediatamente",
        "Evaluación: qué datos, cuántos titulares, qué riesgo",
        "Notificación a la Agencia: sin dilaciones indebidas",
        "Notificación a titulares: si hay riesgo para sus derechos",
        "Lecciones aprendidas: post-mortem documentado"
    ]
    render_topic_card(draw, t, dur, "IMPLEMENTACIÓN TÉCNICA DE LA LEY 21.719", "",
                      "Plan de respuesta a brechas", body, WARN)


def scene_dev_10_eipd(draw, t, dur, mod_title=None, mod_subtitle=None):
    render_caso(draw, t, dur, "IMPLEMENTACIÓN TÉCNICA DE LA LEY 21.719", "",
                "Caso: nuevo sistema con datos sensibles",
                "Vas a desarrollar un sistema de reconocimiento facial para control de acceso. ¿Qué hacer primero?",
                ["Identifica qué datos: biométricos faciales",
                 "Evalúa el riesgo: alto (dato sensible único)",
                 "Realiza una EIPD ANTES de codificar",
                 "Documenta: qué datos, qué riesgo, qué mitigaciones",
                 "Implementa: cifrado, logs, consentimiento expreso",
                 "Revisa periódicamente: cada 12 meses o ante cambios"])


def scene_dev_11_arq(draw, t, dur, mod_title=None, mod_subtitle=None):
    body = [
        "Capa de IDENTIDAD: autenticación, autorización",
        "Capa de CONSENTIMIENTO: registro y revocación",
        "Capa de DATOS PERSONALES: almacenamiento cifrado",
        "Capa de AUDITORÍA: logs inmutables de acceso",
        "Capa de DERECHOS DEL USUARIO: endpoints ARCO+",
        "Cada capa con responsabilidad clara y testeable"
    ]
    render_topic_card(draw, t, dur, "IMPLEMENTACIÓN TÉCNICA DE LA LEY 21.719", "",
                      "Arquitectura recomendada", body, PRIMARY)


def scene_dev_12_checklist(draw, t, dur, mod_title=None, mod_subtitle=None):
    items = [
        "Cifrado en reposo (AES-256)",
        "Cifrado en tránsito (TLS 1.3+)",
        "Logs firmados criptográficamente",
        "Endpoints ARCO+ implementados",
        "Consentimiento granular con revocación fácil",
        "Mecanismo de notificación de brechas",
        "Plan de portabilidad de datos",
        "EIPD para tratamientos de alto riesgo"
    ]
    render_checklist(draw, t, dur, "IMPLEMENTACIÓN TÉCNICA DE LA LEY 21.719", "", items)


# --- INSTITUCION ---

def scene_inst_03_marco(draw, t, dur, mod_title=None, mod_subtitle=None):
    body = [
        "Ley 21.719: Protección de Datos Personales",
        "Ley 18.575: Bases Generales de la Administración del Estado",
        "Ley 19.880: Procedimiento Administrativo",
        "Decreto Supremo 779/2000: reglamento anterior (sigue parcialmente)",
        "Normativa sectorial específica (salud, educación, etc.)",
        "Jurisprudencia administrativa de la Contraloría"
    ]
    render_topic_card(draw, t, dur, "LEY 21.719 PARA INSTITUCIONES PÚBLICAS", "",
                      "Marco jurídico aplicable", body, PRIMARY)


def scene_inst_04_responsable(draw, t, dur, mod_title=None, mod_subtitle=None):
    body = [
        "Es la AUTORIDAD SUPERIOR del organismo",
        "Jefe de servicio, alcalde, rector, director",
        "NO es un empleado ni un técnico",
        "Asume responsabilidad legal y administrativa",
        "Debe designar un DPO con dedicación exclusiva",
        "Debe asignar recursos para cumplimiento"
    ]
    render_topic_card(draw, t, dur, "LEY 21.719 PARA INSTITUCIONES PÚBLICAS", "",
                      "El responsable del tratamiento", body, PRIMARY)


def scene_inst_05_obligaciones(draw, t, dur, mod_title=None, mod_subtitle=None):
    body = [
        "DPO obligatorio para instituciones con alto volumen",
        "Registro de operaciones obligatorio",
        "Informes periódicos a la Agencia",
        "Auditorías internas anuales",
        "Política de protección de datos documentada",
        "Capacitación a todos los funcionarios"
    ]
    render_topic_card(draw, t, dur, "LEY 21.719 PARA INSTITUCIONES PÚBLICAS", "",
                      "Obligaciones especiales", body, PRIMARY)


def scene_inst_06_transitorio(draw, t, dur, mod_title=None, mod_subtitle=None):
    body = [
        "Las instituciones tienen hasta el 1 de diciembre de 2026",
        "Para adecuarse completamente",
        "Algunas obligaciones son INMEDIATAS:",
        "  → Registro de operaciones desde la entrada en vigor",
        "  → Designación de DPO en instituciones obligadas",
        "Plan de adecuación gradual: priorizar riesgos altos"
    ]
    render_topic_card(draw, t, dur, "LEY 21.719 PARA INSTITUCIONES PÚBLICAS", "",
                      "Período transitorio", body, HIGHLIGHT)


def scene_inst_07_sensibles(draw, t, dur, mod_title=None, mod_subtitle=None):
    body = [
        "Salud: fichas clínicas, licencias médicas",
        "Seguridad social: RUT, datos previsionales",
        "Antecedentes penales: registros policial y judicial",
        "Autorización legal ESPECÍFICA requerida",
        "Propósito CLARO y limitado",
        "Plazo de conservación DEFINIDO por ley"
    ]
    render_topic_card(draw, t, dur, "LEY 21.719 PARA INSTITUCIONES PÚBLICAS", "",
                      "Datos sensibles en el sector público", body, WARN)


def scene_inst_08_transferencia(draw, t, dur, mod_title=None, mod_subtitle=None):
    body = [
        "Permiten coordinación entre organismos",
        "Requieren BASES LEGALES específicas",
        "Convenios interinstitucionales formalizados",
        "No es lo mismo que el sector privado",
        "Finalidad pública clara y documentada",
        "Minimización: solo los datos necesarios"
    ]
    render_topic_card(draw, t, dur, "LEY 21.719 PARA INSTITUCIONES PÚBLICAS", "",
                      "Transferencias entre organismos", body, PRIMARY)


def scene_inst_09_fiscalizacion(draw, t, dur, mod_title=None, mod_subtitle=None):
    body = [
        "La Agencia de Protección de Datos fiscaliza",
        "Puede realizar auditorías in situ",
        "La Contraloría General de la República audita",
        "A través de su Unidad de Auditoría Interna",
        "Reclamos ciudadanoses ante la Agencia",
        "Sanciones administrativas y disciplinarias"
    ]
    render_topic_card(draw, t, dur, "LEY 21.719 PARA INSTITUCIONES PÚBLICAS", "",
                      "Fiscalización y control", body, PRIMARY)


def scene_inst_10_caso_municipio(draw, t, dur, mod_title=None, mod_subtitle=None):
    render_caso(draw, t, dur, "LEY 21.719 PARA INSTITUCIONES PÚBLICAS", "",
                "Caso: municipio con datos antiguos",
                "Un municipio mantiene registros de beneficiarios de programas sociales de hace 20 años. ¿Qué hacer?",
                ["Identifica qué datos son de personas ya no vivas",
                 "Elimina registros con consentimiento caduco",
                 "Mantén solo los que tienen base legal vigente",
                 "Anonimiza para fines estadísticos o históricos",
                 "Documenta el proceso de revisión y limpieza",
                 "Comunica a la Agencia la decisión tomada"])


def scene_inst_11_caso_universidad(draw, t, dur, mod_title=None, mod_subtitle=None):
    render_caso(draw, t, dur, "LEY 21.719 PARA INSTITUCIONES PÚBLICAS", "",
                "Caso: universidad con registros antiguos",
                "Una universidad pública tiene registros de estudiantes que se graduaron hace años. ¿Opciones?",
                ["Evalúa si hay base legal para conservarlos",
                 "Si no: anonimiza para fines estadísticos",
                 "Si sí: actualiza el consentimiento o elimina",
                 "Distingue entre datos académicos y datos personales",
                 "Crea un protocolo de retención por tipo de dato",
                 "Documenta la decisión en el registro de operaciones"])


def scene_inst_12_recomendaciones(draw, t, dur, mod_title=None, mod_subtitle=None):
    items = [
        "Designa un DPO con dedicación exclusiva",
        "Crea un comité de protección de datos",
        "Establece canales directos con la Agencia",
        "Documenta todo: decisiones, EIPD, incidentes",
        "Forma a tu equipo continuamente",
        "Realiza auditorías internas anuales",
        "Mantén un canal de comunicación con la ciudadanía"
    ]
    render_checklist(draw, t, dur, "LEY 21.719 PARA INSTITUCIONES PÚBLICAS", "", items)


# ===================== MAPEO DE ESCENAS POR MÓDULO =====================

SCENES = {
    "ciudadano": {
        "01_hook": render_hook,
        "02_contexto": render_contexto,
        "03_derechos_arco": scene_ciudadano_03_arco,
        "04_acceso": scene_ciudadano_04_acceso,
        "05_rectificacion": scene_ciudadano_05_rectif,
        "06_cancelacion": scene_ciudadano_06_cancel,
        "07_portabilidad": scene_ciudadano_07_portab,
        "08_menores": scene_ciudadano_08_menores,
        "09_datos_sensibles": scene_ciudadano_09_sensibles,
        "10_caso_correo": scene_ciudadano_10_caso_correo,
        "11_caso_rechazo": scene_ciudadano_11_caso_rechazo,
        "12_agencia": scene_ciudadano_12_agencia,
        "13_cierre": render_cierre,
    },
    "desarrollador": {
        "01_hook": render_hook,
        "02_contexto": render_contexto,
        "03_privacidad_design": scene_dev_03_design,
        "04_securidades": scene_dev_04_seguridad,
        "05_datos_sensibles": scene_dev_05_sensibles,
        "06_consentimiento": scene_dev_06_consent,
        "07_arco_endpoints": scene_dev_07_endpoints,
        "08_registro_operaciones": scene_dev_08_registro,
        "09_brechas": scene_dev_09_brechas,
        "10_eipd": scene_dev_10_eipd,
        "11_arquitectura": scene_dev_11_arq,
        "12_checklist_tecnico": scene_dev_12_checklist,
        "13_cierre": render_cierre,
    },
    "institucion": {
        "01_hook": render_hook,
        "02_contexto": render_contexto,
        "03_marco_juridico": scene_inst_03_marco,
        "04_responsable": scene_inst_04_responsable,
        "05_obligaciones": scene_inst_05_obligaciones,
        "06_periodo_transitorio": scene_inst_06_transitorio,
        "07_datos_sensibles": scene_inst_07_sensibles,
        "08_transferencia_publica": scene_inst_08_transferencia,
        "09_fiscalizacion": scene_inst_09_fiscalizacion,
        "10_caso_municipio": scene_inst_10_caso_municipio,
        "11_caso_universidad": scene_inst_11_caso_universidad,
        "12_recomendaciones": scene_inst_12_recomendaciones,
        "13_cierre": render_cierre,
    },
}


# ===================== TTS Y ENSAMBLAJE =====================

def gen_tts(text: str, output_path: Path, voice: str = "es-ES-ElviraNeural") -> bool:
    try:
        import edge_tts
        async def _speak():
            communicate = edge_tts.Communicate(text, voice)
            await communicate.save(str(output_path))
        asyncio.run(_speak())
        return output_path.exists() and output_path.stat().st_size > 100
    except Exception as e:
        print(f"  edge-tts error: {e}")
        return False


def get_audio_duration(path: Path) -> float:
    try:
        out = subprocess.check_output([
            "ffprobe", "-v", "error", "-show_entries", "format=duration",
            "-of", "default=noprint_wrappers=1:nokey=1", str(path)
        ], stderr=subprocess.DEVNULL).decode().strip()
        return float(out)
    except Exception:
        return 0.0


def render_subtitle(text: str, size=(W, H)) -> Image.Image:
    img = Image.new("RGBA", size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    font = ImageFont.truetype(f"{FONT_DIR}/DejaVuSans-Bold.ttf", 36)
    pad_x, pad_y = 30, 14
    bbox = draw.textbbox((0, 0), text, font=font)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    box_x = (size[0] - tw) // 2 - pad_x
    box_y = size[1] - th - pad_y * 2 - 30
    draw.rectangle([box_x, box_y, box_x + tw + 2 * pad_x, box_y + th + 2 * pad_y],
                   fill=(0, 0, 0, 200))
    draw.text((size[0] // 2, box_y + pad_y + th // 2), text,
              font=font, fill=(255, 255, 255), anchor="mm")
    return img


def compose_scene(scene_id: str, mod_id: str, narration: str, duration: float, out_path: Path):
    frame_dir = FRAMES_DIR / f"{mod_id}_{scene_id}"
    if not frame_dir.exists():
        print(f"  ✗ No frames para {scene_id}")
        return False
    # 1. TTS
    audio_path = AUDIO_DIR / f"{mod_id}_{scene_id}.mp3"
    if not gen_tts(narration, audio_path):
        return False
    audio_dur = get_audio_duration(audio_path)
    actual_dur = max(audio_dur, duration) + 1.0
    # 2. Render del MP4
    frame_pattern = str(frame_dir / "frame_%05d.png")
    tmp_video = OUT_DIR / f"{mod_id}_{scene_id}_tmp.mp4"
    cmd_video = [
        "ffmpeg", "-y", "-r", str(FPS),
        "-i", frame_pattern,
        "-t", f"{actual_dur:.2f}",
        "-vf", "scale=1280:720",
        "-c:v", "libx264", "-preset", "fast", "-crf", "23",
        "-pix_fmt", "yuv420p",
        str(tmp_video)
    ]
    subprocess.run(cmd_video, check=True, capture_output=True)
    # 3. Quemar subtítulos
    sub_img = render_subtitle(narration)
    sub_path = OUT_DIR / f"{mod_id}_{scene_id}_sub.png"
    sub_img.save(sub_path)
    burned_video = OUT_DIR / f"{mod_id}_{scene_id}_sub.mp4"
    cmd_burn = [
        "ffmpeg", "-y",
        "-i", str(tmp_video),
        "-i", str(sub_path),
        "-filter_complex", "[0:v][1:v] overlay=0:H-h",
        "-t", f"{audio_dur:.2f}",
        str(burned_video)
    ]
    subprocess.run(cmd_burn, check=True, capture_output=True)
    # 4. Combinar con audio
    final_scene = OUT_DIR / f"{mod_id}_{scene_id}_final.mp4"
    cmd_combine = [
        "ffmpeg", "-y",
        "-i", str(burned_video),
        "-i", str(audio_path),
        "-c:v", "copy", "-c:a", "aac",
        "-shortest",
        str(final_scene)
    ]
    subprocess.run(cmd_combine, check=True, capture_output=True)
    # 5. Limpiar
    tmp_video.unlink(missing_ok=True)
    burned_video.unlink(missing_ok=True)
    sub_path.unlink(missing_ok=True)
    return final_scene.exists()


def main(module_id: str):
    if module_id not in SCENES:
        print(f"Módulo '{module_id}' no soportado. Usa: {list(SCENES.keys())}")
        sys.exit(1)
    with open(ROOT / "plans.json") as f:
        plans = json.load(f)
    plan = plans[module_id]
    mod_title = plan["titulo"]
    mod_subtitle = plan["subtitulo"]
    scenes = plan["escenas"]
    print(f"\n=== Generando módulo: {module_id} ===")
    print(f"    Título: {mod_title}")
    print(f"    {len(scenes)} escenas\n")
    for scene_id, duration, narration in scenes:
        print(f"  → {scene_id} ({duration}s)")
        render_func = SCENES[module_id].get(scene_id)
        if not render_func:
            print(f"    ✗ No hay render para {scene_id}")
            continue
        # Generar frames — algunas funciones tienen firma (draw, t, dur, mod_title, mod_subtitle)
        # y otras (scene_ciudadano_*, scene_dev_*, scene_inst_*) tienen firma (draw, t, dur).
        # Detectamos con inspect y adaptamos los argumentos para no romper ninguna.
        import inspect as _inspect
        _nargs = len(_inspect.signature(render_func).parameters)
        if _nargs >= 5:
            def _render(d, t, dur, _mt=mod_title, _ms=mod_subtitle, _rf=render_func):
                return _rf(d, t, dur, _mt, _ms)
        else:
            def _render(d, t, dur, _rf=render_func):
                return _rf(d, t, dur)
        frame_dir = write_frames_module(
            module_id, mod_title, mod_subtitle, scene_id, narration, duration,
            _render
        )
        # Componer escena
        compose_scene(scene_id, module_id, narration, duration,
                     OUT_DIR / f"{module_id}_{scene_id}_final.mp4")
    # Concatenar todo
    print(f"\n  → Ensamblando video final...")
    concat_list = OUT_DIR / f"{module_id}_concat.txt"
    with open(concat_list, "w") as f:
        for scene_id, _, _ in scenes:
            final = OUT_DIR / f"{module_id}_{scene_id}_final.mp4"
            if final.exists():
                f.write(f"file '{final}'\n")
    out_final = OUT_DIR / f"ley21719-{module_id}-preview.mp4"
    cmd_concat = [
        "ffmpeg", "-y", "-f", "concat", "-safe", "0",
        "-i", str(concat_list),
        "-c", "copy",
        str(out_final)
    ]
    subprocess.run(cmd_concat, check=True, capture_output=True)
    print(f"\n  ✓ {out_final}")
    return out_final


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Uso: python make_module.py <ciudadano|desarrollador|institucion>")
        sys.exit(1)
    main(sys.argv[1])
