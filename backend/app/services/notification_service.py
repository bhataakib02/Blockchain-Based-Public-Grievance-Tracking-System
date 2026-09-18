from typing import Optional, List, Dict, Any
from datetime import datetime
import uuid

# In-memory notification fallback storage for quick execution
_mock_notifications: List[Dict[str, Any]] = [
    {
        "id": "n1",
        "user_id": "00000000-0000-0000-0000-000000000006",
        "title": "Grievance Registered On-Chain",
        "message": "Your grievance 'Severe Pothole near MG Road' was logged with Hash 0xfc2922...",
        "type": "SUCCESS",
        "related_grievance_id": "30000000-0000-0000-0000-000000000001",
        "read": False,
        "created_at": datetime.utcnow().isoformat()
    }
]

def create_notification(user_id: str, title: str, message: str, type: str = "INFO", related_grievance_id: Optional[str] = None):
    new_notif = {
        "id": str(uuid.uuid4()),
        "user_id": user_id,
        "title": title,
        "message": message,
        "type": type,
        "related_grievance_id": related_grievance_id,
        "read": False,
        "created_at": datetime.utcnow().isoformat()
    }
    _mock_notifications.insert(0, new_notif)
    return new_notif

def get_user_notifications(user_id: str) -> List[Dict[str, Any]]:
    return [n for n in _mock_notifications if n["user_id"] == user_id or user_id == "00000000-0000-0000-0000-000000000001"]

def mark_notification_read(notif_id: str, user_id: str) -> bool:
    for n in _mock_notifications:
        if n["id"] == notif_id and (n["user_id"] == user_id or user_id == "00000000-0000-0000-0000-000000000001"):
            n["read"] = True
            return True
    return False
