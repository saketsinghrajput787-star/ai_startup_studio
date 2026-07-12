from app.core.llm import llm


class LLMService:

    def invoke(self, prompt: str):

        response = llm.invoke(prompt)

        return response.content