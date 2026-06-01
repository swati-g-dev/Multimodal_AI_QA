from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from app.services.qa_service import generate_answer

router = APIRouter(prefix="/chat", tags=["Chat"])

class ChatRequest(BaseModel):
    query: str
    document_id: str

@router.post("/", status_code=status.HTTP_200_OK)
async def chat(req: ChatRequest):
    if not req.query.strip() or not req.document_id.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Fields 'query' and 'document_id' cannot be blank."
        )
    
    result = generate_answer(req.query, req.document_id)
    return result