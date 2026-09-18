from fastapi import APIRouter, Depends, HTTPException
from typing import List, Dict, Any
from app.core.security import get_current_user
from app.services.grievance_service import get_grievance_by_id

router = APIRouter(prefix="/resolutions", tags=["Resolutions"])

@router.get("/{grievance_id}")
def get_resolution(grievance_id: str, current_user: Dict[str, Any] = Depends(get_current_user)):
    g = get_grievance_by_id(grievance_id)
    if not g:
        raise HTTPException(status_code=404, detail="Grievance not found.")
    return {
        "grievance_id": g["id"],
        "resolution_summary": g.get("resolution_summary"),
        "resolution_hash": g.get("resolution_hash"),
        "status": g["status"],
        "feedback_comments": g.get("feedback_comments"),
        "feedback_hash": g.get("feedback_hash"),
        "rejection_reason": g.get("rejection_reason"),
        "rejection_hash": g.get("rejection_hash")
    }
