from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.auth import create_session, get_current_user, hash_password, verify_password, require_master_password
from app.database import get_db
from app.models import User

router = APIRouter()


class LoginPayload(BaseModel):
    username: str = Field(min_length=1, max_length=120)
    password: str = Field(min_length=1, max_length=256)


class RegisterPayload(LoginPayload):
    master_password: str = Field(min_length=1, max_length=256)


def user_dict(user: User) -> dict:
    return {"id": user.id, "username": user.username, "role": user.role, "is_active": user.is_active}


@router.post("/login")
def login(payload: LoginPayload, db: Session = Depends(get_db)):
    user = db.scalar(select(User).where(User.username == payload.username.strip()))
    if not user or not user.is_active or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Неверный логин или пароль")
    token = create_session(db, user)
    return {"access_token": token, "token_type": "bearer", "user": user_dict(user)}


@router.post("/register")
def register(payload: RegisterPayload, db: Session = Depends(get_db)):
    require_master_password(payload.master_password)
    username = payload.username.strip()
    if not username:
        raise HTTPException(status_code=422, detail="Логин не может быть пустым")
    if db.scalar(select(User).where(User.username == username)):
        raise HTTPException(status_code=409, detail="Такой аккаунт уже существует")
    user = User(username=username, password_hash=hash_password(payload.password))
    db.add(user)
    db.commit()
    db.refresh(user)
    token = create_session(db, user)
    return {"access_token": token, "token_type": "bearer", "user": user_dict(user)}


@router.get("/me")
def me(user: User = Depends(get_current_user)):
    return user_dict(user)
