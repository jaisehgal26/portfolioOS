from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.deps.auth import verify_admin_key
from app.models.guestbook import GuestbookEntry
from app.schemas.guestbook import (
    GuestbookAdminItem,
    GuestbookAdminListResponse,
    GuestbookStatusUpdate,
)

router = APIRouter(
    prefix="/api/v1/admin",
    tags=["admin"],
    dependencies=[Depends(verify_admin_key)],
)


@router.get("/guestbook", response_model=GuestbookAdminListResponse)
async def admin_list_guestbook(
    status: str = Query(default="pending"),
    db: AsyncSession = Depends(get_db),
) -> GuestbookAdminListResponse:
    if status not in ("pending", "approved", "rejected"):
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Invalid status")

    result = await db.execute(
        select(GuestbookEntry)
        .where(GuestbookEntry.status == status)
        .order_by(GuestbookEntry.created_at.desc())
    )
    entries = result.scalars().all()
    return GuestbookAdminListResponse(
        items=[GuestbookAdminItem.model_validate(e) for e in entries]
    )


@router.patch("/guestbook/{entry_id}", response_model=GuestbookAdminItem)
async def admin_update_guestbook(
    entry_id: UUID,
    payload: GuestbookStatusUpdate,
    db: AsyncSession = Depends(get_db),
) -> GuestbookAdminItem:
    entry = await db.get(GuestbookEntry, entry_id)
    if not entry:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Entry not found")

    entry.status = payload.status
    await db.commit()
    await db.refresh(entry)
    return GuestbookAdminItem.model_validate(entry)
