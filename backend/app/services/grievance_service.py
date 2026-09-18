from typing import List, Dict, Any, Optional
from datetime import datetime
import uuid
from app.services.hash_service import compute_sha256_bytes32, compute_string_bytes32
from app.services.notification_service import create_notification

# Shared mock dataset initialized with demo records
_mock_grievances: List[Dict[str, Any]] = [
    {
        "id": "30000000-0000-0000-0000-000000000001",
        "onchain_id": 1,
        "title": "Severe Pothole near MG Road Sector 4",
        "title_hash": compute_string_bytes32("Severe Pothole near MG Road Sector 4"),
        "description": "Large deep pothole causing traffic slowdowns and hazard to two-wheelers near central junction.",
        "description_hash": compute_sha256_bytes32("Large deep pothole causing traffic slowdowns and hazard to two-wheelers near central junction."),
        "category_code": "0x524f414453000000000000000000000000000000000000000000000000000000",
        "department_code": "0x5055424c49435f574f524b530000000000000000000000000000000000000000",
        "priority": "HIGH",
        "status": "ASSIGNED",
        "citizen_id": "00000000-0000-0000-0000-000000000006",
        "assigned_officer_id": "00000000-0000-0000-0000-000000000004",
        "location": "MG Road, Sector 4, North Block",
        "resolution_summary": None,
        "resolution_hash": None,
        "feedback_comments": None,
        "feedback_hash": None,
        "rejection_reason": None,
        "rejection_hash": None,
        "reopen_count": 0,
        "created_at": datetime.utcnow().isoformat(),
        "updated_at": datetime.utcnow().isoformat()
    },
    {
        "id": "30000000-0000-0000-0000-000000000002",
        "onchain_id": 2,
        "title": "Clean Water Pipeline Burst in Lake View Colony",
        "title_hash": compute_string_bytes32("Clean Water Pipeline Burst in Lake View Colony"),
        "description": "Water pipe leaking heavily on the main road since early morning, wasting clean drinking water.",
        "description_hash": compute_sha256_bytes32("Water pipe leaking heavily on the main road since early morning, wasting clean drinking water."),
        "category_code": "0x57415445525f4c45414b00000000000000000000000000000000000000000000",
        "department_code": "0x57415445525f5345525649434553000000000000000000000000000000000000",
        "priority": "CRITICAL",
        "status": "SUBMITTED",
        "citizen_id": "00000000-0000-0000-0000-000000000007",
        "assigned_officer_id": None,
        "location": "Lake View Colony, Ward 12",
        "resolution_summary": None,
        "resolution_hash": None,
        "feedback_comments": None,
        "feedback_hash": None,
        "rejection_reason": None,
        "rejection_hash": None,
        "reopen_count": 0,
        "created_at": datetime.utcnow().isoformat(),
        "updated_at": datetime.utcnow().isoformat()
    }
]

_mock_audit_events: List[Dict[str, Any]] = [
    {
        "id": "a1",
        "grievance_id": "30000000-0000-0000-0000-000000000001",
        "actor_id": "00000000-0000-0000-0000-000000000006",
        "actor_wallet": "0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc",
        "action": "GRIEVANCE_CREATED",
        "data_hash": "0xfc2922442223788a10a1005a9c046271966a0123456789abcdef0123456789ab",
        "is_onchain": True,
        "tx_hash": "0x8f7a93b4c12d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f",
        "details": {"title": "Severe Pothole near MG Road Sector 4"},
        "created_at": datetime.utcnow().isoformat()
    }
]

def list_grievances(user_id: str, role: str, department_code: Optional[str] = None) -> List[Dict[str, Any]]:
    if role == "CITIZEN":
        return [g for g in _mock_grievances if g["citizen_id"] == user_id]
    elif role == "OFFICER":
        return [g for g in _mock_grievances if g["assigned_officer_id"] == user_id or (department_code and g["department_code"] == department_code)]
    elif role == "DEPARTMENT_ADMIN":
        if department_code:
            return [g for g in _mock_grievances if g["department_code"] == department_code]
        return _mock_grievances
    else:
        # SUPER_ADMIN
        return _mock_grievances

def get_grievance_by_id(grievance_id: str) -> Optional[Dict[str, Any]]:
    for g in _mock_grievances:
        if g["id"] == grievance_id or str(g.get("onchain_id")) == str(grievance_id):
            return g
    return None

