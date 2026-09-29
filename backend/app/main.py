from contextlib import asynccontextmanager
import asyncio
from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.auth import get_current_user
from app.config import settings
from app.database import init_db
from app.api.auth import router as auth_router
from app.api.catalog import router as catalog_router
from app.api.filters import router as filters_router
from app.api.monitor import router as monitor_router
from app.api.search import router as search_router
from app.api.telegram import router as telegram_router
from app.monitor import monitor_loop


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    stop_event = asyncio.Event()
    task = asyncio.create_task(monitor_loop(stop_event))
    app.state.monitor_stop_event = stop_event
    app.state.monitor_task = task
    yield
    stop_event.set()
    await task


app = FastAPI(title="CarManager Monitor", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.frontend_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/api/auth", tags=["auth"])
protected = [Depends(get_current_user)]
app.include_router(catalog_router, prefix="/api/catalog", tags=["catalog"], dependencies=protected)
app.include_router(filters_router, prefix="/api/filters", tags=["filters"], dependencies=protected)
app.include_router(search_router, prefix="/api/search", tags=["search"], dependencies=protected)
app.include_router(monitor_router, prefix="/api/monitor", tags=["monitor"], dependencies=protected)
app.include_router(telegram_router, prefix="/api/telegram", tags=["telegram"])


@app.get("/health")
async def health():
    return {"status": "ok", "service": "car-manager-backend", "search_configured": bool(settings.carmanager_search_path)}
