"""
Genera narración TTS para cada escena y compone el video final.

Uso:
    python compose_video.py

Lee frames de out/frames/, genera TTS por bloque, sincroniza con audio,
quema subtítulos y ensambla en out/ley21719-empresa-preview.mp4 (720p) y
out/ley21719-empresa-hd.mp4 (1080p).
"""
from __future__ import annotations
import os
import sys
import json
import subprocess
from pathlib import Path
from typing import List, Dict, Any
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).parent
sys.path.insert(0, str(ROOT / "render"))
from anim import W, H, BG, TEXT, MUTED, FONT_DIR

FPS = 30
OUT_DIR = ROOT / "out"
FRAMES_DIR = OUT_DIR / "frames"
AUDIO_DIR = OUT_DIR / "audio"
AUDIO_DIR.mkdir(parents=True, exist_ok=True)

# === NARRACIÓN (mismo texto del plan.md) ===
SCENES_WITH_NARRATION = [
    ("01_hook", 8.0, "¿Puede tu empresa demostrar HOY que cumple la Ley 21.719? Si la respuesta es no, tienes hasta el primero de diciembre de 2026 para reaccionar."),
    ("02_contexto", 12.0, "La Ley 19.628 quedó atrás. La nueva Ley 21.719 es un cambio de paradigma. Entra en vigencia plena el primero de diciembre de 2026, y desde ese día la Agencia de Protección de Datos Personales va a fiscalizar."),
    ("03_cambio", 15.0, "El cambio clave: antes esperabas a que te pillaran. Hoy tienes que demostrar que cumples. Es responsabilidad proactiva. Eso lo dice el Artículo 49."),
    ("04_dpo", 18.0, "Primera obligación: designar un delegado de protección de datos. El Artículo 50 lo permite de forma voluntaria. El Artículo 49 exige un modelo de prevención de infracciones. Si tienes datos sensibles o alto volumen, el DPO ya no es opcional."),
    ("05_seguridad", 18.0, "Segunda: medidas de seguridad. Artículos 14 bis y 14 quinquies. No es solo un antivirus. Son controles técnicos y organizativos proporcionales al riesgo."),
    ("06_eipd", 18.0, "Tercera: evaluación de impacto, la EIPD. Artículo 15 ter. Obligatoria cuando el tratamiento sea probablemente de alto riesgo. Sin EIPD, no hay tratamiento legal."),
    ("07_transferencias", 22.0, "Cuarta: transferencias internacionales. Artículo 27. Sin cláusulas contractuales, sin consentimiento expreso, sin país con adecuación, la transferencia a Estados Unidos hoy es ilegal."),
    ("08_sanciones", 22.0, "Las sanciones duelen. Desde cinco mil UTM, hasta dos a cuatro por ciento de los ingresos anuales. Artículos 35 y 37. No es un costo menor."),
    ("09_plazos", 18.0, "Los plazos también importan. Treinta días corridos, prorrogables una vez, para responder al titular. Artículo 11. Y notificación sin dilaciones indebidas para para brechas. Artículo 14 sexies."),
    ("10_caso_brecha", 35.0, "Caso real. Una empresa sufre una brecha con quinientos clientes. ¿Qué hacer? Primero, registrar la vulneración. Segundo, notificar a la Agencia sin dilaciones. Tercero, comunicar a cada titular afectado. Cuarto, adoptar medidas correctivas en sesenta días."),
    ("11_caso_transferencia", 30.0, "Otro caso. Quieres mover datos a un proveedor SAAS en Estados Unidos. ¿Opciones? Primero, consentimiento expreso del titular. Segundo, cláusulas contractuales vinculantes. Tercero, esperar a que Estados Unidos tenga adecuación. Hoy no la tiene. Cuarta: no hacer nada. La cuarta opción te convierte en infractor. Artículo 27 y 28."),
    ("12_checklist", 20.0, "Tu checklist de implementación. Verificar si requieres un DPO de forma obligatoria. Implementar el proceso de EIPD. Actualizar contratos con terceros. Mecanismos de consentimiento explícito. Auditoría de seguridad. Y procedimiento interno para notificación de brechas."),
    ("13_cierre", 12.0, "Esta ley ya no es opcional. La fecha clave ya está escrita: primero de diciembre de 2026. Empieza hoy. Te vemos en el siguiente módulo del curso."),
]


