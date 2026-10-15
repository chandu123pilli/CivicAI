from pydantic import BaseModel
from typing import Optional, List

class AIClassifyRequest(BaseModel):
    title: str
    description: str

class AIClassifyResponse(BaseModel):
    category: str
    priority: str
    priority_explanation: str
    department: str
    summary: str
    is_ai_powered: bool

class AIChatMessage(BaseModel):
    role: str  # "user" or "assistant"
    content: str

class AIChatRequest(BaseModel):
    message: str
    conversation_history: Optional[List[AIChatMessage]] = []
    user_latitude: Optional[float] = None
    user_longitude: Optional[float] = None

class AIChatResponse(BaseModel):
    reply: str
    related_issues: Optional[List[dict]] = []
