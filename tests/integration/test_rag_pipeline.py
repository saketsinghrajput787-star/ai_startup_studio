from unittest.mock import patch, MagicMock
from app.services.rag_service import RAGService


@patch("app.services.rag_service.get_retriever")
def test_rag_pipeline_retrieve(mock_get_retriever):
    mock_retriever = MagicMock()
    mock_doc1 = MagicMock()
    mock_doc1.page_content = "Document 1 content about SaaS"
    mock_doc2 = MagicMock()
    mock_doc2.page_content = "Document 2 content about Microservices"
    mock_retriever.invoke.return_value = [mock_doc1, mock_doc2]
    mock_get_retriever.return_value = mock_retriever

    rag = RAGService()
    context = rag.retrieve("SaaS microservices architecture")

    assert "Document 1 content about SaaS" in context
    assert "Document 2 content about Microservices" in context
    mock_retriever.invoke.assert_called_once_with("SaaS microservices architecture")
