from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

class AdminOverviewResponse(BaseModel):
    total_complaints: int
    unassigned_complaints: int
    high_critical_complaints: int
    resolved_complaints: int
    average_resolution_hours: float
    pending_duplicates_count: int

class CategoryCount(BaseModel):
    category: str
    count: int

class StatusCount(BaseModel):
    status: str
    count: int

class PriorityCount(BaseModel):
    priority: str
    count: int

class DepartmentWorkload(BaseModel):
    department: str
    total: int
    resolved: int
    pending: int

class MonthlyTrend(BaseModel):
    period: str
    count: int

class AdminAnalyticsResponse(BaseModel):
    category_distribution: List[CategoryCount]
    status_distribution: List[StatusCount]
    priority_distribution: List[PriorityCount]
    department_workload: List[DepartmentWorkload]
    monthly_trend: List[MonthlyTrend]

class AdminStatusUpdateRequest(BaseModel):
    new_status: str
    note: Optional[str] = None
    resolution_details: Optional[str] = None
    priority: Optional[str] = None
    department: Optional[str] = None

class AdminAssignRequest(BaseModel):
    department: str
    note: Optional[str] = None
