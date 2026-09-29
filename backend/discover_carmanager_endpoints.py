"""Discover CarManager endpoints from the authenticated site.

This script does not print cookies, passwords, or authorization headers.
It logs in using the existing application settings, downloads the main page
and its JavaScript files, and prints likely API/request endpoints.
"""

import asyncio
import re
from pathlib import Path
from urllib.parse import urljoin

import httpx

from app.config import settings


BASE_URL = settings.carmanager_base_url.rstrip("/")

UA = (
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
    "AppleWebKit/537.36 (KHTML, like Gecko) "
    "Chrome/140.0.0.0 Safari/537.36"
)

KEYWORDS = (
    "maker",
    "model",
    "carbase",
    "jsoninfo",
    "search",
    "ajax",
    "fetch",
    "getjson",
    "post",
)


def interesting_url(url: str) -> bool:
    value = url.lower()
    return any(word in value for word in KEYWORDS)


def extract_scripts(html: str) -> list[str]:
    found = re.findall(
        r'<script[^>]+src=["\']([^"\']+)["\']',
        html,
        flags=re.IGNORECASE,
    )
    return list(dict.fromkeys(urljoin(BASE_URL + "/", src) for src in found))


def extract_request_candidates(js: str) -> list[str]:
    candidates: list[str] = []

    patterns = [
        r"""(?:url|action)\s*:\s*["\']([^"\']+)["\']""",
        r"""(?:\.get|\.post|\.ajax|fetch)\s*\(\s*["\']([^"\']+)["\']""",
        r"""["\'](\/[A-Za-z0-9_./?=&%{}:-]{2,})["\']""",
    ]

    for pattern in patterns:
        candidates.extend(re.findall(pattern, js, flags=re.IGNORECASE))

    result = []
    seen = set()

    for value in candidates:
        value = value.strip()

        if value.startswith("//"):
            value = "https:" + value

        if value.startswith("/"):
            value = urljoin(BASE_URL + "/", value)

        if interesting_url(value) or "carmanager.co.kr" in value.lower():
            if value not in seen:
                seen.add(value)
                result.append(value)

    return result


async def main() -> None:
    if not settings.carmanager_user_id or not settings.carmanager_password:
        raise RuntimeError(
            "CARMANAGER_USER_ID and CARMANAGER_PASSWORD must be configured."
        )

    headers = {
        "User-Agent": UA,
        "Referer": BASE_URL + "/",
    }

    async with httpx.AsyncClient(
        base_url=BASE_URL,
        headers=headers,
        timeout=30,
        follow_redirects=True,
    ) as client:
        print("1. Login...")
        response = await client.post(
            "/User/Login",
            data={
                "sbxgubun": "1",
                "returnurl": "",
                "userid": settings.carmanager_user_id,
                "userpwd": settings.carmanager_password,
            },
            follow_redirects=False,
        )

        print(f"   Login status: {response.status_code}")

        if response.status_code not in {301, 302, 303, 307, 308}:
            raise RuntimeError("CarManager login failed.")

        print("2. Load main page...")
        response = await client.get("/")
        response.raise_for_status()

        html = response.text
        Path("backend/carmanager_main.html").write_text(html, encoding="utf-8")

        print(f"   Main page: {len(html):,} bytes")

        scripts = extract_scripts(html)
        print(f"3. Found JS files: {len(scripts)}")

        all_candidates: list[tuple[str, str]] = []

        for index, script_url in enumerate(scripts, 1):
            try:
                js_response = await client.get(script_url)
                if js_response.status_code != 200:
                    continue

                js = js_response.text
                filename = script_url.rsplit("/", 1)[-1].split("?")[0]

                # Save JS so it can be inspected locally.
                Path("backend").joinpath(
                    f"carmanager_{filename}"
                ).write_text(js, encoding="utf-8")

                candidates = extract_request_candidates(js)

                if candidates:
                    print(f"\n[{index}] {script_url}")
                    for candidate in candidates:
                        print(f"    -> {candidate}")
                        all_candidates.append((filename, candidate))

            except Exception as exc:
                print(f"    JS error: {script_url} ({exc})")

        print("\n4. Unique request candidates:")
        seen = set()

        for filename, candidate in all_candidates:
            key = (filename, candidate)
            if key in seen:
                continue
            seen.add(key)
            print(f"   [{filename}] {candidate}")

        print("\nDone.")
        print("No cookies or passwords were printed.")


if __name__ == "__main__":
    asyncio.run(main())
