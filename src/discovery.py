from __future__ import annotations

from dataclasses import dataclass
from urllib.parse import urljoin

from bs4 import BeautifulSoup

from .http_client import HttpClient

@dataclass
class PageDiscovery:
    url: str
    status_code: int | None
    final_url: str | None
    title: str | None
    links: list[str]
    scripts: list[str]
    forms: list[dict[str, str | None]]
    error: str | None = None

def discover(url: str, client: HttpClient | None = None) -> PageDiscovery:
    client = client or HttpClient()
    result = client.get(url)

    if result.error:
        return PageDiscovery(
            url=url,
            status_code=None,
            final_url=None,
            title=None,
            links=[],
            scripts=[],
            forms=[],
            error=result.error,
        )

    soup = BeautifulSoup(result.body, "html.parser")
    title = soup.title.get_text(strip=True) if soup.title else None

    links = sorted({
        urljoin(result.final_url or url, tag.get("href"))
        for tag in soup.find_all("a")
        if tag.get("href")
    })

    scripts = sorted({
        urljoin(result.final_url or url, tag.get("src"))
        for tag in soup.find_all("script")
        if tag.get("src")
    })

    forms = []
    for form in soup.find_all("form"):
        forms.append({
            "action": urljoin(result.final_url or url, form.get("action") or ""),
            "method": (form.get("method") or "GET").upper(),
        })

    return PageDiscovery(
        url=url,
        status_code=result.status_code,
        final_url=result.final_url,
        title=title,
        links=links,
        scripts=scripts,
        forms=forms,
    )
