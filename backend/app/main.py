from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.api.catalog import router as catalog_router
from app.api.filters import router as filters_router
from app.api.monitor import router as monitor_router
from app.api.search import router as search_router

app = FastAPI(title="CarManager Monitor", version="0.2.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.frontend_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(catalog_router, prefix="/api/catalog", tags=["catalog"])
app.include_router(filters_router, prefix="/api/filters", tags=["filters"])
app.include_router(search_router, prefix="/api/search", tags=["search"])
app.include_router(monitor_router, prefix="/api/monitor", tags=["monitor"])


@app.get("/health")
async def health() -> dict:
    return {"status": "ok", "service": "car-manager-backend"}
