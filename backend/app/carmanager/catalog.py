from pathlib import Path
import json

CATALOG_PATH = Path(__file__).resolve().parents[2] / "data" / "carmanager_catalog.json"


def load_catalog() -> dict:
    if not CATALOG_PATH.exists():
        return {"brands": []}

    with CATALOG_PATH.open("r", encoding="utf-8") as file:
        data = json.load(file)

    return data if isinstance(data, dict) else {"brands": []}


def get_brands() -> list[dict]:
    return load_catalog().get("brands", [])


def get_models(brand_id: str) -> list[dict]:
    for brand in get_brands():
        if str(brand.get("id")) == str(brand_id):
            return brand.get("models", [])
    return []


def search_models(query: str = "") -> list[dict]:
    query = query.strip().lower()
    result = []

    for brand in get_brands():
        for model in brand.get("models", []):
            name = str(model.get("name", ""))
            if not query or query in name.lower():
                result.append(
                    {
                        "brand_id": brand.get("id"),
                        "brand_name": brand.get("name"),
                        **model,
                    }
                )

    return result
