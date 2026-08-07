from fastapi import Header, HTTPException, Query, status

from app.config import get_settings


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


async def verify_admin_key(x_admin_key: str = Header(..., alias="X-Admin-Key")) -> None:
    settings = get_settings()
    if not settings.admin_api_key or x_admin_key != settings.admin_api_key:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized")
