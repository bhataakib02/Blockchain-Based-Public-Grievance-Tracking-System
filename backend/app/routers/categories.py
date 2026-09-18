from fastapi import APIRouter, Depends, HTTPException
from typing import List, Dict, Any
from app.schemas.models import CategoryCreate
from app.core.security import get_current_user, require_role
from app.services.hash_service import compute_string_bytes32

router = APIRouter(prefix="/categories", tags=["Categories"])

_mock_categories = [
    {
        "id": "20000000-0000-0000-0000-000000000001",
        "code": "0x524f414453000000000000000000000000000000000000000000000000000000",
        "name": "Potholes & Road Repairs",
        "description": "Issues related to road damage, missing asphalt, open manholes.",
        "department_id": "10000000-0000-0000-0000-000000000001"
    },
    {
        "id": "20000000-0000-0000-0000-000000000003",
        "code": "0x57415445525f4c45414b00000000000000000000000000000000000000000000",
        "name": "Water Pipeline Leakage",
        "description": "Burst water main, low water pressure, contaminated water supply.",
        "department_id": "10000000-0000-0000-0000-000000000002"
    }
]

@router.get("", response_model=List[Dict[str, Any]])
def get_categories():
    return _mock_categories

@router.post("", response_model=Dict[str, Any])
def create_category(cat: CategoryCreate, current_user: Dict[str, Any] = Depends(require_role(["SUPER_ADMIN", "DEPARTMENT_ADMIN"]))):
    import uuid
    new_id = str(uuid.uuid4())
    code_bytes32 = compute_string_bytes32(cat.code)
    record = {
        "id": new_id,
        "code": code_bytes32,
        "name": cat.name,
        "description": cat.description,
        "department_id": cat.department_id
    }
    _mock_categories.append(record)
    return record
