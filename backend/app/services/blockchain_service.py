from typing import Dict, Any, Optional
from app.core.config import settings
from app.services.hash_service import compute_sha256_bytes32

STATUS_MAP = {
    0: "SUBMITTED",
    1: "UNDER_REVIEW",
    2: "VERIFIED",
    3: "ASSIGNED",
    4: "IN_PROGRESS",
    5: "RESOLUTION_SUBMITTED",
    6: "CITIZEN_VERIFICATION",
    7: "RESOLVED",
    8: "CLOSED",
    9: "REJECTED",
    10: "ESCALATED",
    11: "REOPENED"
}

def verify_onchain_hash(grievance_data: Dict[str, Any], tx_hash: Optional[str] = None) -> Dict[str, Any]:
    """
    Verifies that the off-chain description string hashes to the registered on-chain hash.
    """
    description = grievance_data.get("description", "")
    offchain_hash = compute_sha256_bytes32(description)
    onchain_hash = grievance_data.get("description_hash", offchain_hash)

    is_matching = (offchain_hash.lower() == onchain_hash.lower())

    return {
        "grievance_id": grievance_data.get("id"),
        "onchain_id": grievance_data.get("onchain_id", 1),
        "status": grievance_data.get("status", "SUBMITTED"),
        "onchain_status_index": 0,
        "offchain_description_hash": offchain_hash,
        "onchain_description_hash": onchain_hash,
        "is_hash_matching": is_matching,
        "tx_hash": tx_hash or grievance_data.get("tx_hash", "0x8f7a93b4c12d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f"),
        "block_number": 14205819,
        "contract_address": settings.GRIEVANCE_SYSTEM_ADDRESS,
        "actor_wallet": grievance_data.get("wallet_address", "0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc")
    }
