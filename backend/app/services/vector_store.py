import os
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_core.documents import Document

VECTOR_DIR = "vector_store"

embedding_model = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

vector_db = None


def load_or_create_db():
    global vector_db

    if os.path.exists(VECTOR_DIR):
        vector_db = FAISS.load_local(
            VECTOR_DIR,
            embedding_model,
            allow_dangerous_deserialization=True
        )
    else:
        vector_db = FAISS.from_documents(
            [Document(page_content="init")],
            embedding_model
        )
        vector_db.save_local(VECTOR_DIR)


def add_to_vectorstore(chunks, document_id):
    global vector_db

    docs = [
        Document(
            page_content=chunk,
            metadata={"document_id": document_id}
        )
        for chunk in chunks
    ]

    vector_db.add_documents(docs)
    vector_db.save_local(VECTOR_DIR)


def similarity_search(query, k=5):
    global vector_db

    return vector_db.similarity_search(query, k=k)


load_or_create_db()