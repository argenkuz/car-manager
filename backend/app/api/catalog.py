from fastapi import APIRouter, HTTPException, Query

from app.carmanager.catalog import get_brands, get_models, search_models

router = APIRouter()


@router.get("/brands")
async def brands():
    return {"items": get_brands()}


@router.get("/brands/{brand_id}/models")
async def models(brand_id: str):
    items = get_models(brand_id)
    if not items:
        raise HTTPException(status_code=404, detail="Brand not found or has no models")
    return {"items": items}


@router.get("/models")
async def models_search(q: str = Query(default="", max_length=100)):
    return {"items": search_models(q)}
