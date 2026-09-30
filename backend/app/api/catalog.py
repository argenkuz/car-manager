import asyncio

from fastapi import APIRouter, HTTPException, Query
from app.carmanager.catalog import (
    get_brands, get_models, get_model_details, get_grades, get_grade_details,
    search_models,
    clear_catalog_cache,
)
from app.carmanager.client import CarManagerClient

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


@router.get("/models/{model_id}/details")
async def model_details(model_id: str):
    return {"items": get_model_details(model_id)}


@router.get("/model-details/{model_detail_id}/grades")
async def grades(model_detail_id: str):
    return {"items": get_grades(model_detail_id)}


@router.get("/grades/{grade_id}/details")
async def grade_details(grade_id: str):
    return {"items": get_grade_details(grade_id)}


@router.get("/models")
async def models_search(q: str = Query(default="", max_length=100)):
    return {"items": search_models(q)}


@router.post("/cache/clear")
async def clear_cache():
    clear_catalog_cache()
    return {"status": "ok", "cache": "cleared"}


@router.get("/car-filters")
async def car_filter_catalog():
    client = CarManagerClient()
    endpoints = {
        "fuel": "/CarBase/JsonBaseCarFuel",
        "mission": "/CarBase/JsonBaseCarMission",
        "color": "/CarBase/JsonBaseCarColor",
        "option_base": "/CarBase/JsonBaseCarOptionBase",
        "option_etc": "/CarBase/JsonBaseCarOptionEtc",
        "sido": "/CodeBase/JsonBaseCodeSiDo",
    }

    async def load_one(key: str, endpoint: str):
        try:
            return key, await asyncio.wait_for(client.post_json(endpoint), timeout=15)
        except Exception:
            return key, []

    try:
        pairs = await asyncio.gather(*(load_one(k, v) for k, v in endpoints.items()))
        return dict(pairs)
    finally:
        await client.close()


@router.get("/sido/{sido_id}/areas")
async def sido_areas(sido_id: str):
    client = CarManagerClient()
    try:
        return {"items": await client.post_json(f"/CodeBase/JsonBaseCodeSiDoArea/{sido_id}")}
    finally:
        await client.close()


@router.get("/sido-areas/{area_id}/danji")
async def danji(area_id: str):
    client = CarManagerClient()
    try:
        return {"items": await client.post_json(f"/CodeBase/JsonBaseCodeDanji/{area_id}")}
    finally:
        await client.close()
