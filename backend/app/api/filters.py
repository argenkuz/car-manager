from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Filter

router = APIRouter()

class FilterPayload(BaseModel):
    name: str = "Новый фильтр"
    enabled: bool = True
    brand_id: str | None = None
    model_id: str | None = None
    min_year: int | None = Field(default=None, ge=1900, le=2100)
    max_year: int | None = Field(default=None, ge=1900, le=2100)
    min_mileage: int | None = Field(default=None, ge=0)
    max_mileage: int | None = Field(default=None, ge=0)
    min_price: int | None = Field(default=None, ge=0)
    max_price: int | None = Field(default=None, ge=0)

def dump(f: Filter):
    return {
        "id": f.id, "name": f.name, "enabled": f.enabled,
        "brand_id": f.brand_id, "model_id": f.model_id,
        "min_year": f.min_year, "max_year": f.max_year,
        "min_mileage": f.min_mileage, "max_mileage": f.max_mileage,
        "min_price": f.min_price, "max_price": f.max_price,
    }

@router.get("")
def get_filters(db: Session = Depends(get_db)):
    return [dump(x) for x in db.scalars(select(Filter).order_by(Filter.id)).all()]

@router.post("")
def create_filter(payload: FilterPayload, db: Session = Depends(get_db)):
    f = Filter(**payload.model_dump())
    db.add(f); db.commit(); db.refresh(f)
    return dump(f)

@router.patch("/{filter_id}")
def update_filter(filter_id: int, payload: FilterPayload, db: Session = Depends(get_db)):
    f = db.get(Filter, filter_id)
    if not f: raise HTTPException(404, "Filter not found")
    for k,v in payload.model_dump().items(): setattr(f,k,v)
    db.commit(); db.refresh(f)
    return dump(f)

@router.delete("/{filter_id}")
def delete_filter(filter_id: int, db: Session = Depends(get_db)):
    f = db.get(Filter, filter_id)
    if not f: raise HTTPException(404, "Filter not found")
    db.delete(f); db.commit()
    return {"status":"deleted","filter_id":filter_id}
