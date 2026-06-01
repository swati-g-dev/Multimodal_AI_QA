from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.summarizer import generate_summary, generate_summary_long, get_document_text

router = APIRouter(prefix="/summary", tags=["Summary"])

class SummaryRequest(BaseModel):
    document_id: str

@router.post("/")
async def summarize(req: SummaryRequest):
    try:
        text = get_document_text(req.document_id)
        
        if not text.strip():
            raise HTTPException(status_code=44, detail="Document content not found.")

        if len(text) < 12000:
            return generate_summary(req.document_id)
        else:
            return generate_summary_long(req.document_id)
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))