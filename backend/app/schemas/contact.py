from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, EmailStr, Field


class ContactCreate(BaseModel):
    name: str = Field(min_length=1, max_length=255)
    email: EmailStr
    message: str = Field(min_length=1, max_length=5000)
    subject: str | None = Field(default=None, max_length=255)


class ContactResponse(BaseModel):
    id: UUID
    created_at: datetime

    model_config = {"from_attributes": True}
