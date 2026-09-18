from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from typing import List, Dict, Any
from app.core.security import get_current_user
from app.services.hash_service import compute_sha256_bytes32
import uuid, datetime

router = APIRouter(prefix="/evidence", tags=["Evidence"])

_mock_evidence: List[Dict[str, Any]] = [
    {
        "id": "ev-1",
        "grievance_id": "30000000-0000-0000-0000-000000000001",
        "uploader_id": "00000000-0000-0000-0000-000000000006",
        "file_name": "pothole_photo_mg_road.jpg",
        "file_path": "/storage/evidence/pothole_photo_mg_road.jpg",
        "file_size": 245890,
        "mime_type": "image/jpeg",
        "file_hash": "0x7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a",
        "created_at": datetime.datetime.utcnow().isoformat()
    }
]

@router.get("/{grievance_id}", response_model=List[Dict[str, Any]])
def get_evidence(grievance_id: str, current_user: Dict[str, Any] = Depends(get_current_user)):
    return [e for e in _mock_evidence if e["grievance_id"] == grievance_id]

@router.post("/{grievance_id}", response_model=Dict[str, Any])
async def upload_evidence(grievance_id: str, file: UploadFile = File(...), current_user: Dict[str, Any] = Depends(get_current_user)):
    content = await file.read()
    file_hash = compute_sha256_bytes32(content.decode("utf-8", errors="ignore") or file.filename)
    record = {
        "id": str(uuid.uuid4()),
        "grievance_id": grievance_id,
        "uploader_id": current_user["id"],
        "file_name": file.filename,
        "file_path": f"/storage/evidence/{file.filename}",
        "file_size": len(content),
        "mime_type": file.content_type or "application/octet-stream",
        "file_hash": file_hash,
        "created_at": datetime.datetime.utcnow().isoformat()
    }
    _mock_evidence.append(record)
    return record
