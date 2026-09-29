from fastapi import APIRouter

from app.config import settings

router = APIRouter()


@router.get("/status")
async def status():
    return {
        "running": False,
        "interval_minutes": settings.monitor_interval_minutes,
        "configured": bool(settings.carmanager_search_path),
    }
