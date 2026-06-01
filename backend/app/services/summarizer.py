from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from langchain_text_splitters import RecursiveCharacterTextSplitter
from bson import ObjectId
from app.db.mongo import documents_collection, transcripts_collection
from app.config import settings

llm = ChatGroq(
    groq_api_key=settings.GROQ_API_KEY,
    model_name="llama-3.3-70b-versatile",
    temperature=0     
)

def get_document_text(document_id: str) -> str:
    try:
        obj_id = ObjectId(document_id)
    except Exception:
        return ""
    
    # Try PDF first
    doc = documents_collection.find_one({"_id": obj_id})
    text = ""
    if doc and "extracted_text" in doc:
        text = doc["extracted_text"]
    # If not PDF, try transcript
    if not text:
        transcript = transcripts_collection.find_one({"document_id": obj_id})
        if transcript:
            text = transcript["text"]
    return text.strip() if text else ""

def generate_summary(document_id: str):
    text = get_document_text(document_id)
    if not text.strip():
        return {"summary": "No content available for summarization."}
    
    text=text[:15000]
    
    prompt = ChatPromptTemplate.from_messages([
            ("system", "You are an expert summarizer. Create a clear, comprehensive, concise, and well-structured summary."),
            ("human", "{text}")
        ])
    
    try: 
        messages = prompt.invoke({"text": text})
        response = llm.invoke(messages)        
        return {
            "summary": response.content
        }
    
    except Exception as e:
        return {
            "summary": f"Error generating summary: {str(e)}",
            "error": True
        }
    

def generate_summary_long(document_id: str):
    text = get_document_text(document_id)
    if not text or not text.strip():
        return {"summary": "No content available for summarization."}

    text_splitter = RecursiveCharacterTextSplitter(chunk_size=4000, chunk_overlap=400)
    docs = text_splitter.create_documents([text])

    # Summarize each chunk with the LLM, then combine and condense
    chunk_summaries = []
    for d in docs:
        chunk_prompt = ChatPromptTemplate.from_messages([
            ("system", "You are an expert summarizer. Produce a concise summary for the provided text."),
            ("human", "{text}")
        ])
        try:
            resp = llm.invoke(chunk_prompt.format_messages(text=d.page_content))
            chunk_summaries.append(resp.content)
        except Exception as e:
            chunk_summaries.append(f"[Error summarizing chunk: {str(e)}]")

    combined = "\n\n".join(chunk_summaries)
    # Final condensation
    final_prompt = ChatPromptTemplate.from_messages([
        ("system", "You are an expert summarizer. Condense the following chunk summaries into a single clear, cohesive, concise summary."),
        ("human", "{text}")
    ])
    try:
        final_resp = llm.invoke(final_prompt.format_messages(text=combined))
        return {"summary": final_resp.content}
    except Exception as e:
        return {"summary": combined, "warning": f"Final condensation failed: {str(e)}"}