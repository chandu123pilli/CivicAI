from datetime import datetime, timezone
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, desc, or_

from app.db.session import SessionLocal
from app.core.deps import get_db, get_current_admin
from app.models.models import User, Issue, IssueStatusHistory, PotentialDuplicates, Notification
from app.schemas.admin import (
    AdminOverviewResponse, AdminAnalyticsResponse,
    CategoryCount, StatusCount, PriorityCount, DepartmentWorkload, MonthlyTrend,
    AdminStatusUpdateRequest, AdminAssignRequest
)
from app.schemas.issue import IssueResponse
from app.schemas.duplicate import DuplicateResponse, DuplicateStatusUpdate, DuplicateIssueBrief

router = APIRouter(prefix="/admin", tags=["Administrator Operations"])

@router.get("/overview", response_model=AdminOverviewResponse)
def get_admin_overview(
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    total = db.query(Issue).count()
    unassigned = db.query(Issue).filter(
        or_(Issue.status == "Submitted", Issue.department == "General Administration")
    ).count()
    high_critical = db.query(Issue).filter(Issue.priority.in_(["High", "Critical"])).count()
    resolved = db.query(Issue).filter(Issue.status == "Resolved").count()
    pending_dups = db.query(PotentialDuplicates).filter(PotentialDuplicates.review_status == "Pending").count()

    # Calculate average resolution time for resolved complaints
    resolved_issues = db.query(Issue).filter(
        Issue.status == "Resolved",
        Issue.resolved_at.isnot(None),
        Issue.created_at.isnot(None)
    ).all()

    avg_hours = 0.0
    if resolved_issues:
        total_seconds = sum(
            max(0, (i.resolved_at - i.created_at).total_seconds())
            for i in resolved_issues
        )
        avg_hours = round(total_seconds / (len(resolved_issues) * 3600.0), 1)

    return AdminOverviewResponse(
        total_complaints=total,
        unassigned_complaints=unassigned,
        high_critical_complaints=high_critical,
        resolved_complaints=resolved,
        average_resolution_hours=avg_hours,
        pending_duplicates_count=pending_dups
    )

@router.get("/analytics", response_model=AdminAnalyticsResponse)
def get_admin_analytics(
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    # Category Distribution
    cat_counts = (
        db.query(Issue.category, func.count(Issue.id))
        .group_by(Issue.category)
        .all()
    )
    category_distribution = [CategoryCount(category=c[0], count=c[1]) for c in cat_counts]

    # Status Distribution
    stat_counts = (
        db.query(Issue.status, func.count(Issue.id))
        .group_by(Issue.status)
        .all()
    )
    status_distribution = [StatusCount(status=s[0], count=s[1]) for s in stat_counts]

    # Priority Distribution
    pri_counts = (
        db.query(Issue.priority, func.count(Issue.id))
        .group_by(Issue.priority)
        .all()
    )
    priority_distribution = [PriorityCount(priority=p[0], count=p[1]) for p in pri_counts]

    # Department Workload
    dept_names = [
        "Roads and Public Works", "Sanitation", "Water Department", 
        "Electricity Department", "Drainage and Public Health", "Public Safety", "General Administration"
    ]
    department_workload = []
    for d in dept_names:
        total_dept = db.query(Issue).filter(Issue.department == d).count()
        resolved_dept = db.query(Issue).filter(Issue.department == d, Issue.status == "Resolved").count()
        pending_dept = total_dept - resolved_dept
        department_workload.append(
            DepartmentWorkload(
                department=d,
                total=total_dept,
                resolved=resolved_dept,
                pending=pending_dept
            )
        )

    # Monthly Trend (last 6 months approximate grouping by month string)
    issues_by_date = db.query(Issue.created_at).order_by(Issue.created_at.asc()).all()
    months_dict = {}
    for (created,) in issues_by_date:
        if created:
            key = created.strftime("%b %Y")
            months_dict[key] = months_dict.get(key, 0) + 1

    monthly_trend = [MonthlyTrend(period=k, count=v) for k, v in months_dict.items()]
    if not monthly_trend:
        monthly_trend = [MonthlyTrend(period=datetime.now(timezone.utc).strftime("%b %Y"), count=0)]

    return AdminAnalyticsResponse(
        category_distribution=category_distribution,
        status_distribution=status_distribution,
        priority_distribution=priority_distribution,
        department_workload=department_workload,
        monthly_trend=monthly_trend
    )

@router.patch("/issues/{issue_id}/status", response_model=IssueResponse)
def update_issue_status(
    issue_id: int,
    update_data: AdminStatusUpdateRequest,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    issue = db.query(Issue).filter(Issue.id == issue_id).first()
    if not issue:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Issue not found.")

    valid_statuses = ["Submitted", "Under Review", "Assigned", "In Progress", "Resolved", "Rejected"]
    if update_data.new_status not in valid_statuses:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid status '{update_data.new_status}'. Allowed: {', '.join(valid_statuses)}"
        )

    previous_status = issue.status
    issue.status = update_data.new_status
    issue.updated_at = datetime.now(timezone.utc)

    if update_data.new_status == "Resolved":
        issue.resolved_at = datetime.now(timezone.utc)
        if update_data.resolution_details:
            issue.resolution_details = update_data.resolution_details
    elif previous_status == "Resolved" and update_data.new_status != "Resolved":
        issue.resolved_at = None

    if update_data.priority:
        issue.priority = update_data.priority
    if update_data.department:
        issue.department = update_data.department
    if update_data.note:
        issue.admin_notes = update_data.note

    # Record Status History
    history = IssueStatusHistory(
        issue_id=issue.id,
        previous_status=previous_status,
        new_status=update_data.new_status,
        changed_by=admin.id,
        note=update_data.note or f"Status changed to {update_data.new_status}"
    )
    db.add(history)

    # Notify Citizen
    notification_msg = f"Status of your complaint #{issue.tracking_id} updated to '{update_data.new_status}' by {admin.full_name}."
    if update_data.note:
        notification_msg += f" Note: {update_data.note}"
    notif = Notification(
        user_id=issue.user_id,
        issue_id=issue.id,
        message=notification_msg
    )
    db.add(notif)
    db.commit()
    db.refresh(issue)

    resp = IssueResponse.model_validate(issue)
    resp.reporter_name = issue.user.full_name if issue.user else "Citizen"
    return resp

@router.patch("/issues/{issue_id}/assign", response_model=IssueResponse)
def assign_issue_department(
    issue_id: int,
    assign_data: AdminAssignRequest,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    issue = db.query(Issue).filter(Issue.id == issue_id).first()
    if not issue:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Issue not found.")

    previous_status = issue.status
    issue.department = assign_data.department
    if issue.status in ["Submitted", "Under Review"]:
        issue.status = "Assigned"
    issue.updated_at = datetime.now(timezone.utc)

    # Record Status History
    history = IssueStatusHistory(
        issue_id=issue.id,
        previous_status=previous_status,
        new_status=issue.status,
        changed_by=admin.id,
        note=assign_data.note or f"Assigned to {assign_data.department}"
    )
    db.add(history)

    # Notify Citizen
    notif = Notification(
        user_id=issue.user_id,
        issue_id=issue.id,
        message=f"Complaint #{issue.tracking_id} has been assigned to {assign_data.department}."
    )
    db.add(notif)
    db.commit()
    db.refresh(issue)

    resp = IssueResponse.model_validate(issue)
    resp.reporter_name = issue.user.full_name if issue.user else "Citizen"
    return resp

@router.get("/duplicates", response_model=List[DuplicateResponse])
def get_duplicates(
    status_filter: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    query = db.query(PotentialDuplicates)
    if status_filter and status_filter != "All":
        query = query.filter(PotentialDuplicates.review_status == status_filter)

    duplicates = query.order_by(desc(PotentialDuplicates.similarity_score)).limit(100).all()

    result = []
    for d in duplicates:
        if d.source_issue and d.matched_issue:
            result.append(
                DuplicateResponse(
                    id=d.id,
                    source_issue=DuplicateIssueBrief.model_validate(d.source_issue),
                    matched_issue=DuplicateIssueBrief.model_validate(d.matched_issue),
                    similarity_score=d.similarity_score,
                    review_status=d.review_status,
                    created_at=d.created_at
                )
            )
    return result

@router.patch("/duplicates/{duplicate_id}", response_model=DuplicateResponse)
def update_duplicate_status(
    duplicate_id: int,
    update_data: DuplicateStatusUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    dup = db.query(PotentialDuplicates).filter(PotentialDuplicates.id == duplicate_id).first()
    if not dup:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Duplicate record not found.")

    valid_statuses = ["Pending", "Confirmed Duplicate", "Marked Independent"]
    if update_data.review_status not in valid_statuses:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid review status. Allowed: {', '.join(valid_statuses)}"
        )

    dup.review_status = update_data.review_status
    db.commit()
    db.refresh(dup)

    return DuplicateResponse(
        id=dup.id,
        source_issue=DuplicateIssueBrief.model_validate(dup.source_issue),
        matched_issue=DuplicateIssueBrief.model_validate(dup.matched_issue),
        similarity_score=dup.similarity_score,
        review_status=dup.review_status,
        created_at=dup.created_at
    )
