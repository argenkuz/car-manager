from dataclasses import dataclass
import os

@dataclass(frozen=True)
class Settings:
    base_url: str = os.getenv("CAR_MANAGER_URL", "https://www.carmanager.co.kr")
    timeout: float = float(os.getenv("CAR_MANAGER_TIMEOUT", "15"))
    user_agent: str = os.getenv(
        "CAR_MANAGER_USER_AGENT",
        "car-manager-research/0.1",
    )

settings = Settings()
