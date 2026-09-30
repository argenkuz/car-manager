from __future__ import annotations

import json
import os
import re
from pathlib import Path

import httpx
from bs4 import BeautifulSoup
from dotenv import load_dotenv


ROOT = Path(__file__).resolve().parent
load_dotenv(ROOT / ".env")
OUT = ROOT / "data" / "carmanager_filters.json"
BASE_URL = os.getenv("CARMANAGER_BASE_URL", "https://carmanager.co.kr").rstrip("/")
USER_ID = os.getenv("CARMANAGER_USER_ID", "")
PASSWORD = os.getenv("CARMANAGER_PASSWORD", "")


def read_js_array(path: Path, variable: str):
    source = path.read_text(encoding="utf-8-sig")
    match = re.search(rf"\bvar\s+{re.escape(variable)}\s*=\s*", source)
    if not match:
        return []
    raw = source[match.end():].strip()
    if raw.endswith(";"):
        raw = raw[:-1].rstrip()
    return json.loads(raw)


def select_options(soup: BeautifulSoup, select_id: str):
    node = soup.find("select", id=select_id)
    if node is None:
        return []
    return [
        {"id": str(o.get("value")).strip(), "name": o.get_text(" ", strip=True)}
        for o in node.find_all("option")
        if str(o.get("value") or "").strip() and o.get_text(" ", strip=True)
    ]


def normalize(items, id_key: str, name_key: str):
    return [
        {"id": str(x[id_key]), "name": str(x[name_key])}
        for x in (items or [])
        if isinstance(x, dict) and x.get(id_key) not in (None, "") and x.get(name_key)
    ]


def main():
    if not USER_ID or not PASSWORD:
        raise SystemExit("CARMANAGER_USER_ID/CARMANAGER_PASSWORD не заданы в .env")

    with httpx.Client(
        base_url=BASE_URL,
        timeout=60,
        follow_redirects=True,
        headers={"User-Agent": "Mozilla/5.0"},
    ) as client:
        login = client.post(
            "/User/Login",
            data={
                "sbxgubun": "1",
                "returnurl": "/Car/Data",
                "userid": USER_ID,
                "userpwd": PASSWORD,
            },
            follow_redirects=False,
        )
        if login.status_code not in {301, 302, 303, 307, 308}:
            raise SystemExit(f"CarManager login failed: HTTP {login.status_code}")

        page = client.get("/Car/Data")
        page.raise_for_status()
        soup = BeautifulSoup(page.text, "html.parser")

        result = {
            "fuel": select_options(soup, "cbxSearchFuel"),
            "mission": select_options(soup, "cbxSearchMission"),
            "color": select_options(soup, "cbxSearchColor"),
            "price_from": select_options(soup, "cbxSearchMoneyS"),
            "price_to": select_options(soup, "cbxSearchMoneyE"),
            "year_from": select_options(soup, "cbxSearchMakeSYear"),
            "year_to": select_options(soup, "cbxSearchMakeEYear"),
            "mileage_from": select_options(soup, "cbxSearchDriveS"),
            "mileage_to": select_options(soup, "cbxSearchDriveE"),
        }

        endpoints = {
            "option": ("/CarBase/JsonBaseCarOptionBase", "CarOptionNo", "CarOptionName"),
            "option_etc": ("/CarBase/JsonBaseCarOptionEtc", "CarOptionNo", "CarOptionName"),
        }
        for key, (path, id_key, name_key) in endpoints.items():
            response = client.post(
                path,
                json={},
                headers={
                    "Content-Type": "application/json; charset=utf-8",
                    "X-Requested-With": "XMLHttpRequest",
                    "Referer": f"{BASE_URL}/Car/Data",
                },
            )
            response.raise_for_status()
            result[key] = normalize(response.json(), id_key, name_key)

        base = ROOT / "carmanager_js"
        result["sido"] = [
            {"id": str(x["SiDoNo"]), "name": str(x["SiDoCodeName"])}
            for x in read_js_array(base / "carmanager_BaseSido.js", "BaseSido")
        ]

        areas = read_js_array(base / "carmanager_BaseSidoArea.js", "BaseSidoArea")
        result["sido_area"] = {
            str(k): [
                {"id": str(x["AreaNo"]), "name": str(x["AreaCodeName"])}
                for x in values
            ]
            for k, values in areas.items()
        }

        danji = read_js_array(base / "carmanager_BaseDanji.js", "BaseDanji")
        result["danji"] = {
            str(k): [
                {"id": str(x["DanjiNo"]), "name": str(x.get("DanjiName", ""))}
                for x in values
                if x.get("DanjiNo") not in (None, "") and x.get("DanjiName")
            ]
            for k, values in danji.items()
        }

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8")

    print(f"Saved: {OUT}")
    for key, value in result.items():
        print(f"{key}: {len(value)}" if isinstance(value, list) else f"{key}: {len(value)} groups")


if __name__ == "__main__":
    main()
