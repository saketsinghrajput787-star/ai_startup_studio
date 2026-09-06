from unittest.mock import patch, MagicMock
from app.rag.embeddings import get_embeddings


@patch("app.rag.embeddings.HuggingFaceEmbeddings")
def test_get_embeddings(mock_hf):
    mock_instance = MagicMock()
    mock_hf.return_value = mock_instance

    embeddings = get_embeddings()
    assert embeddings == mock_instance
    mock_hf.assert_called_once_with(
        model_name="sentence-transformers/all-MiniLM-L6-v2"
    )
