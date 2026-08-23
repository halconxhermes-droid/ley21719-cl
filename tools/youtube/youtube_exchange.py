#!/usr/bin/env python3
"""Intercambia el código de autorización por tokens y guarda youtube_token.json.

Uso: youtube_exchange.py "<URL completa de redirección o solo el code>"
"""
import json
import sys
from pathlib import Path

from google_auth_oauthlib.flow import Flow

HERE = Path(__file__).parent
CLIENT_SECRET = HERE / "client_secret.json"
STATE_FILE = HERE / "oauth_state.json"
TOKEN_FILE = HERE / "youtube_token.json"

SCOPES = [
    "https://www.googleapis.com/auth/youtube.upload",
    "https://www.googleapis.com/auth/youtube.readonly",
    "https://www.googleapis.com/auth/youtube.force-ssl",
]

REDIRECT_URI = "http://localhost:1"


def extract_code(raw: str) -> str:
    raw = raw.strip()
    if "code=" in raw:
        for part in raw.split("code=", 1)[1].split("&"):
            if part:
                return part
    return raw


def main() -> None:
    if len(sys.argv) < 2:
        sys.exit("Uso: youtube_exchange.py <URL_o_code>")
    code = extract_code(sys.argv[1])

    flow = Flow.from_client_secrets_file(
        str(CLIENT_SECRET), scopes=SCOPES, redirect_uri=REDIRECT_URI
    )
    # Recuperar el PKCE verifier persistido por youtube_oauth.py
    stored = json.loads(STATE_FILE.read_text())
    flow.code_verifier = stored["code_verifier"]

    flow.fetch_token(code=code)
    creds = flow.credentials

    client = json.loads(CLIENT_SECRET.read_text())["installed"]
    granted = list(creds.granted_scopes or SCOPES)
    payload = {
        "type": "authorized_user",
        "client_id": client["client_id"],
        "client_secret": client["client_secret"],
        "refresh_token": creds.refresh_token,
        "token": creds.token,
        "scopes": granted,
    }
    TOKEN_FILE.write_text(json.dumps(payload, indent=2), encoding="utf-8")
    print(json.dumps({
        "status": "ok",
        "scopes_otorgados": len(granted),
        "token_file": str(TOKEN_FILE),
        "has_refresh_token": bool(creds.refresh_token),
    }, ensure_ascii=False))


if __name__ == "__main__":
    main()
