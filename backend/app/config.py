from functools import lru_cache
from urllib.parse import parse_qsl, urlencode, urlparse, urlunparse

from pydantic_settings import BaseSettings, SettingsConfigDict


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
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    database_url: str = "postgresql+asyncpg://portfolio:portfolio@localhost:5433/portfolio"
    cors_origins: str = "http://localhost:3000"

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
