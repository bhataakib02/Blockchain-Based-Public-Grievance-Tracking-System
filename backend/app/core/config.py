import os
from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "Blockchain-Based Public Grievance Tracking System"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"

    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "https://placeholder-project.supabase.co")
    SUPABASE_ANON_KEY: str = os.getenv("SUPABASE_ANON_KEY", "placeholder-anon-key")
    SUPABASE_SERVICE_ROLE_KEY: Optional[str] = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "placeholder-service-key")

    JWT_SECRET: str = os.getenv("JWT_SECRET", "super-secret-jwt-key-for-development-change-me")
    JWT_ALGORITHM: str = os.getenv("JWT_ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440 # 24 hours

    RPC_URL: str = os.getenv("RPC_URL", "http://127.0.0.1:8545")
    CHAIN_ID: int = int(os.getenv("CHAIN_ID", "31337"))

    ROLE_MANAGER_ADDRESS: str = os.getenv("VITE_ROLE_MANAGER_ADDRESS", "0x5FbDB2315678afecb367f032d93F642f64180aa3")
    DEPARTMENT_MANAGER_ADDRESS: str = os.getenv("VITE_DEPARTMENT_MANAGER_ADDRESS", "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512")
    ESCALATION_MANAGER_ADDRESS: str = os.getenv("VITE_ESCALATION_MANAGER_ADDRESS", "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0")
    AUDIT_TRAIL_ADDRESS: str = os.getenv("VITE_AUDIT_TRAIL_ADDRESS", "0xCf7Ed3AccA5a467e9e75457124372915801570B7")
    GRIEVANCE_SYSTEM_ADDRESS: str = os.getenv("VITE_GRIEVANCE_SYSTEM_ADDRESS", "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9")

    class Config:
        case_sensitive = True

settings = Settings()
