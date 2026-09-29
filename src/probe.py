from __future__ import annotations

import json

from .config import settings
from .discovery import discover
from .http_client import HttpClient

PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=kr.co.autocafe.carmanager"

def main() -> None:
    client = HttpClient()

    for url in (settings.base_url, PLAY_STORE_URL):
        result = client.get(url)
        print("\n" + "=" * 70)
        print(f"URL:          {result.url}")
        print(f"Status:       {result.status_code}")
        print(f"Final URL:    {result.final_url}")
        print(f"Content-Type: {result.content_type}")
        if result.error:
            print(f"Error:        {result.error}")
            continue

        if "html" in (result.content_type or "").lower():
            page = discover(url, client)
            print(f"Title:        {page.title}")
            print(f"Links:        {len(page.links)}")
            print(f"Scripts:      {len(page.scripts)}")
            print(f"Forms:        {len(page.forms)}")
            print("\nFirst links:")
            print(json.dumps(page.links[:20], ensure_ascii=False, indent=2))
            print("\nScripts:")
            print(json.dumps(page.scripts[:20], ensure_ascii=False, indent=2))

if __name__ == "__main__":
    main()
