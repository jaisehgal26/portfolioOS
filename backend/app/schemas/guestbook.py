from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, EmailStr, Field, field_validator


class GuestbookCreate(BaseModel):
    message: str = Field(min_length=1, max_length=500)
    name: str | None = Field(default=None, max_length=100)
    email: EmailStr | None = None
    is_anonymous: bool = False

    @field_validator("name", mode="before")
    @classmethod
    def strip_name(cls, v: str | None) -> str | None:
        if v is None:
            return None
        stripped = v.strip()
        return stripped or None


class GuestbookSubmitResponse(BaseModel):
    id: UUID
    status: str
    message: str = "Thanks — your message is awaiting moderation."


class GuestbookPublicItem(BaseModel):
    id: UUID
    created_at: datetime
    name: str
    message: str


class GuestbookPublicListResponse(BaseModel):
    items: list[GuestbookPublicItem]
    total: int
    limit: int
    offset: int


class GuestbookAdminItem(BaseModel):
    id: UUID
    created_at: datetime
    status: str
    name: str | None
    email: str | None
    message: str
    is_anonymous: bool

    model_config = {"from_attributes": True}


class GuestbookAdminListResponse(BaseModel):
    items: list[GuestbookAdminItem]


class GuestbookStatusUpdate(BaseModel):
    status: str = Field(pattern="^(approved|rejected)$")
