import os
from bson import ObjectId
from app.storage.file_manager import save_file
from app.db.mongo import documents_collection
from app.services.pdf_parser import extract_text_from_pdf, store_pdf_text

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
    # Validate file type
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

    text = None

# Upload PDF → Save file → Extract text → Store in MongoDB
    # PDF Processing
    if file_type == "pdf":
        text = extract_text_from_pdf(path)
        store_pdf_text(ObjectId(document_id), text)


    return {
        "document_id": str(result.inserted_id),
        "file_type": file_type,
        "path": path,
        "extracted_text": text 
    }