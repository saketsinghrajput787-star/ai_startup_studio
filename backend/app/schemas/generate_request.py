from pydantic import BaseModel, Field


class GenerateRequest(BaseModel):
    idea: str = Field(
        ...,
        min_length=10,
        max_length=1000,
        description="Startup idea provided by the user."
    )