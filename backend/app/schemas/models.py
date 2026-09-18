from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Any
from datetime import datetime
from enum import Enum

class UserRole(str, Enum):
    CITIZEN = "CITIZEN"
    OFFICER = "OFFICER"
    DEPARTMENT_ADMIN = "DEPARTMENT_ADMIN"
    SUPER_ADMIN = "SUPER_ADMIN"

class GrievanceStatus(str, Enum):
    SUBMITTED = "SUBMITTED"
    UNDER_REVIEW = "UNDER_REVIEW"
    VERIFIED = "VERIFIED"
    ASSIGNED = "ASSIGNED"
    IN_PROGRESS = "IN_PROGRESS"
    RESOLUTION_SUBMITTED = "RESOLUTION_SUBMITTED"
    CITIZEN_VERIFICATION = "CITIZEN_VERIFICATION"
    RESOLVED = "RESOLVED"
    CLOSED = "CLOSED"
    REJECTED = "REJECTED"
    ESCALATED = "ESCALATED"
    REOPENED = "REOPENED"

class PriorityLevel(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"

# Auth Schemas
class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    phone_number: Optional[str] = None
    role: UserRole = UserRole.CITIZEN
    wallet_address: Optional[str] = None

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: Dict[str, Any] if False else Any

# Profile Schemas
class ProfileResponse(BaseModel):
    id: str
    email: str
    full_name: str
    phone_number: Optional[str] = None
    role: UserRole
    wallet_address: Optional[str] = None
    created_at: Optional[datetime] = None

# Department Schemas
class DepartmentCreate(BaseModel):
    name: str
    code: str
    description: Optional[str] = None
    administrator_id: Optional[str] = None
    active: bool = True

class DepartmentResponse(BaseModel):
    id: str
    code: str
    name: str
    description: Optional[str] = None
    administrator_id: Optional[str] = None
    active: bool
    metadata_hash: str
    created_at: Optional[datetime] = None

# Category Schemas
class CategoryCreate(BaseModel):
    code: str
    name: str
    description: Optional[str] = None
    department_id: str

class CategoryResponse(BaseModel):
    id: str
    code: str
    name: str
    description: Optional[str] = None
    department_id: str

# Grievance Schemas
class GrievanceCreate(BaseModel):
    title: str
    description: str
    category_code: str
    department_code: str
    priority: PriorityLevel = PriorityLevel.MEDIUM
    location: Optional[str] = None

class GrievanceAssignRequest(BaseModel):
    officer_id: str

class GrievanceStatusUpdateRequest(BaseModel):
    new_status: GrievanceStatus
    evidence_notes: Optional[str] = None

class ResolutionSubmitRequest(BaseModel):
    resolution_summary: str

class GrievanceActionReasonRequest(BaseModel):
    reason: str

class GrievanceResponse(BaseModel):
    id: str
    onchain_id: Optional[int] = None
    title: str
    title_hash: str
    description: str
    description_hash: str
    category_code: str
    department_code: str
    priority: PriorityLevel
    status: GrievanceStatus
    citizen_id: str
    assigned_officer_id: Optional[str] = None
    location: Optional[str] = None
    resolution_summary: Optional[str] = None
    resolution_hash: Optional[str] = None
    feedback_comments: Optional[str] = None
    feedback_hash: Optional[str] = None
    rejection_reason: Optional[str] = None
    rejection_hash: Optional[str] = None
    reopen_count: int = 0
    created_at: datetime
    updated_at: datetime

# Investigation & Evidence Schemas
class InvestigationNoteCreate(BaseModel):
    note: str
    evidence_hash: Optional[str] = None

class EvidenceMetadata(BaseModel):
    file_name: str
    file_path: str
    file_size: int
    mime_type: str
    file_hash: str

# Blockchain Verification Schema
class BlockchainVerificationResponse(BaseModel):
    grievance_id: str
    onchain_id: Optional[int]
    status: str
    onchain_status_index: Optional[int]
    offchain_description_hash: str
    onchain_description_hash: Optional[str]
    is_hash_matching: bool
    tx_hash: Optional[str]
    block_number: Optional[int]
    contract_address: str
    actor_wallet: Optional[str]

# Audit Event Schema
class AuditEventResponse(BaseModel):
    id: str
    grievance_id: str
    actor_id: Optional[str]
    actor_wallet: Optional[str]
    action: str
    data_hash: Optional[str]
    is_onchain: bool
    tx_hash: Optional[str]
    details: Optional[dict] = None
    created_at: datetime
