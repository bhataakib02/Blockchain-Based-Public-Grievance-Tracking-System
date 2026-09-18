from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List, Dict, Any, Optional
from app.schemas.models import (
    GrievanceCreate, GrievanceResponse, GrievanceAssignRequest, 
    GrievanceStatusUpdateRequest, ResolutionSubmitRequest, GrievanceActionReasonRequest
)
from app.core.security import get_current_user, require_role
from app.services.grievance_service import (
    list_grievances, get_grievance_by_id, create_grievance_entry, 
    update_grievance_status, assign_officer
)
from app.services.hash_service import compute_sha256_bytes32

router = APIRouter(prefix="/grievances", tags=["Grievances"])

@router.get("", response_model=List[Dict[str, Any]])
def get_all_grievances(
    status: Optional[str] = Query(None),
    priority: Optional[str] = Query(None),
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    user_id = current_user["id"]
    role = current_user["role"]
    items = list_grievances(user_id, role)
    if status:
        items = [i for i in items if i["status"] == status]
    if priority:
        items = [i for i in items if i["priority"] == priority]
    return items

@router.get("/{grievance_id}", response_model=Dict[str, Any])
def get_grievance_detail(grievance_id: str, current_user: Dict[str, Any] = Depends(get_current_user)):
    g = get_grievance_by_id(grievance_id)
    if not g:
        raise HTTPException(status_code=404, detail="Grievance not found.")
    
    # Enforce ownership / authorization checks
    role = current_user["role"]
    user_id = current_user["id"]
    if role == "CITIZEN" and g["citizen_id"] != user_id:
        raise HTTPException(status_code=403, detail="Unauthorized: You can only view your own grievances.")
    return g

@router.post("", response_model=Dict[str, Any])
def submit_grievance(payload: GrievanceCreate, current_user: Dict[str, Any] = Depends(require_role(["CITIZEN", "SUPER_ADMIN"]))):
    return create_grievance_entry(payload.dict(), current_user["id"])

@router.post("/{grievance_id}/assign")
def assign_grievance_to_officer(
    grievance_id: str, 
    payload: GrievanceAssignRequest, 
    current_user: Dict[str, Any] = Depends(require_role(["DEPARTMENT_ADMIN", "SUPER_ADMIN"]))
):
    res = assign_officer(grievance_id, payload.officer_id, current_user["id"])
    if not res:
        raise HTTPException(status_code=404, detail="Grievance not found or invalid status for assignment.")
    return res

@router.patch("/{grievance_id}/status")
def update_status(
    grievance_id: str, 
    payload: GrievanceStatusUpdateRequest, 
    current_user: Dict[str, Any] = Depends(require_role(["OFFICER", "DEPARTMENT_ADMIN", "SUPER_ADMIN"]))
):
    res = update_grievance_status(grievance_id, payload.new_status.value, current_user["id"], current_user["role"], payload.evidence_notes)
    if not res:
        raise HTTPException(status_code=404, detail="Grievance update failed.")
    return res

@router.post("/{grievance_id}/resolve")
def submit_resolution(
    grievance_id: str, 
    payload: ResolutionSubmitRequest, 
    current_user: Dict[str, Any] = Depends(require_role(["OFFICER", "SUPER_ADMIN"]))
):
    g = get_grievance_by_id(grievance_id)
    if not g:
        raise HTTPException(status_code=404, detail="Grievance not found.")
    
    res_hash = compute_sha256_bytes32(payload.resolution_summary)
    g["resolution_summary"] = payload.resolution_summary
    g["resolution_hash"] = res_hash
    g["status"] = "RESOLUTION_SUBMITTED"
    return g

@router.post("/{grievance_id}/verify")
def verify_resolution(
    grievance_id: str, 
    payload: GrievanceActionReasonRequest, 
    current_user: Dict[str, Any] = Depends(require_role(["CITIZEN", "SUPER_ADMIN"]))
):
    g = get_grievance_by_id(grievance_id)
    if not g:
        raise HTTPException(status_code=404, detail="Grievance not found.")
    feedback_hash = compute_sha256_bytes32(payload.reason)
    g["feedback_comments"] = payload.reason
    g["feedback_hash"] = feedback_hash
    g["status"] = "RESOLVED"
    return g

@router.post("/{grievance_id}/reject")
def reject_resolution(
    grievance_id: str, 
    payload: GrievanceActionReasonRequest, 
    current_user: Dict[str, Any] = Depends(require_role(["CITIZEN", "SUPER_ADMIN"]))
):
    g = get_grievance_by_id(grievance_id)
    if not g:
        raise HTTPException(status_code=404, detail="Grievance not found.")
    rej_hash = compute_sha256_bytes32(payload.reason)
    g["rejection_reason"] = payload.reason
    g["rejection_hash"] = rej_hash
    g["status"] = "REOPENED"
    g["reopen_count"] += 1
    return g

@router.post("/{grievance_id}/reopen")
def reopen_grievance(
    grievance_id: str, 
    payload: GrievanceActionReasonRequest, 
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    g = get_grievance_by_id(grievance_id)
    if not g:
        raise HTTPException(status_code=404, detail="Grievance not found.")
    g["rejection_reason"] = payload.reason
    g["rejection_hash"] = compute_sha256_bytes32(payload.reason)
    g["status"] = "REOPENED"
    g["reopen_count"] += 1
    return g

@router.post("/{grievance_id}/escalate")
def escalate_grievance(
    grievance_id: str, 
    payload: GrievanceActionReasonRequest, 
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    g = get_grievance_by_id(grievance_id)
    if not g:
        raise HTTPException(status_code=404, detail="Grievance not found.")
    g["status"] = "ESCALATED"
    return g
