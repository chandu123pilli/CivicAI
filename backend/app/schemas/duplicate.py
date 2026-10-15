from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class DuplicateIssueBrief(BaseModel):
    id: int
    tracking_id: str
    title: str
    category: str
    status: str
    priority: str
    address: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class DuplicateResponse(BaseModel):
    id: int
    source_issue: DuplicateIssueBrief
    matched_issue: DuplicateIssueBrief
    similarity_score: float
    review_status: str
    created_at: datetime

    class Config:
        from_attributes = True

class DuplicateStatusUpdate(BaseModel):
    review_status: str  # "Confirmed Duplicate" or "Marked Independent"
