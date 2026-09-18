from supabase import create_client, Client
from app.core.config import settings

def get_supabase_client() -> Client:
    try:
        return create_client(settings.SUPABASE_URL, settings.SUPABASE_ANON_KEY)
    except Exception as e:
        print(f"[Supabase Warning] Could not connect to Supabase instance: {e}")
        # Return none or mock fallback handle
        return None

supabase_client = get_supabase_client()
