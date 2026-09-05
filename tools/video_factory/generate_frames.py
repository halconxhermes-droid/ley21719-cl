"""
Genera frames PNG optimizados (sin RGBA por frame) para cada escena.
"""
from __future__ import annotations
import os
import sys
import math
from pathlib import Path
from PIL import Image, ImageDraw

sys.path.insert(0, str(Path(__file__).parent / "render"))
from anim import (
    W, H, BG, PRIMARY, SECONDARY, WARN, HIGHLIGHT, TEXT, MUTED, GRID, DARK_PANEL,
    f, make_canvas, draw_centered, lerp, ease_out, ease_in_out, pulse,
    fade_alpha, blend_color, fade_color,
)

FPS = 30
OUT_DIR = Path(__file__).parent / "out" / "frames"
OUT_DIR.mkdir(parents=True, exist_ok=True)


def write_frames(scene_id: str, total_seconds: float, render_func):
    total = int(total_seconds * FPS)
    scene_dir = OUT_DIR / scene_id
    scene_dir.mkdir(parents=True, exist_ok=True)
    print(f"[{scene_id}] {total} frames ({total_seconds:.1f}s)", flush=True)
    for i in range(total):
        t = i / FPS
        img = render_func(t)
        img.save(scene_dir / f"frame_{i:05d}.png", optimize=False)
    print(f"  → {scene_dir}", flush=True)


# ==================== ESCENAS ====================

def scene1_hook(t):
    img = make_canvas()
    draw = ImageDraw.Draw(img)
    # gradiente vertical sutil decorativo
    for y in range(0, H, 4):
        alpha = int(20 * (1 - y / H) / 4)
        c = (28 + alpha, 28 + alpha, 35 + alpha)
        draw.line([(0, y), (W, y)], fill=c, width=4)

    draw.text((40, 30), "LEY 21.719 — MÓDULO EMPRESA",
              font=f(14, bold=True, mono=True), fill=MUTED, anchor="lt")

    fade = fade_alpha(min(0.6, t), 0.6)
    title_font = f(56, bold=True)
    title = "¿Puede tu empresa demostrar"
    title2 = "HOY que cumple la Ley 21.719?"
    if t > 0.1:
        slide_y = lerp(20, 0, fade)
        draw_centered(draw, title, title_font, fade_color(TEXT, t - 0.1, 0.6), 220 + slide_y)
        draw_centered(draw, title2, title_font, fade_color(PRIMARY, t - 0.1, 0.6), 290 + slide_y)

    if t > 0.8:
        sub_fade = fade_alpha(min(0.5, t - 0.8), 0.5)
        sub_font = f(28)
        draw_centered(draw, "Tienes hasta el 1 de diciembre de 2026",
                      sub_font, fade_color(WARN, t - 0.8, 0.5), 400)
        draw_centered(draw, "para reaccionar.",
                      sub_font, fade_color(TEXT, t - 0.8, 0.5), 440)

    if t > 1.2:
        cd_fade = fade_alpha(min(0.6, t - 1.2), 0.6)
        cx, cy = W - 200, H - 200
        r = 130
        p = 1 + 0.04 * math.sin(t * 3)
        r_p = int(r * p)
        for thickness in range(8):
            draw.ellipse(
                [cx - r_p + thickness, cy - r_p + thickness,
                 cx + r_p - thickness, cy + r_p - thickness],
                outline=PRIMARY, width=1
            )
        dfont = f(22, bold=True)
        draw.text((cx, cy - 20), "VIGENCIA PLENA", font=f(16, bold=True),
                  fill=fade_color(PRIMARY, cd_fade), anchor="mm")
        draw.text((cx, cy + 15), "01.12.2026", font=dfont,
                  fill=TEXT, anchor="mm")
        draw.text((cx, cy + 45), "Chile", font=f(14), fill=MUTED, anchor="mm")
    return img


