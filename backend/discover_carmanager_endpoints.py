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


def extract_scripts(html: str) -> list[str]:
    found = re.findall(
        r'<script[^>]+src=["\']([^"\']+)["\']',
        html,
        flags=re.IGNORECASE,
    )
    return list(dict.fromkeys(urljoin(settings.carmanager_base_url + "/", src) for src in found))


def interesting_url(url: str) -> bool:
    value = url.lower()
    return any(keyword in value for keyword in KEYWORDS)


def extract_request_candidates(js: str) -> list[str]:
    candidates = []
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
            value = urljoin(settings.carmanager_base_url + "/", value)
        if interesting_url(value) or settings.carmanager_base_url.lower() in value.lower():
            if value not in seen:
                seen.add(value)
                result.append(value)
    return result


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
        print("Status:", response.status_code)
        print("Location:", response.headers.get("location"))
        if response.status_code not in {301, 302, 303, 307, 308}:
            raise RuntimeError("LOGIN FAILED")

        print("LOGIN OK")

        print("\n2. MAIN PAGE")
        response = await client.get("/")
        response.raise_for_status()
        html = response.text
        Path("backend/carmanager_main.html").write_text(html, encoding="utf-8")
        print("Saved: backend/carmanager_main.html")

        scripts = extract_scripts(html)
        print("\n3. SEARCH JS FILES")
        print("Found:", len(scripts), "JS files")

        all_candidates = []
        for index, script_url in enumerate(scripts, 1):
            try:
                js_response = await client.get(script_url)
                print(f"[{index}/{len(scripts)}] {script_url} -> {js_response.status_code}")
                if js_response.status_code != 200:
                    continue

                js = js_response.text
                filename = script_url.rsplit("/", 1)[-1].split("?")[0]
                safe_filename = re.sub(r"[^A-Za-z0-9_.-]", "_", filename)
                Path("backend", f"carmanager_{safe_filename}").write_text(js, encoding="utf-8")

                for candidate in extract_request_candidates(js):
                    print("   ", candidate)
                    all_candidates.append((filename, candidate))
            except Exception as exc:
                print("   ERROR:", exc)

        print("\n4. ALL UNIQUE ENDPOINTS")
        seen = set()
        for filename, endpoint in all_candidates:
            if endpoint in seen:
                continue
            seen.add(endpoint)
            print(f"[{filename}]\n   {endpoint}")

        print("\nDONE")


if __name__ == "__main__":
    asyncio.run(main())
