from typing import List

from pydantic import BaseModel


class GenerateResponse(BaseModel):
    executive_summary: str

    target_audience: str

    problem_statement: str

    unique_value_proposition: str

    core_features: List[str]

    user_stories: List[str]

    database_schema: List[str]

    api_endpoints: List[str]

    architecture: str

    roadmap: List[str]

    business_model: str

    risks: List[str]

    future_scope: List[str]