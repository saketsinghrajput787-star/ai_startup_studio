from unittest.mock import patch, MagicMock
from app.rag.vector_store import create_vector_store


@patch("app.rag.vector_store.Chroma")
@patch("app.rag.vector_store.get_embeddings")
def test_create_vector_store(mock_embeddings, mock_chroma):
    mock_embeddings.return_value = MagicMock()
    mock_chroma_instance = MagicMock()
    mock_chroma.from_documents.return_value = mock_chroma_instance

    mock_docs = [MagicMock()]
    store = create_vector_store(mock_docs)

    assert store == mock_chroma_instance
    mock_chroma.from_documents.assert_called_once()
