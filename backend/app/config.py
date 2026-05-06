from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_NAME: str = "Multimodal AI QA"
    DEBUG: bool = True

    OPENAI_API_KEY: str

    MONGO_URI: str
    REDIS_HOST: str
    REDIS_PORT: int

    class Config:
        env_file = ".env"

settings = Settings()