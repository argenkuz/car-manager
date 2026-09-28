from __future__ import annotations

import os
from dataclasses import dataclass
from urllib.parse import urlparse

import requests


DEFAULT_URL = "https://www.carmanager.co.kr"
PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=kr.co.autocafe.carmanager"


@dataclass
class ProbeResult:
    url: str
    status_code: int | None
    final_url: str | None
    content_type: str | None
    error: str | None = None


def probe(url: str) -> ProbeResult:
    try:
        response = requests.get(
            url,
            timeout=15,
            allow_redirects=True,
            headers={
                "User-Agent": "car-manager-research/0.1",
                "Accept": "text/html,application/xhtml+xml,application/json;q=0.9,*/*;q=0.8",
            },
        )
        return ProbeResult(
            url=url,
            status_code=response.status_code,
            final_url=response.url,
            content_type=response.headers.get("content-type"),
        )
    except requests.RequestException as exc:
        return ProbeResult(
            url=url,
            status_code=None,
            final_url=None,
            content_type=None,
            error=str(exc),
        )


def print_result(result: ProbeResult) -> None:
    host = urlparse(result.url).netloc
    print(f"\n[{host}]")
    print(f"  URL:          {result.url}")
    print(f"  Status:       {result.status_code}")
    print(f"  Final URL:    {result.final_url}")
    print(f"  Content-Type: {result.content_type}")
    if result.error:
        print(f"  Error:        {result.error}")


def main() -> None:
    website_url = os.getenv("CAR_MANAGER_URL", DEFAULT_URL)

    print("Car Manager public-access probe")
    print("=" * 34)

    for url in (website_url, PLAY_STORE_URL):
        print_result(probe(url))


if __name__ == "__main__":
    main()
