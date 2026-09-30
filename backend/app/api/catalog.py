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


@router.get("/search-filters")
async def search_filters():
    client = CarManagerClient()
    try:
        await client.ensure_login()
        result = client.get_search_filter_catalog()

        async def safe_json(path: str):
            try:
                return await asyncio.wait_for(client.post_json(path), timeout=20)
            except Exception:
                return []

        fuel_raw, mission_raw, color_raw, option_base_raw, option_etc_raw = await asyncio.gather(
            safe_json("/CarBase/JsonBaseCarFuel"),
            safe_json("/CarBase/JsonBaseCarMission"),
            safe_json("/CarBase/JsonBaseCarColor"),
            safe_json("/CarBase/JsonBaseCarOptionBase"),
            safe_json("/CarBase/JsonBaseCarOptionEtc"),
        )

        def normalize(items, id_keys, name_keys):
            out = []
            for item in items or []:
                value = next((item.get(k) for k in id_keys if item.get(k) not in (None, "")), None)
                name = next((item.get(k) for k in name_keys if item.get(k) not in (None, "")), None)
                if value not in (None, "") and name:
                    out.append({"id": str(value), "name": str(name)})
            return out

        result["fuel"] = normalize(fuel_raw, ["FKeyNo"], ["FuelName"]) or result.get("fuel", [])
        result["mission"] = normalize(mission_raw, ["MKeyNo"], ["MissionName"]) or result.get("mission", [])
        result["color"] = normalize(color_raw, ["CKeyNo"], ["ColorName"]) or result.get("color", [])
        result["option"] = (
            normalize(option_base_raw, ["CarOptionNo"], ["CarOptionName"])
            + normalize(option_etc_raw, ["CarOptionNo"], ["CarOptionName"])
        ) or result.get("option", [])

        return result
    finally:
        await client.close()


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
