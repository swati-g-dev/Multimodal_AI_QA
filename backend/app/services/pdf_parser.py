from pypdf import PdfReader
from app.db.mongo import documents_collection

def extract_text_from_pdf(file_path: str) -> str:
    reader = PdfReader(file_path)
    text = ""

    for page in reader.pages:
        extracted = page.extract_text()
        if extracted:
            text += extracted + "\n"

    return text


def store_pdf_text(document_id: str, text: str):
    documents_collection.update_one(
        {"_id": document_id},
        {"$set": {"extracted_text": text}}
    )