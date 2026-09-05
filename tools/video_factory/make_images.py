"""
Generador de imágenes explicativas para el curso Ley 21.719.

Produce 12 imágenes PNG 1920x1080 con paleta y tipografía unificadas.
Idioma: español latino.

Uso: .venv/bin/python make_images.py
"""
from __future__ import annotations

import os
import textwrap
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

# ==================== CONFIGURACIÓN ====================
W, H = 1920, 1080
PAD = 100

# Paleta (formato RGB)
BG = (15, 23, 42)            # azul oscuro
ACCENT = (59, 130, 246)      # azul brillante
WARN = (245, 158, 11)        # ámbar
SUCCESS = (16, 185, 129)     # verde
DANGER = (239, 68, 68)       # rojo
TEXT = (241, 245, 249)       # blanco hueso
MUTED = (148, 163, 184)      # gris claro
SURFACE = (30, 41, 59)       # tarjeta

# Tipografías
FONT_DIR_BOLD = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
FONT_DIR_REG = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
FONT_MONO = "/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf"

# ==================== UTILIDADES ====================

def load_font(path: str, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(path, size)


def wrap_text(draw, text: str, font, max_width: int) -> list[str]:
    """Wrap texto según ancho en píxeles."""
    words = text.split()
    lines = []
    current = []
    for w in words:
        test = " ".join(current + [w])
        if draw.textlength(test, font=font) <= max_width:
            current.append(w)
        else:
            if current:
                lines.append(" ".join(current))
            current = [w]
    if current:
        lines.append(" ".join(current))
    return lines


def text_size(draw, text: str, font):
    """Retorna (ancho, alto) del texto."""
    bbox = draw.textbbox((0, 0), text, font=font)
    return bbox[2] - bbox[0], bbox[3] - bbox[1]


def new_canvas() -> tuple[Image.Image, ImageDraw.ImageDraw]:
    img = Image.new("RGB", (W, H), BG)
    draw = ImageDraw.Draw(img)
    return img, draw


def draw_chip(draw, x, y, w, h, label, fill, text_color, font):
    """Dibuja una tarjeta con texto centrado."""
    radius = 16
    draw.rounded_rectangle([x, y, x + w, y + h], radius=radius, fill=fill)
    tw, th = text_size(draw, label, font)
    draw.text((x + (w - tw) / 2, y + (h - th) / 2 - 4), label, font=font, fill=text_color)


def draw_header(draw, title: str, subtitle: str):
    """Header común para todas las imágenes."""
    title_font = load_font(FONT_DIR_BOLD, 72)
    sub_font = load_font(FONT_DIR_REG, 32)

    # Banda superior de acento
    draw.rectangle([0, 0, W, 8], fill=ACCENT)
    # Título
    draw.text((PAD, 60), title, font=title_font, fill=TEXT)
    # Subtítulo
    draw.text((PAD, 150), subtitle, font=sub_font, fill=MUTED)
    # Línea separadora
    draw.line([(PAD, 210), (W - PAD, 210)], fill=ACCENT, width=3)


def draw_footer(draw, text: str):
    """Footer con atribución."""
    font = load_font(FONT_DIR_REG, 22)
    tw, _ = text_size(draw, text, font)
    draw.text(((W - tw) / 2, H - 50), text, font=font, fill=MUTED)


# ==================== MÓDULO CIUDADANO ====================

def ciudadano_derechos_arco(out: Path):
    """Los 6 derechos ARCO+ en tarjetas visuales."""
    img, draw = new_canvas()
    draw_header(
        draw,
        "Tus 6 derechos ARCO+",
        "Acceso · Rectificación · Cancelación · Oposición · Portabilidad · Bloqueo",
    )

    derechos = [
        ("ACCESO", "Pedí una copia de TODOS tus datos", SUCCESS),
        ("RECTIFICACIÓN", "Corregí datos incorrectos o desactualizados", ACCENT),
        ("CANCELACIÓN", "Solicitá la eliminación (derecho al olvido)", WARN),
        ("OPOSICIÓN", "Negarte a que usen tus datos para marketing", DANGER),
        ("PORTABILIDAD", "Llevátelos a otro servicio en formato digital", ACCENT),
        ("BLOQUEO", "Congelá el tratamiento mientras hay disputa", SUCCESS),
    ]

    title_font = load_font(FONT_DIR_BOLD, 36)
    body_font = load_font(FONT_DIR_REG, 24)
    pad_x = 50
    pad_y = 30
    card_w = (W - 2 * PAD - 2 * pad_x) // 3
    card_h = 280

    start_y = 280
    for i, (titulo, desc, color) in enumerate(derechos):
        col = i % 3
        row = i // 3
        x = PAD + col * (card_w + pad_x)
        y = start_y + row * (card_h + pad_y)

        # Tarjeta
        draw.rounded_rectangle(
            [x, y, x + card_w, y + card_h], radius=24, fill=SURFACE
        )
        # Barra de color lateral
        draw.rectangle([x, y, x + 12, y + card_h], fill=color)
        # Número
        num_font = load_font(FONT_DIR_BOLD, 32)
        draw.text((x + 36, y + 30), f"{i+1}.", font=num_font, fill=color)
        # Título
        draw.text((x + 100, y + 32), titulo, font=title_font, fill=TEXT)
        # Descripción
        wrapped = wrap_text(draw, desc, body_font, card_w - 70)
        for j, line in enumerate(wrapped):
            draw.text((x + 36, y + 130 + j * 34), line, font=body_font, fill=MUTED)

    draw_footer(draw, "Ley 21.719 — Art. 5°, 6°, 7°, 8°, 9°")
    out.parent.mkdir(parents=True, exist_ok=True)
    img.save(out, "PNG", optimize=True)


def ciudadano_plazo_30_dias(out: Path):
    """Línea de tiempo de 30 días corridos."""
    img, draw = new_canvas()
    draw_header(
        draw,
        "Plazo: 30 días corridos",
        "Desde que presentás tu solicitud, el responsable tiene este tiempo para responder",
    )

    # Línea de tiempo
    line_y = 540
    line_x_start = PAD + 100
    line_x_end = W - PAD - 100

    # Línea base
    draw.line(
        [(line_x_start, line_y), (line_x_end, line_y)],
        fill=ACCENT,
        width=6,
    )

    # Marcas
    milestones = [
        ("DÍA 1", "Presentás\ntu solicitud", SUCCESS, line_x_start),
        ("DÍA 15", "Si es complejo,\nse puede prorrogar\n1 vez (Art. 11)", WARN, (line_x_start + line_x_end) // 2),
        ("DÍA 30", "Vencimiento\ndel plazo legal", DANGER, line_x_end),
    ]

    big_font = load_font(FONT_DIR_BOLD, 36)
    small_font = load_font(FONT_DIR_REG, 24)

    for i, (day, desc, color, x) in enumerate(milestones):
        # Círculo
        radius = 24
        draw.ellipse([x - radius, line_y - radius, x + radius, line_y + radius], fill=color)
        # Etiqueta día
        tw, _ = text_size(draw, day, big_font)
        draw.text((x - tw / 2, line_y - 140), day, font=big_font, fill=color)
        # Descripción
        lines = desc.split("\n")
        for j, line in enumerate(lines):
            lw, _ = text_size(draw, line, small_font)
            draw.text((x - lw / 2, line_y + 50 + j * 32), line, font=small_font, fill=TEXT)

    # Caja inferior con mensaje clave
    box_y = 800
    draw.rounded_rectangle(
        [PAD, box_y, W - PAD, box_y + 180], radius=20, fill=SURFACE
    )
    msg_font = load_font(FONT_DIR_BOLD, 32)
    body_font = load_font(FONT_DIR_REG, 26)
    draw.text((PAD + 40, box_y + 24), "¿No te respondieron?", font=msg_font, fill=WARN)
    draw.text(
        (PAD + 40, box_y + 76),
        "1. Reiterá la solicitud por escrito certificado",
        font=body_font,
        fill=TEXT,
    )
    draw.text(
        (PAD + 40, box_y + 118),
        "2. Presentá reclamación ante la Agencia (Art. 41)",
        font=body_font,
        fill=TEXT,
    )

    draw_footer(draw, "Ley 21.719 — Art. 11")
    out.parent.mkdir(parents=True, exist_ok=True)
    img.save(out, "PNG", optimize=True)


def ciudadano_flujo_reclamacion(out: Path):
    """Diagrama de flujo: titular → empresa → Agencia."""
    img, draw = new_canvas()
    draw_header(
        draw,
        "Cómo reclamar tus datos",
        "Pasos que podés seguir si una empresa no te entrega tu información",
    )

    # 4 nodos conectados por flechas
    node_w = 340
    node_h = 200
    gap = 40
    y = 380
    total_w = 4 * node_w + 3 * gap
    start_x = (W - total_w) // 2

    nodes = [
        ("1", "ENVIÁ TU\nSOLICITUD", "Por escrito,\ncon tu nombre\ny RUT", ACCENT),
        ("2", "ESPERÁ\n30 DÍAS", "Plazo legal\npara responder", WARN),
        ("3", "REITERÁ\nSI NEGARON", "Vía carta\ncertificada", DANGER),
        ("4", "AGENCIA\nDE DATOS", "Presentá\nreclamación\nformal", SUCCESS),
    ]

    big_font = load_font(FONT_DIR_BOLD, 56)
    title_font = load_font(FONT_DIR_BOLD, 26)
    body_font = load_font(FONT_DIR_REG, 20)

    for i, (num, title, desc, color) in enumerate(nodes):
        x = start_x + i * (node_w + gap)
        # Tarjeta
        draw.rounded_rectangle(
            [x, y, x + node_w, y + node_h], radius=20, fill=SURFACE
        )
        # Número (círculo más pequeño a la izquierda)
        nw, nh = text_size(draw, num, big_font)
        draw.ellipse(
            [x + 20, y + 20, x + 20 + 70, y + 20 + 70], fill=color
        )
        nw, nh = text_size(draw, num, big_font)
        draw.text(
            (x + 20 + (70 - nw) / 2, y + 20 + (70 - nh) / 2 - 6),
            num,
            font=big_font,
            fill=TEXT,
        )
        # Título (a la derecha del círculo)
        for j, line in enumerate(title.split("\n")):
            draw.text(
                (x + 105, y + 28 + j * 32), line, font=title_font, fill=TEXT
            )
        # Descripción
        for j, line in enumerate(desc.split("\n")):
            draw.text(
                (x + 105, y + 110 + j * 26), line, font=body_font, fill=MUTED
            )

        # Flecha entre nodos
        if i < 3:
            fx1 = x + node_w + 5
            fx2 = x + node_w + gap - 5
            fy = y + node_h // 2
            draw.line([(fx1, fy), (fx2, fy)], fill=MUTED, width=4)
            # Punta de flecha
            draw.polygon(
                [(fx2, fy - 10), (fx2 + 15, fy), (fx2, fy + 10)], fill=MUTED
            )

    # Mensaje final
    msg_font = load_font(FONT_DIR_BOLD, 30)
    draw.text(
        (PAD, 720),
        "La Agencia puede fiscalizar, ordenar la entrega y sancionar",
        font=msg_font,
        fill=SUCCESS,
    )

    # Sanciones
    draw.rounded_rectangle(
        [PAD, 800, W - PAD, 1000], radius=20, fill=SURFACE
    )
    warn_font = load_font(FONT_DIR_BOLD, 26)
    body_font = load_font(FONT_DIR_REG, 22)
    draw.text(
        (PAD + 40, 824),
        "Multas: 5.000 a 20.000 UTM por infracciones",
        font=warn_font,
        fill=WARN,
    )
    draw.text(
        (PAD + 40, 874),
        "Infracciones graves: 2-4% de ingresos anuales",
        font=body_font,
        fill=TEXT,
    )
    draw.text(
        (PAD + 40, 916),
        "Infracciones leves: 1-5.000 UTM",
        font=body_font,
        fill=TEXT,
    )

    draw_footer(draw, "Ley 21.719 — Art. 11, 35, 41, 49")
    out.parent.mkdir(parents=True, exist_ok=True)
    img.save(out, "PNG", optimize=True)


def ciudadano_datos_sensibles(out: Path):
    """Lista de datos sensibles con íconos."""
    img, draw = new_canvas()
    draw_header(
        draw,
        "Datos sensibles: consentimiento explícito",
        "Requieren tu autorización clara, específica y por escrito",
    )

    # 6 categorías
    items = [
        ("🩺", "SALUD", "Historial clínico,\nresultados de exámenes"),
        ("👆", "BIOMÉTRICOS", "Huellas dactilares,\niris, voz, rostro"),
        ("🧬", "GENÉTICOS", "ADN, composición\ngenética"),
        ("🌈", "ORIENTACIÓN SEXUAL", "Identidad de género,\npreferencias"),
        ("🕊️", "RELIGIÓN", "Creencias, prácticas,\nafiliación"),
        ("🗳️", "OPINIÓN POLÍTICA", "Afiliación partidaria,\nvoto"),
    ]

    pad_x = 40
    pad_y = 30
    card_w = (W - 2 * PAD - 2 * pad_x) // 3
    card_h = 220

    start_y = 270
    for i, (emoji, titulo, desc) in enumerate(items):
        col = i % 3
        row = i // 3
        x = PAD + col * (card_w + pad_x)
        y = start_y + row * (card_h + pad_y)

        # Tarjeta
        draw.rounded_rectangle(
            [x, y, x + card_w, y + card_h], radius=20, fill=SURFACE
        )
        # Emoji (representado con texto grande)
        emoji_font = load_font(FONT_DIR_BOLD, 56)
        ew, eh = text_size(draw, emoji, emoji_font)
        draw.text(
            (x + (card_w - ew) / 2, y + 12), emoji, font=emoji_font, fill=WARN
        )
        # Título
        title_font = load_font(FONT_DIR_BOLD, 30)
        tw, _ = text_size(draw, titulo, title_font)
        draw.text(
            (x + (card_w - tw) / 2, y + 88), titulo, font=title_font, fill=TEXT
        )
        # Descripción
        body_font = load_font(FONT_DIR_REG, 20)
        for j, line in enumerate(desc.split("\n")):
            lw, _ = text_size(draw, line, body_font)
            draw.text(
                (x + (card_w - lw) / 2, y + 138 + j * 28),
                line,
                font=body_font,
                fill=MUTED,
            )

    # Mensaje inferior
    box_y = 800
    draw.rounded_rectangle(
        [PAD, box_y, W - PAD, box_y + 160], radius=20, fill=SURFACE
    )
    warn_font = load_font(FONT_DIR_BOLD, 30)
    body_font = load_font(FONT_DIR_REG, 24)
    draw.text(
        (PAD + 40, box_y + 24),
        "Sin consentimiento explícito = multa directa",
        font=warn_font,
        fill=DANGER,
    )
    draw.text(
        (PAD + 40, box_y + 76),
        "Las empresas NO pueden tratar estos datos sin tu autorización clara, específica y por escrito",
        font=body_font,
        fill=TEXT,
    )

    draw_footer(draw, "Ley 21.719 — Art. 16 ter")
    out.parent.mkdir(parents=True, exist_ok=True)
    img.save(out, "PNG", optimize=True)


# ==================== MÓDULO DESARROLLADOR ====================

def desarrollador_arquitectura_capas(out: Path):
    """Diagrama de las 5 capas de arquitectura."""
    img, draw = new_canvas()
    draw_header(
        draw,
        "Arquitectura recomendada en 5 capas",
        "Cada capa con responsabilidad clara y aislada",
    )

    capas = [
        ("1", "CAPA DE IDENTIDAD", "Quién es el usuario\nAutenticación robusta (MFA)\nGestión de sesiones", ACCENT),
        ("2", "CAPA DE CONSENTIMIENTO", "Registro granular por finalidad\nRevocación efectiva\nHistorial auditable", SUCCESS),
        ("3", "CAPA DE DATOS PERSONALES", "Cifrado en reposo (AES-256)\nCifrado en tránsito (TLS 1.3)\nPseudonimización", ACCENT),
        ("4", "CAPA DE AUDITORÍA", "Logs inmutables firmados\nRegistro de accesos\nTrazabilidad completa", WARN),
        ("5", "CAPA DE DERECHOS DEL USUARIO", "Endpoints ARCO+\nPortabilidad estructurada\nNotificación de brechas", SUCCESS),
    ]

    card_w = W - 2 * PAD - 60
    card_h = 110
    gap = 20
    start_y = 260

    big_font = load_font(FONT_DIR_BOLD, 56)
    title_font = load_font(FONT_DIR_BOLD, 32)
    body_font = load_font(FONT_DIR_REG, 22)

    for i, (num, titulo, desc, color) in enumerate(capas):
        y = start_y + i * (card_h + gap)
        x = PAD + 30
        # Tarjeta
        draw.rounded_rectangle(
            [x, y, x + card_w, y + card_h], radius=20, fill=SURFACE
        )
        # Número
        nw, nh = text_size(draw, num, big_font)
        draw.ellipse([x + 20, y + 20, x + 100, y + 100], fill=color)
        nw, nh = text_size(draw, num, big_font)
        draw.text(
            (x + 20 + (80 - nw) / 2, y + 20 + (80 - nh) / 2 - 6),
            num,
            font=big_font,
            fill=TEXT,
        )
        # Título
        draw.text((x + 130, y + 24), titulo, font=title_font, fill=TEXT)
        # Descripción
        for j, line in enumerate(desc.split("\n")):
            draw.text((x + 130, y + 66 + j * 26), line, font=body_font, fill=MUTED)

    # Footer con principio
    box_y = 920
    draw.rounded_rectangle(
        [PAD, box_y, W - PAD, box_y + 110], radius=20, fill=SURFACE
    )
    warn_font = load_font(FONT_DIR_BOLD, 28)
    draw.text(
        (PAD + 40, box_y + 24),
        "Cada capa debe poder auditarse de forma independiente",
        font=warn_font,
        fill=WARN,
    )
    draw.text(
        (PAD + 40, box_y + 64),
        "Si una cae, las demás siguen protegiendo los datos del usuario",
        font=load_font(FONT_DIR_REG, 22),
        fill=TEXT,
    )

    draw_footer(draw, "Ley 21.719 — Art. 14 quinquies, 15 ter")
    out.parent.mkdir(parents=True, exist_ok=True)
    img.save(out, "PNG", optimize=True)


def desarrollador_endpoints_arco(out: Path):
    """Tabla de endpoints HTTP para derechos ARCO+."""
    img, draw = new_canvas()
    draw_header(
        draw,
        "Endpoints ARCO+ para tu API",
        "Implementación técnica de los derechos del titular",
    )

    # Cabecera de tabla
    table_x = PAD
    table_y = 270
    col_widths = [220, 200, 140, W - 2 * PAD - 220 - 200 - 140 - 60]
    col_headers = ["MÉTODO", "ENDPOINT", "VERBO HTTP", "DESCRIPCIÓN"]

    header_h = 60
    # Header row
    draw.rounded_rectangle(
        [table_x, table_y, W - PAD, table_y + header_h], radius=12, fill=ACCENT
    )
    x_cur = table_x + 20
    for i, header in enumerate(col_headers):
        font = load_font(FONT_DIR_BOLD, 24)
        draw.text((x_cur, table_y + 16), header, font=font, fill=TEXT)
        x_cur += col_widths[i]

    # Filas
    rows = [
        ("Acceso", "/api/v1/user/data", "GET", "Devuelve copia de todos los datos del usuario autenticado"),
        ("Rectificación", "/api/v1/user/data", "PATCH", "Actualiza campos específicos del registro"),
        ("Cancelación", "/api/v1/user/data", "DELETE", "Elimina el registro (verifica excepciones legales)"),
        ("Portabilidad", "/api/v1/user/export", "GET", "Devuelve datos en JSON/CSV estructurado"),
        ("Bloqueo", "/api/v1/user/lock", "POST", "Congela tratamiento mientras hay disputa"),
    ]

    row_h = 80
    body_font = load_font(FONT_DIR_REG, 22)
    mono_font = load_font(FONT_MONO, 22)
    title_font = load_font(FONT_DIR_BOLD, 22)

    for r, (titulo, endpoint, verbo, desc) in enumerate(rows):
        y = table_y + header_h + 20 + r * row_h
        # Fondo alternado
        if r % 2 == 0:
            draw.rectangle(
                [table_x, y, W - PAD, y + row_h - 10], fill=SURFACE
            )
        # Celda 1: título
        draw.text((table_x + 20, y + 24), titulo, font=title_font, fill=TEXT)
        # Celda 2: endpoint
        draw.text(
            (table_x + 20 + col_widths[0], y + 24),
            endpoint,
            font=mono_font,
            fill=ACCENT,
        )
        # Celda 3: verbo
        verb_color = (
            SUCCESS if verbo == "GET" else WARN if verbo == "POST" else ACCENT
        )
        draw.text(
            (table_x + 20 + col_widths[0] + col_widths[1], y + 24),
            verbo,
            font=title_font,
            fill=verb_color,
        )
        # Celda 4: descripción (wrap)
        wrapped = wrap_text(
            draw, desc, body_font, col_widths[3] - 20
        )
        for j, line in enumerate(wrapped[:2]):
            draw.text(
                (
                    table_x
                    + 20
                    + col_widths[0]
                    + col_widths[1]
                    + col_widths[2],
                    y + 24 + j * 26,
                ),
                line,
                font=body_font,
                fill=MUTED,
            )

    # Mensaje inferior
    box_y = 870
    draw.rounded_rectangle(
        [PAD, box_y, W - PAD, box_y + 130], radius=20, fill=SURFACE
    )
    warn_font = load_font(FONT_DIR_BOLD, 26)
    body_font = load_font(FONT_DIR_REG, 22)
    draw.text(
        (PAD + 40, box_y + 24),
        "Cada endpoint requiere autenticación robusta (MFA recomendado)",
        font=warn_font,
        fill=WARN,
    )
    draw.text(
        (PAD + 40, box_y + 70),
        "Rate limiting + logging inmutable de cada operación sobre datos personales",
        font=body_font,
        fill=TEXT,
    )

    draw_footer(draw, "Ley 21.719 — Art. 5° a 9°")
    out.parent.mkdir(parents=True, exist_ok=True)
    img.save(out, "PNG", optimize=True)


def desarrollador_flujo_brecha(out: Path):
    """Línea de tiempo del plan de respuesta a brechas."""
    img, draw = new_canvas()
    draw_header(
        draw,
        "Plan de respuesta a brechas de seguridad",
        "4 fases: detección, contención, evaluación, notificación",
    )

    fases = [
        ("1", "DETECCIÓN", "Logs, IDS/IPS,\nmonitoreo de\nanomalías", SUCCESS, "0-2h"),
        ("2", "CONTENCIÓN", "Aislar sistemas\nafectados,\nrevocar accesos", WARN, "2-24h"),
        ("3", "EVALUACIÓN", "Determinar\nalcance de la\nbrecha", ACCENT, "24-72h"),
        ("4", "NOTIFICACIÓN", "A la Agencia y\na todos los\nafectados", DANGER, "72h+"),
    ]

    # Timeline horizontal
    line_y = 460
    line_x_start = PAD + 100
    line_x_end = W - PAD - 100
    draw.line(
        [(line_x_start, line_y), (line_x_end, line_y)],
        fill=ACCENT,
        width=6,
    )

    card_w = (line_x_end - line_x_start - 3 * 50) // 4
    card_h = 320

    big_font = load_font(FONT_DIR_BOLD, 72)
    title_font = load_font(FONT_DIR_BOLD, 30)
    body_font = load_font(FONT_DIR_REG, 22)
    time_font = load_font(FONT_DIR_BOLD, 22)

    for i, (num, titulo, desc, color, tiempo) in enumerate(fases):
        x_center = line_x_start + i * (card_w + 50) + card_w // 2
        # Círculo
        radius = 32
        draw.ellipse(
            [
                x_center - radius,
                line_y - radius,
                x_center + radius,
                line_y + radius,
            ],
            fill=color,
        )
        nw, nh = text_size(draw, num, big_font)
        draw.text(
            (x_center - nw / 2, line_y - nh / 2 - 8),
            num,
            font=big_font,
            fill=TEXT,
        )
        # Tarjeta debajo
        x = x_center - card_w // 2
        y = line_y + 80
        draw.rounded_rectangle(
            [x, y, x + card_w, y + card_h], radius=20, fill=SURFACE
        )
        draw.rectangle([x, y, x + 12, y + card_h], fill=color)
        # Tiempo (encabezado de la tarjeta, separado del título)
        tw, _ = text_size(draw, tiempo, time_font)
        draw.text(
            (x + (card_w - tw) / 2, y + 18), tiempo, font=time_font, fill=color
        )
        # Título
        tw, _ = text_size(draw, titulo, title_font)
        draw.text(
            (x + (card_w - tw) / 2, y + 58), titulo, font=title_font, fill=TEXT
        )
        # Descripción
        for j, line in enumerate(desc.split("\n")):
            lw, _ = text_size(draw, line, body_font)
            draw.text(
                (x + (card_w - lw) / 2, y + 110 + j * 28),
                line,
                font=body_font,
                fill=MUTED,
            )

    # Mensaje inferior
    box_y = 950
    draw.rounded_rectangle(
        [PAD, box_y, W - PAD, box_y + 90], radius=20, fill=SURFACE
    )
    warn_font = load_font(FONT_DIR_BOLD, 26)
    draw.text(
        (PAD + 40, box_y + 24),
        "Si hay riesgo para titulares, notificación sin dilaciones a la Agencia y afectados",
        font=warn_font,
        fill=DANGER,
    )

    draw_footer(draw, "Ley 21.719 — Art. 14 sexies")
    out.parent.mkdir(parents=True, exist_ok=True)
    img.save(out, "PNG", optimize=True)


def desarrollador_checklist_tecnico(out: Path):
    """Checklist visual con los 7 requisitos técnicos."""
    img, draw = new_canvas()
    draw_header(
        draw,
        "Checklist técnico de cumplimiento",
        "7 requisitos que tu código debe cumplir ANTES del 1 de diciembre de 2026",
    )

    items = [
        ("Cifrado en reposo", "AES-256 para datos personales en bases de datos", SUCCESS),
        ("Cifrado en tránsito", "TLS 1.3 para todas las comunicaciones", SUCCESS),
        ("Logs firmados", "Inmutables, con firma criptográfica de cada operación", SUCCESS),
        ("Endpoints ARCO+", "Implementados y autenticados con MFA", SUCCESS),
        ("Consentimiento granular", "Activación/desactivación por tipo de tratamiento", SUCCESS),
        ("Notificación de brechas", "Plan automatizado con plazos legales", SUCCESS),
        ("Portabilidad de datos", "Exportación estructurada, legible por máquina", SUCCESS),
    ]

    # 2 columnas
    items_per_col = (len(items) + 1) // 2
    col_w = (W - 2 * PAD - 60) // 2
    row_h = 90
    start_y = 270

    check_font = load_font(FONT_DIR_BOLD, 28)
    desc_font = load_font(FONT_DIR_REG, 22)

    for i, (titulo, desc, color) in enumerate(items):
        if i < items_per_col:
            col = 0
            row = i
        else:
            col = 1
            row = i - items_per_col
        x = PAD + 30 + col * (col_w + 30)
        y = start_y + row * row_h

        # Caja
        draw.rounded_rectangle(
            [x, y, x + col_w, y + row_h - 15], radius=15, fill=SURFACE
        )
        # Check verde
        cx = x + 30
        cy = y + (row_h - 15) // 2
        draw.ellipse([cx - 18, cy - 18, cx + 18, cy + 18], fill=SUCCESS)
        font_v = load_font(FONT_DIR_BOLD, 30)
        vw, vh = text_size(draw, "✓", font_v)
        draw.text((cx - vw / 2, cy - vh / 2 - 4), "✓", font=font_v, fill=TEXT)
        # Título
        draw.text((x + 70, y + 14), titulo, font=check_font, fill=TEXT)
        # Descripción
        draw.text((x + 70, y + 48), desc, font=desc_font, fill=MUTED)

    # Mensaje inferior
    box_y = 880
    draw.rounded_rectangle(
        [PAD, box_y, W - PAD, box_y + 130], radius=20, fill=SURFACE
    )
    warn_font = load_font(FONT_DIR_BOLD, 30)
    body_font = load_font(FONT_DIR_REG, 24)
    draw.text(
        (PAD + 40, box_y + 24),
        "El código que escribes HOY determina si tu empresa cumple MAÑANA",
        font=warn_font,
        fill=ACCENT,
    )
    draw.text(
        (PAD + 40, box_y + 74),
        "Privacidad desde el diseño. Es código, no opcional.",
        font=body_font,
        fill=TEXT,
    )

    draw_footer(draw, "Ley 21.719 — Art. 14 quinquies, 15 ter, 16 ter")
    out.parent.mkdir(parents=True, exist_ok=True)
    img.save(out, "PNG", optimize=True)


# ==================== MÓDULO INSTITUCIÓN ====================

def institucion_marco_juridico(out: Path):
    """Pirámide de normativa aplicable."""
    img, draw = new_canvas()
    draw_header(
        draw,
        "Marco jurídico aplicable al sector público",
        "Pirámide normativa: de mayor a menor jerarquía",
    )

    # Pirámide invertida: 4 niveles
    # Nivel 1 (arriba, ancho)
    levels = [
        ("CONSTITUCIÓN POLÍTICA", "Art. 19 N° 4 y 12", "Protección a la vida privada y libertad de expresión", 200, ACCENT),
        ("LEY 21.719", "Ley de Protección de Datos Personales", "Norma específica de protección de datos", 380, SUCCESS),
        ("LEY 18.575", "Bases Generales de la Administración del Estado", "Norma marco del sector público", 560, WARN),
        ("REGLAMENTOS", "Decretos y normas técnicas", "Detalle operativo de cumplimiento", 740, MUTED),
    ]

    title_font = load_font(FONT_DIR_BOLD, 30)
    body_font = load_font(FONT_DIR_REG, 20)
    small_font = load_font(FONT_DIR_REG, 17)

    for i, (titulo, ref, desc, w, color) in enumerate(levels):
        x = (W - w) // 2
        y = 260 + i * 175
        # Bloque pirámide
        draw.rounded_rectangle([x, y, x + w, y + 150], radius=15, fill=SURFACE)
        draw.rectangle([x, y, x + 12, y + 150], fill=color)
        # Título
        tw, _ = text_size(draw, titulo, title_font)
        draw.text(
            (x + (w - tw) / 2 + 10, y + 14), titulo, font=title_font, fill=TEXT
        )
        # Referencia
        rw, _ = text_size(draw, ref, body_font)
        draw.text(
            (x + (w - rw) / 2 + 10, y + 58), ref, font=body_font, fill=color
        )
        # Descripción
        wrapped = wrap_text(draw, desc, small_font, w - 40)
        for j, line in enumerate(wrapped):
            lw, _ = text_size(draw, line, small_font)
            draw.text(
                (x + (w - lw) / 2 + 10, y + 96 + j * 22),
                line,
                font=small_font,
                fill=MUTED,
            )

    # Mensaje
    box_y = 980
    draw.rounded_rectangle(
        [PAD, box_y, W - PAD, box_y + 70], radius=20, fill=SURFACE
    )
    msg_font = load_font(FONT_DIR_BOLD, 24)
    draw.text(
        (PAD + 40, box_y + 20),
        "El sector público debe cumplir TODAS estas normas de forma simultánea",
        font=msg_font,
        fill=SUCCESS,
    )

    draw_footer(draw, "Ley 21.719 — Art. 54, 56, 60")
    out.parent.mkdir(parents=True, exist_ok=True)
    img.save(out, "PNG", optimize=True)


def institucion_responsable(out: Path):
    """Quién es el responsable en cada tipo de organismo."""
    img, draw = new_canvas()
    draw_header(
        draw,
        "¿Quién es el responsable del tratamiento?",
        "En el sector público, es la autoridad superior del organismo",
    )

    organismos = [
        ("🏛️", "MINISTERIO", "Ministro/a del\nrespectivo ministerio", ACCENT),
        ("🏘️", "MUNICIPALIDAD", "El/la alcalde/sa\n(autoridad máxima)", SUCCESS),
        ("🎓", "UNIVERSIDAD\nPÚBLICA", "El/la rector/a", WARN),
        ("🏥", "HOSPITAL /\nSERVICIO DE SALUD", "Director/a del\nrespectivo servicio", DANGER),
    ]

    pad_x = 40
    card_w = (W - 2 * PAD - pad_x) // 2
    card_h = 280

    for i, (emoji, tipo, rol, color) in enumerate(organismos):
        col = i % 2
        row = i // 2
        x = PAD + col * (card_w + pad_x)
        y = 280 + row * (card_h + 30)

        # Tarjeta
        draw.rounded_rectangle(
            [x, y, x + card_w, y + card_h], radius=20, fill=SURFACE
        )
        # Emoji
        emoji_font = load_font(FONT_DIR_BOLD, 72)
        ew, _ = text_size(draw, emoji, emoji_font)
        draw.text(
            (x + (card_w - ew) / 2, y + 20),
            emoji,
            font=emoji_font,
            fill=color,
        )
        # Tipo
        type_font = load_font(FONT_DIR_BOLD, 36)
        for j, line in enumerate(tipo.split("\n")):
            tw, _ = text_size(draw, line, type_font)
            draw.text(
                (x + (card_w - tw) / 2, y + 116 + j * 42),
                line,
                font=type_font,
                fill=TEXT,
            )
        # Rol
        role_font = load_font(FONT_DIR_REG, 24)
        for j, line in enumerate(rol.split("\n")):
            rw, _ = text_size(draw, line, role_font)
            draw.text(
                (x + (card_w - rw) / 2, y + 200 + j * 30),
                line,
                font=role_font,
                fill=MUTED,
            )

    # Mensaje
    box_y = 900
    draw.rounded_rectangle(
        [PAD, box_y, W - PAD, box_y + 110], radius=20, fill=SURFACE
    )
    warn_font = load_font(FONT_DIR_BOLD, 26)
    body_font = load_font(FONT_DIR_REG, 22)
    draw.text(
        (PAD + 40, box_y + 20),
        "El responsable NO es un empleado. Es la autoridad máxima del organismo.",
        font=warn_font,
        fill=ACCENT,
    )
    draw.text(
        (PAD + 40, box_y + 64),
        "Es quien debe velar por el cumplimiento de la ley y firmar las declaraciones.",
        font=body_font,
        fill=TEXT,
    )

    draw_footer(draw, "Ley 21.719 — Art. 1°, 2°")
    out.parent.mkdir(parents=True, exist_ok=True)
    img.save(out, "PNG", optimize=True)


def institucion_periodo_transitorio(out: Path):
    """Cuenta regresiva: 60 días antes del 1 dic 2026."""
    img, draw = new_canvas()
    draw_header(
        draw,
        "Período transitorio: 60 días clave",
        "Antes del 1 de diciembre de 2026, la institución debe adecuarse",
    )

    # Línea de tiempo centrada vertical
    line_x = W // 2
    line_y_start = 280
    line_y_end = 760
    draw.line(
        [(line_x, line_y_start), (line_x, line_y_end)],
        fill=ACCENT,
        width=8,
    )

    # Marcas
    milestones = [
        ("HOY", "Inicio del\nperíodo transitorio", SUCCESS, line_y_start + 60),
        ("30 DÍAS", "Auditoría interna\nde cumplimiento", WARN, line_y_start + 200),
        ("45 DÍAS", "Designar DPO\n(formalización)", ACCENT, line_y_start + 340),
        ("60 DÍAS", "Adecuación completa\nobligatoria", DANGER, line_y_end - 60),
    ]

    big_font = load_font(FONT_DIR_BOLD, 40)
    title_font = load_font(FONT_DIR_BOLD, 28)
    body_font = load_font(FONT_DIR_REG, 22)

    for i, (day, desc, color, y) in enumerate(milestones):
        # Círculo en línea
        draw.ellipse(
            [line_x - 22, y - 22, line_x + 22, y + 22], fill=color
        )
        # Etiqueta
        dw, dh = text_size(draw, day, big_font)
        label_x = line_x + 60
        draw.text((label_x, y - dh / 2 - 4), day, font=big_font, fill=color)
        # Caja con descripción
        box_x = line_x + 60
        box_y = y + 30
        for j, line in enumerate(desc.split("\n")):
            draw.text(
                (box_x, box_y + j * 26), line, font=body_font, fill=TEXT
            )

    # Fecha clave destacada
    box_y = 820
    draw.rounded_rectangle(
        [PAD, box_y, W - PAD, box_y + 200], radius=20, fill=SURFACE
    )
    date_font = load_font(FONT_DIR_BOLD, 56)
    draw.text((PAD + 40, box_y + 28), "1 DE DICIEMBRE DE 2026", font=date_font, fill=DANGER)
    body_font = load_font(FONT_DIR_BOLD, 24)
    draw.text(
        (PAD + 40, box_y + 110),
        "Entrada en vigencia plena de la Ley 21.719",
        font=body_font,
        fill=TEXT,
    )
    body2_font = load_font(FONT_DIR_REG, 20)
    draw.text(
        (PAD + 40, box_y + 150),
        "El sector público debe estar completamente adecuado para esta fecha",
        font=body2_font,
        fill=MUTED,
    )

    draw_footer(draw, "Ley 21.719 — Vigencia plena: 2026-12-01")
    out.parent.mkdir(parents=True, exist_ok=True)
    img.save(out, "PNG", optimize=True)


def institucion_obligaciones_dpo(out: Path):
    """Checklist de obligaciones especiales."""
    img, draw = new_canvas()
    draw_header(
        draw,
        "Obligaciones especiales del sector público",
        "Checklist de cumplimiento institucional",
    )

    items = [
        ("Designar DPO", "Obligatorio para instituciones con alto volumen de datos", DANGER),
        ("Registro de operaciones", "Mantener actualizado el Registro Nacional de Operaciones", DANGER),
        ("Informes periódicos", "Reportar cumplimiento a la Agencia de forma regular", WARN),
        ("Auditorías internas", "Realizar auditorías de cumplimiento al menos una vez al año", WARN),
        ("Cooperación interinstitucional", "Mantener canales directos con la Agencia", ACCENT),
        ("Documentación", "Toda decisión sobre tratamiento debe estar documentada", ACCENT),
        ("Capacitación", "Formar al personal en protección de datos", SUCCESS),
        ("Canales de atención", "Habilitar canales para que los titulares ejerzan derechos ARCO+", SUCCESS),
    ]

    # 2 columnas
    items_per_col = (len(items) + 1) // 2
    col_w = (W - 2 * PAD - 60) // 2
    row_h = 90
    start_y = 270

    title_font = load_font(FONT_DIR_BOLD, 22)
    body_font = load_font(FONT_DIR_REG, 18)

    for i, (titulo, desc, color) in enumerate(items):
        if i < items_per_col:
            col = 0
            row = i
        else:
            col = 1
            row = i - items_per_col
        x = PAD + 30 + col * (col_w + 30)
        y = start_y + row * row_h

        # Caja
        draw.rounded_rectangle(
            [x, y, x + col_w, y + row_h - 15], radius=15, fill=SURFACE
        )
        # Cuadradito de color según prioridad
        priority = DANGER if i < 2 else WARN if i < 4 else ACCENT
        draw.rectangle([x, y, x + 12, y + row_h - 15], fill=priority)
        # Título (wrap por si es largo)
        wrapped_title = wrap_text(draw, titulo, title_font, col_w - 40)
        for j, line in enumerate(wrapped_title):
            draw.text((x + 24, y + 10 + j * 26), line, font=title_font, fill=TEXT)
        # Descripción
        for k, line in enumerate(desc.split("\n")):
            draw.text(
                (x + 24, y + 56 + k * 22), line, font=body_font, fill=MUTED
            )

    # Mensaje inferior
    box_y = 850
    draw.rounded_rectangle(
        [PAD, box_y, W - PAD, box_y + 180], radius=20, fill=SURFACE
    )
    title_font = load_font(FONT_DIR_BOLD, 28)
    body_font = load_font(FONT_DIR_REG, 22)
    draw.text(
        (PAD + 40, box_y + 20),
        "Obligaciones críticas para instituciones de alto volumen",
        font=title_font,
        fill=DANGER,
    )
    draw.text(
        (PAD + 40, box_y + 64),
        "1. Designar DPO con dedicación exclusiva",
        font=body_font,
        fill=TEXT,
    )
    draw.text(
        (PAD + 40, box_y + 100),
        "2. Crear comité institucional de protección de datos",
        font=body_font,
        fill=TEXT,
    )
    draw.text(
        (PAD + 40, box_y + 136),
        "3. Establecer canales directos con la Agencia",
        font=body_font,
        fill=TEXT,
    )

    draw_footer(draw, "Ley 21.719 — Art. 49, 50, 60")
    out.parent.mkdir(parents=True, exist_ok=True)
    img.save(out, "PNG", optimize=True)


# ==================== MAIN ====================

def main():
    base = Path("/opt/data/ley21719-cl/tools/video_factory/out/img")

    images = {
        "ciudadano/ciudadano_derechos_arco.png": ciudadano_derechos_arco,
        "ciudadano/ciudadano_plazo_30_dias.png": ciudadano_plazo_30_dias,
        "ciudadano/ciudadano_flujo_reclamacion.png": ciudadano_flujo_reclamacion,
        "ciudadano/ciudadano_datos_sensibles.png": ciudadano_datos_sensibles,
        "desarrollador/desarrollador_arquitectura_capas.png": desarrollador_arquitectura_capas,
        "desarrollador/desarrollador_endpoints_arco.png": desarrollador_endpoints_arco,
        "desarrollador/desarrollador_flujo_brecha.png": desarrollador_flujo_brecha,
        "desarrollador/desarrollador_checklist_tecnico.png": desarrollador_checklist_tecnico,
        "institucion/institucion_marco_juridico.png": institucion_marco_juridico,
        "institucion/institucion_responsable.png": institucion_responsable,
        "institucion/institucion_periodo_transitorio.png": institucion_periodo_transitorio,
        "institucion/institucion_obligaciones_dpo.png": institucion_obligaciones_dpo,
    }

    print(f"Generando {len(images)} imágenes en {base}...")
    for i, (rel_path, fn) in enumerate(images.items(), 1):
        out = base / rel_path
        print(f"  [{i}/{len(images)}] {rel_path} ...", end="", flush=True)
        fn(out)
        size = out.stat().st_size
        print(f" OK ({size:,} bytes)")

    print(f"\n✅ Listo. {len(images)} imágenes en {base}/")


if __name__ == "__main__":
    main()
