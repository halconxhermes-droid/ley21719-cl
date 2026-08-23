#!/usr/bin/env python3
"""Verifica el token de YouTube listando el canal propio (youtube.readonly)."""
import json
import sys
from pathlib import Path

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build

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


def main() -> None:
    creds = get_creds()
    yt = build("youtube", "v3", credentials=creds)
    resp = yt.channels().list(part="snippet,statistics,contentDetails", mine=True).execute()
    items = resp.get("items", [])
    if not items:
        print(json.dumps({"status": "sin_canal", "detalle": "la cuenta no tiene canal activo"}, ensure_ascii=False))
        return
    ch = items[0]
    out = {
        "status": "ok",
        "canal": ch["snippet"]["title"],
        "handle": ch["snippet"].get("customUrl"),
        "channel_id": ch["id"],
        "suscriptores": ch["statistics"].get("subscriberCount"),
        "videos": ch["statistics"].get("videoCount"),
    }
    print(json.dumps(out, ensure_ascii=False))


if __name__ == "__main__":
    main()
