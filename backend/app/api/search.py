from fastapi import APIRouter, HTTPException
from app.api.filters import FilterPayload
from app.carmanager.client import CarManagerClient
from app.carmanager.parser import parse_cars
from app.config import settings

router = APIRouter()

@router.post("")
async def search(payload: FilterPayload):
    client = CarManagerClient()
    try:
        response = await client.search(payload.model_dump(exclude_none=True))
        response.raise_for_status()
        cars = parse_cars(response.text, settings.carmanager_base_url)
        return {"items": [c.to_dict() for c in cars], "count": len(cars)}
    except RuntimeError as exc:
        raise HTTPException(503, str(exc)) from exc
    except Exception as exc:
        raise HTTPException(502, f"CarManager request failed: {exc}") from exc
    finally:
        await client.close()
