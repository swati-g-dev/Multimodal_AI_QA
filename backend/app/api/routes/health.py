# inside any route file
# from app.storage.file_manager import save_file

from fastapi import APIRouter

router = APIRouter()

@router.get("/health")
def health_check():
    return {"status": "ok"}

