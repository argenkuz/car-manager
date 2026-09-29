from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Filter
import json

router = APIRouter()


class FilterPayload(BaseModel):
    name: str = "Новый фильтр"
    enabled: bool = True
    brand_id: str | None = None
    model_id: str | None = None
    model_detail_id: str | None = None
    grade_id: str | None = None
    grade_detail_id: str | None = None
    min_year: int | None = Field(default=None, ge=1900, le=2100)
    max_year: int | None = Field(default=None, ge=1900, le=2100)
    min_mileage: int | None = Field(default=None, ge=0)
    max_mileage: int | None = Field(default=None, ge=0)
    min_price: int | None = Field(default=None, ge=0)
    max_price: int | None = Field(default=None, ge=0)
    fuel_ids: list[str] = Field(default_factory=list)
    mission_ids: list[str] = Field(default_factory=list)
    color_ids: list[str] = Field(default_factory=list)
    option_ids: list[str] = Field(default_factory=list)
    accident: str | None = None
    sido_ids: list[str] = Field(default_factory=list)
    sido_area_ids: list[str] = Field(default_factory=list)
    danji_ids: list[str] = Field(default_factory=list)


def _loads(value: str | None) -> list[str]:
    if not value:
        return []
    try:
        data = json.loads(value)
        return [str(x) for x in data] if isinstance(data, list) else []
    except (TypeError, ValueError):
        return []


def _dumps(value: list[str]) -> str | None:
    return json.dumps(value, ensure_ascii=False) if value else None


def dump(f: Filter):
    return {
        "id": f.id, "name": f.name, "enabled": f.enabled,
        "brand_id": f.brand_id, "model_id": f.model_id,
        "model_detail_id": f.model_detail_id,
        "grade_id": f.grade_id, "grade_detail_id": f.grade_detail_id,
        "min_year": f.min_year, "max_year": f.max_year,
        "min_mileage": f.min_mileage, "max_mileage": f.max_mileage,
        "min_price": f.min_price, "max_price": f.max_price,
        "fuel_ids": _loads(f.fuel_ids),
        "mission_ids": _loads(f.mission_ids),
        "color_ids": _loads(f.color_ids),
        "option_ids": _loads(f.option_ids),
        "accident": f.accident,
        "sido_ids": _loads(f.sido_ids),
        "sido_area_ids": _loads(f.sido_area_ids),
        "danji_ids": _loads(f.danji_ids),
    }


def _apply_payload(f: Filter, payload: FilterPayload):
    data = payload.model_dump()
    for key in (
        "name", "enabled", "brand_id", "model_id", "model_detail_id",
        "grade_id", "grade_detail_id", "min_year", "max_year",
        "min_mileage", "max_mileage", "min_price", "max_price", "accident",
    ):
        setattr(f, key, data[key])
    f.fuel_ids = _dumps(data["fuel_ids"])
    f.mission_ids = _dumps(data["mission_ids"])
    f.color_ids = _dumps(data["color_ids"])
    f.option_ids = _dumps(data["option_ids"])
    f.sido_ids = _dumps(data["sido_ids"])
    f.sido_area_ids = _dumps(data["sido_area_ids"])
    f.danji_ids = _dumps(data["danji_ids"])


@router.get("")
def get_filters(db: Session = Depends(get_db)):
    return [dump(x) for x in db.scalars(select(Filter).order_by(Filter.id)).all()]


@router.post("")
def create_filter(payload: FilterPayload, db: Session = Depends(get_db)):
    f = Filter()
    _apply_payload(f, payload)
    db.add(f)
    db.commit()
    db.refresh(f)
    return dump(f)


@router.patch("/{filter_id}")
def update_filter(filter_id: int, payload: FilterPayload, db: Session = Depends(get_db)):
    f = db.get(Filter, filter_id)
    if not f:
        raise HTTPException(404, "Filter not found")
    _apply_payload(f, payload)
    db.commit()
    db.refresh(f)
    return dump(f)


@router.delete("/{filter_id}")
def delete_filter(filter_id: int, db: Session = Depends(get_db)):
    f = db.get(Filter, filter_id)
    if not f:
        raise HTTPException(404, "Filter not found")
    db.delete(f)
    db.commit()
    return {"status": "deleted", "filter_id": filter_id}
