import os
import secrets
from fastapi import Header, HTTPException, Security, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from pathlib import Path
from dotenv import load_dotenv

# Default admin key for secure access (can be overridden via environment variable ADMIN_SECRET_KEY / ADMIN_KEY / ADMIN_PASSWORD)
DEFAULT_ADMIN_KEY = "admin_foundrai_secret_2026"

security = HTTPBearer(auto_error=False)


def get_admin_key():
    env_path = Path(__file__).resolve().parent.parent / ".env"
    if env_path.exists():
        load_dotenv(dotenv_path=env_path, override=True)
    return os.environ.get("ADMIN_SECRET_KEY") or os.environ.get("ADMIN_KEY") or os.environ.get("ADMIN_PASSWORD") or DEFAULT_ADMIN_KEY



def verify_admin(
    x_admin_key: str = Header(None, alias="X-Admin-Key"),
    auth: HTTPAuthorizationCredentials = Security(security)
):
    expected_key = get_admin_key()
    
    provided_key = None
    if x_admin_key:
        provided_key = x_admin_key
    elif auth and auth.credentials:
        provided_key = auth.credentials

    if not provided_key or not secrets.compare_digest(str(provided_key), str(expected_key)):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Forbidden: Invalid or missing admin credentials"
        )
    
    return True
