from fastapi import APIRouter, Depends, Header, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.auth import get_current_user, require_master_password
from app.database import get_db
from app.models import TelegramRecipient, User

router = APIRouter()


class TelegramPayload(BaseModel):
    telegram_id: int = Field(gt=0)


def master_from_header(value: str | None = Header(default=None, alias="X-Master-Password")) -> str:
    if not value:
        raise HTTPException(status_code=403, detail="Требуется мастер-пароль")
    require_master_password(value)
    return value


@router.get("/recipients")
def get_recipients(
    _: str = Depends(master_from_header),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return [
        {"telegram_id": x.telegram_id, "created_at": x.created_at}
        for x in db.scalars(select(TelegramRecipient).order_by(TelegramRecipient.id)).all()
    ]


@router.post("/recipients")
def add_recipient(
    payload: TelegramPayload,
    _: str = Depends(master_from_header),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if db.scalar(select(TelegramRecipient).where(TelegramRecipient.telegram_id == payload.telegram_id)):
        return {"telegram_id": payload.telegram_id, "status": "already_exists"}
    row = TelegramRecipient(telegram_id=payload.telegram_id)
    db.add(row)
    db.commit()
    db.refresh(row)
    return {"telegram_id": row.telegram_id, "created_at": row.created_at}


@router.delete("/recipients/{telegram_id}")
def delete_recipient(
    telegram_id: int,
    _: str = Depends(master_from_header),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    row = db.scalar(select(TelegramRecipient).where(TelegramRecipient.telegram_id == telegram_id))
    if not row:
        raise HTTPException(status_code=404, detail="Telegram ID не найден")
    db.delete(row)
    db.commit()
    return {"status": "deleted"}
