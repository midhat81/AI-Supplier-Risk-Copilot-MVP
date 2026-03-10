"""
Auth Routes
POST /auth/register  - Create new user
POST /auth/login     - Login and get JWT token
GET  /auth/me        - Get current user info
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.utils.db   import get_db
from app.utils.auth import (
    hash_password,
    verify_password,
    create_access_token,
    get_current_user
)
from app.models.user    import User
from app.schemas.user_schema import (
    UserCreate,
    UserLogin,
    UserOut,
    Token
)

router = APIRouter()


# ── Register ─────────────────────────────────────
@router.post("/register", response_model=UserOut, status_code=201)
def register(payload: UserCreate, db: Session = Depends(get_db)):
    # Check if email already exists
    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        raise HTTPException(
            status_code = status.HTTP_400_BAD_REQUEST,
            detail      = "Email already registered"
        )

    user = User(
        email           = payload.email,
        full_name       = payload.full_name,
        hashed_password = hash_password(payload.password),
        role            = "user",
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


# ── Login ─────────────────────────────────────────
@router.post("/login", response_model=Token)
def login(payload: UserLogin, db: Session = Depends(get_db)):
    # Find user
    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(
            status_code = status.HTTP_401_UNAUTHORIZED,
            detail      = "Invalid email or password",
            headers     = {"WWW-Authenticate": "Bearer"},
        )

    # Create token
    token = create_access_token(data={"sub": user.email})
    return {
        "access_token": token,
        "token_type":   "bearer"
    }


# ── Get Current User ──────────────────────────────
@router.get("/me", response_model=UserOut)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user