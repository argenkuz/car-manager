from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    carmanager_base_url: str = "https://carmanager.co.kr"
    carmanager_user_id: str = ""
    carmanager_password: str = ""
    database_url: str = "sqlite+aiosqlite:///./car_manager.db"
    telegram_bot_token: str = ""
    telegram_chat_id: str = ""
    monitor_interval_minutes: int = 10
    environment: str = "development"
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

settings = Settings()
