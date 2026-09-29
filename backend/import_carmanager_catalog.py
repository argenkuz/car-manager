from __future__ import annotations

import json
from pathlib import Path

from app.carmanager.catalog import (
    clear_catalog_cache,
    get_brands,
    get_models,
    get_model_details,
    get_grades,
    get_grade_details,
)


ROOT = Path(__file__).resolve().parent
OUTPUT = ROOT / "data" / "carmanager_catalog.json"


def main() -> None:
    clear_catalog_cache()

    brands = get_brands()
    catalog_brands = []

    for brand in brands:
        brand_id = brand["id"]
        models = get_models(brand_id)

        catalog_brands.append(
            {
                **brand,
                "models": [
                    {
                        **model,
                        "details": [
                            {
                                **detail,
                                "grades": [
                                    {
                                        **grade,
                                        "grade_details": get_grade_details(grade["id"]),
                                    }
                                    for grade in get_grades(detail["id"])
                                ],
                            }
                            for detail in get_model_details(model["id"])
                        ],
                    }
                    for model in models
                ],
            }
        )

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(
        json.dumps(
            {
                "source": "CarManager JavaScript catalog",
                "brands": catalog_brands,
            },
            ensure_ascii=False,
            indent=2,
        ),
        encoding="utf-8",
    )

    model_count = sum(len(brand["models"]) for brand in catalog_brands)

    print(f"Brands: {len(catalog_brands)}")
    print(f"Models: {model_count}")
    print(f"Saved: {OUTPUT}")


if __name__ == "__main__":
    main()
