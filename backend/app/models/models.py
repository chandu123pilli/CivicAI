from datetime import datetime, timezone
from sqlalchemy import (
    Column, Integer, String, Text, Float, Boolean, DateTime, ForeignKey, Index
)
from sqlalchemy.orm import relationship
from app.db.session import Base

def utcnow():
    return datetime.now(timezone.utc)

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(120), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(20), default="citizen", nullable=False)  # "citizen" or "admin"
    phone = Column(String(30), nullable=True)
    department = Column(String(100), nullable=True)  # for admin assignment
    created_at = Column(DateTime, default=utcnow, nullable=False)

    issues = relationship("Issue", back_populates="user", cascade="all, delete-orphan")
    comments = relationship("Comment", back_populates="user", cascade="all, delete-orphan")
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")
    status_changes = relationship("IssueStatusHistory", back_populates="admin_user", foreign_keys="IssueStatusHistory.changed_by")


class Issue(Base):
    __tablename__ = "issues"

    id = Column(Integer, primary_key=True, index=True)
    tracking_id = Column(String(32), unique=True, index=True, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    category = Column(String(80), nullable=False, index=True)
    priority = Column(String(20), default="Medium", nullable=False, index=True)  # Low, Medium, High, Critical
    ai_priority_explanation = Column(Text, nullable=True)
    department = Column(String(100), nullable=False, index=True)
    status = Column(String(30), default="Submitted", nullable=False, index=True)  # Submitted, Under Review, Assigned, In Progress, Resolved, Rejected
    
    image_path = Column(String(500), nullable=True)
    latitude = Column(Float, nullable=True, index=True)
    longitude = Column(Float, nullable=True, index=True)
    address = Column(String(255), nullable=True)
    
    ai_summary = Column(Text, nullable=True)
    admin_notes = Column(Text, nullable=True)  # Internal notes (never sent to non-admin citizens)
    resolution_details = Column(Text, nullable=True)
    
    created_at = Column(DateTime, default=utcnow, nullable=False, index=True)
    updated_at = Column(DateTime, default=utcnow, onupdate=utcnow, nullable=False)
    resolved_at = Column(DateTime, nullable=True)

    # Relationships
    user = relationship("User", back_populates="issues")
    status_history = relationship("IssueStatusHistory", back_populates="issue", cascade="all, delete-orphan", order_by="IssueStatusHistory.created_at.desc()")
    comments = relationship("Comment", back_populates="issue", cascade="all, delete-orphan", order_by="Comment.created_at.asc()")
    
    # Duplicates relationships
    as_source_duplicates = relationship(
        "PotentialDuplicates",
        foreign_keys="PotentialDuplicates.source_issue_id",
        back_populates="source_issue",
        cascade="all, delete-orphan"
    )
    as_matched_duplicates = relationship(
        "PotentialDuplicates",
        foreign_keys="PotentialDuplicates.matched_issue_id",
        back_populates="matched_issue",
        cascade="all, delete-orphan"
    )


class IssueStatusHistory(Base):
    __tablename__ = "issue_status_history"

    id = Column(Integer, primary_key=True, index=True)
    issue_id = Column(Integer, ForeignKey("issues.id", ondelete="CASCADE"), nullable=False, index=True)
    previous_status = Column(String(30), nullable=True)
    new_status = Column(String(30), nullable=False)
    changed_by = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    note = Column(Text, nullable=True)
    created_at = Column(DateTime, default=utcnow, nullable=False)

    issue = relationship("Issue", back_populates="status_history")
    admin_user = relationship("User", back_populates="status_changes", foreign_keys=[changed_by])


class PotentialDuplicates(Base):
    __tablename__ = "potential_duplicates"

    id = Column(Integer, primary_key=True, index=True)
    source_issue_id = Column(Integer, ForeignKey("issues.id", ondelete="CASCADE"), nullable=False, index=True)
    matched_issue_id = Column(Integer, ForeignKey("issues.id", ondelete="CASCADE"), nullable=False, index=True)
    similarity_score = Column(Float, nullable=False)  # 0.0 - 1.0
    review_status = Column(String(30), default="Pending", nullable=False)  # Pending, Confirmed Duplicate, Marked Independent
    created_at = Column(DateTime, default=utcnow, nullable=False)

    source_issue = relationship("Issue", foreign_keys=[source_issue_id], back_populates="as_source_duplicates")
    matched_issue = relationship("Issue", foreign_keys=[matched_issue_id], back_populates="as_matched_duplicates")


class Comment(Base):
    __tablename__ = "comments"

    id = Column(Integer, primary_key=True, index=True)
    issue_id = Column(Integer, ForeignKey("issues.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    message = Column(Text, nullable=False)
    created_at = Column(DateTime, default=utcnow, nullable=False)

    issue = relationship("Issue", back_populates="comments")
    user = relationship("User", back_populates="comments")


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    issue_id = Column(Integer, ForeignKey("issues.id", ondelete="SET NULL"), nullable=True)
    message = Column(Text, nullable=False)
    is_read = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, default=utcnow, nullable=False)

    user = relationship("User", back_populates="notifications")
