from sqlalchemy import create_engine, inspect, text
from sqlalchemy.orm import DeclarativeBase, sessionmaker
from app.config import settings


class Base(DeclarativeBase):
    pass


engine = create_engine(
    settings.database_url.replace("+aiosqlite", ""),
    connect_args={"check_same_thread": False} if settings.database_url.startswith("sqlite") else {},
)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    from app.models import Filter, SeenCar, MonitorSettings
    Base.metadata.create_all(bind=engine)

    # Lightweight SQLite migration for installations created before advanced filters.
    if settings.database_url.startswith("sqlite"):
        inspector = inspect(engine)
        columns = {c["name"] for c in inspector.get_columns("filters")}
        additions = {
            "model_detail_id": "VARCHAR(100)",
            "grade_id": "VARCHAR(100)",
            "grade_detail_id": "VARCHAR(100)",
            "fuel_ids": "VARCHAR(1000)",
            "mission_ids": "VARCHAR(1000)",
            "color_ids": "VARCHAR(1000)",
            "option_ids": "VARCHAR(2000)",
            "accident": "VARCHAR(30)",
            "sido_ids": "VARCHAR(1000)",
            "sido_area_ids": "VARCHAR(1000)",
            "danji_ids": "VARCHAR(2000)",
        }
        with engine.begin() as conn:
            for name, sql_type in additions.items():
                if name not in columns:
                    conn.execute(text(f"ALTER TABLE filters ADD COLUMN {name} {sql_type}"))
