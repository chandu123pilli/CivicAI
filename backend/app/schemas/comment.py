from pydantic import BaseModel, Field
from datetime import datetime

class CommentCreate(BaseModel):
    message: str = Field(..., min_length=1, max_length=1000)

class CommentResponse(BaseModel):
    id: int
    issue_id: int
    user_id: int
    user_name: str
    user_role: str
    message: str
    created_at: datetime

    class Config:
        from_attributes = True
