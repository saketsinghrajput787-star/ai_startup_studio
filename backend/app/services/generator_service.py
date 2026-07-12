from langchain_core.prompts import PromptTemplate

from app.core.prompt_loader import load_prompt
from app.services.llm_service import LLMService
from app.services.rag_service import RAGService


class GeneratorService:

    def __init__(self):

        self.rag = RAGService()

        self.llm = LLMService()

        self.template = PromptTemplate.from_template(
            load_prompt("master_prompt.md")
        )

    def generate(self, startup_idea: str):

        context = self.rag.retrieve(startup_idea)

        prompt = self.template.format(
            idea=startup_idea,
            context=context
        )

        result = self.llm.invoke(prompt)

        return result