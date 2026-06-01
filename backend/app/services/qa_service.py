from langchain_groq import ChatGroq
from langchain_classic.chains import create_retrieval_chain
from langchain_classic.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate
from app.services.vector_store import get_document_retriever
from app.config import settings

llm = ChatGroq(
    groq_api_key=settings.GROQ_API_KEY,
    model_name="llama-3.3-70b-versatile",
    temperature=0, # deterministic output with no creativity or randomness
)

# Prompt
system_prompt = """
    You are a helpful AI assistant for question answering.

    Use ONLY the provided context to answer the question.

    If the answer is not contained in the context, say:
    "I could not find the answer in the uploaded documents."

    Do not generate information that is not present in the context.    Context:
    {context}
"""

prompt = ChatPromptTemplate.from_messages([
    ("system", system_prompt),
    ("human", "{input}"),
])

question_answer_chain = create_stuff_documents_chain(llm, prompt)


def generate_answer(query: str, document_id: str):
    try:
        # for QA using top 3
        retriever = get_document_retriever(document_id, k=3)
        
        retrieval_chain = create_retrieval_chain(
            retriever,
            question_answer_chain
        )
        
        response = retrieval_chain.invoke({"input": query})
        
        sources = []
        if "context" in response:
            for doc in response["context"]:
                sources.append({
                    "text": doc.page_content,
                    "metadata": doc.metadata
                })
        
        # IF response["answer"] FORMAT GET CHANGED THEN UPDATE THIS ACCORDINGLY
        answer = response.get("answer", "No answer generated.")
        return {
            "answer": answer,
            "sources": sources
        }
    
    except Exception as e:
        print(f"QA Error: {e}")

        return {
            "answer": "An error occurred while processing the question.",
            "sources": []
        }