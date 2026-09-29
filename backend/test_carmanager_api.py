import asyncio
import httpx


BASE_URL = "https://carmanager.co.kr"

USER_ID = "tmdgusc1420"
PASSWORD = "asdf7344"

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/140.0.0.0 Safari/537.36"
    ),
    "Referer": "https://carmanager.co.kr/",
    "X-Requested-With": "XMLHttpRequest",
}


async def main():

    async with httpx.AsyncClient(
        base_url=BASE_URL,
        headers=HEADERS,
        timeout=30,
        follow_redirects=False,
    ) as client:

        # =========================
        # LOGIN
        # =========================

        print("LOGIN")

        response = await client.post(
            "/User/Login",
            data={
                "sbxgubun": "1",
                "returnurl": "",
                "userid": USER_ID,
                "userpwd": PASSWORD,
            },
        )

        print("Status:", response.status_code)
        print("Location:", response.headers.get("location"))

        if response.status_code not in {
            301, 302, 303, 307, 308
        }:
            print("LOGIN FAILED")
            return

        print("LOGIN OK")

        # =========================
        # MAKERS
        # =========================

        print("\nREQUEST MAKERS")

        response = await client.get(
            "/CarBase/JsonBaseCarMaker"
        )

        print("Status:", response.status_code)
        print(
            "Content-Type:",
            response.headers.get("content-type"),
        )
        print(
            "Length:",
            len(response.text),
        )

        print("\n========== RESPONSE ==========\n")

        print(response.text[:10000])

        print("\n==============================")

        # =========================
        # SAVE RESPONSE
        # =========================

        with open(
            "backend/carmanager_makers_response.txt",
            "w",
            encoding="utf-8",
        ) as file:

            file.write(response.text)

        print(
            "\nSaved:"
            " backend/carmanager_makers_response.txt"
        )


if __name__ == "__main__":
    asyncio.run(main())