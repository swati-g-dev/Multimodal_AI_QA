# from langchain_text_splitters import RecursiveCharacterTextSplitter
# from langchain_huggingface import HuggingFaceEmbeddings
# from langchain_community.vectorstores import FAISS

# # Sample text
# text = """
# Artificial Intelligence is transforming software development.
# LangChain helps build LLM-powered applications.
# FAISS is used for efficient vector similarity search.
# """

# print("1. Starting chunking...")

# # Chunking
# splitter = RecursiveCharacterTextSplitter(
#     chunk_size=100,
#     chunk_overlap=20
# )

# chunks = splitter.split_text(text)

# print("2. Chunks created:")
# print(chunks)

# # Embeddings
# print("3. Loading embedding model...")

# embeddings = HuggingFaceEmbeddings(
#     model_name="sentence-transformers/all-MiniLM-L6-v2"
# )

# print("4. Creating FAISS vector store...")

# vectorstore = FAISS.from_texts(chunks, embeddings)

# print("5. Vector store created successfully!")

# # Retrieval test
# query = "What is FAISS?"

# docs = vectorstore.similarity_search(query, k=2)

# print("\n6. Retrieval Results:")

# for i, doc in enumerate(docs):
#     print(f"\nResult {i+1}:")
#     print(doc.page_content)