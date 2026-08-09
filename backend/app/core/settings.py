from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    GOOGLE_API_KEY: str
    MODEL_NAME: str = "gemini-2.5-flash"
    TEMPERATURE: float = 0
    CHROMA_DB_PATH: str
    KNOWLEDGE_BASE_PATH: str
    UPLOAD_PATH: str

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore"
    )


settings = Settings()
# Force uvicorn reload to pick up .env changes