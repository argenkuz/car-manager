from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class FilterPayload(BaseModel):
    brand_id: str | None = None
    model_id: str | None = None
    min_year: int | None = None
    max_year: int | None = None
    min_mileage: int | None = None
    max_mileage: int | None = None
    min_price: int | None = None
    max_price: int | None = None

@router.post("/preview")
async def preview(payload: FilterPayload):
    return {"filters": payload.model_dump(exclude_none=True)}
