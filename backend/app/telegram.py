from __future__ import annotations

import html
import httpx
from sqlalchemy import select

from app.carmanager.models import Car
from app.config import settings
from app.database import SessionLocal
from app.models import TelegramRecipient


def _recipients() -> list[int]:
    db = SessionLocal()
    try:
        return [
            row.telegram_id
            for row in db.scalars(
                select(TelegramRecipient).order_by(TelegramRecipient.id)
            ).all()
        ]
    finally:
        db.close()


def _caption(car: Car) -> str:
    return (
        f"🚗 <b>{html.escape(car.title)}</b>\n"
        f"Год: {car.year or '-'} | Пробег: {car.mileage or '-'} км\n"
        f"Цена: {html.escape(car.price_text or 'По запросу')}\n"
        f"Регион: {html.escape(car.location or '-')}\n"
        f"ID: <code>{html.escape(car.id)}</code>"
    )


async def send_message(text: str) -> None:
    if not settings.telegram_bot_token:
        return

    recipients = _recipients()
    if not recipients:
        return

    url = f"https://api.telegram.org/bot{settings.telegram_bot_token}/sendMessage"
    async with httpx.AsyncClient(timeout=15) as client:
        for telegram_id in recipients:
            response = await client.post(
                url,
                json={
                    "chat_id": telegram_id,
                    "text": text,
                    "disable_web_page_preview": False,
                },
            )
            if response.status_code >= 400:
                print(f"Telegram send failed for {telegram_id}: {response.text[:500]}")


async def send_car_notification(car: Car) -> None:
    if not settings.telegram_bot_token:
        return

    recipients = _recipients()
    if not recipients:
        return

    api_url = f"https://api.telegram.org/bot{settings.telegram_bot_token}"
    caption = _caption(car)

    async with httpx.AsyncClient(timeout=20) as client:
        for telegram_id in recipients:
            keyboard = None
            if car.url:
                keyboard = {
                    "inline_keyboard": [
                        [{"text": "🔗 Открыть объявление", "url": car.url}]
                    ]
                }

            if car.image_url:
                response = await client.post(
                    f"{api_url}/sendPhoto",
                    json={
                        "chat_id": telegram_id,
                        "photo": car.image_url,
                        "caption": caption,
                        "parse_mode": "HTML",
                        "reply_markup": keyboard,
                    },
                )
            else:
                response = await client.post(
                    f"{api_url}/sendMessage",
                    json={
                        "chat_id": telegram_id,
                        "text": caption,
                        "parse_mode": "HTML",
                        "reply_markup": keyboard,
                        "disable_web_page_preview": False,
                    },
                )

            if response.status_code >= 400:
                print(
                    f"Telegram car notification failed for {telegram_id}: "
                    f"{response.text[:500]}"
                )
