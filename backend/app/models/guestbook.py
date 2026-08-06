import uuid
from datetime import datetime

from sqlalchemy import Boolean, DateTime, Index, String, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.models.contact import Base


class GuestbookEntry(Base):
    __tablename__ = "guestbook_entries"
    __table_args__ = (
        Index("ix_guestbook_entries_status_created", "status", "created_at"),
    )

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    status: Mapped[str] = mapped_column(String(16), nullable=False, default="pending")
    name: Mapped[str | None] = mapped_column(String(100), nullable=True)
    email: Mapped[str | None] = mapped_column(String(320), nullable=True)
    message: Mapped[str] = mapped_column(String(500), nullable=False)
    is_anonymous: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    visitor_hash: Mapped[str | None] = mapped_column(String(64), nullable=True)
