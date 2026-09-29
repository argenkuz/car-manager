import asyncio
import json
import re
from pathlib import Path

import httpx

from app.config import settings

BASE_URL = settings.carmanager_base_url.rstrip("/")


async def main():
    print("=" * 70)
    print("CARMANAGER SEARCH TEST")
    print("=" * 70)

    async with httpx.AsyncClient(
        base_url=BASE_URL,
        timeout=httpx.Timeout(60.0, connect=30.0),
        follow_redirects=False,
    ) as client:
        print("\n1. LOGIN")
        login_data = {
            "sbxgubun": "1",
            "returnurl": "/Car/Data",
            "userid": settings.carmanager_user_id,
            "userpwd": settings.carmanager_password,
        }
        response = await client.post("/User/Login", data=login_data)
        print("POST /User/Login:", response.status_code)
        print("Location:", response.headers.get("location"))

        if response.status_code not in (301, 302, 303, 307, 308):
            print(response.text[:1000])
            return

        print("\n2. GET /Car/Data")
        response = await client.get("/Car/Data")
        print("Status:", response.status_code)
        print("URL:", response.url)
        print("Length:", len(response.text))

        if response.status_code != 200:
            print(response.text[:2000])
            return

        html = response.text
        Path("carmanager_search_page.html").write_text(html, encoding="utf-8")

        print("\n3. HIDDEN VALUES")

        def get_input_value(name: str) -> str:
            patterns = [
                rf'<input[^>]+name=["\']{re.escape(name)}["\'][^>]+value=["\']([^"\']*)["\']',
                rf'<input[^>]+value=["\']([^"\']*)["\'][^>]+name=["\']{re.escape(name)}["\']',
            ]
            for pattern in patterns:
                match = re.search(pattern, html, re.IGNORECASE)
                if match:
                    return match.group(1)
            return ""

        enc_check = get_input_value("EncCheck")
        pre_page = get_input_value("PrePage")
        print("EncCheck:", enc_check)
        print("PrePage:", pre_page)

        print("\n4. SEARCH PARAMETERS")
        payload = {
            "para": {
                "EncCheck": enc_check,
                "PrePage": pre_page,
                "PageNow": 1,
                "PageSize": 20,
                "PageSort": "1",
                "PageAscDesc": "0",
                "CarMode": "0",
                "CarSiDoNo": "",
                "CarSiDoAreaNo": "",
                "CarDanjiNo": "",
                "CarMakerNo": "10055",
                "CarModelNo": "",
                "CarModelDetailNo": "",
                "CarGradeNo": "",
                "CarGradeDetailNo": "",
                "CarMakeSDate": "",
                "CarMakeEDate": "",
                "CarDriveSKm": "",
                "CarDriveEKm": "",
                "CarMission": "",
                "CarFuel": "",
                "CarColor": "",
                "CarSMoney": "",
                "CarEMoney": "",
                "CarIsLPG": "False",
                "CarIsSago": "False",
                "CarIsPhoto": "False",
                "CarIsSaleAmount": "False",
                "CarIsCarCheck": "False",
                "CarIsLeaseCheck": "False",
                "CarName": "",
                "CarDealerName": "",
                "CarShopName": "",
                "CarDealerHP": "",
                "CarNumber": "",
                "CarOption": "",
                "CarTruckTonS": "",
                "CarTruckTonE": "",
            }
        }

        print(json.dumps(payload, ensure_ascii=False, indent=2))

        print("\n5. POST /Car/DataPart")
        response = await client.post(
            "/Car/DataPart",
            json=payload,
            headers={
                "X-Requested-With": "XMLHttpRequest",
                "Referer": f"{BASE_URL}/Car/Data",
            },
        )
        print("Status:", response.status_code)
        print("Content-Type:", response.headers.get("content-type"))
        print("Length:", len(response.text))

        result_path = Path("carmanager_search_result.html")
        result_path.write_text(response.text, encoding="utf-8")
        print("Saved:", result_path)

        print("\n6. RESULT PREVIEW")
        print("-" * 70)
        print(response.text[:5000])
        print("-" * 70)

        print("\n7. POSSIBLE CAR IDENTIFIERS")
        patterns = [
            r'data-car-id=["\']([^"\']+)["\']',
            r'data-id=["\']([^"\']+)["\']',
            r'CarNo["\']?\s*[:=]\s*["\']?([A-Za-z0-9_-]+)',
            r'carno["\']?\s*[:=]\s*["\']?([A-Za-z0-9_-]+)',
            r'EncNo["\']?\s*[:=]\s*["\']?([A-Za-z0-9_-]+)',
        ]
        found = set()
        for pattern in patterns:
            found.update(re.findall(pattern, response.text, re.IGNORECASE))

        if found:
            for item in list(found)[:30]:
                print(item)
        else:
            print("Явные ID не найдены.")

        print("\n" + "=" * 70)
        print("TEST FINISHED")
        print("=" * 70)


if __name__ == "__main__":
    asyncio.run(main())
