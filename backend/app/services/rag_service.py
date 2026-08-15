from app.rag.retriever import get_retriever


class RAGService:

    def __init__(self):
        self.retriever = None

    def retrieve(self, query: str) -> str:

        if self.retriever is None:
            self.retriever = get_retriever()

        docs = self.retriever.invoke(query)

        context = "\n\n".join(
            doc.page_content
            for doc in docs
        )

        return context
