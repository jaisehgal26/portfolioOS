import hashlib

from fastapi import APIRouter, Depends, HTTPException, Query, Request, status
from sqlalchemy import func, select
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import get_settings
from app.constants import REACTION_TARGET_IDS
from app.database import get_db
from app.deps.rate_limit import rate_limit_dep
from app.models.reaction import ReactionEvent
from app.schemas.reaction import (
    ReactionCreate,
    ReactionResponse,
    ReactionCountItem,
    ReactionsListResponse,
)
from app.services.rate_limit import get_client_ip

router = APIRouter(prefix="/api/v1", tags=["reactions"])


def _visitor_hash(request: Request) -> str:
    settings = get_settings()
    ip = get_client_ip(request)
    ua = request.headers.get("user-agent", "")
    raw = f"{ip}|{ua}|{settings.reaction_hash_salt}"
    return hashlib.sha256(raw.encode()).hexdigest()


def _resolve_target_ids(target_type: str, target_id: str | None) -> list[str]:
    allowed = REACTION_TARGET_IDS.get(target_type)
    if allowed is None:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Invalid target_type")

    if target_id:
        if target_id not in allowed:
            raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Invalid target_id")
        return [target_id]

    return sorted(allowed)


async def _count_for_target(
    db: AsyncSession,
    target_type: str,
    target_id: str,
) -> int:
    result = await db.execute(
        select(func.count())
        .select_from(ReactionEvent)
        .where(
            ReactionEvent.target_type == target_type,
            ReactionEvent.target_id == target_id,
        )
    )
    return result.scalar_one()


@router.get("/reactions", response_model=ReactionsListResponse)
async def list_reactions(
    target_type: str = Query(...),
    target_id: str | None = Query(None),
    db: AsyncSession = Depends(get_db),
    _: None = Depends(rate_limit_dep("public_read")),
) -> ReactionsListResponse:
    ids = _resolve_target_ids(target_type, target_id)

    counts: list[ReactionCountItem] = []
    for pid in ids:
        count = await _count_for_target(db, target_type, pid)
        counts.append(ReactionCountItem(target_id=pid, count=count))

    return ReactionsListResponse(target_type=target_type, counts=counts)


@router.post("/reactions", response_model=ReactionResponse)
async def add_reaction(
    payload: ReactionCreate,
    request: Request,
    db: AsyncSession = Depends(get_db),
    _: None = Depends(rate_limit_dep("reactions_write")),
) -> ReactionResponse:
    _resolve_target_ids(payload.target_type, payload.target_id)

    visitor = _visitor_hash(request)
    stmt = (
        insert(ReactionEvent)
        .values(
            target_type=payload.target_type,
            target_id=payload.target_id,
            visitor_hash=visitor,
        )
        .on_conflict_do_nothing(constraint="uq_reaction_events_visitor")
    )
    result = await db.execute(stmt)
    await db.commit()

    already_reacted = result.rowcount == 0
    count = await _count_for_target(db, payload.target_type, payload.target_id)

    return ReactionResponse(
        target_type=payload.target_type,
        target_id=payload.target_id,
        count=count,
        already_reacted=already_reacted,
    )
