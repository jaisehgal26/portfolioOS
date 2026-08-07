"""Signed admin session tokens (stdlib only — no JWT dependency)."""

from __future__ import annotations

import base64
import hashlib
import hmac
import json
import time
from secrets import compare_digest

SESSION_TTL_SECONDS = 7 * 24 * 3600


def create_admin_token(username: str, secret: str, ttl_seconds: int = SESSION_TTL_SECONDS) -> str:
    payload = {"sub": username, "exp": int(time.time()) + ttl_seconds}
    payload_b64 = (
        base64.urlsafe_b64encode(json.dumps(payload, separators=(",", ":")).encode())
        .decode()
        .rstrip("=")
    )
    sig = hmac.new(secret.encode(), payload_b64.encode(), hashlib.sha256).hexdigest()
    return f"{payload_b64}.{sig}"


def verify_admin_token(token: str, secret: str) -> str | None:
    try:
        payload_b64, sig = token.rsplit(".", 1)
        expected = hmac.new(secret.encode(), payload_b64.encode(), hashlib.sha256).hexdigest()
        if not compare_digest(sig, expected):
            return None
        padded = payload_b64 + "=" * (-len(payload_b64) % 4)
        payload = json.loads(base64.urlsafe_b64decode(padded))
        if int(payload.get("exp", 0)) < time.time():
            return None
        sub = payload.get("sub")
        return sub if isinstance(sub, str) else None
    except (ValueError, json.JSONDecodeError, TypeError):
        return None