def create_grievance_entry(data: Dict[str, Any], citizen_id: str) -> Dict[str, Any]:
    new_id = str(uuid.uuid4())
    onchain_id = len(_mock_grievances) + 1
    title_hash = compute_string_bytes32(data["title"])
    desc_hash = compute_sha256_bytes32(data["description"])

    record = {
        "id": new_id,
        "onchain_id": onchain_id,
        "title": data["title"],
        "title_hash": title_hash,
        "description": data["description"],
        "description_hash": desc_hash,
        "category_code": data["category_code"],
        "department_code": data["department_code"],
        "priority": data.get("priority", "MEDIUM"),
        "status": "SUBMITTED",
        "citizen_id": citizen_id,
        "assigned_officer_id": None,
        "location": data.get("location"),
        "resolution_summary": None,
        "resolution_hash": None,
        "feedback_comments": None,
        "feedback_hash": None,
        "rejection_reason": None,
        "rejection_hash": None,
        "reopen_count": 0,
        "created_at": datetime.utcnow().isoformat(),
        "updated_at": datetime.utcnow().isoformat()
    }
    _mock_grievances.append(record)

    # Append audit event
    _mock_audit_events.append({
        "id": str(uuid.uuid4()),
        "grievance_id": new_id,
        "actor_id": citizen_id,
        "actor_wallet": "0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc",
        "action": "GRIEVANCE_CREATED",
        "data_hash": desc_hash,
        "is_onchain": True,
        "tx_hash": f"0x{uuid.uuid4().hex}{uuid.uuid4().hex[:32]}",
        "details": {"title": data["title"]},
        "created_at": datetime.utcnow().isoformat()
    })

    create_notification(citizen_id, "Grievance Logged", f"Grievance #{onchain_id} '{data['title']}' created.", "SUCCESS", new_id)
    return record

def update_grievance_status(grievance_id: str, new_status: str, actor_id: str, actor_role: str, notes: Optional[str] = None) -> Optional[Dict[str, Any]]:
    g = get_grievance_by_id(grievance_id)
    if not g:
        return None
    old_status = g["status"]
    g["status"] = new_status
    g["updated_at"] = datetime.utcnow().isoformat()

    note_hash = compute_sha256_bytes32(notes) if notes else None

    _mock_audit_events.append({
        "id": str(uuid.uuid4()),
        "grievance_id": g["id"],
        "actor_id": actor_id,
        "actor_wallet": "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
        "action": "STATUS_UPDATED",
        "data_hash": note_hash,
        "is_onchain": True,
        "tx_hash": f"0x{uuid.uuid4().hex}{uuid.uuid4().hex[:32]}",
        "details": {"from": old_status, "to": new_status},
        "created_at": datetime.utcnow().isoformat()
    })

    create_notification(g["citizen_id"], "Status Updated", f"Grievance #{g.get('onchain_id', 1)} status changed to {new_status}.", "INFO", g["id"])
    return g

def assign_officer(grievance_id: str, officer_id: str, admin_id: str) -> Optional[Dict[str, Any]]:
    g = get_grievance_by_id(grievance_id)
    if not g:
        return None
    g["assigned_officer_id"] = officer_id
    g["status"] = "ASSIGNED"
    g["updated_at"] = datetime.utcnow().isoformat()

    _mock_audit_events.append({
        "id": str(uuid.uuid4()),
        "grievance_id": g["id"],
        "actor_id": admin_id,
        "actor_wallet": "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
        "action": "GRIEVANCE_ASSIGNED",
        "data_hash": compute_string_bytes32(officer_id),
        "is_onchain": True,
        "tx_hash": f"0x{uuid.uuid4().hex}{uuid.uuid4().hex[:32]}",
        "details": {"assigned_officer": officer_id},
        "created_at": datetime.utcnow().isoformat()
    })

    create_notification(officer_id, "New Grievance Assigned", f"You have been assigned to Grievance #{g.get('onchain_id', 1)}.", "INFO", g["id"])
    return g

def get_audit_events(grievance_id: str) -> List[Dict[str, Any]]:
    return [e for e in _mock_audit_events if e["grievance_id"] == grievance_id]
