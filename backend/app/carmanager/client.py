from __future__ import annotations
from typing import Any
import httpx
from app.config import settings

class CarManagerClient:
    def __init__(self) -> None:
        self.client = httpx.AsyncClient(
            base_url=settings.carmanager_base_url,
            timeout=30.0,
            follow_redirects=True,
            headers={
                "User-Agent": (
                    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                    "AppleWebKit/537.36 (KHTML, like Gecko) "
                    "Chrome/140.0.0.0 Safari/537.36"
                )
            },
        )
        self.authenticated = False

    async def login(self) -> bool:
        if not settings.carmanager_user_id or not settings.carmanager_password:
            return False
        response = await self.client.post(
            "/User/Login",
            data={
                "sbxgubun": "1",
                "returnurl": "",
                "userid": settings.carmanager_user_id,
                "userpwd": settings.carmanager_password,
            },
            follow_redirects=False,
        )
        self.authenticated = response.status_code in {301,302,303,307,308}
        return self.authenticated

    async def ensure_login(self):
        if not self.authenticated and not await self.login():
            raise RuntimeError("CarManager authentication failed")

    async def get(self, path: str, **kwargs: Any) -> httpx.Response:
        await self.ensure_login()
        return await self.client.get(path, **kwargs)

    async def search(self, payload: dict) -> httpx.Response:
        await self.ensure_login()
        if not settings.carmanager_search_path:
            raise RuntimeError("CARMANAGER_SEARCH_PATH is not configured")
        return await self.client.post(
            settings.carmanager_search_path,
            data={k: v for k, v in payload.items() if v is not None},
        )

    async def close(self):
        await self.client.aclose()