def gen_tts_edge(text: str, output_path: Path, voice: str = "es-ES-ElviraNeural") -> bool:
    """Genera TTS usando edge-tts (gratis, sin API key)."""
    try:
        import edge_tts
        import asyncio
        async def _speak():
            communicate = edge_tts.Communicate(text, voice)
            await communicate.save(str(output_path))
        asyncio.run(_speak())
        return output_path.exists() and output_path.stat().st_size > 100
    except Exception as e:
        print(f"  edge-tts error: {e}")
        return False


def get_audio_duration(path: Path) -> float:
    """Lee duración del audio con ffprobe."""
    try:
        out = subprocess.check_output([
            "ffprobe", "-v", "error", "-show_entries", "format=duration",
            "-of", "default=noprint_wrappers=1:nokey=1", str(path)
        ], stderr=subprocess.DEVNULL).decode().strip()
        return float(out)
    except Exception:
        return 0.0


def render_subtitle_frame(text: str, size: tuple = (W, H)) -> Image.Image:
    """Crea un frame PIL con subtítulo centrado abajo (estilo karaoke)."""
    img = Image.new("RGBA", size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    font = ImageFont.truetype(f"{FONT_DIR}/DejaVuSans-Bold.ttf", 36)
    # caja semitransparente
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


def assemble_scene_video(scene_id: str, narration_text: str, duration: float, out_path: Path):
    """Compone video de una escena: frames + audio TTS + subtítulos quemados."""
    frame_dir = FRAMES_DIR / scene_id
    if not frame_dir.exists():
        print(f"  ✗ No frames para {scene_id}")
        return False

    # 1. Generar TTS
    audio_path = AUDIO_DIR / f"{scene_id}.mp3"
    print(f"  → TTS {scene_id}: {len(narration_text)} chars")
    if not gen_tts_edge(narration_text, audio_path):
        print(f"  ✗ TTS falló para {scene_id}")
        return False

    audio_dur = get_audio_duration(audio_path)
    # Si el audio es más largo que la escena, lo limitamos (cortamos al final)
    if audio_dur > duration:
        # Re-codificar audio truncado
        truncated = AUDIO_DIR / f"{scene_id}_trunc.mp3"
        subprocess.run([
            "ffmpeg", "-y", "-i", str(audio_path),
            "-t", str(duration), "-c", "copy", str(truncated)
        ], check=True, stderr=subprocess.DEVNULL, stdout=subprocess.DEVNULL)
        audio_path = truncated
        audio_dur = duration
    # Si es más corto, no pasa nada (el video durará según frames)

    # 2. Generar subtítulo como PNG temporal (un solo subtítulo por escena)
    sub_img = render_subtitle_frame(narration_text)
    sub_path = AUDIO_DIR / f"{scene_id}_subtitle.png"
    sub_img.save(sub_path)

    # 3. Calcular duración efectiva
    effective_duration = max(duration, audio_dur)
    target_frames = int(effective_duration * FPS)

    # 4. Construir video con FFmpeg
    # - loop frames hasta target_frames
    # - overlay subtítulo desde t=0 hasta t=audio_dur
    # - agregar audio

    # Pre-procesar frames a video base sin subtítulo
    base_video = AUDIO_DIR / f"{scene_id}_base.mp4"
    cmd_base = [
        "ffmpeg", "-y",
        "-framerate", str(FPS),
        "-i", str(frame_dir / "frame_%05d.png"),
        "-t", str(effective_duration),
        "-vf", f"scale={W}:{H}:flags=lanczos",
        "-c:v", "libx264",
        "-pix_fmt", "yuv420p",
        "-preset", "veryfast",
        "-crf", "23",
        str(base_video)
    ]
    subprocess.run(cmd_base, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    # Overlay del subtítulo
    if audio_dur > 0:
        cmd_overlay = [
            "ffmpeg", "-y",
            "-i", str(base_video),
            "-i", str(sub_path),
            "-filter_complex",
            f"[1:v]format=rgba,scale={W}:{H}[sub];"
            f"[0:v][sub]overlay=0:0:enable='between(t,0,{audio_dur})'[v]",
            "-map", "[v]",
            "-map", "0:a?",
            "-c:v", "libx264",
            "-pix_fmt", "yuv420p",
            "-preset", "veryfast",
            "-crf", "23",
            "-shortest",
            str(out_path)
        ]
        # Si hay audio, lo agregamos
        cmd_overlay_with_audio = [
            "ffmpeg", "-y",
            "-i", str(base_video),
            "-i", str(sub_path),
            "-i", str(audio_path),
            "-filter_complex",
            f"[1:v]format=rgba,scale={W}:{H}[sub];"
            f"[0:v][sub]overlay=0:0:enable='between(t,0,{audio_dur})'[v]",
            "-map", "[v]",
            "-map", "2:a",
            "-c:v", "libx264",
            "-pix_fmt", "yuv420p",
            "-preset", "veryfast",
            "-crf", "23",
            "-c:a", "aac",
            "-b:a", "128k",
            "-shortest",
            str(out_path)
        ]
        subprocess.run(cmd_overlay_with_audio, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    else:
        # Sin audio, solo video
        cmd = [
            "ffmpeg", "-y",
            "-i", str(base_video),
            "-i", str(sub_path),
            "-filter_complex",
            f"[1:v]format=rgba,scale={W}:{H}[sub];"
            f"[0:v][sub]overlay=0:0[v]",
            "-map", "[v]",
            "-c:v", "libx264",
            "-pix_fmt", "yuv420p",
            "-preset", "veryfast",
            "-crf", "23",
            "-shortest",
            str(out_path)
        ]
        subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    # Limpiar
    base_video.unlink(missing_ok=True)
    if audio_path.name.endswith("_trunc.mp3"):
        audio_path.unlink(missing_ok=True)
    sub_path.unlink(missing_ok=True)
    return True


def main():
    # Espera a que todas las escenas se hayan renderizado
    import time
    expected = {sid: dur for sid, dur, _ in SCENES_WITH_NARRATION}
    print("Esperando frames completos...")
    while True:
        ready = all((FRAMES_DIR / sid).exists() and len(list((FRAMES_DIR / sid).iterdir())) >= int(dur * FPS)
                    for sid, dur in expected.items())
        if ready:
            break
        time.sleep(2)
        sys.stdout.write(".")
        sys.stdout.flush()
    print(" listos\n")

    out_clips = []
    for scene_id, duration, narration in SCENES_WITH_NARRATION:
        out_path = AUDIO_DIR / f"{scene_id}_final.mp4"
        print(f"\n[{scene_id}] dur={duration}s")
        if assemble_scene_video(scene_id, narration, duration, out_path):
            out_clips.append(out_path)
            print(f"  ✓ {out_path.name}")
        else:
            print(f"  ✗ falló {scene_id}")

    # Concatenar todos los clips
    if out_clips:
        concat_file = OUT_DIR / "concat.txt"
        with open(concat_file, "w") as f:
            for clip in out_clips:
                f.write(f"file '{clip}'\n")
        final = OUT_DIR / "ley21719-empresa-preview.mp4"
        cmd = [
            "ffmpeg", "-y",
            "-f", "concat",
            "-safe", "0",
            "-i", str(concat_file),
            "-c", "copy",
            str(final)
        ]
        subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        concat_file.unlink(missing_ok=True)
        print(f"\n✓ Video final: {final}")
        print(f"  Tamaño: {final.stat().st_size / 1e6:.1f} MB")
        # duración total
        total_dur = sum(d for _, d, _ in SCENES_WITH_NARRATION)
        print(f"  Duración nominal: {total_dur:.1f}s ({total_dur//60:.0f}:{total_dur%60:02.0f})")


if __name__ == "__main__":
    main()