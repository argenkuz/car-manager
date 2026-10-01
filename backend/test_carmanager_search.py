import asyncio
import json
from pathlib import Path

from app.carmanager.client import CarManagerClient


async def main():
    print("=" * 70)
    print("CARMANAGER SEARCH TEST")
    print("=" * 70)

    client = CarManagerClient()
    try:
        print("\n1. AUTHENTICATED SEARCH CONTEXT")
        ok = await client.login()
        print("Login/context:", ok)
        print("EncCheck:", client.enc_check)
        print("PrePage:", client.pre_page)

        if not ok:
            if client.search_html:
                Path("carmanager_search_page.html").write_text(
                    client.search_html, encoding="utf-8"
                )
                print("Saved: carmanager_search_page.html")
            raise RuntimeError(
                "CarManager authentication succeeded at HTTP level, "
                "but /Car/Data did not provide EncCheck. "
                "Check the source IP/network or CarManager access policy."
            )

        Path("carmanager_search_page.html").write_text(
            client.search_html, encoding="utf-8"
        )

        print("\n2. SEARCH PARAMETERS")
        filters = {"brand_id": "10055"}
        payload = client._build_search_payload(filters, page=1, page_size=20)
        print(json.dumps(payload, ensure_ascii=False, indent=2))

        print("\n3. POST /Car/DataPart")
        response = await client.search(filters, page=1, page_size=20)
        print("Status:", response.status_code)
        print("Content-Type:", response.headers.get("content-type"))
        print("Length:", len(response.text))

        result_path = Path("carmanager_search_result.html")
        result_path.write_text(response.text, encoding="utf-8")
        print("Saved:", result_path)

        print("\n4. RESULT PREVIEW")
        print("-" * 70)
        print(response.text[:5000])
        print("-" * 70)

        response.raise_for_status()
        print("\nTEST PASSED")
    finally:
        await client.close()


if __name__ == "__main__":
    asyncio.run(main())
