import asyncio
import json
from pathlib import Path

from app.carmanager.client import CarManagerClient
from app.config import settings


async def main():
    print("=" * 70)
    print("CARMANAGER SEARCH TEST")
    print("=" * 70)

    if not settings.carmanager_user_id or not settings.carmanager_password:
        print("ERROR: CARMANAGER_USER_ID / CARMANAGER_PASSWORD are not configured")
        return

    client = CarManagerClient()

    try:
        print("\n1. LOGIN + SEARCH CONTEXT")
        ok = await client.login()
        print("Login:", "OK" if ok else "FAILED")
        print("EncCheck:", client.enc_check)
        print("PrePage:", client.pre_page)
        print("Search HTML length:", len(client.search_html))

        if not ok:
            if client.search_html:
                Path("carmanager_search_page.html").write_text(
                    client.search_html, encoding="utf-8"
                )
                print("Saved diagnostic page: carmanager_search_page.html")
            print("\nCarManager did not return a valid search context.")
            print("The test stops here intentionally; /Car/DataPart is not called without EncCheck.")
            return

        print("\n2. SEARCH PARAMETERS")
        filters = {
            "brand_id": "10055",
        }
        payload = client.build_search_payload(filters, page=1, page_size=20)
        print(json.dumps(payload, ensure_ascii=False, indent=2))

        print("\n3. POST /Car/DataPart")
        response = await client.search(filters, page=1, page_size=20)
        print("Status:", response.status_code)
        print("URL:", response.url)
        print("Content-Type:", response.headers.get("content-type"))
        print("Length:", len(response.text))

        Path("carmanager_search_page.html").write_text(
            client.search_html, encoding="utf-8"
        )
        Path("carmanager_search_result.html").write_text(
            response.text, encoding="utf-8"
        )

        print("Saved: carmanager_search_page.html")
        print("Saved: carmanager_search_result.html")

        print("\n4. RESULT PREVIEW")
        print("-" * 70)
        print(response.text[:5000])
        print("-" * 70)

        print("\n5. POSSIBLE CAR IDENTIFIERS")
        identifiers = set()
        for pattern in (
            r'data-car-id=["\\']([^"\\']+)["\\']',
            r'data-id=["\\']([^"\\']+)["\\']',
            r'CarNo["\\']?\\s*[:=]\\s*["\\']?([A-Za-z0-9_-]+)',
            r'carno["\\']?\\s*[:=]\\s*["\\']?([A-Za-z0-9_-]+)',
            r'EncNo["\\']?\\s*[:=]\\s*["\\']?([A-Za-z0-9_-]+)',
        ):
            import re
            identifiers.update(re.findall(pattern, response.text, re.IGNORECASE))

        if identifiers:
            for item in list(identifiers)[:30]:
                print(item)
        else:
            print("Явные ID не найдены.")

    except Exception as exc:
        print(f"\\nERROR: {type(exc).__name__}: {exc}")
        raise
    finally:
        await client.close()

    print("\n" + "=" * 70)
    print("TEST FINISHED")
    print("=" * 70)


if __name__ == "__main__":
    asyncio.run(main())
