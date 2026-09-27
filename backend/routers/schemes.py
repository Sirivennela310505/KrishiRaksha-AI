from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from database import get_db
import models
import schemas

router = APIRouter(prefix="/api/schemes", tags=["Government Schemes"])

@router.get("", response_model=List[schemas.SchemeResponse])
def get_schemes(
    category: Optional[str] = Query(None),
    state: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(models.GovernmentScheme).filter(models.GovernmentScheme.is_active == True)
    if category and category.lower() != "all":
        query = query.filter(models.GovernmentScheme.category.ilike(f"%{category}%"))
    if state and state.lower() != "all":
        query = query.filter(
            (models.GovernmentScheme.state_applicability.ilike(f"%{state}%")) |
            (models.GovernmentScheme.state_applicability.ilike("%all india%"))
        )
    return query.all()

@router.get("/{scheme_id}", response_model=schemas.SchemeResponse)
def get_scheme_detail(scheme_id: int, db: Session = Depends(get_db)):
    scheme = db.query(models.GovernmentScheme).filter(models.GovernmentScheme.id == scheme_id).first()
    if not scheme:
        raise HTTPException(status_code=404, detail="Scheme not found")
    return scheme

@router.get("/search/voice")
def search_schemes_voice(query: str = Query(...), db: Session = Depends(get_db)):
    """
    Search schemes using natural voice queries such as:
    'Which scheme helps farmers buy equipment?' or 'PM Kisan Samman'
    """
    q_lower = query.lower()
    schemes = db.query(models.GovernmentScheme).filter(models.GovernmentScheme.is_active == True).all()
    matched = []

    for s in schemes:
        score = 0
        searchable_text = f"{s.title} {s.short_description} {s.who_can_benefit} {s.category}".lower()
        if "equipment" in q_lower or "tractor" in q_lower or "machinery" in q_lower:
            if "mechanization" in searchable_text or "equipment" in searchable_text or "smam" in searchable_text:
                score += 5
        if "solar" in q_lower or "pump" in q_lower:
            if "kusum" in searchable_text or "solar" in searchable_text:
                score += 5
        if "insurance" in q_lower or "loss" in q_lower or "damage" in q_lower:
            if "insurance" in searchable_text or "pmfby" in searchable_text:
                score += 5
        if "water" in q_lower or "drip" in q_lower or "irrigation" in q_lower:
            if "sinchayee" in searchable_text or "irrigation" in searchable_text or "drip" in searchable_text:
                score += 5
        if "soil" in q_lower or "test" in q_lower or "fertilizer" in q_lower:
            if "soil" in searchable_text:
                score += 5
        if "cash" in q_lower or "6000" in q_lower or "money" in q_lower or "kisan" in q_lower:
            if "pm-kisan" in searchable_text:
                score += 5

        # Word overlap
        for word in q_lower.split():
            if len(word) > 3 and word in searchable_text:
                score += 1

        if score > 0:
            matched.append((score, s))

    matched.sort(key=lambda x: x[0], reverse=True)
    results = [s for _, s in matched] if matched else schemes[:3]
    return {
        "query": query,
        "results_count": len(results),
        "schemes": results
    }
