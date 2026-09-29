from __future__ import annotations

import hashlib
import hmac
import secrets
from datetime import datetime, timedelta

from fastapi import Depends, HTTPException, Request
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.config import settings
from app.database import get_db
from app.models import User, UserSession


def hash_password(password: str) -> str:
    salt = secrets.token_bytes(16)
    digest = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, 310_000)
    return "pbkdf2_sha256$310000$" + salt.hex() + "$" + digest.hex()


def verify_password(password: str, encoded: str) -> bool:
    try:
        algorithm, rounds, salt_hex, digest_hex = encoded.split("$")
        if algorithm != "pbkdf2_sha256":
            return False
        candidate = hashlib.pbkdf2_hmac(
            "sha256", password.encode("utf-8"), bytes.fromhex(salt_hex), int(rounds)
        ).hex()
        return hmac.compare_digest(candidate, digest_hex)
    except (ValueError, TypeError):
        return False


def create_session(db: Session, user: User) -> str:
    raw = secrets.token_urlsafe(48)
    token_hash = hashlib.sha256(raw.encode("utf-8")).hexdigest()
    db.add(UserSession(
        user_id=user.id,
        token_hash=token_hash,
        expires_at=datetime.utcnow() + timedelta(days=settings.session_days),
    ))
    db.commit()
    return raw


def get_current_user(request: Request, db: Session = Depends(get_db)) -> User:
    header = request.headers.get("Authorization", "")
    if not header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Требуется авторизация")
    raw = header[7:].strip()
    if not raw:
        raise HTTPException(status_code=401, detail="Требуется авторизация")
    token_hash = hashlib.sha256(raw.encode("utf-8")).hexdigest()
    session = db.scalar(select(UserSession).where(UserSession.token_hash == token_hash))
    if not session or session.expires_at <= datetime.utcnow():
        raise HTTPException(status_code=401, detail="Сессия истекла")
    user = db.get(User, session.user_id)
    if not user or not user.is_active:
        raise HTTPException(status_code=401, detail="Пользователь недоступен")
    return user


def require_master_password(master_password: str) -> None:
    if not settings.master_password:
        raise HTTPException(status_code=503, detail="MASTER_PASSWORD не настроен на сервере")
    if not hmac.compare_digest(master_password, settings.master_password):
        raise HTTPException(status_code=403, detail="Неверный мастер-пароль")
