from fastapi import APIRouter, Depends, HTTPException
from typing import List, Dict, Any
from app.schemas.models import DepartmentCreate, DepartmentResponse
from app.core.security import get_current_user, require_role
from app.services.hash_service import compute_sha256_bytes32, compute_string_bytes32

router = APIRouter(prefix="/departments", tags=["Departments"])

_mock_departments: List[Dict[str, Any]] = [
    {
        "id": "10000000-0000-0000-0000-000000000001",
        "code": "0x5055424c49435f574f524b530000000000000000000000000000000000000000",
        "name": "Public Works Department",
        "description": "Responsible for roads, bridges, streetlights, and public infrastructure maintenance.",
        "administrator_id": "00000000-0000-0000-0000-000000000002",
        "active": True,
        "metadata_hash": "0xe88a8d11e5f8bc874a7b73e8fa9f20e4e5e4e5e4e5e4e5e4e5e4e5e4e5e4e5e4"
    },
    {
        "id": "10000000-0000-0000-0000-000000000002",
        "code": "0x57415445525f5345525649434553000000000000000000000000000000000000",
        "name": "Water & Sanitation Board",
        "description": "Handles municipal water supply, pipeline leaks, drainage, and sewage management.",
        "administrator_id": "00000000-0000-0000-0000-000000000003",
        "active": True,
        "metadata_hash": "0xf99b9e22f6f9cd985b8c84f9fb0f31f5f6f5f6f5f6f5f6f5f6f5f6f5f6f5f6f5"
    }
]

@router.get("", response_model=List[Dict[str, Any]])
def get_departments():
    return _mock_departments

@router.post("", response_model=Dict[str, Any])
def create_department(dept: DepartmentCreate, current_user: Dict[str, Any] = Depends(require_role(["SUPER_ADMIN"]))):
    import uuid
    new_id = str(uuid.uuid4())
    code_bytes32 = compute_string_bytes32(dept.code)
    meta_hash = compute_sha256_bytes32(f"{dept.name}:{dept.description or ''}")

    record = {
        "id": new_id,
        "code": code_bytes32,
        "name": dept.name,
        "description": dept.description,
        "administrator_id": dept.administrator_id,
        "active": dept.active,
        "metadata_hash": meta_hash
    }
    _mock_departments.append(record)
    return record
