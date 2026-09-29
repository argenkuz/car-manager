from __future__ import annotations
import httpx
from app.config import settings

async def send_message(text: str) -> None:
    if not settings.telegram_bot_token or not settings.telegram_chat_id:
        return
    url = f"https://api.telegram.org/bot{settings.telegram_bot_token}/sendMessage"
    async with httpx.AsyncClient(timeout=15) as client:
        await client.post(url, json={
            "chat_id": settings.telegram_chat_id,
            "text": text,
            "disable_web_page_preview": False,
        })
