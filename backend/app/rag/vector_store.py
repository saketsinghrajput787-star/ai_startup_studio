from langchain_chroma import Chroma

from app.config import VECTOR_DB
from app.rag.embeddings import get_embeddings


def create_vector_store(chunks):
    """
    Create ChromaDB vector database.
    """

    vector_store = Chroma.from_documents(
        documents=chunks,
        embedding=get_embeddings(),
        persist_directory=str(VECTOR_DB),
    )

    print("Vector Database Created Successfully")

    return vector_store