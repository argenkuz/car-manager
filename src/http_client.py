from __future__ import annotations

from dataclasses import dataclass
import requests

from .config import settings

@dataclass
class HttpResult:
    url: str
    status_code: int | None
    final_url: str | None
    content_type: str | None
    headers: dict[str, str]
    body: str
    error: str | None = None

class HttpClient:
    def __init__(self) -> None:
        self.session = requests.Session()
        self.session.headers.update({
            "User-Agent": settings.user_agent,
            "Accept": "text/html,application/xhtml+xml,application/json;q=0.9,*/*;q=0.8",
        })

    def get(self, url: str) -> HttpResult:
        try:
            response = self.session.get(
                url,
                timeout=settings.timeout,
                allow_redirects=True,
            )
            return HttpResult(
                url=url,
                status_code=response.status_code,
                final_url=response.url,
                content_type=response.headers.get("content-type"),
                headers=dict(response.headers),
                body=response.text,
            )
        except requests.RequestException as exc:
            return HttpResult(
                url=url,
                status_code=None,
                final_url=None,
                content_type=None,
                headers={},
                body="",
                error=str(exc),
            )
