from fastapi import APIRouter, Depends, HTTPException
from typing import List, Dict, Any
from app.core.security import get_current_user, require_role

router = APIRouter(prefix="/users", tags=["Users"])

_mock_profiles = [
    {
        "id": "00000000-0000-0000-0000-000000000001",
        "email": "superadmin@grievance.gov.in",
        "full_name": "Super Admin User",
        "phone_number": "+91 9876543210",
        "role": "SUPER_ADMIN",
        "wallet_address": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
    },
    {
        "id": "00000000-0000-0000-0000-000000000002",
        "email": "deptadmin.pwd@grievance.gov.in",
        "full_name": "Public Works Admin",
        "phone_number": "+91 9876543211",
        "role": "DEPARTMENT_ADMIN",
        "wallet_address": "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"
    },
    {
        "id": "00000000-0000-0000-0000-000000000004",
        "email": "officer.kumar@grievance.gov.in",
        "full_name": "Inspector Rajesh Kumar",
        "phone_number": "+91 9876543213",
        "role": "OFFICER",
        "wallet_address": "0x90F79bf6EB2c4f870365E785982E1f101E93b906"
    },
    {
        "id": "00000000-0000-0000-0000-000000000006",
        "email": "citizen.rahul@gmail.com",
        "full_name": "Rahul Verma (Citizen)",
        "phone_number": "+91 9876543215",
        "role": "CITIZEN",
        "wallet_address": "0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc"
    }
]

@router.get("", response_model=List[Dict[str, Any]])
def list_users(current_user: Dict[str, Any] = Depends(require_role(["SUPER_ADMIN", "DEPARTMENT_ADMIN"]))):
    return _mock_profiles

@router.get("/officers", response_model=List[Dict[str, Any]])
def list_officers(current_user: Dict[str, Any] = Depends(get_current_user)):
    return [p for p in _mock_profiles if p["role"] == "OFFICER"]
