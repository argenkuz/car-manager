from __future__ import annotations
import re
from typing import Optional
from bs4 import BeautifulSoup
from app.carmanager.models import Car

def parse_int(value: str | None) -> Optional[int]:
    if not value:
        return None
    digits = re.sub(r"[^0-9]", "", value)
    return int(digits) if digits else None

def parse_cars(html: str) -> list[Car]:
    soup = BeautifulSoup(html, "html.parser")
    cars: list[Car] = []
    for item in soup.select("[data-car-id]"):
        car_id = item.get("data-car-id")
        if car_id:
            cars.append(Car(id=car_id, title=item.get_text(" ", strip=True)))
    return cars
