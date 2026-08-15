from langchain_chroma import Chroma

from app.config import VECTOR_DB
from app.rag.embeddings import get_embeddings


def get_retriever():

    vector_store = Chroma(
        persist_directory=str(VECTOR_DB),
        embedding_function=get_embeddings(),
    )

    return vector_store.as_retriever(
        search_type="similarity",
        search_kwargs={"k": 2},
    )
