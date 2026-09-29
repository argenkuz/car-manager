import asyncio
import re
from pathlib import Path
from urllib.parse import urljoin

import httpx


BASE_URL = "https://carmanager.co.kr"

USER_ID = "tmdgusc1420"
PASSWORD = "asdf7344"

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

    return list(
        dict.fromkeys(
            urljoin(BASE_URL + "/", src)
            for src in found
        )
    )


def interesting_url(url: str) -> bool:

    value = url.lower()

    return any(
        keyword in value
        for keyword in KEYWORDS
    )


def extract_request_candidates(js: str) -> list[str]:

    candidates = []

    patterns = [

        # url: "/..."
        r"""(?:url|action)\s*:\s*["\']([^"\']+)["\']""",

        # $.get("/...")
        # $.post("/...")
        # $.ajax("/...")
        # fetch("/...")
        r"""(?:\.get|\.post|\.ajax|fetch)\s*\(\s*["\']([^"\']+)["\']""",

        # любой URL начинающийся с /
        r"""["\'](\/[A-Za-z0-9_./?=&%{}:-]{2,})["\']""",
    ]

    for pattern in patterns:

        matches = re.findall(
            pattern,
            js,
            flags=re.IGNORECASE,
        )

        candidates.extend(matches)

    result = []
    seen = set()

    for value in candidates:

        value = value.strip()

        if value.startswith("//"):
            value = "https:" + value

        if value.startswith("/"):
            value = urljoin(
                BASE_URL + "/",
                value,
            )

        if (
            interesting_url(value)
            or "carmanager.co.kr" in value.lower()
        ):

            if value not in seen:

                seen.add(value)
                result.append(value)

    return result


async def main():

    async with httpx.AsyncClient(
        base_url=BASE_URL,
        timeout=30,
        follow_redirects=True,
        headers={
            "User-Agent": UA,
            "Referer": BASE_URL + "/",
        },
    ) as client:

        # =====================================
        # LOGIN
        # =====================================

        print("1. LOGIN")

        response = await client.post(
            "/User/Login",
            data={
                "sbxgubun": "1",
                "returnurl": "",
                "userid": USER_ID,
                "userpwd": PASSWORD,
            },
            follow_redirects=False,
        )

        print(
            "Status:",
            response.status_code,
        )

        print(
            "Location:",
            response.headers.get("location"),
        )

        if response.status_code not in {
            301,
            302,
            303,
            307,
            308,
        }:

            print(
                "LOGIN FAILED"
            )

            return

        print(
            "LOGIN OK"
        )

        # =====================================
        # MAIN PAGE
        # =====================================

        print("\n2. MAIN PAGE")

        response = await client.get("/")

        print(
            "Status:",
            response.status_code,
        )

        print(
            "Length:",
            len(response.text),
        )

        if response.status_code != 200:

            print(
                "MAIN PAGE FAILED"
            )

            return

        html = response.text

        Path(
            "backend/carmanager_main.html"
        ).write_text(
            html,
            encoding="utf-8",
        )

        print(
            "Saved: backend/carmanager_main.html"
        )

        # =====================================
        # FIND JS
        # =====================================

        print("\n3. SEARCH JS FILES")

        scripts = extract_scripts(html)

        print(
            "Found:",
            len(scripts),
            "JS files",
        )

        all_candidates = []

        # =====================================
        # DOWNLOAD JS
        # =====================================

        for index, script_url in enumerate(
            scripts,
            1,
        ):

            try:

                js_response = await client.get(
                    script_url
                )

                print(
                    f"[{index}/{len(scripts)}]",
                    script_url,
                    "->",
                    js_response.status_code,
                )

                if js_response.status_code != 200:
                    continue

                js = js_response.text

                filename = (
                    script_url
                    .rsplit("/", 1)[-1]
                    .split("?")[0]
                )

                safe_filename = re.sub(
                    r"[^A-Za-z0-9_.-]",
                    "_",
                    filename,
                )

                Path(
                    "backend",
                    f"carmanager_{safe_filename}",
                ).write_text(
                    js,
                    encoding="utf-8",
                )

                candidates = (
                    extract_request_candidates(js)
                )

                if candidates:

                    print(
                        "   FOUND REQUESTS:"
                    )

                    for candidate in candidates:

                        print(
                            "      ",
                            candidate,
                        )

                        all_candidates.append(
                            (
                                filename,
                                candidate,
                            )
                        )

            except Exception as exc:

                print(
                    "   ERROR:",
                    exc,
                )

        # =====================================
        # UNIQUE ENDPOINTS
        # =====================================

        print(
            "\n4. ALL UNIQUE ENDPOINTS"
        )

        unique = []

        seen = set()

        for filename, endpoint in (
            all_candidates
        ):

            if endpoint in seen:
                continue

            seen.add(endpoint)

            unique.append(
                (
                    filename,
                    endpoint,
                )
            )

        for filename, endpoint in unique:

            print(
                f"[{filename}]"
            )

            print(
                "   ",
                endpoint,
            )

        # =====================================
        # SEARCH IMPORTANT FILES
        # =====================================

        print(
            "\n5. IMPORTANT FILES"
        )

        for filename, endpoint in unique:

            text = (
                filename.lower()
                + " "
                + endpoint.lower()
            )

            if any(
                keyword in text
                for keyword in (
                    "maker",
                    "model",
                    "carbase",
                    "search",
                    "json",
                )
            ):

                print(
                    ">>>",
                    filename,
                    endpoint,
                )

        print(
            "\nDONE"
        )


if __name__ == "__main__":
    asyncio.run(main())