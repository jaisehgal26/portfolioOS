from fastapi import APIRouter, HTTPException, Request, status
from secrets import compare_digest

from app.config import get_settings
from app.schemas.admin_auth import AdminLoginRequest, AdminLoginResponse
from app.services.admin_session import SESSION_TTL_SECONDS, create_admin_token
from app.services.rate_limit import get_client_ip
from app.services.turnstile import verify_turnstile_token

router = APIRouter(prefix="/api/v1/admin/auth", tags=["admin-auth"])


@router.post("/login", response_model=AdminLoginResponse)
async def admin_login(payload: AdminLoginRequest, request: Request) -> AdminLoginResponse:
    await verify_turnstile_token(payload.turnstile_token, get_client_ip(request))

    settings = get_settings()
    if not settings.admin_username or not settings.admin_password:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Admin not configured",
        )

    username_ok = compare_digest(payload.username, settings.admin_username)
    password_ok = compare_digest(payload.password, settings.admin_password)
    if not username_ok or not password_ok:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    secret = settings.admin_session_secret
    token = create_admin_token(payload.username, secret)
    return AdminLoginResponse(token=token, expires_in=SESSION_TTL_SECONDS)
