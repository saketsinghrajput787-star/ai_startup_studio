from unittest.mock import patch


def test_generate_validation_error(client):
    # Test idea that is too short
    response = client.post("/generate/", json={"idea": "Short"})

    assert response.status_code == 422  # FastAPI validation error


@patch("app.api.generate.generator.generate")
def test_generate_success(mock_generate, client):
    # Mock LLM generation output
    mock_generate.return_value = """{
        "executive_summary": "An AI-powered Food Delivery Startup",
        "target_audience": "Busy professionals",
        "problem_statement": "No healthy ready meals",
        "unique_value_proposition": "Fast and healthy",
        "core_features": [],
        "user_stories": [],
        "database_schema": [],
        "api_endpoints": [],
        "architecture": "",
        "roadmap": [],
        "business_model": "",
        "risks": [],
        "future_scope": []
    }"""

    response = client.post(
        "/generate/",
        json={"idea": "I want to build an AI Food Delivery Startup"}
    )

    assert response.status_code == 200

    data = response.json()

    assert data["executive_summary"] == "An AI-powered Food Delivery Startup"

    assert data["target_audience"] == "Busy professionals"
