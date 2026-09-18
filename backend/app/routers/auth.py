from fastapi import APIRouter, HTTPException, Depends, status
from app.schemas.models import LoginRequest, RegisterRequest, TokenResponse, ProfileResponse
from app.core.security import verify_password, get_password_hash, create_access_token, get_current_user
from typing import Dict, Any

router = APIRouter(prefix="/auth", tags=["Authentication"])

# In-memory auth user store for local execution
_demo_users: Dict[str, Dict[str, Any]] = {
    "superadmin@grievance.gov.in": {
        "id": "00000000-0000-0000-0000-000000000001",
        "email": "superadmin@grievance.gov.in",
        "hashed_password": get_password_hash("DemoPassword123!"),
        "full_name": "Super Admin User",
        "role": "SUPER_ADMIN",
        "wallet_address": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
    },
    "deptadmin.pwd@grievance.gov.in": {
        "id": "00000000-0000-0000-0000-000000000002",
        "email": "deptadmin.pwd@grievance.gov.in",
        "hashed_password": get_password_hash("DemoPassword123!"),
        "full_name": "Public Works Admin",
        "role": "DEPARTMENT_ADMIN",
        "wallet_address": "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"
    },
    "officer.kumar@grievance.gov.in": {
        "id": "00000000-0000-0000-0000-000000000004",
        "email": "officer.kumar@grievance.gov.in",
        "hashed_password": get_password_hash("DemoPassword123!"),
        "full_name": "Inspector Rajesh Kumar",
        "role": "OFFICER",
        "wallet_address": "0x90F79bf6EB2c4f870365E785982E1f101E93b906"
    },
    "citizen.rahul@gmail.com": {
        "id": "00000000-0000-0000-0000-000000000006",
        "email": "citizen.rahul@gmail.com",
        "hashed_password": get_password_hash("DemoPassword123!"),
        "full_name": "Rahul Verma (Citizen)",
        "role": "CITIZEN",
        "wallet_address": "0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc"
    }
}

@router.post("/register", response_model=TokenResponse)
def register_user(req: RegisterRequest):
    if req.email in _demo_users:
        raise HTTPException(status_code=400, detail="User email already registered.")
    
    import uuid
    new_id = str(uuid.uuid4())
    user_record = {
        "id": new_id,
        "email": req.email,
        "hashed_password": get_password_hash(req.password),
        "full_name": req.full_name,
        "role": req.role.value if hasattr(req.role, 'value') else str(req.role),
        "wallet_address": req.wallet_address
    }
    _demo_users[req.email] = user_record

    token = create_access_token({
        "sub": new_id,
        "email": req.email,
        "role": user_record["role"],
        "full_name": req.full_name,
        "wallet_address": req.wallet_address
    })

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": new_id,
            "email": req.email,
            "full_name": req.full_name,
            "role": user_record["role"],
            "wallet_address": req.wallet_address
        }
    }

@router.post("/login", response_model=TokenResponse)
def login_user(req: LoginRequest):
    user = _demo_users.get(req.email)
    if not user or not verify_password(req.password, user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password.")
    
    token = create_access_token({
        "sub": user["id"],
        "email": user["email"],
        "role": user["role"],
        "full_name": user["full_name"],
        "wallet_address": user.get("wallet_address")
    })

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user["id"],
            "email": user["email"],
            "full_name": user["full_name"],
            "role": user["role"],
            "wallet_address": user.get("wallet_address")
        }
    }

@router.get("/me")
def get_me(current_user: Dict[str, Any] = Depends(get_current_user)):
    return current_user
