from fastapi import FastAPI
from app.api.router import api_router
from app.config import settings

def create_app() -> FastAPI:
    app = FastAPI(
        title=settings.APP_NAME,
        debug=settings.DEBUG
    )

    app.include_router(api_router)

    return app

app = create_app()