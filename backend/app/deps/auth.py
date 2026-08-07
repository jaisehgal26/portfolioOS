from fastapi import Header, HTTPException, Query, status
from secrets import compare_digest

from app.config import get_settings
from app.services.admin_session import verify_admin_token


async def verify_cron_secret(
    authorization: str | None = Header(None),
    secret: str | None = Query(None, description="Cron secret for external schedulers (e.g. cron-job.org)"),
) -> None:
    """Accept Bearer header or ?secret= query param (cron-job.org friendly)."""
    settings = get_settings()
    if not settings.cron_secret:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Cron not configured",
        )

    token: str | None = None
    if authorization and authorization.startswith("Bearer "):
        token = authorization.removeprefix("Bearer ").strip()
    elif secret:
        token = secret.strip()

    if not token or token != settings.cron_secret:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized")


async def verify_admin_key(
    x_admin_key: str | None = Header(None, alias="X-Admin-Key"),
    authorization: str | None = Header(None),
) -> None:
    settings = get_settings()
    if not settings.admin_configured:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Admin not configured",
        )

    if x_admin_key and settings.admin_api_key and compare_digest(x_admin_key, settings.admin_api_key):
        return

    if authorization and authorization.startswith("Bearer "):
        token = authorization.removeprefix("Bearer ").strip()
        if verify_admin_token(token, settings.admin_session_secret):
            return

    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized")
