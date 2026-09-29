from __future__ import annotations
import asyncio
from datetime import datetime, timedelta
from sqlalchemy import select, delete
from app.database import SessionLocal
from app.models import Filter, SeenCar, MonitorSettings
from app.carmanager.client import CarManagerClient
from app.carmanager.parser import parse_cars
from app.telegram import send_message
from app.config import settings

def _get_settings(db):
    row = db.get(MonitorSettings, 1)
    if row is None:
        row = MonitorSettings(id=1, enabled=False)
        db.add(row)
        db.commit()
        db.refresh(row)
    return row

def _filter_payload(f: Filter) -> dict:
    return {
        "brand_id": f.brand_id,
        "model_id": f.model_id,
        "min_year": f.min_year,
        "max_year": f.max_year,
        "min_mileage": f.min_mileage,
        "max_mileage": f.max_mileage,
        "min_price": f.min_price,
        "max_price": f.max_price,
    }

def _matches(car, f: Filter) -> bool:
    if f.min_year is not None and (car.year is None or car.year < f.min_year): return False
    if f.max_year is not None and (car.year is None or car.year > f.max_year): return False
    if f.min_mileage is not None and (car.mileage is None or car.mileage < f.min_mileage): return False
    if f.max_mileage is not None and (car.mileage is None or car.mileage > f.max_mileage): return False
    if f.min_price is not None and (car.price is None or car.price < f.min_price): return False
    if f.max_price is not None and (car.price is None or car.price > f.max_price): return False
    return True

async def run_once() -> dict:
    db = SessionLocal()
    client = CarManagerClient()
    try:
        settings_row = _get_settings(db)
        filters = db.scalars(select(Filter).where(Filter.enabled == True)).all()
        total_new = 0
        for f in filters:
            response = await client.search(_filter_payload(f))
            cars = parse_cars(response.text, base_url=settings.carmanager_base_url)
            for car in cars:
                if not _matches(car, f):
                    continue
                exists = db.scalar(select(SeenCar).where(SeenCar.filter_id == f.id, SeenCar.car_id == car.id))
                if exists:
                    continue
                seen = SeenCar(filter_id=f.id, car_id=car.id)
                db.add(seen)
                total_new += 1
                if settings.telegram_bot_token and settings.telegram_chat_id:
                    message = (
                        f"🚗 {car.title}\n"
                        f"Год: {car.year or '-'} | Пробег: {car.mileage or '-'} км\n"
                        f"Цена: {car.price or '-'}\n"
                        f"Регион: {car.location or '-'}\n"
                        f"{car.url or ''}"
                    )
                    await send_message(message)
                    seen.notified = True
        settings_row.next_run_at = datetime.utcnow() + timedelta(minutes=settings_row.interval_minutes)
        db.commit()
        return {"filters": len(filters), "new_cars": total_new}
    finally:
        await client.close()
        db.close()

async def monitor_loop(stop_event: asyncio.Event):
    while not stop_event.is_set():
        db = SessionLocal()
        row = _get_settings(db)
        enabled = row.enabled
        interval = max(1, row.interval_minutes)
        db.close()
        if enabled:
            try:
                await run_once()
            except Exception as exc:
                print(f"Monitor error: {exc}")
        try:
            await asyncio.wait_for(stop_event.wait(), timeout=interval * 60)
        except asyncio.TimeoutError:
            pass