def scene2_contexto(t):
    img = make_canvas()
    draw = ImageDraw.Draw(img)
    draw.text((40, 30), "01 — CONTEXTO",
              font=f(14, bold=True, mono=True), fill=MUTED, anchor="lt")
    draw_centered(draw, "De la 19.628 a la 21.719", f(46, bold=True), PRIMARY, 100)

    line_y = 380
    nodes = [
        ("1999", "Ley 19.628", "Régimen anterior\nautorregulado", MUTED),
        ("DIC 2024", "Ley 21.719", "Publicada en\nDiario Oficial", PRIMARY),
        ("1 DIC 2026", "VIGENCIA PLENA", "Fiscalización\nactiva de la APDP", WARN),
    ]
    node_xs = [240, 640, 1040]

    if t > 0.2:
        lf = ease_out(min(1.0, (t - 0.2) / 0.8))
        # línea horizontal punteada
        for x in range(node_xs[0], node_xs[2], 10):
            draw.line([(x, line_y), (x + 5, line_y)], fill=PRIMARY, width=2)

    for i, (date, title, sub, color) in enumerate(nodes):
        nx = node_xs[i]
        node_t = max(0, t - 0.4 - i * 0.3)
        nf = ease_out(min(1.0, node_t / 0.5))
        if nf <= 0:
            continue
        r = 14
        p = pulse(node_t * 0.5) if nf > 0.9 else 1.0
        r_drawn = int(r * p)
        # halo como anillos
        halo_color = blend_color(color, 0.3 * nf)
        for rr in range(30, 14, -2):
            draw.ellipse([nx - rr, line_y - rr, nx + rr, line_y + rr],
                         outline=halo_color, width=1)
        draw.ellipse([nx - r_drawn, line_y - r_drawn, nx + r_drawn, line_y + r_drawn],
                     fill=color)

        date_font = f(20, bold=True, mono=True)
        text_color = blend_color(color, nf)
        title_color = blend_color(TEXT, nf)
        muted_color = blend_color(MUTED, nf)
        draw.text((nx, line_y - 80), date, font=date_font, fill=text_color, anchor="mm")
        draw.text((nx, line_y - 50), title, font=f(26, bold=True), fill=title_color, anchor="mm")
        for j, line in enumerate(sub.split("\n")):
            draw.text((nx, line_y + 40 + j * 26), line, font=f(18), fill=muted_color, anchor="mm")
    return img


