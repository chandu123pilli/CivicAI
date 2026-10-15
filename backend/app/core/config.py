from pathlib import Path
from pydantic_settings import BaseSettings
from typing import List, Optional
import os

BASE_DIR = Path(__file__).resolve().parent.parent.parent
DEFAULT_DB_FILE = (BASE_DIR / "civicai.db").as_posix()

class Settings(BaseSettings):
    PROJECT_NAME: str = "CivicAI"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    SECRET_KEY: str = "civicai-super-secret-jwt-key-vortex-hackathon-2026-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    
    DATABASE_URL: str = f"sqlite:///{DEFAULT_DB_FILE}"
    
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:4173",
    ]
    
    UPLOAD_DIR: str = "uploads"
    MAX_UPLOAD_SIZE_BYTES: int = 10 * 1024 * 1024  # 10 MB
    
    GEMINI_API_KEY: Optional[str] = None
    
    # Duplicate detection parameters
    SIMILARITY_DISTANCE_KM: float = 1.0  # 1km radius
    SIMILARITY_SCORE_THRESHOLD: float = 0.50

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
