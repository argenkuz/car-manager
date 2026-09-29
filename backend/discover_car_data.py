import asyncio
import re
from pathlib import Path
from urllib.parse import urljoin

import httpx

from app.config import settings


UA = (
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
    "AppleWebKit/537.36 (KHTML, like Gecko) "
    "Chrome/140.0.0.0 Safari/537.36"
)


def extract_scripts(html: str) -> list[str]:
    return list(
        dict.fromkeys(
            urljoin(
                settings.carmanager_base_url.rstrip("/") + "/",
                src,
            )
            for src in re.findall(
                r'<script[^>]+src=["\']([^"\']+)["\']',
                html,
                flags=re.IGNORECASE,
            )
        )
    )


def extract_forms(html: str) -> list[dict]:
    forms = []
    for match in re.finditer(
        r"<form\\b([^>]*)>(.*?)</form>",
        html,
        flags=re.IGNORECASE | re.DOTALL,
    ):
        attrs, body = match.groups()
        action_match = re.search(r'action=["\']([^"\']*)["\']', attrs, re.I)
        method_match = re.search(r'method=["\']([^"\']*)["\']', attrs, re.I)
        inputs = []
        for input_match in re.finditer(
            r"<input\\b([^>]*)>",
            body,
            flags=re.IGNORECASE,
        ):
            input_attrs = input_match.group(1)
            name = re.search(r'name=["\']([^"\']*)["\']', input_attrs, re.I)
            value = re.search(r'value=["\']([^"\']*)["\']', input_attrs, re.I)
            input_type = re.search(r'type=["\']([^"\']*)["\']', input_attrs, re.I)
            if name:
                inputs.append(
                    {
                        "name": name.group(1),
                        "value": value.group(1) if value else "",
                        "type": input_type.group(1) if input_type else "text",
                    }
                )
        forms.append(
            {
                "action": action_match.group(1) if action_match else "",
                "method": method_match.group(1) if method_match else "get",
                "inputs": inputs,
            }
        )
    return forms


async def main():
    if not settings.carmanager_user_id or not settings.carmanager_password:
        raise RuntimeError("CARMANAGER_USER_ID/CARMANAGER_PASSWORD are not configured")

    base_url = settings.carmanager_base_url.rstrip("/")

    async with httpx.AsyncClient(
        base_url=base_url,
        timeout=30,
        follow_redirects=True,
        headers={"User-Agent": UA, "Referer": base_url + "/"},
    ) as client:
        print("1. LOGIN")
        login = await client.post(
            "/User/Login",
            data={
                "sbxgubun": "1",
                "returnurl": "/Car/Data",
                "userid": settings.carmanager_user_id,
                "userpwd": settings.carmanager_password,
            },
            follow_redirects=False,
        )
        print("POST /User/Login:", login.status_code)
        print("Location:", login.headers.get("location"))
        if login.status_code not in {301, 302, 303, 307, 308}:
            raise RuntimeError("LOGIN FAILED")

        print("\n2. GET /Car/Data")
        response = await client.get("/Car/Data")
        print("Status:", response.status_code)
        print("URL:", response.url)
        print("Length:", len(response.text))

        html = response.text
        Path("backend/carmanager_car_data.html").write_text(html, encoding="utf-8")
        print("Saved: backend/carmanager_car_data.html")

        print("\n3. FORMS")
        for form in extract_forms(html):
            print("ACTION:", form["action"])
            print("METHOD:", form["method"])
            for item in form["inputs"]:
                print("  ", item)

        print("\n4. SCRIPTS")
        scripts = extract_scripts(html)
        print("Found:", len(scripts))
        for script in scripts:
            print(" ", script)

        print("\n5. SEARCH-RELATED LINES")
        for index, line in enumerate(html.splitlines(), 1):
            low = line.lower()
            if any(
                key in low
                for key in (
                    "tbxsearch",
                    "searchmaker",
                    "searchmodel",
                    "searchgrade",
                    "searchsido",
                    "searchdanji",
                    "carfuel",
                    "carmission",
                    "carcolor",
                    "caroption",
                    "gofor",
                    "formsubmit",
                    "/car/data",
                )
            ):
                print(f"{index}: {line.strip()[:500]}")


if __name__ == "__main__":
    asyncio.run(main())
