from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services.file_processor import process_upload

router = APIRouter(prefix="/upload", tags=["Upload"])

@router.post("/")
async def upload_file(file: UploadFile = File(...)):
    try:
        result = await process_upload(file)
        return {
            "message": "File uploaded successfully",
            "data": result
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))