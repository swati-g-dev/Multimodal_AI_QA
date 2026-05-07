import os
from app.storage.file_manager import save_file
from app.db.mongo import documents_collection

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
        "path": path
    }

    result = documents_collection.insert_one(doc)

    return {
        "document_id": str(result.inserted_id),
        "file_type": file_type,
        "path": path
    }