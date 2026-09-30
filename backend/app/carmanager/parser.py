from __future__ import annotations
import re
from urllib.parse import urljoin
from app.carmanager.models import Car

def _text(fragment: str) -> str:
    return re.sub(r"<[^>]+>", " ", fragment)

def _year(value: str) -> int | None:
    m=re.search(r"(19|20)\d{2}",value)
    return int(m.group(0)) if m else None

def _mileage(value: str) -> int | None:
    m=re.search(r"(\d+(?:\.\d+)?)\s*(만|천)?",value.replace(",",""))
    if not m:return None
    n=float(m.group(1))
    if m.group(2)=="만":n*=10000
    if m.group(2)=="천":n*=1000
    return int(n)

def _price(value: str) -> int | None:
    if not value or "상담" in value:return None
    digits=re.sub(r"[^0-9]","",value)
    return int(digits) if digits else None

def _field(row: str, pattern: str) -> str:
    m=re.search(pattern,row,re.I|re.S)
    return _text(m.group(1)).strip() if m else ""

def parse_cars(html: str, base_url: str, enc_check: str | None = None) -> list[Car]:
    rows=re.findall(r'<tr[^>]*class=["\'][^"\']*uc_carcss[^"\']*["\'][^>]*>(.*?)</tr>',html,re.I|re.S)
    result=[];seen=set()
    for row in rows:
        m=re.search(r'data-carno=["\']([^"\']+)',row,re.I)
        if not m:m=re.search(r'class=["\']custom-check["\'][^>]*value=["\']([^"\']+)',row,re.I)
        if not m:continue
        car_id=m.group(1)
        if car_id in seen:continue
        maker=_field(row,r'class=["\'][^"\']*uc_carmaker[^"\']*["\'][^>]*>(.*?)</')
        title=_field(row,r'<td[^>]*class=["\'][^"\']*uc_textleft[^"\']*["\'][^>]*>.*?<a[^>]*>(.*?)</a>')
        year=_field(row,r'class=["\'][^"\']*uc_carreg[^"\']*["\'][^>]*>(.*?)</')
        mileage=_field(row,r'class=["\'][^"\']*uc_carusekm[^"\']*["\'][^>]*>(.*?)</')
        price=_field(row,r'class=["\'][^"\']*uc_caramount[^"\']*["\'][^>]*>(.*?)</')
        area=_field(row,r'class=["\'][^"\']*uc_cararea[^"\']*["\'][^>]*>(.*?)</')
        dealer=_field(row,r'class=["\'][^"\']*uc_cardealer[^"\']*["\'][^>]*>(.*?)</')
        phone=_field(row,r'class=["\'][^"\']*uc_cardealer_phone[^"\']*["\'][^>]*>(.*?)</')
        img=re.search(r'<img[^>]*class=["\'][^"\']*thumbnail[^"\']*[^>]*src=["\']([^"\']+)',row,re.I|re.S)
        hrefs=re.findall(r'<a[^>]+href=["\\']([^"\\']+)["\\']',row,re.I|re.S)
        car_url=next((urljoin(base_url,h) for h in hrefs if "/Car/" in h or "CarNo" in h or "carno" in h),None)
        location=area
        if dealer:location=f"{location} · {dealer}" if location else dealer
        if phone:location=f"{location} · {phone}" if location else phone
        seen.add(car_id)
        result.append(Car(id=car_id,title=title or car_id,brand=maker.strip("[]") or None,model=title or None,year=_year(year),mileage=_mileage(mileage),price=_price(price),location=location or None,url=car_url,image_url=urljoin(base_url,img.group(1)) if img else None))
    return result
