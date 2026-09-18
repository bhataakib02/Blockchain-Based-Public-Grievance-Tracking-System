from fastapi import APIRouter, Depends, HTTPException
from typing import List, Dict, Any
from app.core.security import get_current_user
from app.services.notification_service import get_user_notifications, mark_notification_read

router = APIRouter(prefix="/notifications", tags=["Notifications"])

@router.get("", response_model=List[Dict[str, Any]])
def get_my_notifications(current_user: Dict[str, Any] = Depends(get_current_user)):
    return get_user_notifications(current_user["id"])

@router.patch("/{notif_id}/read")
def read_notification(notif_id: str, current_user: Dict[str, Any] = Depends(get_current_user)):
    success = mark_notification_read(notif_id, current_user["id"])
    if not success:
        raise HTTPException(status_code=404, detail="Notification not found.")
    return {"status": "success", "message": "Marked as read"}
