#!/usr/bin/env python3
"""Sube la serie de 40 videos cortos (Google Flow) a YouTube como UNLISTED.

Lee un manifest JSON: [{"archivo": "/ruta/video.mp4", "num": 1, "titulo": "...", "modulo": "M1"}]
Uso: .venv/bin/python youtube_upload_serie40.py manifest_serie40.json
"""
import json
import re
import sys
import time
from pathlib import Path

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload

HERE = Path(__file__).parent
TOKEN_FILE = HERE / "youtube_token.json"

MODULOS = {
    "M1": "Marco General", "M2": "Agencia APDP", "M3": "Principios",
    "M4": "Derechos ARSOP", "M5": "Consentimiento", "M6": "Menores y Datos Sensibles",
    "M7": "Obligaciones Técnicas", "M8": "Roles e Implementación Web",
    "M9": "Multas y Sanciones", "M10": "Hoja de Ruta 90 días",
}


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


def slug(t: str) -> str:
    t = t.lower()
    t = re.sub(r"[áàä]", "a", t); t = re.sub(r"[éèë]", "e", t)
    t = re.sub(r"[íìï]", "i", t); t = re.sub(r"[óòö]", "o", t)
    t = re.sub(r"[úùü]", "u", t); t = re.sub(r"ñ", "n", t)
    return re.sub(r"[^a-z0-9]+", "-", t).strip("-")[:60]


def main():
    manifest_path = Path(sys.argv[1])
    items = json.loads(manifest_path.read_text())
    yt = build("youtube", "v3", credentials=get_creds())

    # playlist de la serie
    pl = yt.playlists().insert(part="snippet,status", body={
        "snippet": {"title": "Ley 21.719 en 40 videos · Micro-capsulas (10s)",
                     "description": "Serie completa: la Ley 21.719 de Protección de Datos Personales de Chile explicada en 40 cápsulas de 10 segundos. Texto legal validado contra BCN idNorma=1209272."},
        "status": {"privacyStatus": "unlisted"},
    }).execute()
    pl_id = pl["id"]
    print(f"Playlist creada: {pl_id}")

    results = []
    for it in items:
        path = Path(it["archivo"])
        if not path.exists():
            print(f"⚠ falta {path}")
            continue
        mod = MODULOS.get(it.get("modulo"), "")
        titulo = f"{it['num']:02d} · {it['titulo']} | Ley 21.719"
        desc = (
            f"Cápsula {it['num']}/40 — Módulo: {mod}\n\n"
            f"{it.get('descripcion', '')}\n\n"
            "Curso completo: https://proteccion-datoscursos.netlify.app\n"
            "Texto legal: BCN idNorma=1209272. Contenido educativo; no es asesoría legal."
        )
        tags = ["ley 21719", "protección de datos", "chile", "privacidad", "GDPR chileno",
                mod.lower(), f"cápsula {it['num']}"]
        body = {
            "snippet": {"title": titulo, "description": desc, "tags": tags,
                        "categoryId": "27", "defaultLanguage": "es", "defaultAudioLanguage": "es"},
            "status": {"privacyStatus": "unlisted", "selfDeclaredMadeForKids": False},
        }
        media = MediaFileUpload(str(path), chunksize=-1, resumable=True, mimetype="video/mp4")
        req = yt.videos().insert(part="snippet,status", body=body, media_body=media)
        resp = None
        while resp is None:
            st, resp = req.next_chunk()
            if st:
                print(f"  {path.name}: {int(st.progress()*100)}%")
        vid = resp["id"]
        yt.playlistItems().insert(part="snippet", body={
            "snippet": {"playlistId": pl_id,
                        "resourceId": {"kind": "youtube#video", "videoId": vid}},
        }).execute()
        results.append({"num": it["num"], "titulo": it["titulo"], "videoId": vid})
        print(f"✅ {it['num']:02d} {titulo} → {vid}")
        time.sleep(2)  # respiro anti-quota

    out = HERE / "serie40_subidos.json"
    out.write_text(json.dumps(results, ensure_ascii=False, indent=2))
    print(f"\nListo: {len(results)}/40 subidos. IDs en {out}")


if __name__ == "__main__":
    main()
