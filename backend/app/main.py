from fastapi import FastAPI
from app.api.catalog import router as catalog_router
from app.api.filters import router as filters_router
from app.api.monitor import router as monitor_router

app = FastAPI(title="CarManager Monitor", version="0.1.0")
app.include_router(catalog_router, prefix="/api/catalog", tags=["catalog"])
app.include_router(filters_router, prefix="/api/filters", tags=["filters"])
app.include_router(monitor_router, prefix="/api/monitor", tags=["monitor"])

@app.get("/health")
async def health():
    return {"status": "ok"}
