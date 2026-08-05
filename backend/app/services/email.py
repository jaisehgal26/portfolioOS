import asyncio
import html
import logging

import resend

from app.config import Settings, get_settings

logger = logging.getLogger(__name__)


def _escape(text: str) -> str:
    return html.escape(text)


def _send_notification(settings: Settings, name: str, email: str, subject: str | None, message: str) -> None:
    subject_line = subject or "No subject"
    resend.Emails.send(
        {
            "from": settings.resend_from_email,
            "to": [settings.notify_email],
            "reply_to": email,
            "subject": f"New contact message from {name}",
            "html": f"""
                <h2>New contact form submission</h2>
                <p><strong>Name:</strong> {_escape(name)}</p>
                <p><strong>Email:</strong> {_escape(email)}</p>
                <p><strong>Subject:</strong> {_escape(subject_line)}</p>
                <p><strong>Message:</strong></p>
                <p style="white-space:pre-wrap">{_escape(message)}</p>
            """,
        }
    )


def _send_auto_reply(settings: Settings, name: str, email: str, subject: str | None) -> None:
    subject_line = subject or "your message"
    resend.Emails.send(
        {
            "from": settings.resend_from_email,
            "to": [email],
            "reply_to": settings.notify_email,
            "subject": "Thanks for reaching out — Jai Sehgal",
            "html": f"""
                <p>Hi {_escape(name)},</p>
                <p>Thanks for getting in touch about <em>{_escape(subject_line)}</em>.</p>
                <p>I've received your message and will get back to you soon.</p>
                <p>— Jai Sehgal<br><a href="https://jaisehgal.com">jaisehgal.com</a></p>
            """,
        }
    )


async def send_contact_emails(
    name: str,
    email: str,
    subject: str | None,
    message: str,
) -> None:
    settings = get_settings()
    if not settings.resend_api_key:
        logger.warning("RESEND_API_KEY not set; skipping contact emails")
        return

    resend.api_key = settings.resend_api_key

    try:
        await asyncio.gather(
            asyncio.to_thread(_send_notification, settings, name, email, subject, message),
            asyncio.to_thread(_send_auto_reply, settings, name, email, subject),
        )
    except Exception:
        logger.exception("Failed to send contact emails for %s", email)
