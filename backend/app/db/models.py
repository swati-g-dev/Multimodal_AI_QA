from pydantic import BaseModel
from typing import List, Optional

class Document(BaseModel):
    filename: str
    file_type: str
    path: str

class Chunk(BaseModel):
    document_id: str
    text: str
    embedding: Optional[List[float]]

class Transcript(BaseModel):
    document_id: str
    text: str
    segments: list