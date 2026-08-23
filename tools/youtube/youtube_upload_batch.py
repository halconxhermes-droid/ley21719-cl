#!/usr/bin/env python3
"""Sube los 10 videos del curso Ley 21.719 a YouTube como Unlisted."""
import json
import sys
import time
from pathlib import Path

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload

HERE = Path(__file__).parent
TOKEN_FILE = HERE / "youtube_token.json"


def get_creds() -> Credentials:
    payload = json.loads(TOKEN_FILE.read_text())
    creds = Credentials(
        token=payload.get("token"),
        refresh_token=payload.get("refresh_token"),
        token_uri="https://oauth2.googleapis.com/token",
        client_id=payload.get("client_id"),
        client_secret=payload.get("client_secret"),
        scopes=payload.get("scopes"),
    )
    if not creds.valid:
        creds.refresh(Request())
        payload["token"] = creds.token
        TOKEN_FILE.write_text(json.dumps(payload, indent=2), encoding="utf-8")
    return creds


def build_service():
    creds = get_creds()
    return build("youtube", "v3", credentials=creds)


def upload_video(yt, video_path: Path, title: str, description: str, tags: list, playlist_id: str = None) -> str:
    """Sube un video y devuelve video_id."""
    body = {
        "snippet": {
            "title": title,
            "description": description,
            "tags": tags,
            "categoryId": "27",  # Education
            "defaultLanguage": "es",
            "defaultAudioLanguage": "es",
        },
        "status": {
            "privacyStatus": "unlisted",  # NO LISTADO
            "selfDeclaredMadeForKids": False,
        },
    }
    media = MediaFileUpload(str(video_path), chunksize=-1, resumable=True, mimetype="video/mp4")
    request = yt.videos().insert(part="snippet,status", body=body, media_body=media)

    response = None
    while response is None:
        status, response = request.next_chunk()
        if status:
            print(f"  {video_path.name}: {int(status.progress() * 100)}%")

    video_id = response["id"]
    print(f"  ✅ Subido: {title} (ID: {video_id})")

    # Agregar a playlist si existe
    if playlist_id:
        yt.playlistItems().insert(
            part="snippet",
            body={
                "snippet": {
                    "playlistId": playlist_id,
                    "resourceId": {"kind": "youtube#video", "videoId": video_id},
                }
            },
        ).execute()

    return video_id


def upload_captions(yt, video_id: str, caption_path: Path, language: str = "es"):
    """Sube archivo de subtítulos (SRT/VTT/TXT)."""
    if not caption_path.exists():
        return
    media = MediaFileUpload(str(caption_path), mimetype="text/plain", resumable=False)
    yt.captions().insert(
        part="snippet",
        body={
            "snippet": {
                "videoId": video_id,
                "language": language,
                "name": caption_path.stem,
                "isDraft": False,
            }
        },
        media_body=media,
    ).execute()
    print(f"    📝 Subtítulos subidos: {caption_path.name}")


def create_playlist(yt, title: str, description: str) -> str:
    """Crea playlist y devuelve ID."""
    resp = yt.playlists().insert(
        part="snippet,status",
        body={
            "snippet": {"title": title, "description": description},
            "status": {"privacyStatus": "unlisted"},
        },
    ).execute()
    return resp["id"]


def main():
    yt = build_service()

    # Cargar manifest con metadata de videos
    manifest = json.loads(Path("/opt/data/ley21719-cl/media/manifest.json").read_text())
    videos_dir = Path("/opt/data/ley21719-cl/media/videos")
    transcripts_dir = Path("/opt/data/ley21719-cl/docs/transcripts")

    # Crear playlist del curso
    playlist_id = create_playlist(
        yt,
        "Ley 21.719 - Protección de Datos Personales (Curso completo)",
        "Curso educativo de 10 videos sobre la Ley 21.719 de Protección de Datos Personales de Chile. "
        "Vigencia plena: 1 de diciembre de 2026. Material preparado por Hermes Agent."
    )
    print(f"📋 Playlist creada: {playlist_id}")

    # Subir cada video en orden
    results = []
    for v in manifest["videos"]:
        # El manifest usa ruta relativa desde media/ y clave "archivo"
        video_rel = v.get("archivo") or v.get("file")
        if not video_rel:
            print(f"⚠️ Sin clave 'archivo' en manifest item: {v}")
            continue
        video_file = Path("/opt/data/ley21719-cl/media") / video_rel
        if not video_file.exists():
            print(f"⚠️ No encontrado: {video_file}")
            continue

        # Buscar transcripción: usa campo "transcript" del manifest
        transcript_rel = v.get("transcript")
        if transcript_rel:
            transcript_file = Path("/opt/data/ley21719-cl") / transcript_rel
        else:
            # Fallback: buscar por número en transcripts/
            num = Path(video_rel).name.split("-")[0]
            transcript_files = list(transcripts_dir.glob(f"*{num}*.txt"))
            transcript_file = transcript_files[0] if transcript_files else None

        # Construir descripción enriquecida (el manifest usa claves en español)
        titulo = v.get("titulo") or v.get("title") or Path(video_rel).stem
        desc = f"""{titulo}

📚 Tema: {v.get("tema", "Ley 21.719")}
⏱ Duración: {v.get("duracion_s", "?")} segundos

🔗 La Ley 21.719 de Protección de Datos Personales de Chile entra en vigencia plena el 1 de diciembre de 2026.

📌 Contenido relacionado:
- Derechos ARSOP del titular (acceso, rectificación, supresión, oposición, portabilidad)
- Consentimiento y sus tipos
- Datos sensibles y biometría
- Notificación de brechas de seguridad
- Evaluación de Impacto de Protección de Datos (EIPD)
- Sanciones y fiscalización

📅 Vigencia plena: 1 diciembre 2026 | Reemplaza a la Ley 19.628
🎓 Curso: Ley 21.719 - Protección de Datos Personales Chile

#Ley21719 #ProteccionDeDatos #Chile #Privacidad #DatosPersonales"""

        tags = [
            "Ley 21.719", "Protección de Datos Personales", "Chile", "Privacidad",
            "Datos Personales", "APDP", "Derechos ARSOP", "EIPD", "Brecha de seguridad",
            "Curso educativo", "NotebookLM"
        ] + v.get("tags", [])

        video_id = upload_video(yt, video_file, titulo, desc, tags, playlist_id)

        # Subir subtítulos si existe transcripción
        if transcript_file:
            upload_captions(yt, video_id, transcript_file)

        results.append({"video_id": video_id, "title": titulo, "file": str(video_file.name)})
        time.sleep(2)  # Respetar cuotas

    print(json.dumps({"playlist_id": playlist_id, "videos": results}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()