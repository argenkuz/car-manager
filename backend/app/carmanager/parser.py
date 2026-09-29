from __future__ import annotations
import re
from urllib.parse import urljoin
from bs4 import BeautifulSoup
from app.carmanager.models import Car

def _int(value: str | None):
    if not value: return None
    digits = re.sub(r"[^0-9]", "", value)
    return int(digits) if digits else None

def parse_cars(html: str, base_url: str) -> list[Car]:
    soup = BeautifulSoup(html, "html.parser")
    cars: list[Car] = []
    nodes = soup.select("[data-car-id], [data-id], .car-item, .car_list, li[class*='car']")
    seen: set[str] = set()
    for node in nodes:
        car_id = node.get("data-car-id") or node.get("data-id")
        link = node.select_one("a[href]")
        href = link.get("href") if link else None
        if not car_id and href:
            m = re.search(r"(?:idx|id|carNo|car_no)[=/]([A-Za-z0-9_-]+)", href)
            if m: car_id = m.group(1)
        if not car_id:
            continue
        car_id = str(car_id)
        if car_id in seen: continue
        seen.add(car_id)
        text = node.get_text(" ", strip=True)
        title = (link.get_text(" ", strip=True) if link else text[:150]).strip()
        cars.append(Car(
            id=car_id,
            title=title or car_id,
            year=_int((re.search(r"(20\d{2})", text) or [None, None])[1]),
            mileage=_int((re.search(r"([0-9][0-9,]*)\s*(?:km|KM|㎞|키로)", text) or [None, None])[1]),
            price=_int((re.search(r"([0-9][0-9,]*)\s*(?:만원|원|₩)", text) or [None, None])[1]),
            location=None,
            url=urljoin(base_url, href) if href else None,
        ))
    return cars
