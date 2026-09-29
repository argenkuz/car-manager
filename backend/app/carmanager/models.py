from dataclasses import dataclass
from typing import Optional


@dataclass(slots=True)
class Car:
    id: str
    title: str
    brand: Optional[str] = None
    model: Optional[str] = None
    year: Optional[int] = None
    mileage: Optional[int] = None
    price: Optional[int] = None
    location: Optional[str] = None
    url: Optional[str] = None
    image_url: Optional[str] = None

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "title": self.title,
            "brand": self.brand,
            "model": self.model,
            "year": self.year,
            "mileage": self.mileage,
            "price": self.price,
            "location": self.location,
            "url": self.url,
            "image_url": self.image_url,
        }
