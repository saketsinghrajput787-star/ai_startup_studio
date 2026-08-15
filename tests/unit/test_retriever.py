from unittest.mock import patch, MagicMock

from app.rag.retriever import get_retriever


@patch("app.rag.retriever.Chroma")
@patch("app.rag.retriever.get_embeddings")
def test_get_retriever(mock_embeddings, mock_chroma):
    mock_embeddings.return_value = MagicMock()

    mock_chroma_instance = MagicMock()

    mock_chroma.return_value = mock_chroma_instance

    mock_chroma_instance.as_retriever.return_value = "mock_retriever"

    retriever = get_retriever()

    assert retriever == "mock_retriever"

    mock_chroma_instance.as_retriever.assert_called_once_with(
        search_type="similarity",
        search_kwargs={"k": 2}
    )

