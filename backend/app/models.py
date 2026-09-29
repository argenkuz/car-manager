from datetime import datetime
from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column
from app.database import Base

class Filter(Base):
    __tablename__ = "filters"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(120), default="Новый фильтр")
    enabled: Mapped[bool] = mapped_column(Boolean, default=True)
    brand_id: Mapped[str | None] = mapped_column(String(100))
    model_id: Mapped[str | None] = mapped_column(String(100))
    min_year: Mapped[int | None] = mapped_column(Integer)
    max_year: Mapped[int | None] = mapped_column(Integer)
    min_mileage: Mapped[int | None] = mapped_column(Integer)
    max_mileage: Mapped[int | None] = mapped_column(Integer)
    min_price: Mapped[int | None] = mapped_column(Integer)
    max_price: Mapped[int | None] = mapped_column(Integer)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class SeenCar(Base):
    __tablename__ = "seen_cars"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    filter_id: Mapped[int] = mapped_column(ForeignKey("filters.id", ondelete="CASCADE"), index=True)
    car_id: Mapped[str] = mapped_column(String(200), index=True)
    seen_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    notified: Mapped[bool] = mapped_column(Boolean, default=False)

class MonitorSettings(Base):
    __tablename__ = "monitor_settings"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, default=1)
    enabled: Mapped[bool] = mapped_column(Boolean, default=False)
    interval_minutes: Mapped[int] = mapped_column(Integer, default=10)
    next_run_at: Mapped[datetime | None] = mapped_column(DateTime)
