import os
from bson import ObjectId
from app.storage.file_manager import save_file
from app.db.mongo import documents_collection
from app.services.pdf_parser import extract_text_from_pdf, store_pdf_text
from app.services.transcription import transcribe_media, store_transcript
from app.services.chunker import chunk_text
from app.services.vector_store import add_to_vectorstore

ALLOWED_TYPES = {
    "pdf": "pdf",
    "mp3": "audio",
    "wav": "audio",
    "mp4": "video",
    "mov": "video"
}

def get_file_type(filename: str):
    ext = filename.split(".")[-1].lower()
    return ALLOWED_TYPES.get(ext)

async def process_upload(file):
    file_type = get_file_type(file.filename)
    if not file_type:
        raise ValueError("Unsupported file type")

    # Save file locally
    path = save_file(file)

    # Store metadata in MongoDB
    doc = {
        "filename": file.filename,
        "file_type": file_type,
        "path": path,
    }

    result = documents_collection.insert_one(doc)
    document_id = str(result.inserted_id)

    text=""

    # PDF Processing
    if file_type == "pdf":
        try:
            text = extract_text_from_pdf(path)
            if not text.strip():
                raise ValueError("No text extracted from PDF")
            store_pdf_text(ObjectId(document_id), text)
        except Exception as e:
            raise ValueError(f"Failed to process PDF: {str(e)}")

    # Audio/Video Processing
    if file_type in ["audio", "video"]:
        try:
            text, segments = transcribe_media(path)
            store_transcript(document_id, text, segments)
        except Exception as e:
            raise ValueError(f"Failed to process media: {str(e)}")
        
    # Embedding Pipeline
# Upload → Extract text → Chunk → Embed → Store in FAISS
    if text:
        chunks = chunk_text(text)
        add_to_vectorstore(chunks, document_id)


    return {
        "document_id": document_id,
        "file_type": file_type,
        "path": path,
    }