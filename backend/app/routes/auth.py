from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel

from app.auth import (
    create_access_token,
    get_current_user,
    hash_password,
    verify_password,
)
from app.database import users_collection


router = APIRouter(
    prefix="/api/auth",
    tags=["Authentication"],
)


# =========================
# REQUEST MODELS
# =========================

class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str


class LoginRequest(BaseModel):
    email: str
    password: str


# =========================
# REGISTER
# =========================

@router.post("/register")
def register(request: RegisterRequest):
    name = request.name.strip()
    email = request.email.strip().lower()
    password = request.password

    # Basic validation
    if not name:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Name cannot be empty.",
        )

    if not email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email cannot be empty.",
        )

    if len(password) < 8:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must contain at least 8 characters.",
        )

    # Check whether user already exists
    existing_user = users_collection.find_one(
        {"email": email}
    )

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A user with this email already exists.",
        )

    # Create user document
    user = {
        "name": name,
        "email": email,
        "password_hash": hash_password(password),
        "role": "analyst",
    }

    users_collection.insert_one(user)

    # Generate login token
    access_token = create_access_token(
        email=email,
        role="analyst",
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "name": name,
            "email": email,
            "role": "analyst",
        },
    }


# =========================
# LOGIN
# =========================

@router.post("/login")
def login(request: LoginRequest):
    email = request.email.strip().lower()

    user = users_collection.find_one(
        {"email": email}
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
            headers={
                "WWW-Authenticate": "Bearer"
            },
        )

    password_hash = user.get("password_hash")

    if not password_hash:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="User account has no password hash.",
        )

    password_valid = verify_password(
        request.password,
        password_hash,
    )

    if not password_valid:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
            headers={
                "WWW-Authenticate": "Bearer"
            },
        )

    role = user.get("role", "analyst")

    access_token = create_access_token(
        email=user["email"],
        role=role,
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "name": user.get("name", ""),
            "email": user["email"],
            "role": role,
        },
    }


# =========================
# CURRENT USER
# =========================

@router.get("/me")
def get_me(
    current_user=Depends(get_current_user),
):
    return {
        "name": current_user.get("name", ""),
        "email": current_user.get("email", ""),
        "role": current_user.get(
            "role",
            "analyst",
        ),
    }