from datetime import datetime

from pydantic import BaseModel


class HealthServiceStatus(BaseModel):
    target_key: str
    url: str
    status: str
    status_code: int | None
    latency_ms: int | None
    error_message: str | None
    checked_at: datetime


class HealthStatusResponse(BaseModel):
    services: list[HealthServiceStatus]


class HealthCronResultItem(BaseModel):
    target_key: str
    status: str
    latency_ms: int | None


class HealthCronResponse(BaseModel):
    checked: int
    results: list[HealthCronResultItem]
