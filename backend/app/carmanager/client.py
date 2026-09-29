from __future__ import annotations
from typing import Any
import httpx
from app.config import settings

class CarManagerClient:
    """Authenticated HTTP client for CarManager."""

    def __init__(self) -> None:
        self.client = httpx.AsyncClient(
            base_url=settings.carmanager_base_url,
            timeout=30.0,
            follow_redirects=True,
            headers={"User-Agent": "Mozilla/5.0"},
        )
        self.authenticated = False

    async def login(self) -> bool:
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
        self.authenticated = response.status_code in {301, 302, 303, 307, 308}
        return self.authenticated

    async def get(self, path: str, **kwargs: Any) -> httpx.Response:
        if not self.authenticated:
            await self.login()
        return await self.client.get(path, **kwargs)

    async def post(self, path: str, **kwargs: Any) -> httpx.Response:
        if not self.authenticated:
            await self.login()
        return await self.client.post(path, **kwargs)

    async def close(self) -> None:
        await self.client.aclose()
