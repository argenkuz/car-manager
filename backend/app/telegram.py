from __future__ import annotations

import httpx
from sqlalchemy import select

from app.config import settings
from app.database import SessionLocal
from app.models import TelegramRecipient


async def send_message(text: str) -> None:
    if not settings.telegram_bot_token:
        return

    db = SessionLocal()
    try:
        recipients = [
            row.telegram_id
            for row in db.scalars(select(TelegramRecipient).order_by(TelegramRecipient.id)).all()
        ]
    finally:
        db.close()

    if not recipients and settings.telegram_chat_id:
        recipients = [int(settings.telegram_chat_id)]

    if not recipients:
        return

    url = f"https://api.telegram.org/bot{settings.telegram_bot_token}/sendMessage"
    async with httpx.AsyncClient(timeout=15) as client:
        for telegram_id in recipients:
            await client.post(url, json={
                "chat_id": telegram_id,
                "text": text,
                "disable_web_page_preview": False,
            })
