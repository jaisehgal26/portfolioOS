import asyncio
import html
import logging

import resend

from app.config import Settings, get_settings

logger = logging.getLogger(__name__)


def _escape(text: str) -> str:
    return html.escape(text)


def _send_notification(
    settings: Settings,
    name: str | None,
    email: str | None,
    message: str,
    is_anonymous: bool,
) -> None:
    display_name = "Anonymous" if is_anonymous else (name or "Anonymous")
    email_line = (
        f"<p><strong>Email:</strong> {_escape(email)}</p>"
        if email and not is_anonymous
        else "<p><strong>Email:</strong> not provided</p>"
    )
    resend.Emails.send(
        {
            "from": settings.resend_from_email,
            "to": [settings.notify_email],
            "reply_to": email if email and not is_anonymous else settings.notify_email,
            "subject": f"New guestbook message from {display_name}",
            "html": f"""
                <h2>New guestbook submission (pending moderation)</h2>
                <p><strong>Name:</strong> {_escape(display_name)}</p>
                {email_line}
                <p><strong>Message:</strong></p>
                <p style="white-space:pre-wrap">{_escape(message)}</p>
            """,
        }
    )


async def send_guestbook_notification(
    name: str | None,
    email: str | None,
    message: str,
    is_anonymous: bool,
) -> None:
    settings = get_settings()
    if not settings.resend_api_key:
        logger.warning("RESEND_API_KEY not set; skipping guestbook notification")
        return

    resend.api_key = settings.resend_api_key

    try:
        await asyncio.to_thread(
            _send_notification,
            settings,
            name,
            email,
            message,
            is_anonymous,
        )
    except Exception:
        logger.exception("Failed to send guestbook notification")
