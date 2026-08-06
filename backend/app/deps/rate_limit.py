from fastapi import Request

from app.services.rate_limit import enforce_rate_limit


def rate_limit_dep(scope: str):
    async def _dep(request: Request) -> None:
        await enforce_rate_limit(request, scope)

    return _dep
