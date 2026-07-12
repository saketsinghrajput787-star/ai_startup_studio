from app.rag.retriever import get_retriever


class RAGService:

    def __init__(self):
        self.retriever = get_retriever()

    def retrieve(self, query: str) -> str:

        docs = self.retriever.invoke(query)

        context = "\n\n".join(
            doc.page_content
            for doc in docs
        )

        return context