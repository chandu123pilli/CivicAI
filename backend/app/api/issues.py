import uuid
from typing import Optional, List
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_, desc, asc

from app.db.session import SessionLocal
from app.core.deps import get_db, get_current_user
from app.models.models import User, Issue, IssueStatusHistory, PotentialDuplicates, Comment, Notification
from app.schemas.issue import (
    IssueResponse, IssueDetailResponse, IssueListResponse, PublicMapIssueResponse,
    IssueStatusHistoryItem, IssueCommentItem, PotentialDuplicateItem
)
from app.schemas.comment import CommentCreate, CommentResponse
from app.services.ai_service import AIService
from app.services.duplicate_service import detect_and_store_duplicates
from app.utils.file_upload import save_uploaded_image

router = APIRouter(prefix="/issues", tags=["Issues"])

def generate_tracking_id() -> str:
    # Generates a tracking ID like CIVIC-2026-A8F29C
    short_uuid = uuid.uuid4().hex[:6].upper()
    return f"CIVIC-2026-{short_uuid}"

@router.post("", response_model=IssueResponse, status_code=status.HTTP_201_CREATED)
async def create_issue(
    title: str = Form(..., min_length=3, max_length=255),
    description: str = Form(..., min_length=10),
    category: Optional[str] = Form(None),
    latitude: Optional[float] = Form(None),
    longitude: Optional[float] = Form(None),
    address: Optional[str] = Form(None),
    image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Handle image upload if provided
    image_url = None
    if image and image.filename:
        image_url = await save_uploaded_image(image)

    # Run AI Classification & Priority Estimation
    ai_result = AIService.classify_issue(title, description)
    
    # Use user category if valid and specified, otherwise AI prediction
    final_category = category if category and category != "Other" else ai_result["category"]
    priority = ai_result["priority"]
    ai_explanation = ai_result["priority_explanation"]
    department = ai_result["department"]
    ai_summary = ai_result["summary"]

    tracking_id = generate_tracking_id()

    # Create Issue
    new_issue = Issue(
        tracking_id=tracking_id,
        user_id=current_user.id,
        title=title.strip(),
        description=description.strip(),
        category=final_category,
        priority=priority,
        ai_priority_explanation=ai_explanation,
        department=department,
        status="Submitted",
        image_path=image_url,
        latitude=latitude,
        longitude=longitude,
        address=address.strip() if address else None,
        ai_summary=ai_summary,
        admin_notes=None
    )
    db.add(new_issue)
    db.commit()
    db.refresh(new_issue)

    # Record Initial Status History
    history_entry = IssueStatusHistory(
        issue_id=new_issue.id,
        previous_status=None,
        new_status="Submitted",
        changed_by=current_user.id,
        note="Issue filed and logged by citizen."
    )
    db.add(history_entry)

    # Create Initial Notification for User
    notification = Notification(
        user_id=current_user.id,
        issue_id=new_issue.id,
        message=f"Your complaint '{new_issue.title}' was submitted with Tracking ID: {new_issue.tracking_id}."
    )
    db.add(notification)
    db.commit()

    # Search and link potential duplicates
    try:
        detect_and_store_duplicates(db, new_issue)
    except Exception as e:
        # Never fail issue creation due to duplicate detection error
        pass

    db.refresh(new_issue)
    resp = IssueResponse.model_validate(new_issue)
    resp.reporter_name = current_user.full_name
    return resp

@router.get("", response_model=IssueListResponse)
def list_issues(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    status: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    priority: Optional[str] = Query(None),
    department: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    my_reports_only: Optional[bool] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Issue)

    # Role-based restriction: regular citizens only see their own reports in list view,
    # unless they are browsing public map.
    if current_user.role != "admin" or my_reports_only:
        query = query.filter(Issue.user_id == current_user.id)

    # Filter parameters
    if status and status != "All":
        query = query.filter(Issue.status == status)
    if category and category != "All":
        query = query.filter(Issue.category == category)
    if priority and priority != "All":
        query = query.filter(Issue.priority == priority)
    if department and department != "All":
        query = query.filter(Issue.department == department)
    if search:
        search_fmt = f"%{search.strip()}%"
        query = query.filter(
            or_(
                Issue.title.ilike(search_fmt),
                Issue.description.ilike(search_fmt),
                Issue.tracking_id.ilike(search_fmt),
                Issue.address.ilike(search_fmt)
            )
        )

    total = query.count()
    total_pages = (total + limit - 1) // limit if total > 0 else 1

    issues = (
        query.order_by(desc(Issue.created_at))
        .offset((page - 1) * limit)
        .limit(limit)
        .all()
    )

    items = []
    for issue in issues:
        item = IssueResponse.model_validate(issue)
        item.reporter_name = issue.user.full_name if issue.user else "Anonymous"
        # Hide admin notes from non-admin citizens
        if current_user.role != "admin":
            item.admin_notes = None
        items.append(item)

    return IssueListResponse(
        items=items,
        total=total,
        page=page,
        limit=limit,
        total_pages=total_pages
    )

@router.get("/public/map", response_model=List[PublicMapIssueResponse])
def get_public_map_issues(
    category: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """Public endpoint to display complaints on Leaflet OpenStreetMap without exposing private citizen details."""
    query = db.query(Issue).filter(
        Issue.latitude.isnot(None),
        Issue.longitude.isnot(None)
    )

    if category and category != "All":
        query = query.filter(Issue.category == category)
    if status and status != "All":
        query = query.filter(Issue.status == status)

    issues = query.order_by(desc(Issue.created_at)).limit(300).all()
    return [PublicMapIssueResponse.model_validate(i) for i in issues]

@router.get("/{issue_id}", response_model=IssueDetailResponse)
def get_issue_detail(
    issue_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    issue = db.query(Issue).filter(Issue.id == issue_id).first()
    if not issue:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Issue not found.")

    # Status history formatted
    history_items = []
    for h in issue.status_history:
        admin_name = h.admin_user.full_name if h.admin_user else "System"
        history_items.append(
            IssueStatusHistoryItem(
                id=h.id,
                previous_status=h.previous_status,
                new_status=h.new_status,
                changed_by_name=admin_name,
                note=h.note,
                created_at=h.created_at
            )
        )

    # Comments formatted
    comment_items = []
    for c in issue.comments:
        comment_items.append(
            IssueCommentItem(
                id=c.id,
                user_id=c.user_id,
                user_name=c.user.full_name if c.user else "User",
                user_role=c.user.role if c.user else "citizen",
                message=c.message,
                created_at=c.created_at
            )
        )

    # Duplicates (visible to admin or reporter)
    duplicate_items = []
    if current_user.role == "admin" or current_user.id == issue.user_id:
        for dup in issue.as_source_duplicates:
            if dup.matched_issue:
                duplicate_items.append(
                    PotentialDuplicateItem(
                        id=dup.id,
                        matched_issue_id=dup.matched_issue.id,
                        matched_tracking_id=dup.matched_issue.tracking_id,
                        matched_title=dup.matched_issue.title,
                        matched_category=dup.matched_issue.category,
                        matched_status=dup.matched_issue.status,
                        similarity_score=dup.similarity_score,
                        review_status=dup.review_status,
                        created_at=dup.created_at
                    )
                )

    resp = IssueDetailResponse(
        id=issue.id,
        tracking_id=issue.tracking_id,
        user_id=issue.user_id,
        reporter_name=issue.user.full_name if issue.user else "Citizen Reporter",
        title=issue.title,
        description=issue.description,
        category=issue.category,
        priority=issue.priority,
        ai_priority_explanation=issue.ai_priority_explanation,
        department=issue.department,
        status=issue.status,
        image_path=issue.image_path,
        latitude=issue.latitude,
        longitude=issue.longitude,
        address=issue.address,
        ai_summary=issue.ai_summary,
        admin_notes=issue.admin_notes if current_user.role == "admin" else None,
        resolution_details=issue.resolution_details,
        created_at=issue.created_at,
        updated_at=issue.updated_at,
        resolved_at=issue.resolved_at,
        status_history=history_items,
        comments=comment_items,
        potential_duplicates=duplicate_items
    )
    return resp

@router.patch("/{issue_id}", response_model=IssueResponse)
def update_citizen_issue(
    issue_id: int,
    title: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    address: Optional[str] = Form(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    issue = db.query(Issue).filter(Issue.id == issue_id).first()
    if not issue:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Issue not found.")

    if current_user.role != "admin" and issue.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Permission denied.")

    if current_user.role != "admin" and issue.status != "Submitted":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Complaints currently under review or in progress cannot be directly edited. Please add a comment."
        )

    if title:
        issue.title = title.strip()
    if description:
        issue.description = description.strip()
    if address:
        issue.address = address.strip()

    issue.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(issue)

    resp = IssueResponse.model_validate(issue)
    resp.reporter_name = current_user.full_name
    return resp

@router.get("/{issue_id}/history", response_model=List[IssueStatusHistoryItem])
def get_issue_history(
    issue_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    issue = db.query(Issue).filter(Issue.id == issue_id).first()
    if not issue:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Issue not found.")

    items = []
    for h in issue.status_history:
        admin_name = h.admin_user.full_name if h.admin_user else "System"
        items.append(
            IssueStatusHistoryItem(
                id=h.id,
                previous_status=h.previous_status,
                new_status=h.new_status,
                changed_by_name=admin_name,
                note=h.note,
                created_at=h.created_at
            )
        )
    return items

@router.post("/{issue_id}/comments", response_model=CommentResponse, status_code=status.HTTP_201_CREATED)
def post_comment(
    issue_id: int,
    comment_in: CommentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    issue = db.query(Issue).filter(Issue.id == issue_id).first()
    if not issue:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Issue not found.")

    comment = Comment(
        issue_id=issue.id,
        user_id=current_user.id,
        message=comment_in.message.strip()
    )
    db.add(comment)
    db.commit()
    db.refresh(comment)

    # Notify counterpart
    if current_user.role == "admin" and issue.user_id != current_user.id:
        notif = Notification(
            user_id=issue.user_id,
            issue_id=issue.id,
            message=f"Administrator added an update to your complaint #{issue.tracking_id}."
        )
        db.add(notif)
        db.commit()
    elif current_user.role != "admin" and issue.user_id == current_user.id:
        # Notify admins
        admins = db.query(User).filter(User.role == "admin").all()
        for admin in admins:
            notif = Notification(
                user_id=admin.id,
                issue_id=issue.id,
                message=f"Citizen posted a comment on #{issue.tracking_id}."
            )
            db.add(notif)
        db.commit()

    return CommentResponse(
        id=comment.id,
        issue_id=comment.issue_id,
        user_id=comment.user_id,
        user_name=current_user.full_name,
        user_role=current_user.role,
        message=comment.message,
        created_at=comment.created_at
    )