def scene3_cambio(t):
    img = make_canvas()
    draw = ImageDraw.Draw(img)
    draw.text((40, 30), "02 — EL CAMBIO CLAVE",
              font=f(14, bold=True, mono=True), fill=MUTED, anchor="lt")
    draw_centered(draw, "De 'cumplir si te pillan'", f(38, bold=True), WARN, 100)
    draw_centered(draw, "a 'demostrar que cumples'", f(38, bold=True), SECONDARY, 150)

    box_y = 240
    box_h = 320
    box_w = 480
    gap = 40
    total_w = box_w * 2 + gap
    box1_x = (W - total_w) // 2
    box2_x = box1_x + box_w + gap

    t_anim = max(0, t - 0.3)
    slide = ease_out(min(1.0, t_anim / 0.7))
    box_alpha = int(255 * slide)

    # Box 1: ANTES
    box1_real_x = int(box1_x + lerp(-100, 0, slide))
    panel_color = blend_color(DARK_PANEL, slide)
    draw.rectangle([box1_real_x, box_y, box1_real_x + box_w, box_y + box_h],
                   fill=panel_color, outline=WARN, width=3)
    draw.text((box1_real_x + box_w // 2, box_y + 40), "ANTES",
              font=f(28, bold=True), fill=WARN, anchor="mm")
    draw.text((box1_real_x + box_w // 2, box_y + 80), "Ley 19.628",
              font=f(20), fill=MUTED, anchor="mm")
    lines1 = [
        "•  Cumplo si me fiscalizan",
        "•  Sanciones menores",
        "•  Sin agencia autónoma",
        "•  DPO opcional (buena práctica)",
        "•  EIPD no exigida",
    ]
    for i, line in enumerate(lines1):
        draw.text((box1_real_x + 30, box_y + 130 + i * 36), line,
                  font=f(20), fill=TEXT, anchor="lt")

    # Box 2: DESPUÉS
    box2_real_x = int(box2_x + lerp(100, 0, slide))
    draw.rectangle([box2_real_x, box_y, box2_real_x + box_w, box_y + box_h],
                   fill=panel_color, outline=SECONDARY, width=3)
    draw.text((box2_real_x + box_w // 2, box_y + 40), "AHORA",
              font=f(28, bold=True), fill=SECONDARY, anchor="mm")
    draw.text((box2_real_x + box_w // 2, box_y + 80), "Ley 21.719",
              font=f(20), fill=MUTED, anchor="mm")
    lines2 = [
        "•  Demuestro que cumplo (Art. 49)",
        "•  Multas hasta 5.000 UTM y 2-4% ingresos",
        "•  Agencia de Protección de Datos",
        "•  DPO obligatorio en ciertos casos",
        "•  EIPD cuando hay alto riesgo (Art. 15 ter)",
    ]
    for i, line in enumerate(lines2):
        draw.text((box2_real_x + 30, box_y + 130 + i * 36), line,
                  font=f(20), fill=TEXT, anchor="lt")

    if t > 2.0:
        pie_fade = fade_alpha(min(0.6, t - 2.0), 0.6)
        draw.text((W // 2, H - 60), "Responsabilidad proactiva  ·  Art. 49",
                  font=f(24, bold=True), fill=blend_color(HIGHLIGHT, pie_fade), anchor="mm")
    return img


def scene4_dpo(t):
    img = make_canvas()
    draw = ImageDraw.Draw(img)
    draw.text((40, 30), "03 — PRÁCTICA 1 / 4",
              font=f(14, bold=True, mono=True), fill=MUTED, anchor="lt")
    draw_centered(draw, "Designar un Delegado de Protección de Datos",
                  f(34, bold=True), PRIMARY, 100)
    draw_centered(draw, "Conocido como DPO o DPD", f(22), MUTED, 160)

    t_anim = max(0, t - 0.3)
    fade = ease_out(min(1.0, t_anim / 0.5))
    card = [160, 220, W - 160, 580]
    panel_c = blend_color(DARK_PANEL, fade)
    outline_c = blend_color(PRIMARY, fade)
    draw.rectangle(card, fill=panel_c, outline=outline_c, width=2)

    draw.text((200, 260), "ART. 50",
              font=f(28, bold=True, mono=True), fill=PRIMARY, anchor="lt")
    draw.text((320, 260), "Designación VOLUNTARIA",
              font=f(24, bold=True), fill=TEXT, anchor="lt")
    draw.text((200, 295), "La empresa puede nombrar un DPO. Recomendable si manejas",
              font=f(20), fill=TEXT, anchor="lt")
    draw.text((200, 322), "datos sensibles o alto volumen.",
              font=f(20), fill=TEXT, anchor="lt")

    draw.line([(200, 360), (W - 200, 360)], fill=MUTED, width=1)

    draw.text((200, 390), "ART. 49",
              font=f(28, bold=True, mono=True), fill=WARN, anchor="lt")
    draw.text((320, 390), "Modelo de prevención OBLIGATORIO",
              font=f(24, bold=True), fill=TEXT, anchor="lt")
    draw.text((200, 425), "Toda empresa debe contar con un modelo de prevención",
              font=f(20), fill=TEXT, anchor="lt")
    draw.text((200, 452), "de infracciones. Sin este modelo, no hay cumplimiento.",
              font=f(20), fill=TEXT, anchor="lt")

    draw.line([(200, 490), (W - 200, 490)], fill=MUTED, width=1)

    bg_highlight = (80, 50, 30)
    bg_c = blend_color(bg_highlight, fade)
    draw.rectangle([200, 510, W - 200, 560], fill=bg_c)
    draw.text((W // 2, 535), "Si tienes datos sensibles o alto volumen, el DPO ya NO es opcional.",
              font=f(20, bold=True), fill=HIGHLIGHT, anchor="mm")
    return img


def scene5_seguridad(t):
    img = make_canvas()
    draw = ImageDraw.Draw(img)
    draw.text((40, 30), "04 — PRÁCTICA 2 / 4",
              font=f(14, bold=True, mono=True), fill=MUTED, anchor="lt")
    draw_centered(draw, "Medidas de seguridad técnicas y organizativas",
                  f(34, bold=True), PRIMARY, 100)
    draw_centered(draw, "No basta con un antivirus", f(22), MUTED, 160)

    cx, cy = W // 2, 400
    t_anim = max(0, t - 0.3)
    fade = ease_out(min(1.0, t_anim / 0.5))

    for i, (color, _) in enumerate([(WARN, None), (PRIMARY, None)]):
        r = 200 - i * 50
        draw.ellipse([cx - r, cy - r, cx + r, cy + r], outline=color, width=4)

    panel_c = blend_color(DARK_PANEL, fade)
    draw.ellipse([cx - 80, cy - 80, cx + 80, cy + 80],
                 fill=panel_c, outline=SECONDARY, width=3)
    draw.text((cx, cy - 10), "Datos", font=f(24, bold=True), fill=SECONDARY, anchor="mm")
    draw.text((cx, cy + 20), "protegidos", font=f(20), fill=TEXT, anchor="mm")

    if t > 1.0:
        lf = ease_out(min(1.0, (t - 1.0) / 0.4))
        draw.text((180, 380), "Art. 14 bis", font=f(22, bold=True, mono=True),
                  fill=PRIMARY, anchor="lm")
        for j, line in enumerate(["Cifrado, control de acceso,",
                                   "registros de auditoría,",
                                   "pruebas periódicas"]):
            draw.text((180, 410 + j * 28), line, font=f(18), fill=TEXT, anchor="lm")
        draw.text((W - 180, 380), "Art. 14 quinquies",
                  font=f(22, bold=True, mono=True), fill=WARN, anchor="rm")
        for j, line in enumerate(["Políticas internas,",
                                   "capacitación del personal,",
                                   "gobernanza del acceso"]):
            draw.text((W - 180, 410 + j * 28), line, font=f(18), fill=TEXT, anchor="rm")
    return img


def scene6_eipd(t):
    img = make_canvas()
    draw = ImageDraw.Draw(img)
    draw.text((40, 30), "05 — PRÁCTICA 3 / 4",
              font=f(14, bold=True, mono=True), fill=MUTED, anchor="lt")
    draw_centered(draw, "Evaluación de Impacto (EIPD)",
                  f(40, bold=True), PRIMARY, 100)
    draw_centered(draw, "Obligatoria cuando el tratamiento sea probablemente de alto riesgo",
                  f(22), MUTED, 160)

    t_anim = max(0, t - 0.3)
    fade = ease_out(min(1.0, t_anim / 0.6))

    boxes = [
        (200, 280, 360, 480, "1. Identificar", "Datos y operaciones\nque pueden generar\nalto riesgo", PRIMARY),
        (480, 280, 640, 480, "2. Evaluar", "Probabilidad y\nseveridad del daño\na titulares", HIGHLIGHT),
        (760, 280, 920, 480, "3. Mitigar", "Medidas para\nreducir el riesgo\na nivel aceptable", SECONDARY),
    ]
    panel_c = blend_color(DARK_PANEL, fade)
    for i, (x1, y1, x2, y2, head, body, color) in enumerate(boxes):
        delay = i * 0.3
        bt = max(0, t - 0.5 - delay)
        bf = ease_out(min(1.0, bt / 0.5))
        if bf <= 0:
            continue
        outline_c = blend_color(color, bf)
        draw.rectangle([x1, y1, x2, y2], fill=panel_c, outline=outline_c, width=3)
        draw.text(((x1 + x2) // 2, y1 + 40), head,
                  font=f(24, bold=True), fill=color, anchor="mm")
        for j, line in enumerate(body.split("\n")):
            draw.text(((x1 + x2) // 2, y1 + 100 + j * 32), line,
                      font=f(20), fill=TEXT, anchor="mm")
        if i < 2:
            ax1 = x2 + 5
            ax2 = boxes[i + 1][0] - 5
            ay = (y1 + y2) // 2
            arr_f = ease_out(min(1.0, max(0, t - 1.0 - delay) / 0.4))
            if arr_f > 0:
                draw.polygon([(ax1, ay - 12), (ax2 - 10, ay - 12), (ax2 - 10, ay - 22),
                              (ax2, ay), (ax2 - 10, ay + 22), (ax2 - 10, ay + 12),
                              (ax1, ay + 12)], fill=PRIMARY)

    if t > 1.8:
        pf = fade_alpha(min(0.5, t - 1.8), 0.5)
        draw.text((W // 2, 540), "Sin EIPD, no hay tratamiento legal del alto riesgo.",
                  font=f(22, bold=True), fill=blend_color(HIGHLIGHT, pf), anchor="mm")
        draw.text((W // 2, 575), "Art. 15 ter",
                  font=f(20, bold=True, mono=True), fill=blend_color(WARN, pf), anchor="mm")
    return img


def scene7_transferencias(t):
    img = make_canvas()
    draw = ImageDraw.Draw(img)
    draw.text((40, 30), "06 — PRÁCTICA 4 / 4",
              font=f(14, bold=True, mono=True), fill=MUTED, anchor="lt")
    draw_centered(draw, "Transferencias internacionales",
                  f(40, bold=True), PRIMARY, 100)
    draw_centered(draw, "Sin mecanismo legal = transferencia ilegal",
                  f(22), MUTED, 160)

    t_anim = max(0, t - 0.3)
    fade = ease_out(min(1.0, t_anim / 0.5))

    cx, cy = W // 2, 420
    draw.ellipse([cx - 30, cy - 30, cx + 30, cy + 30], fill=PRIMARY)
    draw.text((cx, cy - 60), "CHILE", font=f(20, bold=True), fill=PRIMARY, anchor="mm")

    targets = [
        (300, 320, "EE.UU.", "SIN adecuación", WARN),
        (980, 320, "UE", "Con adecuación", SECONDARY),
        (640, 220, "Asia", "Requiere cláusulas", HIGHLIGHT),
    ]
    for i, (tx, ty, name, status, color) in enumerate(targets):
        delay = i * 0.4
        tt = max(0, t - 0.8 - delay)
        tf = ease_out(min(1.0, tt / 0.5))
        if tf <= 0:
            continue
        draw.ellipse([tx - 24, ty - 24, tx + 24, ty + 24], fill=color)
        draw.text((tx, ty + 50), name, font=f(20, bold=True), fill=color, anchor="mm")
        draw.text((tx, ty + 75), status, font=f(16), fill=MUTED, anchor="mm")
        if t > 1.2 + delay * 0.5:
            arr_f = ease_out(min(1.0, (t - 1.2 - delay * 0.5) / 0.4))
            dx, dy = tx - cx, ty - cy
            length = math.hypot(dx, dy)
            ux, uy = dx / length, dy / length
            sx, sy = cx + ux * 30, cy + uy * 30
            ex, ey = tx - ux * 24, ty - uy * 24
            for seg in range(0, int(length - 60), 12):
                p1 = (sx + ux * seg, sy + uy * seg)
                p2 = (sx + ux * (seg + 6), sy + uy * (seg + 6))
                draw.line([p1, p2], fill=color, width=2)
            angle = math.atan2(dy, dx)
            ax = ex - ux * 4 - math.sin(angle) * 6
            ay = ey - uy * 4 + math.cos(angle) * 6
            cx2 = ex - ux * 4 + math.sin(angle) * 6
            cy2 = ey - uy * 4 - math.cos(angle) * 6
            draw.polygon([(ex, ey), (int(ax), int(ay)), (int(cx2), int(cy2))],
                         fill=color)

    if t > 2.5:
        pf = fade_alpha(min(0.5, t - 2.5), 0.5)
        draw.text((W // 2, 600), "Art. 27 — Adecuación, cláusulas contractuales o consentimiento expreso.",
                  font=f(22, bold=True), fill=blend_color(HIGHLIGHT, pf), anchor="mm")
    return img


def scene8_sanciones(t):
    img = make_canvas()
    draw = ImageDraw.Draw(img)
    draw.text((40, 30), "07 — SANCIONES",
              font=f(14, bold=True, mono=True), fill=MUTED, anchor="lt")
    draw_centered(draw, "Las sanciones duelen", f(40, bold=True), WARN, 100)

    t_anim = max(0, t - 0.3)
    fade = ease_out(min(1.0, t_anim / 0.6))
    panel_c = blend_color(DARK_PANEL, fade)

    box_w = 460
    box_h = 320
    box1_x = 160
    box2_x = W - box1_x - box_w
    box_y = 240

    # Panel izquierdo
    draw.rectangle([box1_x, box_y, box1_x + box_w, box_y + box_h],
                   fill=panel_c, outline=WARN, width=3)
    draw.text((box1_x + box_w // 2, box_y + 40), "MULTA MÍNIMA",
              font=f(20, bold=True), fill=WARN, anchor="mm")
    draw.text((box1_x + box_w // 2, box_y + 130), "5.000 UTM",
              font=f(80, bold=True), fill=WARN, anchor="mm")
    draw.text((box1_x + box_w // 2, box_y + 200), "Art. 35",
              font=f(22, bold=True, mono=True), fill=MUTED, anchor="mm")
    draw.text((box1_x + box_w // 2, box_y + 240), "Unidad Tributaria Mensual",
              font=f(18), fill=TEXT, anchor="mm")
    draw.text((box1_x + box_w // 2, box_y + 265), "(~$330M CLP hoy)",
              font=f(18), fill=MUTED, anchor="mm")

    # Panel derecho
    draw.rectangle([box2_x, box_y, box2_x + box_w, box_y + box_h],
                   fill=panel_c, outline=WARN, width=3)
    draw.text((box2_x + box_w // 2, box_y + 40), "MULTA MÁXIMA",
              font=f(20, bold=True), fill=WARN, anchor="mm")
    draw.text((box2_x + box_w // 2, box_y + 130), "2% – 4%",
              font=f(80, bold=True), fill=WARN, anchor="mm")
    draw.text((box2_x + box_w // 2, box_y + 200), "Art. 37",
              font=f(22, bold=True, mono=True), fill=MUTED, anchor="mm")
    draw.text((box2_x + box_w // 2, box_y + 240), "de los ingresos anuales",
              font=f(20), fill=TEXT, anchor="mm")
    draw.text((box2_x + box_w // 2, box_y + 265), "empresas no exentas",
              font=f(18), fill=MUTED, anchor="mm")

    if t > 1.5:
        pf = fade_alpha(min(0.5, t - 1.5), 0.5)
        draw.text((W // 2, 600), "No es un costo menor.",
                  font=f(28, bold=True), fill=blend_color(HIGHLIGHT, pf), anchor="mm")
    return img


def scene9_plazos(t):
    img = make_canvas()
    draw = ImageDraw.Draw(img)
    draw.text((40, 30), "08 — PLAZOS",
              font=f(14, bold=True, mono=True), fill=MUTED, anchor="lt")
    draw_centered(draw, "Los plazos importan", f(40, bold=True), PRIMARY, 100)

    t_anim = max(0, t - 0.3)
    fade = ease_out(min(1.0, t_anim / 0.6))
    panel_c = blend_color(DARK_PANEL, fade)

    box_w = 460
    box_h = 320
    box1_x = 160
    box2_x = W - box1_x - box_w
    box_y = 220

    # Izquierda: 30 días
    draw.rectangle([box1_x, box_y, box1_x + box_w, box_y + box_h],
                   fill=panel_c, outline=SECONDARY, width=3)
    draw.text((box1_x + box_w // 2, box_y + 40), "RESPUESTA AL TITULAR",
              font=f(20, bold=True), fill=SECONDARY, anchor="mm")
    draw.text((box1_x + box_w // 2, box_y + 130), "30 días",
              font=f(80, bold=True), fill=SECONDARY, anchor="mm")
    draw.text((box1_x + box_w // 2, box_y + 210), "corridos · prorrogables",
              font=f(20), fill=TEXT, anchor="mm")
    draw.text((box1_x + box_w // 2, box_y + 240), "una sola vez",
              font=f(20), fill=TEXT, anchor="mm")
    draw.text((box1_x + box_w // 2, box_y + 280), "Art. 11",
              font=f(22, bold=True, mono=True), fill=PRIMARY, anchor="mm")

    # Derecha: brechas
    draw.rectangle([box2_x, box_y, box2_x + box_w, box_y + box_h],
                   fill=panel_c, outline=WARN, width=3)
    draw.text((box2_x + box_w // 2, box_y + 40), "BRECHAS DE SEGURIDAD",
              font=f(20, bold=True), fill=WARN, anchor="mm")
    draw.text((box2_x + box_w // 2, box_y + 130), "Sin dilaciones",
              font=f(56, bold=True), fill=WARN, anchor="mm")
    draw.text((box2_x + box_w // 2, box_y + 200), "indebidas",
              font=f(44, bold=True), fill=WARN, anchor="mm")
    draw.text((box2_x + box_w // 2, box_y + 260), "Notificar Agencia + titulares",
              font=f(18), fill=TEXT, anchor="mm")
    draw.text((box2_x + box_w // 2, box_y + 290), "Art. 14 sexies",
              font=f(22, bold=True, mono=True), fill=PRIMARY, anchor="mm")
    return img


def scene10_caso_brecha(t):
    img = make_canvas()
    draw = ImageDraw.Draw(img)
    draw.text((40, 30), "09 — CASO PRÁCTICO",
              font=f(14, bold=True, mono=True), fill=MUTED, anchor="lt")
    draw_centered(draw, "Brecha con 500 clientes", f(40, bold=True), WARN, 100)
    draw_centered(draw, "Una empresa sufre una vulneración que compromete datos de 500 clientes",
                  f(20), MUTED, 160)

    pasos = [
        ("1. REGISTRAR", "Documentar la vulneración\nen cuanto se detecta", PRIMARY),
        ("2. NOTIFICAR APDP", "A la Agencia 'sin dilaciones\nindebidas'", WARN),
        ("3. COMUNICAR", "A CADA titular afectado\n(párrafo 2º)", HIGHLIGHT),
        ("4. CORREGIR", "Adoptar medidas correctivas\nen 60 días", SECONDARY),
    ]
    box_w = 460
    box_h = 150
    start_x = 160
    start_y = 240
    gap_x = 40
    gap_y = 30

    for i, (head, body, color) in enumerate(pasos):
        row = i // 2
        col = i % 2
        x1 = start_x + col * (box_w + gap_x)
        y1 = start_y + row * (box_h + gap_y)
        delay = i * 0.3
        bt = max(0, t - 0.3 - delay)
        bf = ease_out(min(1.0, bt / 0.5))
        if bf <= 0:
            continue
        outline_c = blend_color(color, bf)
        draw.rectangle([x1, y1, x1 + box_w, y1 + box_h],
                       fill=DARK_PANEL, outline=outline_c, width=3)
        draw.text((x1 + 30, y1 + 35), head, font=f(28, bold=True),
                  fill=color, anchor="lt")
        for j, line in enumerate(body.split("\n")):
            draw.text((x1 + 30, y1 + 80 + j * 28), line,
                      font=f(20), fill=TEXT, anchor="lt")

    if t > 2.0:
        pf = fade_alpha(min(0.5, t - 2.0), 0.5)
        draw.text((W // 2, H - 50), "Art. 14 sexies — Procedimiento obligatorio",
                  font=f(22, bold=True), fill=blend_color(HIGHLIGHT, pf), anchor="mm")
    return img


def scene11_caso_transferencia(t):
    img = make_canvas()
    draw = ImageDraw.Draw(img)
    draw.text((40, 30), "10 — CASO TRANSFERENCIA",
              font=f(14, bold=True, mono=True), fill=MUTED, anchor="lt")
    draw_centered(draw, "Mover datos a SaaS en EE.UU.", f(36, bold=True), PRIMARY, 100)
    draw_centered(draw, "¿Opciones legales?", f(22), MUTED, 160)

    opciones = [
        ("OPCIÓN 1", "Consentimiento expreso\ndel titular", "para ESA transferencia", SECONDARY),
        ("OPCIÓN 2", "Cláusulas contractuales\nvinculantes", "entre responsable y proveedor", PRIMARY),
        ("OPCIÓN 3", "Esperar adecuación", "EE.UU. NO la tiene hoy", HIGHLIGHT),
        ("OPCIÓN 4", "No hacer nada", "→ ILEGAL · multa hasta 20.000 UTM", WARN),
    ]
    box_w = 540
    box_h = 100
    start_x = 100
    start_y = 220
    gap_y = 18

    for i, (head, title, sub, color) in enumerate(opciones):
        delay = i * 0.25
        ot = max(0, t - 0.3 - delay)
        of = ease_out(min(1.0, ot / 0.5))
        if of <= 0:
            continue
        outline_c = blend_color(color, of)
        x1 = start_x
        y1 = start_y + i * (box_h + gap_y)
        draw.rectangle([x1, y1, x1 + box_w, y1 + box_h],
                       fill=DARK_PANEL, outline=outline_c, width=3)
        draw.text((x1 + 25, y1 + 30), head, font=f(20, bold=True),
                  fill=color, anchor="lt")
        for j, line in enumerate(title.split("\n")):
            draw.text((x1 + 25, y1 + 60 + j * 22), line,
                      font=f(20, bold=True), fill=TEXT, anchor="lt")
        for j, line in enumerate(sub.split("\n")):
            draw.text((x1 + box_w - 25, y1 + 50 + j * 22), line,
                      font=f(18), fill=MUTED, anchor="rm")

    if t > 2.0:
        pf = fade_alpha(min(0.5, t - 2.0), 0.5)
        draw.text((W // 2, H - 50), "Art. 27 y 28 — Sin mecanismo legal = infracción grave",
                  font=f(22, bold=True), fill=blend_color(HIGHLIGHT, pf), anchor="mm")
    return img


def scene12_checklist(t):
    img = make_canvas()
    draw = ImageDraw.Draw(img)
    draw.text((40, 30), "11 — CHECKLIST",
              font=f(14, bold=True, mono=True), fill=MUTED, anchor="lt")
    draw_centered(draw, "Tu plan de implementación", f(40, bold=True), SECONDARY, 100)

    items = [
        "Verificar si requieres DPO de forma obligatoria",
        "Implementar proceso de evaluación de impacto (EIPD)",
        "Actualizar cláusulas de contratos con terceros",
        "Implementar mecanismos de consentimiento explícito",
        "Realizar auditoría de seguridad de datos",
        "Definir procedimiento interno de notificación de brechas",
    ]
    start_y = 200
    line_h = 55
    for i, item in enumerate(items):
        delay = i * 0.25
        it = max(0, t - 0.3 - delay)
        itf = ease_out(min(1.0, it / 0.5))
        if itf <= 0:
            continue
        y = start_y + i * line_h
        cb_x, cb_y = 180, y
        cb_size = 32
        if it > 0.4:
            cf = ease_out(min(1.0, (it - 0.4) / 0.3))
            draw.rectangle([cb_x, cb_y, cb_x + cb_size, cb_y + cb_size],
                           outline=SECONDARY, width=3)
            if cf > 0.3:
                draw.line([(cb_x + 6, cb_y + 16), (cb_x + 13, cb_y + 24)],
                          fill=SECONDARY, width=4)
                draw.line([(cb_x + 13, cb_y + 24), (cb_x + 27, cb_y + 8)],
                          fill=SECONDARY, width=4)
        else:
            draw.rectangle([cb_x, cb_y, cb_x + cb_size, cb_y + cb_size],
                           outline=MUTED, width=3)
        draw.text((cb_x + 60, y + 16), item, font=f(22), fill=TEXT, anchor="lm")
    return img


def scene13_cierre(t):
    img = make_canvas()
    draw = ImageDraw.Draw(img)
    draw.text((40, 30), "12 — CIERRE",
              font=f(14, bold=True, mono=True), fill=MUTED, anchor="lt")

    if t > 0.2:
        fade = fade_alpha(min(0.6, t - 0.2), 0.6)
        draw.text((W // 2, 250), "Esta ley ya no es opcional.",
                  font=f(50, bold=True), fill=blend_color(PRIMARY, fade), anchor="mm")
    if t > 1.0:
        fade = fade_alpha(min(0.5, t - 1.0), 0.5)
        draw.text((W // 2, 340), "La fecha clave ya está escrita.",
                  font=f(28), fill=blend_color(TEXT, fade), anchor="mm")
    if t > 1.5:
        fade = fade_alpha(min(0.6, t - 1.5), 0.6)
        for r in range(60, 8, -4):
            draw.ellipse([W // 2 - r, 440 - r, W // 2 + r, 440 + r],
                         outline=blend_color(WARN, fade), width=2)
        bg_c = blend_color(WARN, fade * 0.3)
        draw.rectangle([W // 2 - 220, 410, W // 2 + 220, 470],
                       fill=bg_c, outline=blend_color(WARN, fade), width=3)
        draw.text((W // 2, 440), "1 · DICIEMBRE · 2026",
                  font=f(36, bold=True, mono=True),
                  fill=blend_color(HIGHLIGHT, fade), anchor="mm")
    if t > 2.5:
        fade = fade_alpha(min(0.5, t - 2.5), 0.5)
        draw.text((W // 2, 560), "Empieza hoy.",
                  font=f(36, bold=True), fill=blend_color(SECONDARY, fade), anchor="mm")
        draw.text((W // 2, 610), "Te vemos en el siguiente módulo del curso.",
                  font=f(22), fill=blend_color(MUTED, fade), anchor="mm")
    return img


SCENES = [
    ("01_hook", 8, scene1_hook),
    ("02_contexto", 12, scene2_contexto),
    ("03_cambio", 15, scene3_cambio),
    ("04_dpo", 18, scene4_dpo),
    ("05_seguridad", 18, scene5_seguridad),
    ("06_eipd", 18, scene6_eipd),
    ("07_transferencias", 22, scene7_transferencias),
    ("08_sanciones", 22, scene8_sanciones),
    ("09_plazos", 18, scene9_plazos),
    ("10_caso_brecha", 35, scene10_caso_brecha),
    ("11_caso_transferencia", 30, scene11_caso_transferencia),
    ("12_checklist", 20, scene12_checklist),
    ("13_cierre", 12, scene13_cierre),
]


def main():
    target = sys.argv[1] if len(sys.argv) > 1 else None
    # Borrar frames viejos para que no haya mezclas
    if target is None:
        import shutil
        shutil.rmtree(OUT_DIR, ignore_errors=True)
        OUT_DIR.mkdir(parents=True, exist_ok=True)
    for scene_id, duration, fn in SCENES:
        if target and target != scene_id:
            continue
        write_frames(scene_id, duration, fn)
    print(f"\nListo. Total: {len(SCENES)} escenas.")
    total_dur = sum(d for _, d, _ in SCENES)
    print(f"Duración total: {total_dur}s ({total_dur//60}:{total_dur%60:02d})")


if __name__ == "__main__":
    main()