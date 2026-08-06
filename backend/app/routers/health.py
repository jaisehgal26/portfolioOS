from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.deps.auth import verify_cron_secret
from app.deps.rate_limit import rate_limit_dep
from app.models.health import HealthCheckLatest
from app.schemas.health import (
    HealthCronResponse,
    HealthCronResultItem,
    HealthServiceStatus,
    HealthStatusResponse,
)
from app.services.health_checker import run_health_checks

router = APIRouter(prefix="/api/v1/health", tags=["health"])


@router.get("/status", response_model=HealthStatusResponse)
async def health_status(
    db: AsyncSession = Depends(get_db),
    _: None = Depends(rate_limit_dep("public_read")),
) -> HealthStatusResponse:
    result = await db.execute(select(HealthCheckLatest))
    rows = result.scalars().all()
    services = [
        HealthServiceStatus(
            target_key=row.target_key,
            url=row.url,
            status=row.status,
            status_code=row.status_code,
            latency_ms=row.latency_ms,
            error_message=row.error_message,
            checked_at=row.checked_at,
        )
        for row in rows
    ]
    return HealthStatusResponse(services=services)


@router.get("/cron", response_model=HealthCronResponse, dependencies=[Depends(verify_cron_secret)])
async def health_cron(db: AsyncSession = Depends(get_db)) -> HealthCronResponse:
    results = await run_health_checks(db)
    return HealthCronResponse(
        checked=len(results),
        results=[
            HealthCronResultItem(
                target_key=r["target_key"],
                status=r["status"],
                latency_ms=r["latency_ms"],
            )
            for r in results
        ],
    )
