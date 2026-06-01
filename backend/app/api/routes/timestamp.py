from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.timestamp_service import find_best_segment

router = APIRouter(prefix="/timestamp", tags=["Timestamp"])

class TimestampRequest(BaseModel):
    document_id: str
    query: str

@router.post("/")
async def timestamp(req: TimestampRequest):
    if not req.document_id or not req.query:
        raise HTTPException(status_code=400, detail="document_id and query are required")

    try:
        return find_best_segment(req.document_id, req.query)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
