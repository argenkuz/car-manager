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
    """
    Conservative parser.

    CarManager's exact listing markup is intentionally not guessed here.
    Once the real search response is captured, selectors can be added in one place.
    """
    soup = BeautifulSoup(html, "html.parser")
    cars: list[Car] = []

    for item in soup.select("[data-car-id]"):
        car_id = item.get("data-car-id")
        if not car_id:
            continue

        cars.append(
            Car(
                id=car_id,
                title=item.get_text(" ", strip=True),
                url=item.get("href") if item.name == "a" else None,
            )
        )

    return cars
