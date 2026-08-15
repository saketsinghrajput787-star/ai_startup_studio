from app.schemas.generate_response import GenerateResponse, SystemArchitecture
from app.core.db import log_idea_request, get_idea_requests, get_idea_stats


def test_system_architecture_schema_parsing():
    """Verify that GenerateResponse parses both blueprints with and without system_architecture."""
    # Test without system_architecture (backward compatible)
    payload_without = {
        "executive_summary": "Summary",
        "target_audience": "Audience",
        "problem_statement": "Problem",
        "unique_value_proposition": "Value",
        "core_features": ["f1"],
        "user_stories": ["s1"],
        "database_schema": ["d1"],
        "api_endpoints": ["/api/v1"],
        "architecture": "Monolith",
        "roadmap": ["Q1"],
        "business_model": "SaaS",
        "risks": ["r1"],
        "future_scope": ["scope1"]
    }
    res = GenerateResponse(**payload_without)
    assert res.system_architecture is None
    assert res.executive_summary == "Summary"

    # Test with system_architecture
    payload_with = {
        **payload_without,
        "system_architecture": {
            "overview": "Adaptive Modular Monolith",
            "diagram_flow": ["Client", "API Gateway", "FastAPI", "PostgreSQL"],
            "components": ["Frontend: React", "Backend: FastAPI"],
            "database_strategy": "PostgreSQL with connection pooling",
            "caching_strategy": "Redis cache for hot data",
            "api_architecture": "REST API with JWT auth",
            "scalability": "Horizontal container scaling",
            "reliability": "Multi-region failover",
            "security": "OAuth2 + RBAC",
            "bottlenecks": "DB write operations during peak hours"
        }
    }
    res_with = GenerateResponse(**payload_with)
    assert res_with.system_architecture is not None
    assert res_with.system_architecture.overview == "Adaptive Modular Monolith"
    assert len(res_with.system_architecture.diagram_flow) == 4


def test_db_logging_and_stats():
    """Verify database logging, pagination, and stats aggregation."""
    initial_stats = get_idea_stats()
    initial_total = initial_stats["total_ideas"]

    # Log new ideas
    id1 = log_idea_request("Idea One Test", "SUCCESS", category="FinTech")
    id2 = log_idea_request("Idea Two Test", "FAILED", category="EdTech")
    assert id1 is not None
    assert id2 is not None

    # Check updated stats
    new_stats = get_idea_stats()
    assert new_stats["total_ideas"] == initial_total + 2

    # Check pagination
    requests_page = get_idea_requests(page=1, limit=5)
    assert len(requests_page["items"]) > 0
    assert requests_page["total"] >= 2
