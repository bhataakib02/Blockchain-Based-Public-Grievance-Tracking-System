from fastapi import APIRouter, Depends, HTTPException
from typing import Dict, Any
from app.core.security import get_current_user
from app.services.grievance_service import get_grievance_by_id
from app.services.blockchain_service import verify_onchain_hash

router = APIRouter(prefix="/blockchain", tags=["Blockchain Verification"])

@router.get("/verify/{grievance_id}", response_model=Dict[str, Any])
def verify_grievance_blockchain(grievance_id: str):
    g = get_grievance_by_id(grievance_id)
    if not g:
        raise HTTPException(status_code=404, detail="Grievance record not found.")
    return verify_onchain_hash(g)
