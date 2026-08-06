from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.deps.rate_limit import rate_limit_dep
from app.models.contact import ContactSubmission
from app.schemas.contact import ContactCreate, ContactResponse
from app.services.email import send_contact_emails

router = APIRouter(prefix="/api/v1", tags=["contact"])


@router.post("/contact", response_model=ContactResponse, status_code=status.HTTP_201_CREATED)
async def submit_contact(
    payload: ContactCreate,
    db: AsyncSession = Depends(get_db),
    _: None = Depends(rate_limit_dep("contact_write")),
) -> ContactSubmission:
    submission = ContactSubmission(
        name=payload.name,
        email=payload.email,
        subject=payload.subject,
        message=payload.message,
    )
    try:
        db.add(submission)
        await db.commit()
        await db.refresh(submission)
    except SQLAlchemyError:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to save your message. Please try again later.",
        ) from None

    await send_contact_emails(
        name=payload.name,
        email=payload.email,
        subject=payload.subject,
        message=payload.message,
    )

    return submission
