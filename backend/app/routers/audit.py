from fastapi import APIRouter, Depends
from typing import List, Dict, Any
from app.core.security import get_current_user
from app.services.grievance_service import get_audit_events

router = APIRouter(prefix="/audit", tags=["Audit Trail"])

@router.get("/{grievance_id}", response_model=List[Dict[str, Any]])
def get_grievance_audit_trail(grievance_id: str):
    return get_audit_events(grievance_id)
