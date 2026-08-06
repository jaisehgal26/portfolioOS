from fastapi import APIRouter, Depends, Query, Request, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.deps.rate_limit import rate_limit_dep
from app.models.guestbook import GuestbookEntry
from app.schemas.guestbook import (
    GuestbookCreate,
    GuestbookPublicItem,
    GuestbookPublicListResponse,
    GuestbookSubmitResponse,
)
from app.services.guestbook_notify import send_guestbook_notification
from app.services.rate_limit import get_client_ip, hash_ip

router = APIRouter(prefix="/api/v1", tags=["guestbook"])


def _public_name(entry: GuestbookEntry) -> str:
    if entry.is_anonymous:
        return "Anonymous"
    if entry.name:
        return entry.name
    return "Anonymous"


@router.get("/guestbook", response_model=GuestbookPublicListResponse)
async def list_guestbook(
    limit: int = Query(default=20, ge=1, le=50),
    offset: int = Query(default=0, ge=0),
    db: AsyncSession = Depends(get_db),
    _: None = Depends(rate_limit_dep("public_read")),
) -> GuestbookPublicListResponse:
    total_result = await db.execute(
        select(func.count())
        .select_from(GuestbookEntry)
        .where(GuestbookEntry.status == "approved")
    )
    total = total_result.scalar_one()

    result = await db.execute(
        select(GuestbookEntry)
        .where(GuestbookEntry.status == "approved")
        .order_by(GuestbookEntry.created_at.desc())
        .offset(offset)
        .limit(limit)
    )
    entries = result.scalars().all()

    items = [
        GuestbookPublicItem(
            id=entry.id,
            created_at=entry.created_at,
            name=_public_name(entry),
            message=entry.message,
        )
        for entry in entries
    ]

    return GuestbookPublicListResponse(items=items, total=total, limit=limit, offset=offset)


@router.post("/guestbook", response_model=GuestbookSubmitResponse, status_code=status.HTTP_201_CREATED)
async def submit_guestbook(
    payload: GuestbookCreate,
    request: Request,
    db: AsyncSession = Depends(get_db),
    _: None = Depends(rate_limit_dep("guestbook_write")),
) -> GuestbookSubmitResponse:
    visitor = hash_ip(get_client_ip(request))

    if payload.is_anonymous:
        name = None
        email = None
    else:
        name = payload.name
        email = str(payload.email) if payload.email else None

    entry = GuestbookEntry(
        status="pending",
        name=name,
        email=email,
        message=payload.message.strip(),
        is_anonymous=payload.is_anonymous,
        visitor_hash=visitor,
    )
    db.add(entry)
    await db.commit()
    await db.refresh(entry)

    await send_guestbook_notification(name, email, entry.message, payload.is_anonymous)

    return GuestbookSubmitResponse(id=entry.id, status=entry.status)
