from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    GROQ_API_KEY: str
    MODEL_NAME: str = "llama-3.3-70b-versatile"
    TEMPERATURE: float = 0
    CHROMA_DB_PATH: str
    KNOWLEDGE_BASE_PATH: str
    UPLOAD_PATH: str

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore"
    )


settings = Settings()
# Reboot the server space 1