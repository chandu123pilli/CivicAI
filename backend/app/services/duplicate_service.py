import math
import re
from typing import List, Tuple, Optional
from sqlalchemy.orm import Session
from app.models.models import Issue, PotentialDuplicates
from app.core.config import settings

def haversine_distance_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculate the great-circle distance between two points on the Earth in kilometers."""
    R = 6371.0  # Earth's radius in kilometers
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (
        math.sin(dlat / 2.0) ** 2
        + math.cos(math.radians(lat1))
        * math.cos(math.radians(lat2))
        * math.sin(dlon / 2.0) ** 2
    )
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
    return R * c

def tokenize(text: str) -> set:
    """Tokenize text into lowercase alphanumeric words, filtering out short stopwords."""
    stopwords = {
        "the", "a", "an", "in", "on", "at", "to", "for", "of", "and", "or", "is",
        "are", "was", "were", "this", "that", "it", "with", "from", "by", "near", "there"
    }
    words = re.findall(r'[a-zA-Z0-9]{3,}', text.lower())
    return {w for w in words if w not in stopwords}

def jaccard_similarity(tokens1: set, tokens2: set) -> float:
    if not tokens1 or not tokens2:
        return 0.0
    intersection = tokens1.intersection(tokens2)
    union = tokens1.union(tokens2)
    return len(intersection) / len(union)

def calculate_similarity(
    new_issue: Issue,
    existing_issue: Issue
) -> float:
    # 1. Text Similarity
    tokens1 = tokenize(f"{new_issue.title} {new_issue.description}")
    tokens2 = tokenize(f"{existing_issue.title} {existing_issue.description}")
    text_sim = jaccard_similarity(tokens1, tokens2)

    # 2. Category Similarity
    if new_issue.category == existing_issue.category:
        category_sim = 1.0
    elif (
        (new_issue.category in ["Water supply and leakage", "Drainage and flooding"] and 
         existing_issue.category in ["Water supply and leakage", "Drainage and flooding"]) or
        (new_issue.category in ["Roads and potholes", "Public safety"] and
         existing_issue.category in ["Roads and potholes", "Public safety"])
    ):
        category_sim = 0.5
    else:
        category_sim = 0.0

    # 3. Geo Distance
    has_coords = (
        new_issue.latitude is not None and new_issue.longitude is not None and
        existing_issue.latitude is not None and existing_issue.longitude is not None
    )

    if has_coords:
        dist_km = haversine_distance_km(
            new_issue.latitude, new_issue.longitude,
            existing_issue.latitude, existing_issue.longitude
        )
        if dist_km <= 0.05:
            dist_sim = 1.0
        elif dist_km <= settings.SIMILARITY_DISTANCE_KM:
            dist_sim = max(0.0, 1.0 - (dist_km / settings.SIMILARITY_DISTANCE_KM))
        else:
            dist_sim = 0.0

        # Weighted combination: 40% distance, 35% text, 25% category
        total_score = (0.40 * dist_sim) + (0.35 * text_sim) + (0.25 * category_sim)
    else:
        # Without coords: 65% text, 35% category
        total_score = (0.65 * text_sim) + (0.35 * category_sim)

    return round(total_score, 3)

def detect_and_store_duplicates(db: Session, new_issue: Issue) -> List[PotentialDuplicates]:
    """
    Search active/recent complaints (excluding resolved/rejected older issues or self)
    and record potential duplicates exceeding threshold.
    """
    # Look back at complaints created in the last 60 days
    candidates = (
        db.query(Issue)
        .filter(Issue.id != new_issue.id)
        .filter(Issue.status.in_(["Submitted", "Under Review", "Assigned", "In Progress"]))
        .all()
    )

    created_matches: List[PotentialDuplicates] = []
    
    for candidate in candidates:
        score = calculate_similarity(new_issue, candidate)
        if score >= settings.SIMILARITY_SCORE_THRESHOLD:
            # Check if this duplicate pair is already recorded
            existing_dup = (
                db.query(PotentialDuplicates)
                .filter(
                    ((PotentialDuplicates.source_issue_id == new_issue.id) & (PotentialDuplicates.matched_issue_id == candidate.id)) |
                    ((PotentialDuplicates.source_issue_id == candidate.id) & (PotentialDuplicates.matched_issue_id == new_issue.id))
                )
                .first()
            )
            if not existing_dup:
                dup_record = PotentialDuplicates(
                    source_issue_id=new_issue.id,
                    matched_issue_id=candidate.id,
                    similarity_score=score,
                    review_status="Pending"
                )
                db.add(dup_record)
                created_matches.append(dup_record)

    if created_matches:
        db.commit()

    return created_matches
