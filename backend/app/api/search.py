from fastapi import APIRouter, HTTPException

from app.api.filters import FilterPayload
from app.carmanager.client import CarManagerClient
from app.carmanager.parser import parse_cars
from app.config import settings

router = APIRouter()


@router.post("")
async def search(payload: FilterPayload):
    if not settings.carmanager_search_path:
        raise HTTPException(
            status_code=503,
            detail="CARMANAGER_SEARCH_PATH is not configured yet.",
        )

    client = CarManagerClient()
    try:
        response = await client.post(
            settings.carmanager_search_path,
            data=payload.model_dump(exclude_none=True),
        )
        response.raise_for_status()
        cars = parse_cars(response.text)
        return {"items": [car.to_dict() for car in cars], "count": len(cars)}
    except RuntimeError as exc:
        raise HTTPException(status_code=401, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"CarManager request failed: {exc}") from exc
    finally:
        await client.close()
