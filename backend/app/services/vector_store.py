import os
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_core.documents import Document

VECTOR_DIR = "vector_store"

embedding_model = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

def add_to_vectorstore(chunks: list[str], document_id: str):
    doc_dir = os.path.join(VECTOR_DIR, document_id)
    docs = [
        Document(
            page_content=chunk,
            metadata={"document_id": document_id}
        )
        for chunk in chunks
    ]

    # Create or update isolated index per document ID
    vector_db = FAISS.from_documents(docs, embedding_model)
    vector_db.save_local(doc_dir)

# caching
loaded_indexes = {}

def get_document_retriever(document_id: str, k: int = 5):
    doc_dir = os.path.join(VECTOR_DIR, document_id)
    if not os.path.exists(doc_dir):
        raise ValueError(f"No vector index found for document: {document_id}")

    # Check cache first
    if document_id not in loaded_indexes:
        loaded_indexes[document_id] = FAISS.load_local(
            doc_dir,
            embedding_model,
            allow_dangerous_deserialization=True
        )

    return loaded_indexes[document_id].as_retriever(
        search_kwargs={"k": k}
    )