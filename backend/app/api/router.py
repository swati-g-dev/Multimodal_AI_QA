from fastapi import APIRouter
from app.api.routes import health, upload, chat, summary, timestamp

api_router = APIRouter()

api_router.include_router(health.router, tags=["Health"])
api_router.include_router(upload.router)
api_router.include_router(chat.router)
api_router.include_router(summary.router)
api_router.include_router(timestamp.router)