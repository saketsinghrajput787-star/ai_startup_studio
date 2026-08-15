from app.dependencies import DEFAULT_ADMIN_KEY
from app.core.db import log_idea_request


def test_admin_unauthorized_access(client):
    """Directly accessing admin endpoints without credentials must return 403 Forbidden."""
    # Test GET /admin/ideas
    res_ideas = client.get("/admin/ideas")
    assert res_ideas.status_code == 403
    assert "Forbidden" in res_ideas.json().get("detail", "")

    # Test GET /admin/ideas/stats
    res_stats = client.get("/admin/ideas/stats")
    assert res_stats.status_code == 403
    assert "Forbidden" in res_stats.json().get("detail", "")


def test_admin_invalid_key_access(client):
    """Accessing with incorrect admin key must return 403 Forbidden."""
    res = client.get("/admin/ideas", headers={"X-Admin-Key": "wrong_key_123"})
    assert res.status_code == 403


def test_admin_authorized_access(client):
    """Accessing with valid admin key must return 200 OK."""
    # Log a test idea
    log_idea_request(
        idea_text="AI-powered agricultural equipment rental",
        status="SUCCESS",
        category="AgriTech"
    )

    # Test ideas list
    res_ideas = client.get(
        "/admin/ideas",
        headers={"X-Admin-Key": DEFAULT_ADMIN_KEY}
    )
    assert res_ideas.status_code == 200
    data = res_ideas.json()
    assert "items" in data
    assert "total" in data
    assert data["total"] >= 1

    # Test stats
    res_stats = client.get(
        "/admin/ideas/stats",
        headers={"X-Admin-Key": DEFAULT_ADMIN_KEY}
    )
    assert res_stats.status_code == 200
    stats = res_stats.json()
    assert "total_ideas" in stats
    assert "ideas_today" in stats
    assert "successful_ideas" in stats


def test_admin_search_and_filter(client):
    """Testing search filter on admin ideas endpoint."""
    unique_keyword = "QuantumDroneExploration99"
    log_idea_request(
        idea_text=f"A startup idea about {unique_keyword}",
        status="SUCCESS",
        category="Robotics & Travel"
    )

    res = client.get(
        f"/admin/ideas?search={unique_keyword}",
        headers={"X-Admin-Key": DEFAULT_ADMIN_KEY}
    )
    assert res.status_code == 200
    data = res.json()
    assert data["total"] >= 1
    assert any(unique_keyword in item["idea_text"] for item in data["items"])
