from __future__ import annotations

import re
from typing import Any

import httpx
from bs4 import BeautifulSoup

from app.config import settings


class CarManagerClient:
    """Authenticated CarManager HTTP client.

    CarManager's vehicle search is a two-step flow:
    1. authenticated GET /Car/Data to obtain EncCheck/PrePage;
    2. JSON POST /Car/DataPart with the search parameters.
    """

    SEARCH_PATH = "/Car/DataPart"

    def __init__(self) -> None:
        self.client = httpx.AsyncClient(
            base_url=settings.carmanager_base_url.rstrip("/"),
            timeout=httpx.Timeout(60.0, connect=30.0),
            follow_redirects=False,
            headers={
                "User-Agent": (
                    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                    "AppleWebKit/537.36 (KHTML, like Gecko) "
                    "Chrome/140.0.0.0 Safari/537.36"
                )
            },
        )
        self.authenticated = False
        self.enc_check = ""
        self.pre_page = ""
        self.search_html = ""

    async def login(self) -> bool:
        if not settings.carmanager_user_id or not settings.carmanager_password:
            return False

        response = await self.client.post(
            "/User/Login",
            data={
                "sbxgubun": "1",
                "returnurl": "/Car/Data",
                "userid": settings.carmanager_user_id,
                "userpwd": settings.carmanager_password,
            },
            follow_redirects=False,
        )
        self.authenticated = response.status_code in {301, 302, 303, 307, 308}
        if not self.authenticated:
            return False

        return await self._load_search_context()

    async def _load_search_context(self) -> bool:
        response = await self.client.get("/Car/Data")
        if response.status_code in {301, 302, 303, 307, 308} or "User/Login" in str(response.url):
            self.authenticated = False
            return False
        if response.status_code != 200:
            self.authenticated = False
            return False

        soup = BeautifulSoup(response.text, "html.parser")
        self.enc_check = self._input_value(soup, "EncCheck")
        self.pre_page = self._input_value(soup, "PrePage")
        self.search_html = response.text

        # EncCheck is required by /Car/DataPart. Treat an HTML login page as
        # an authentication failure instead of sending a malformed search.
        if not self.enc_check:
            self.authenticated = False
            return False
        return True

    def get_search_filter_catalog(self) -> dict[str, list[dict[str, str]]]:
        """Read filter select options exactly as CarManager renders them."""
        if not self.search_html:
            return {}
        soup = BeautifulSoup(self.search_html, "html.parser")

        def select_options(select_id: str) -> list[dict[str, str]]:
            node = soup.find("select", id=select_id)
            if node is None:
                return []
            result = []
            for option in node.find_all("option"):
                value = str(option.get("value") or "").strip()
                label = option.get_text(" ", strip=True)
                if value and label:
                    result.append({"id": value, "name": label})
            return result

        return {
            "fuel": select_options("cbxSearchFuel"),
            "mission": select_options("cbxSearchMission"),
            "color": select_options("cbxSearchColor"),
            "sido": select_options("cbxSearchSiDo"),
            "price_from": select_options("cbxSearchMoneyS"),
            "price_to": select_options("cbxSearchMoneyE"),
            "year_from": select_options("cbxSearchMakeSYear"),
            "year_to": select_options("cbxSearchMakeEYear"),
            "mileage_from": select_options("cbxSearchDriveS"),
            "mileage_to": select_options("cbxSearchDriveE"),
            "option": select_options("cbxSearchOption"),
        }

    @staticmethod
    def _input_value(soup: BeautifulSoup, name: str) -> str:
        node = soup.find("input", attrs={"name": name})
        if node is None:
            node = soup.find("input", attrs={"id": name})
        return str(node.get("value") or "").strip() if node else ""

    async def ensure_login(self) -> None:
        if self.authenticated and self.enc_check:
            return
        if not await self.login():
            raise RuntimeError("CarManager authentication failed")

    async def get(self, path: str, **kwargs: Any) -> httpx.Response:
        await self.ensure_login()
        response = await self.client.get(path, **kwargs)
        if response.status_code in {401, 403}:
            self.authenticated = False
            await self.ensure_login()
            response = await self.client.get(path, **kwargs)
        return response

    @staticmethod
    def _join(values: Any) -> str:
        if values is None:
            return ""
        if isinstance(values, (list, tuple, set)):
            return ",".join(str(x) for x in values if str(x))
        return str(values)

    @staticmethod
    def _number(value: Any) -> str:
        return "" if value is None else str(value)

    def _build_search_payload(self, filters: dict[str, Any], page: int = 1, page_size: int = 50) -> dict:
        # Values mirror reLoadJsonCarDataMulti/reLoadJsonCarDataCs from
        # CarManager's own sCarData.js.
        min_year = filters.get("min_year")
        max_year = filters.get("max_year")
        min_mileage = filters.get("min_mileage")
        max_mileage = filters.get("max_mileage")
        min_price = filters.get("min_price")
        max_price = filters.get("max_price")

        return {
            "para": {
                "EncCheck": self.enc_check,
                "PrePage": self.pre_page,
                "PageNow": page,
                "PageSize": page_size,
                "PageSort": "1",
                "PageAscDesc": "0",
                "CarMode": "0",
                "CarSiDoNo": self._join(filters.get("sido_ids")),
                "CarSiDoAreaNo": self._join(filters.get("sido_area_ids")),
                "CarDanjiNo": self._join(filters.get("danji_ids")),
                "CarMakerNo": self._number(filters.get("brand_id")),
                "CarModelNo": self._number(filters.get("model_id")),
                "CarModelDetailNo": self._number(filters.get("model_detail_id")),
                "CarGradeNo": self._number(filters.get("grade_id")),
                "CarGradeDetailNo": self._number(filters.get("grade_detail_id")),
                "CarMakeSDate": f"{min_year}-01" if min_year else "",
                "CarMakeEDate": f"{max_year}-12" if max_year else "",
                "CarDriveSKm": self._number(min_mileage),
                "CarDriveEKm": self._number(max_mileage),
                "CarMission": self._join(filters.get("mission_ids")),
                "CarFuel": self._join(filters.get("fuel_ids")),
                "CarColor": self._join(filters.get("color_ids")),
                "CarSMoney": self._number(min_price),
                "CarEMoney": self._number(max_price),
                "CarIsLPG": "False",
                "CarIsSago": "True" if filters.get("accident") == "0" else "False",
                "CarIsPhoto": "False",
                "CarIsSaleAmount": "False",
                "CarIsCarCheck": "False",
                "CarIsLeaseCheck": "False",
                "CarName": "",
                "CarDealerName": "",
                "CarShopName": "",
                "CarDealerHP": "",
                "CarNumber": "",
                "CarOption": self._join(filters.get("option_ids")),
                "CarTruckTonS": "",
                "CarTruckTonE": "",
            }
        }

    async def post_json(self, path: str, data: Any | None = None) -> Any:
        """POST to a CarManager JSON catalog endpoint using the authenticated session."""
        await self.ensure_login()
        response = await self.client.post(
            path,
            json={} if data is None else data,
            headers={
                "Content-Type": "application/json; charset=utf-8",
                "X-Requested-With": "XMLHttpRequest",
                "Referer": f"{settings.carmanager_base_url.rstrip('/')}/Car/Data",
            },
        )

        if response.status_code in {301, 302, 303, 307, 308} or "User/Login" in str(response.url):
            self.authenticated = False
            await self.ensure_login()
            response = await self.client.post(
                path,
                json=data if data is not None else {},
                headers={
                    "Content-Type": "application/json; charset=utf-8",
                    "X-Requested-With": "XMLHttpRequest",
                    "Referer": f"{settings.carmanager_base_url.rstrip('/')}/Car/Data",
                },
            )

        response.raise_for_status()
        return response.json()

    async def search(self, filters: dict[str, Any], page: int = 1, page_size: int = 50) -> httpx.Response:
        await self.ensure_login()
        payload = self._build_search_payload(filters, page=page, page_size=page_size)
        response = await self.client.post(
            self.SEARCH_PATH,
            json=payload,
            headers={
                "Content-Type": "application/json; charset=utf-8",
                "X-Requested-With": "XMLHttpRequest",
                "Referer": f"{settings.carmanager_base_url.rstrip('/')}/Car/Data",
            },
        )

        # A stale session may redirect to the login page. Refresh the
        # authenticated search context once and retry.
        if response.status_code in {301, 302, 303, 307, 308} or "User/Login" in str(response.url):
            self.authenticated = False
            await self.ensure_login()
            payload = self._build_search_payload(filters, page=page, page_size=page_size)
            response = await self.client.post(
                self.SEARCH_PATH,
                json=payload,
                headers={
                    "Content-Type": "application/json; charset=utf-8",
                    "X-Requested-With": "XMLHttpRequest",
                    "Referer": f"{settings.carmanager_base_url.rstrip('/')}/Car/Data",
                },
            )
        return response

    async def close(self) -> None:
        await self.client.aclose()
