from pymongo import MongoClient
from app.config import settings

client = MongoClient(settings.MONGO_URI)
db = client["multimodal_ai_qa"]

documents_collection = db["documents"]
chunks_collection = db["chunks"]
transcripts_collection = db["transcripts"]