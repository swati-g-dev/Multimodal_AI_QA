import whisper
from app.db.mongo import transcripts_collection
from bson import ObjectId

# Load model once (important for performance)
model = whisper.load_model("base")

# Upload Media → Whisper Transcription → Text + Segments → MongoDB
def transcribe_media(file_path: str):
    result = model.transcribe(file_path)
    text = result["text"]
    segments = result["segments"]  # contains timestamps
    return text, segments


def store_transcript(document_id:str, text: str, segments: list):
    """Store transcription in the database."""
    result = transcripts_collection.insert_one({
        "document_id": ObjectId(document_id),
        "text": text,
        "segments": segments
    })
    if not result.inserted_id:
        raise ValueError(f"Failed to store transcript for document {document_id}")
    return result