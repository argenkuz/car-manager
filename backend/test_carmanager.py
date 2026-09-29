import asyncio

import httpx

from app.config import settings


async def main():
    if not settings.carmanager_user_id or not settings.carmanager_password:
        raise RuntimeError("CARMANAGER_USER_ID/CARMANAGER_PASSWORD are not configured")

    async with httpx.AsyncClient(
        base_url=settings.carmanager_base_url,
        follow_redirects=False,
        timeout=30,
        headers={
            "User-Agent": (
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/140.0.0.0 Safari/537.36"
            )
        },
    ) as client:
        print("1. GET login...")
        response = await client.get("/User/Login/")
        print("GET:", response.status_code)
        print("Cookies:", client.cookies)

        print("\n2. POST login...")
        response = await client.post(
            "/User/Login",
            data={
                "sbxgubun": "1",
                "returnurl": "",
                "userid": settings.carmanager_user_id,
                "userpwd": settings.carmanager_password,
            },
        )
        print("POST:", response.status_code)
        print("Location:", response.headers.get("location"))
        print("Cookies:", client.cookies)

        print("\n3. GET main...")
        response = await client.get("/")
        print("MAIN:", response.status_code)
        print("URL:", response.url)
        print("Length:", len(response.text))
        print("\nFirst 1000 chars:")
        print(response.text[:1000])


if __name__ == "__main__":
    asyncio.run(main())
