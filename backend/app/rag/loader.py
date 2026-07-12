from pathlib import Path

from langchain_community.document_loaders import DirectoryLoader, TextLoader


def load_documents(path: str):
    """
    Load all markdown files from the knowledge base.
    """

    loader = DirectoryLoader(
        path,
        glob="**/*.md",
        loader_cls=TextLoader,
        show_progress=True,
    )

    documents = loader.load()

    print(f"\nLoaded {len(documents)} documents")

    return documents