import json
from unittest.mock import patch, MagicMock
from app.services.generator_service import GeneratorService


@patch("app.services.generator_service.LLMService")
@patch("app.services.generator_service.RAGService")
def test_generator_complete_flow(mock_rag_cls, mock_llm_cls):
    mock_rag = MagicMock()
    mock_rag.retrieve.return_value = "Sample architecture guidance from knowledge base"
    mock_rag_cls.return_value = mock_rag

    mock_llm = MagicMock()
    sample_response = {
        "executive_summary": "Test Product",
        "target_audience": "Developers",
        "problem_statement": "Manual blueprint design",
        "unique_value_proposition": "Automated blueprints",
        "core_features": ["Feature 1"],
        "user_stories": ["Story 1"],
        "database_schema": ["users", "blueprints"],
        "api_endpoints": ["POST /generate"],
        "architecture": "Event-driven",
        "roadmap": ["MVP in 2 weeks"],
        "business_model": "Freemium",
        "risks": ["API rate limits"],
        "future_scope": ["Multi-cloud"],
        "system_architecture": {
            "overview": "Serverless with FastAPI",
            "diagram_flow": ["Client", "FastAPI"],
            "components": ["Frontend", "Backend"],
            "database_strategy": "PostgreSQL",
            "caching_strategy": "Redis",
            "api_architecture": "REST",
            "scalability": "Horizontal",
            "reliability": "99.9% uptime",
            "security": "JWT",
            "bottlenecks": "DB connections"
        }
    }
    mock_llm.invoke.return_value = json.dumps(sample_response)
    mock_llm_cls.return_value = mock_llm

    service = GeneratorService()
    result_str = service.generate("AI blueprint generator for startups")

    assert result_str is not None
    result = json.loads(result_str)
    assert result["executive_summary"] == "Test Product"
    assert result["system_architecture"]["overview"] == "Serverless with FastAPI"
