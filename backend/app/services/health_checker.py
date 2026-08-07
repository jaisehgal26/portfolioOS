import asyncio
import time
from datetime import datetime, timezone

import httpx
from sqlalchemy import delete
from sqlalchemy.ext.asyncio import AsyncSession

from app.constants import HEALTH_TARGETS
from app.models.health import HealthCheckLatest


async def _check_url(client: httpx.AsyncClient, url: str) -> dict:
    start = time.perf_counter()
    try:
        resp = await client.get(url)
        latency_ms = int((time.perf_counter() - start) * 1000)
        status = "up" if 200 <= resp.status_code < 400 else "down"
        return {
            "status": status,
            "status_code": resp.status_code,
            "latency_ms": latency_ms,
            "error_message": None if status == "up" else f"HTTP {resp.status_code}",
        }
    except httpx.HTTPError as exc:
        latency_ms = int((time.perf_counter() - start) * 1000)
        return {
            "status": "down",
            "status_code": None,
            "latency_ms": latency_ms,
            "error_message": str(exc)[:500],
        }


async def _check_target(client: httpx.AsyncClient, target_key: str, url: str) -> dict:
    result = await _check_url(client, url)
    return {"target_key": target_key, "url": url, **result}


async def run_health_checks(db: AsyncSession) -> list[dict]:
    checked_at = datetime.now(timezone.utc)

    async with httpx.AsyncClient(timeout=10.0, follow_redirects=True) as client:
        tasks = [_check_target(client, key, url) for key, url in HEALTH_TARGETS.items()]
        results = await asyncio.gather(*tasks)

    for row in results:
        existing = await db.get(HealthCheckLatest, row["target_key"])
        if existing:
            existing.url = row["url"]
            existing.status = row["status"]
            existing.status_code = row["status_code"]
            existing.latency_ms = row["latency_ms"]
            existing.error_message = row["error_message"]
            existing.checked_at = checked_at
        else:
            db.add(
                HealthCheckLatest(
                    target_key=row["target_key"],
                    url=row["url"],
                    status=row["status"],
                    status_code=row["status_code"],
                    latency_ms=row["latency_ms"],
                    error_message=row["error_message"],
                    checked_at=checked_at,
                )
            )

    await db.execute(
        delete(HealthCheckLatest).where(HealthCheckLatest.target_key.not_in(list(HEALTH_TARGETS.keys())))
    )
    await db.commit()
    return results
