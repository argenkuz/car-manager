from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import MonitorSettings
from app.monitor import run_once

router = APIRouter()

class MonitorUpdate(BaseModel):
    enabled: bool | None = None
    interval_minutes: int | None = Field(default=None, ge=1, le=1440)

def get_settings(db: Session):
    row = db.get(MonitorSettings, 1)
    if row is None:
        row = MonitorSettings(id=1, enabled=False, interval_minutes=10)
        db.add(row); db.commit(); db.refresh(row)
    return row

@router.get("/status")
def status(db: Session = Depends(get_db)):
    row = get_settings(db)
    return {"running": row.enabled, "enabled": row.enabled, "interval_minutes": row.interval_minutes, "next_run_at": row.next_run_at}

@router.patch("/settings")
def update_settings(payload: MonitorUpdate, db: Session = Depends(get_db)):
    row = get_settings(db)
    data = payload.model_dump(exclude_none=True)
    for k,v in data.items(): setattr(row,k,v)
    db.commit(); db.refresh(row)
    return {"enabled": row.enabled, "interval_minutes": row.interval_minutes, "next_run_at": row.next_run_at}

@router.post("/run-once")
async def run_monitor_once():
    try:
        return await run_once()
    except RuntimeError as exc:
        raise HTTPException(503, str(exc)) from exc
