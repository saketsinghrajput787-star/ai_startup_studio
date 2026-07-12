import json

from fastapi import APIRouter, HTTPException

from app.schemas.generate_request import GenerateRequest
from app.services.generator_service import GeneratorService
from app.utils.helpers import clean_json_response

router = APIRouter(
    prefix="/generate",
    tags=["Generation"]
)

generator = GeneratorService()


@router.post("/")
def generate_startup(data: GenerateRequest):

    try:

        response = generator.generate(data.idea)

        cleaned_response = clean_json_response(response)

        return json.loads(cleaned_response)

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )