import os
from datetime import datetime, timedelta, timezone

from dotenv import load_dotenv
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import ExpiredSignatureError, JWTError, jwt
from pwdlib import PasswordHash

from app.database import users_collection


# =========================================================
# ENVIRONMENT VARIABLES
# =========================================================

load_dotenv()

SECRET_KEY: str = os.getenv("JWT_SECRET_KEY") or ""

if not SECRET_KEY:
    raise RuntimeError(
        "JWT_SECRET_KEY is missing from backend/.env"
    )

ALGORITHM: str = "HS256"

ACCESS_TOKEN_EXPIRE_MINUTES: int = int(
    os.getenv(
        "ACCESS_TOKEN_EXPIRE_MINUTES",
        "60"
    )
)


# =========================================================
# PASSWORD HASHING
# =========================================================

password_hasher = PasswordHash.recommended()


def hash_password(password: str) -> str:
    """
    Hash a plain-text password.
    """
    return password_hasher.hash(password)


def verify_password(
    plain_password: str,
    hashed_password: str
) -> bool:
    """
    Verify a plain-text password against
    a stored password hash.
    """
    return password_hasher.verify(
        plain_password,
        hashed_password
    )


# =========================================================
# JWT TOKEN CREATION
# =========================================================

def create_access_token(
    email: str,
    role: str = "analyst"
) -> str:
    """
    Create a JWT access token.
    """

    expire_time = (
        datetime.now(timezone.utc)
        + timedelta(
            minutes=ACCESS_TOKEN_EXPIRE_MINUTES
        )
    )

    payload = {
        "sub": email,
        "role": role,
        "exp": expire_time
    }

    token = jwt.encode(
        payload,
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    return token


# =========================================================
# BEARER AUTHENTICATION
# =========================================================

bearer_scheme = HTTPBearer()


# =========================================================
# GET CURRENT USER
# =========================================================

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(
        bearer_scheme
    )
):
    """
    Validate the JWT token and return
    the corresponding MongoDB user.
    """

    token = credentials.credentials

    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        email = payload.get("sub")

        if not email:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication token.",
                headers={
                    "WWW-Authenticate": "Bearer"
                }
            )

    except ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication token has expired.",
            headers={
                "WWW-Authenticate": "Bearer"
            }
        )

    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication token.",
            headers={
                "WWW-Authenticate": "Bearer"
            }
        )

    user = users_collection.find_one(
        {"email": email}
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User account not found.",
            headers={
                "WWW-Authenticate": "Bearer"
            }
        )

    return user