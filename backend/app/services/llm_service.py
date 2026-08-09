from app.core.llm import llm
from app.schemas.generate_response import GenerateResponse


class LLMService:

    def __init__(self):
        # Enforce exact adherence to the startup blueprint schema
        self.structured_llm = llm.with_structured_output(GenerateResponse)

    def invoke(self, prompt: str):
        response = self.structured_llm.invoke(prompt)
        return response.model_dump_json()