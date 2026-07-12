from app.rag.retriever import get_retriever


def main():

    retriever = get_retriever()

    query = "How should I design a REST API?"

    docs = retriever.invoke(query)

    print(f"\nQuery: {query}\n")

    for i, doc in enumerate(docs, start=1):
        print("=" * 80)
        print(f"Document {i}")
        print("=" * 80)
        print(doc.page_content)
        print()


if __name__ == "__main__":
    main()