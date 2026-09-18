from fastapi import APIRouter, Depends, HTTPException
from typing import List, Dict, Any
from app.schemas.models import InvestigationNoteCreate
from app.core.security import get_current_user, require_role
from app.services.hash_service import compute_sha256_bytes32
import uuid, datetime

router = APIRouter(prefix="/investigations", tags=["Investigations"])

_mock_notes: List[Dict[str, Any]] = [
    {
        "id": "inv-1",
        "grievance_id": "30000000-0000-0000-0000-000000000001",
        "officer_id": "00000000-0000-0000-0000-000000000004",
        "officer_name": "Inspector Rajesh Kumar",
        "note": "Initial site inspection completed. Pothole measured at 1.5m diameter and 15cm depth. Repair crew dispatched.",
        "evidence_hash": "0xa1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2",
        "created_at": datetime.datetime.utcnow().isoformat()
    }
]

@router.get("/{grievance_id}", response_model=List[Dict[str, Any]])
def get_notes_for_grievance(grievance_id: str, current_user: Dict[str, Any] = Depends(get_current_user)):
    return [n for n in _mock_notes if n["grievance_id"] == grievance_id]

@router.post("/{grievance_id}", response_model=Dict[str, Any])
def add_investigation_note(grievance_id: str, payload: InvestigationNoteCreate, current_user: Dict[str, Any] = Depends(require_role(["OFFICER", "SUPER_ADMIN"]))):
    note_hash = payload.evidence_hash or compute_sha256_bytes32(payload.note)
    record = {
        "id": str(uuid.uuid4()),
        "grievance_id": grievance_id,
        "officer_id": current_user["id"],
        "officer_name": current_user.get("full_name", "Officer"),
        "note": payload.note,
        "evidence_hash": note_hash,
        "created_at": datetime.datetime.utcnow().isoformat()
    }
    _mock_notes.append(record)
    return record
