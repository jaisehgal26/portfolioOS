from functools import lru_cache
from pathlib import Path
from urllib.parse import parse_qsl, urlencode, urlparse, urlunparse

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

REPO_ROOT = Path(__file__).resolve().parents[2]


def _ensure_https_url(url: str) -> str:
    """Ensure REST/base URLs include a scheme (common Vercel env typo)."""
    cleaned = url.strip()
    if not cleaned:
        return ""
    if cleaned.startswith(("http://", "https://")):
        return cleaned
    return f"https://{cleaned}"


def _env_file() -> Path | None:
    root_env = REPO_ROOT / ".env"
    if root_env.exists():
        return root_env
    legacy_env = REPO_ROOT / "backend" / ".env"
    if legacy_env.exists():
        return legacy_env
    return None


def normalize_database_url(url: str) -> str:
    """Ensure SQLAlchemy async driver and Neon SSL params."""
    if url.startswith("postgresql://"):
        url = url.replace("postgresql://", "postgresql+asyncpg://", 1)
    elif url.startswith("postgres://"):
        url = url.replace("postgres://", "postgresql+asyncpg://", 1)

    parsed = urlparse(url)
    query = dict(parse_qsl(parsed.query, keep_blank_values=True))

    # asyncpg uses `ssl`, not libpq's `sslmode` / `channel_binding`
    query.pop("sslmode", None)
    query.pop("channel_binding", None)

    if parsed.hostname and "neon.tech" in parsed.hostname:
        query["ssl"] = "require"

    return urlunparse(parsed._replace(query=urlencode(query)))


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=_env_file(),
        env_file_encoding="utf-8",
        extra="ignore",
    )

    database_url: str = "postgresql+asyncpg://portfolio:portfolio@localhost:5433/portfolio"
    cors_origins: str = "http://localhost:3000"
    resend_api_key: str = ""
    resend_from_email: str = "JaiOS <onboarding@resend.dev>"
    notify_email: str = "sehgaljai81@gmail.com"

    upstash_redis_rest_url: str = ""
    upstash_redis_rest_token: str = ""
    cron_secret: str = ""
    admin_api_key: str = ""
    reaction_hash_salt: str = "dev-reaction-salt-change-in-production"
    health_self_url: str = "https://jaisehgal.com"

    rate_limit_contact: int = 5
    rate_limit_guestbook: int = 3
    rate_limit_reactions: int = 30
    rate_limit_public_read: int = 120
    rate_limit_write_window_seconds: int = 3600
    rate_limit_read_window_seconds: int = 60

    @field_validator("upstash_redis_rest_url", "health_self_url", mode="before")
    @classmethod
    def normalize_http_urls(cls, value: object) -> object:
        if isinstance(value, str):
            return _ensure_https_url(value)
        return value

    @property
    def async_database_url(self) -> str:
        return normalize_database_url(self.database_url)

    @property
    def sync_database_url(self) -> str:
        """Plain postgresql:// URL for Alembic migrations."""
        url = self.database_url
        if url.startswith("postgresql+asyncpg://"):
            url = url.replace("postgresql+asyncpg://", "postgresql://", 1)
        elif url.startswith("postgres://"):
            url = url.replace("postgres://", "postgresql://", 1)
        return url

    @property
    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
