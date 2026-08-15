from typing import Optional
from fastapi import APIRouter, Depends, Query, HTTPException, status
from pydantic import BaseModel

from app.core.db import get_idea_requests, get_idea_stats
from app.dependencies import verify_admin

router = APIRouter(
    prefix="/admin",
    tags=["Admin Analytics"]
)


class VerifyAdminRequest(BaseModel):
    admin_key: str


@router.post("/verify")
def verify_admin_credentials(_: bool = Depends(verify_admin)):
    """Verifies that the provided admin credentials are valid."""
    return {"status": "authenticated", "message": "Admin access granted"}


@router.get("/ideas")
def list_idea_requests(
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(20, ge=1, le=100, description="Items per page"),
    search: Optional[str] = Query(None, description="Search term for idea text, category, or user"),
    status: Optional[str] = Query(None, description="Filter by status (SUCCESS / FAILED)"),
    start_date: Optional[str] = Query(None, description="ISO format start date"),
    end_date: Optional[str] = Query(None, description="ISO format end date"),
    _: bool = Depends(verify_admin)
):
    """Returns paginated idea generation requests (Admin only)."""
    return get_idea_requests(
        page=page,
        limit=limit,
        search=search,
        status=status,
        start_date=start_date,
        end_date=end_date
    )


@router.get("/ideas/stats")
def get_analytics_stats(_: bool = Depends(verify_admin)):
    """Returns aggregated stats and metrics for idea generation (Admin only)."""
    return get_idea_stats()
