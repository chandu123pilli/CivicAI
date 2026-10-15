from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class IssueBase(BaseModel):
    title: str = Field(..., min_length=3, max_length=255)
    description: str = Field(..., min_length=10)
    category: Optional[str] = "Other"
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    address: Optional[str] = None

class IssueCreate(IssueBase):
    pass

class IssueStatusHistoryItem(BaseModel):
    id: int
    previous_status: Optional[str] = None
    new_status: str
    changed_by_name: Optional[str] = None
    note: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class IssueCommentItem(BaseModel):
    id: int
    user_id: int
    user_name: str
    user_role: str
    message: str
    created_at: datetime

    class Config:
        from_attributes = True

class PotentialDuplicateItem(BaseModel):
    id: int
    matched_issue_id: int
    matched_tracking_id: str
    matched_title: str
    matched_category: str
    matched_status: str
    similarity_score: float
    review_status: str
    created_at: datetime

    class Config:
        from_attributes = True

class IssueResponse(BaseModel):
    id: int
    tracking_id: str
    user_id: int
    reporter_name: Optional[str] = None
    title: str
    description: str
    category: str
    priority: str
    ai_priority_explanation: Optional[str] = None
    department: str
    status: str
    image_path: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    address: Optional[str] = None
    ai_summary: Optional[str] = None
    admin_notes: Optional[str] = None  # None for regular citizens
    resolution_details: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    resolved_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class IssueDetailResponse(IssueResponse):
    status_history: List[IssueStatusHistoryItem] = []
    comments: List[IssueCommentItem] = []
    potential_duplicates: List[PotentialDuplicateItem] = []

class PublicMapIssueResponse(BaseModel):
    id: int
    tracking_id: str
    title: str
    category: str
    priority: str
    status: str
    latitude: float
    longitude: float
    address: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class IssueListResponse(BaseModel):
    items: List[IssueResponse]
    total: int
    page: int
    limit: int
    total_pages: int
