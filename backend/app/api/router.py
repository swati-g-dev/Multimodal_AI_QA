from fastapi import APIRouter
from app.api.routes import health,upload

api_router = APIRouter()

api_router.include_router(health.router, tags=["Health"])

# User Upload → Validate → Save File → Store in MongoDB → Return document_id
api_router.include_router(upload.router)