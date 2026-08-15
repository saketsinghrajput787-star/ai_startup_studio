import json

from fastapi import APIRouter, HTTPException

from app.schemas.generate_request import GenerateRequest
from app.services.generator_service import GeneratorService
from app.utils.helpers import clean_json_response
from app.core.db import log_idea_request

router = APIRouter(
    prefix="/generate",
    tags=["Generation"]
)

generator = GeneratorService()


def _infer_category(idea_text: str, parsed_data: dict) -> str:
    """Helper to determine a startup category from idea or parsed blueprint."""
    if isinstance(parsed_data, dict):
        if parsed_data.get("category"):
            return str(parsed_data.get("category"))
        
        target = str(parsed_data.get("target_audience", "")).lower()
        summary = str(parsed_data.get("executive_summary", "")).lower()
        full_text = f"{idea_text} {target} {summary}".lower()
    else:
        full_text = idea_text.lower()

    if any(k in full_text for k in ["agri", "farm", "crop", "harvest"]):
        return "AgriTech"
    elif any(k in full_text for k in ["health", "med", "doctor", "clinic", "patient"]):
        return "HealthTech"
    elif any(k in full_text for k in ["finance", "bank", "invest", "crypto", "pay", "fintech"]):
        return "FinTech"
    elif any(k in full_text for k in ["edu", "learn", "student", "school", "course"]):
        return "EdTech"
    elif any(k in full_text for k in ["e-commerce", "marketplace", "shop", "retail", "store", "buy", "sell"]):
        return "E-Commerce / Marketplace"
    elif any(k in full_text for k in ["robot", "tourism", "underwater", "travel", "drone"]):
        return "Robotics & Travel"
    elif any(k in full_text for k in ["ai", "saas", "software", "cloud", "api"]):
        return "AI & SaaS"
    else:
        return "General Tech"


@router.post("/")
def generate_startup(data: GenerateRequest):

    try:

        response = generator.generate(data.idea)

        cleaned_response = clean_json_response(response)

        parsed_data = json.loads(cleaned_response)

        # Log successful generation
        category = _infer_category(data.idea, parsed_data)
        log_idea_request(
            idea_text=data.idea,
            status="SUCCESS",
            category=category
        )

        return parsed_data

    except Exception as e:

        # Log failed generation attempt
        log_idea_request(
            idea_text=data.idea,
            status="FAILED",
            category=_infer_category(data.idea, {})
        )

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )