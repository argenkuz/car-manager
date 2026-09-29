from __future__ import annotations

from functools import lru_cache
from pathlib import Path
import json
import re
from typing import Any


ROOT = Path(__file__).resolve().parents[2]
CATALOG_PATH = ROOT / "data" / "carmanager_catalog.json"

SOURCE_FILES = {
    "brands": (ROOT / "carmanager_js" / "carmanager_CarBaseMaker.js", "CarBaseMaker"),
    "models": (ROOT / "carmanager_CarBaseModel.js", "CarBaseModel"),
    "model_details": (ROOT / "carmanager_CarBaseModelDetail.js", "CarBaseModelDetail"),
    "grades": (ROOT / "carmanager_CarBaseGrade.js", "CarBaseGrade"),
    "grade_details": (ROOT / "carmanager_CarBaseGradeDetail.js", "CarBaseGradeDetail"),
}


@lru_cache(maxsize=None)
def _load_js_object(kind: str) -> Any:
    path, variable = SOURCE_FILES[kind]
    if not path.exists():
        return {} if kind != "brands" else []
    source = path.read_text(encoding="utf-8-sig")
    match = re.search(
        rf"var\s+{re.escape(variable)}\s*=\s*(.*?);\s*$",
        source,
        flags=re.DOTALL,
    )
    if not match:
        return {} if kind != "brands" else []
    try:
        return json.loads(match.group(1))
    except json.JSONDecodeError:
        return {} if kind != "brands" else []


def _legacy_catalog() -> dict:
    if not CATALOG_PATH.exists():
        return {"brands": []}
    try:
        data = json.loads(CATALOG_PATH.read_text(encoding="utf-8"))
        return data if isinstance(data, dict) else {"brands": []}
    except (OSError, json.JSONDecodeError):
        return {"brands": []}


def get_brands() -> list[dict]:
    brands = _load_js_object("brands")
    if isinstance(brands, list) and brands:
        return [
            {
                "id": str(x.get("MakerNo")),
                "name": x.get("MakerName", ""),
                "code": x.get("MakerCode"),
                "country_id": x.get("CountryNo"),
                "country": x.get("CountryName"),
            }
            for x in brands
            if x.get("MakerNo")
        ]
    return _legacy_catalog().get("brands", [])


def _items_for_key(kind: str, key: str) -> list[dict]:
    data = _load_js_object(kind)
    if not isinstance(data, dict):
        return []
    items = data.get(str(key), [])
    return items if isinstance(items, list) else []


def get_models(brand_id: str) -> list[dict]:
    return [
        {
            "id": str(x.get("ModelNo")),
            "name": x.get("ModelName", ""),
            "maker_id": str(x.get("MakerNo")) if x.get("MakerNo") else str(brand_id),
            "code": x.get("ModelCode"),
            "kind_code": x.get("KindCode"),
        }
        for x in _items_for_key("models", brand_id)
        if x.get("ModelNo")
    ]


def get_model_details(model_id: str) -> list[dict]:
    return [
        {
            "id": str(x.get("MDetailNo")),
            "name": x.get("MDetailName", ""),
            "model_id": str(x.get("ModelNo")) if x.get("ModelNo") else str(model_id),
            "code": x.get("MDetailCode"),
            "kind_sub_code": x.get("KindSubCode"),
            "car_count": int(x["CarCount"]) if str(x.get("CarCount", "")).isdigit() else None,
        }
        for x in _items_for_key("model_details", model_id)
        if x.get("MDetailNo")
    ]


def get_grades(model_detail_id: str) -> list[dict]:
    return [
        {
            "id": str(x.get("GradeNo")),
            "name": x.get("GradeName", ""),
            "model_detail_id": str(x.get("MDetailNo")) if x.get("MDetailNo") else str(model_detail_id),
        }
        for x in _items_for_key("grades", model_detail_id)
        if x.get("GradeNo")
    ]


def get_grade_details(grade_id: str) -> list[dict]:
    return [
        {
            "id": str(x.get("GDetailNo")),
            "name": x.get("GDetailName", ""),
            "grade_id": str(x.get("GradeNo")) if x.get("GradeNo") else str(grade_id),
        }
        for x in _items_for_key("grade_details", grade_id)
        if x.get("GDetailNo")
    ]


def search_models(query: str = "") -> list[dict]:
    query = query.strip().lower()
    result = []
    for brand in get_brands():
        for model in get_models(brand["id"]):
            if not query or query in str(model.get("name", "")).lower():
                result.append(
                    {
                        "brand_id": brand["id"],
                        "brand_name": brand["name"],
                        **model,
                    }
                )
    return result
