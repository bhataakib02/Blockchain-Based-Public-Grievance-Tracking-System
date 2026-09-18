from fastapi import APIRouter, Depends
from typing import Dict, Any
from app.core.security import get_current_user
from app.services.grievance_service import list_grievances

router = APIRouter(prefix="/analytics", tags=["Analytics"])

@router.get("/summary", response_model=Dict[str, Any])
def get_analytics_summary(current_user: Dict[str, Any] = Depends(get_current_user)):
    user_id = current_user["id"]
    role = current_user["role"]
    grievances = list_grievances(user_id, role)

    total = len(grievances)
    submitted = sum(1 for g in grievances if g["status"] == "SUBMITTED")
    active = sum(1 for g in grievances if g["status"] in ["UNDER_REVIEW", "ASSIGNED", "IN_PROGRESS", "RESOLUTION_SUBMITTED", "CITIZEN_VERIFICATION", "REOPENED"])
    resolved = sum(1 for g in grievances if g["status"] in ["RESOLVED", "CLOSED"])
    escalated = sum(1 for g in grievances if g["status"] == "ESCALATED")
    reopened = sum(1 for g in grievances if g["status"] == "REOPENED" or g.get("reopen_count", 0) > 0)
    overdue = sum(1 for g in grievances if g["priority"] == "CRITICAL" and g["status"] != "RESOLVED")

    status_distribution = {}
    for g in grievances:
        st = g["status"]
        status_distribution[st] = status_distribution.get(st, 0) + 1

    return {
        "role": role,
        "total_grievances": total,
        "submitted": submitted,
        "active_grievances": active,
        "resolved_grievances": resolved,
        "escalated_grievances": escalated,
        "reopened_grievances": reopened,
        "overdue_grievances": overdue,
        "status_distribution": status_distribution
    }
