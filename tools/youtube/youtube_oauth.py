#!/usr/bin/env python3
"""Genera la URL de autorización OAuth para YouTube Data API v3.

Flujo manual headless con PKCE: guarda el code_verifier en oauth_state.json
para que youtube_exchange.py pueda completar el intercambio.
"""
import json
import sys
from pathlib import Path

from google_auth_oauthlib.flow import Flow

HERE = Path(__file__).parent
CLIENT_SECRET = HERE / "client_secret.json"
STATE_FILE = HERE / "oauth_state.json"

SCOPES = [
    "https://www.googleapis.com/auth/youtube.upload",
    "https://www.googleapis.com/auth/youtube.readonly",
    "https://www.googleapis.com/auth/youtube.force-ssl",
]

REDIRECT_URI = "http://localhost:1"


def main() -> None:
    if not CLIENT_SECRET.exists():
        sys.exit(f"Falta {CLIENT_SECRET}")

    flow = Flow.from_client_secrets_file(
        str(CLIENT_SECRET), scopes=SCOPES, redirect_uri=REDIRECT_URI
    )
    # Generar un verificador PKCE propio y persistirlo junto al state,
    # porque el flujo es de 2 procesos (generar URL aqui / intercambiar despues).
    import hashlib
    import base64
    verifier = base64.urlsafe_b64encode(__import__("secrets").token_bytes(64)).rstrip(b"=").decode()
    challenge = base64.urlsafe_b64encode(hashlib.sha256(verifier.encode()).digest()).rstrip(b"=").decode()

    state = __import__("secrets").token_urlsafe(24)
    auth_url, _ = flow.authorization_url(
        access_type="offline",
        include_granted_scopes="true",
        prompt="consent",
        state=state,
        code_challenge=challenge,
        code_challenge_method="S256",
    )
    STATE_FILE.write_text(json.dumps({"state": state, "code_verifier": verifier}), encoding="utf-8")
    print(json.dumps({"auth_url": auth_url}, ensure_ascii=False))


if __name__ == "__main__":
    main()
