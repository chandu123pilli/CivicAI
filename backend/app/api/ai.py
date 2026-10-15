from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.db.session import SessionLocal
from app.core.deps import get_db, get_current_user
from app.models.models import User, Issue
from app.schemas.ai import AIClassifyRequest, AIClassifyResponse, AIChatRequest, AIChatResponse
from app.services.ai_service import AIService
from app.services.duplicate_service import calculate_similarity

router = APIRouter(prefix="/ai", tags=["AI Services"])

@router.post("/classify", response_model=AIClassifyResponse)
def classify_complaint(data: AIClassifyRequest):
    """Real-time AI categorization, urgency estimation, and department recommendation."""
    result = AIService.classify_issue(data.title, data.description)
    return AIClassifyResponse(**result)

@router.post("/chat", response_model=AIChatResponse)
def chat_with_assistant(
    request: AIChatRequest,
    db: Session = Depends(get_db)
):
    """Context-aware AI chat assistant that uses actual civic complaints data."""
    # Retrieve recent active issues for real context
    recent_issues = (
        db.query(Issue)
        .order_by(desc(Issue.created_at))
        .limit(15)
        .all()
    )

    context_issues = [
        {
            "id": i.id,
            "tracking_id": i.tracking_id,
            "title": i.title,
            "category": i.category,
            "priority": i.priority,
            "department": i.department,
            "status": i.status,
            "address": i.address,
            "created_at": i.created_at.isoformat() if i.created_at else None
        }
        for i in recent_issues
    ]

    history_dicts = [{"role": m.role, "content": m.content} for m in request.conversation_history]
    reply = AIService.chat_assistant(request.message, history_dicts, context_issues)

    # Find any related issues mentioned in query or matching categories
    related = []
    msg_lower = request.message.lower()
    for item in context_issues:
        if (
            item["tracking_id"].lower() in msg_lower or
            item["category"].lower() in msg_lower or
            item["title"].lower() in msg_lower
        ):
            related.append(item)
            if len(related) >= 3:
                break

    return AIChatResponse(reply=reply, related_issues=related)

@router.get("/similar/{issue_id}")
def get_similar_issues(
    issue_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Return issues that bear text or geographic similarity to the specified issue."""
    target = db.query(Issue).filter(Issue.id == issue_id).first()
    if not target:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Issue not found.")

    others = db.query(Issue).filter(Issue.id != target.id).limit(50).all()
    scored = []
    for other in others:
        score = calculate_similarity(target, other)
        if score > 0.25:
            scored.append({
                "id": other.id,
                "tracking_id": other.tracking_id,
                "title": other.title,
                "category": other.category,
                "status": other.status,
                "priority": other.priority,
                "similarity_score": score
            })

    scored.sort(key=lambda x: x["similarity_score"], reverse=True)
    return scored[:5]
