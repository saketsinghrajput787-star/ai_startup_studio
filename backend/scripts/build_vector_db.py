from app.config import KNOWLEDGE_BASE
from app.rag.loader import load_documents
from app.rag.splitter import split_documents
from app.rag.vector_store import create_vector_store


def main():
    print("Loading documents...")

    documents = load_documents(str(KNOWLEDGE_BASE))

    print("Splitting documents...")

    chunks = split_documents(documents)

    print("Creating vector database...")

    create_vector_store(chunks)

    print("\nKnowledge Base Indexed Successfully!")


if __name__ == "__main__":
    main()