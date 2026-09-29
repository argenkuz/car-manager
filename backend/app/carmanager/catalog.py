from pathlib import Path
import json

CATALOG_PATH = Path(__file__).resolve().parents[2] / "data" / "carmanager_catalog.json"

def load_catalog() -> dict:
    if not CATALOG_PATH.exists():
        return {"brands": []}
    with CATALOG_PATH.open("r", encoding="utf-8") as f:
        return json.load(f)

def get_brands() -> list[dict]:
    return load_catalog().get("brands", [])

def get_models(brand_id: str) -> list[dict]:
    for brand in get_brands():
        if str(brand.get("id")) == str(brand_id):
            return brand.get("models", [])
    return []
