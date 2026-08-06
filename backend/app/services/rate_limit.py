import asyncio
import hashlib
import logging

from fastapi import HTTPException, Request, status

from app.config import get_settings

logger = logging.getLogger(__name__)

SCOPE_LIMITS: dict[str, tuple[str, int]] = {
    "contact_write": ("rate_limit_contact", "rate_limit_write_window_seconds"),
    "guestbook_write": ("rate_limit_guestbook", "rate_limit_write_window_seconds"),
    "reactions_write": ("rate_limit_reactions", "rate_limit_write_window_seconds"),
    "public_read": ("rate_limit_public_read", "rate_limit_read_window_seconds"),
}


def get_client_ip(request: Request) -> str:
    forwarded = request.headers.get("x-forwarded-for", "")
    if forwarded:
        return forwarded.split(",")[0].strip()
    if request.client:
        return request.client.host
    return "unknown"


def hash_ip(ip: str) -> str:
    return hashlib.sha256(ip.encode()).hexdigest()[:16]


def _get_redis_client():
    from upstash_redis import Redis

    settings = get_settings()
    return Redis(url=settings.upstash_redis_rest_url, token=settings.upstash_redis_rest_token)


def _enforce_sync(scope: str, ip_hash: str) -> None:
    settings = get_settings()
    limit_key, window_key = SCOPE_LIMITS[scope]
    limit = getattr(settings, limit_key)
    window = getattr(settings, window_key)

    redis = _get_redis_client()
    key = f"rl:{scope}:{ip_hash}"
    count = redis.incr(key)
    if count == 1:
        redis.expire(key, window)

    if count > limit:
        retry_after = redis.ttl(key)
        if retry_after is None or retry_after < 1:
            retry_after = window
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many requests. Please try again later.",
            headers={"Retry-After": str(retry_after)},
        )


async def enforce_rate_limit(request: Request, scope: str) -> None:
    settings = get_settings()
    if not settings.upstash_redis_rest_url or not settings.upstash_redis_rest_token:
        logger.debug("Upstash not configured; skipping rate limit for scope=%s", scope)
        return

    ip_hash = hash_ip(get_client_ip(request))
    await asyncio.to_thread(_enforce_sync, scope, ip_hash)
