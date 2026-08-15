from typing import List, Optional, Any, Dict
from pydantic import BaseModel, Field


class SystemArchitecture(BaseModel):
    overview: Optional[str] = ""
    diagram_flow: Optional[List[str]] = []
    components: Optional[List[str]] = []
    database_strategy: Optional[str] = ""
    caching_strategy: Optional[str] = ""
    api_architecture: Optional[str] = ""
    scalability: Optional[str] = ""
    reliability: Optional[str] = ""
    security: Optional[str] = ""
    bottlenecks: Optional[str] = ""


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
    system_architecture: Optional[SystemArchitecture] = None