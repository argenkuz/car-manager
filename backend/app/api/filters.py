from fastapi import APIRouter
from pydantic import BaseModel, Field

router = APIRouter()


class FilterPayload(BaseModel):
    brand_id: str | None = None
    model_id: str | None = None
    min_year: int | None = Field(default=None, ge=1900, le=2100)
    max_year: int | None = Field(default=None, ge=1900, le=2100)
    min_mileage: int | None = Field(default=None, ge=0)
    max_mileage: int | None = Field(default=None, ge=0)
    min_price: int | None = Field(default=None, ge=0)
    max_price: int | None = Field(default=None, ge=0)


@router.post("/preview")
async def preview(payload: FilterPayload):
    return {"filters": payload.model_dump(exclude_none=True)}
