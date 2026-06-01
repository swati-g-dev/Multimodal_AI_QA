from langchain_huggingface import HuggingFaceEmbeddings
from app.db.mongo import transcripts_collection
import numpy as np
from bson import ObjectId

def cosine_similarity(a, b):
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))


def find_best_segment(document_id: str, query: str):
    transcript = transcripts_collection.find_one({
        "document_id": ObjectId(document_id)
    })

    if not transcript:
        return {"error": "Transcript not found"}

    segments = transcript["segments"]

    if not segments:
        return {"error": "No segments available"}

    # Embed query
    embedding_model = HuggingFaceEmbeddings(
        model_name="sentence-transformers/all-MiniLM-L6-v2"
    )
    query_embedding = embedding_model.embed_documents([query])[0]

    best_score = -1
    best_segment = None

    for seg in segments:
        seg_text = seg["text"]

        seg_embedding = embedding_model.embed_documents([seg_text])[0]

        score = cosine_similarity(query_embedding, seg_embedding)

        if score > best_score:
            best_score = score
            best_segment = seg

    if not best_segment:
        return {"error": "No relevant segment found"}

    return {
        "text": best_segment["text"],
        "start": best_segment["start"],
        "end": best_segment["end"]
    }