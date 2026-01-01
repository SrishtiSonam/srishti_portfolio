import os
from pathlib import Path
from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    """Application configuration settings"""
    
    # App Info
    APP_NAME: str = "AI Portfolio Platform"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True
    
    # Server
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    
    # Database
    DATABASE_URL: str = "sqlite:///./portfolio.db"
    # For production PostgreSQL: "postgresql://user:password@host:port/dbname"
    
    # JWT Authentication
    SECRET_KEY: str = "your-secret-key-change-this-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # CORS
    CORS_ORIGINS: list = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:5174",
        "https://*.vercel.app",
    ]
    
    # AI Configuration
    AI_MODEL_NAME: str = "all-MiniLM-L6-v2"  # sentence-transformers model
    VECTOR_STORE_PATH: str = "./data/vector_store"
    EMBEDDING_DIMENSION: int = 384
    MAX_CONTEXT_LENGTH: int = 2000
    
    # OpenAI (Optional - for advanced AI features)
    OPENAI_API_KEY: Optional[str] = None
    USE_OPENAI: bool = False
    
    # Voice (Optional - for external voice APIs)
    GOOGLE_CLOUD_API_KEY: Optional[str] = None
    USE_EXTERNAL_VOICE: bool = False
    
    # File Upload
    UPLOAD_DIR: str = "./uploads"
    MAX_UPLOAD_SIZE: int = 10 * 1024 * 1024  # 10MB
    ALLOWED_EXTENSIONS: set = {".pdf", ".jpg", ".jpeg", ".png"}
    
    # GitHub Fallback
    GITHUB_REPO_URL: str = "https://github.com/yourusername/portfolio"
    
    # Admin
    ADMIN_EMAIL: str = "admin@example.com"
    ADMIN_PASSWORD: str = "changeme123"  # Change this!
    
    class Config:
        env_file = ".env"
        case_sensitive = True

# Create settings instance
settings = Settings()

# Create necessary directories
Path(settings.UPLOAD_DIR).mkdir(parents=True, exist_ok=True)
Path(settings.VECTOR_STORE_PATH).mkdir(parents=True, exist_ok=True)
