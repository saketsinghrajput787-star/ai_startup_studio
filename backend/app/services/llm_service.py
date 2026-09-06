import json
import logging
from app.core.llm import llm
from app.schemas.generate_response import GenerateResponse

logger = logging.getLogger(__name__)


class LLMService:

    def __init__(self):
        # Enforce exact adherence to the startup blueprint schema using native json_schema mode
        self.structured_llm = llm.with_structured_output(GenerateResponse, method="json_schema")

    def invoke(self, prompt: str) -> str:
        try:
            response = self.structured_llm.invoke(prompt)
            return self._format_response(response)
        except Exception as e:
            logger.warning(f"json_schema structured output failed: {e}. Falling back to function_calling method.")
            fallback_llm = llm.with_structured_output(GenerateResponse, method="function_calling")
            response = fallback_llm.invoke(prompt)
            return self._format_response(response)

    def _format_response(self, response) -> str:
        if hasattr(response, "model_dump_json"):
            return response.model_dump_json()
        elif isinstance(response, dict):
            return json.dumps(response)
        elif isinstance(response, str):
            return response
        return json.dumps(response)
