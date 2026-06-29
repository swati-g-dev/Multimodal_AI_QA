from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_NAME: str = "Omni Context"
    DEBUG: bool = True

    GROQ_API_KEY: str

    MONGO_URI: str
    REDIS_HOST: str
    REDIS_PORT: int

    class Config:
        env_file = ".env"

settings = Settings()