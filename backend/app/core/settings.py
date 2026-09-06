from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict

ENV_PATH = Path(__file__).resolve().parent.parent.parent / ".env"


class Settings(BaseSettings):
    GROQ_API_KEY: str = ""
    MODEL_NAME: str = "llama-3.3-70b-versatile"
    TEMPERATURE: float = 0
    CHROMA_DB_PATH: str = "app/chroma_db"
    KNOWLEDGE_BASE_PATH: str = "../knowledge_base"
    UPLOAD_PATH: str = "app/uploads/pdf"

    model_config = SettingsConfigDict(
        env_file=(".env", str(ENV_PATH)),
        extra="ignore"
    )


settings = Settings()