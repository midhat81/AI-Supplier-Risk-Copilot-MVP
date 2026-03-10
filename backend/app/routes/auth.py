from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.utils.db   import get_db
from app.utils.auth import (
    hash_password,
    verify_password,
    create_access_token,
    get_current_user
)
from app.models.user import User
from app.schemas.user_schema import (
    UserCreate, UserLogin, UserOut, Token
)

router = APIRouter()


@router.post("/register", response_model=UserOut, status_code=201)
def register(payload: UserCreate, db: Session = Depends(get_db)):
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


@router.post("/login", response_model=Token)
def login(payload: UserLogin, db: Session = Depends(get_db)):
    # DEBUG PRINTS
    print(f"🔍 Login attempt: {payload.email}")
    
    user = db.query(User).filter(User.email == payload.email).first()
    print(f"👤 User found: {user is not None}")
    
    if not user:
        print("❌ User not found!")
        raise HTTPException(
            status_code = status.HTTP_401_UNAUTHORIZED,
            detail      = "Invalid email or password",
            headers     = {"WWW-Authenticate": "Bearer"},
        )

    print(f"🔑 Stored hash: {user.hashed_password[:20]}...")
    
    match = verify_password(payload.password, user.hashed_password)
    print(f"✅ Password match: {match}")

    if not match:
        print("❌ Password wrong!")
        raise HTTPException(
            status_code = status.HTTP_401_UNAUTHORIZED,
            detail      = "Invalid email or password",
            headers     = {"WWW-Authenticate": "Bearer"},
        )

    token = create_access_token(data={"sub": user.email})
    print("🎉 Login successful!")
    return {
        "access_token": token,
        "token_type":   "bearer"
    }


@router.get("/me", response_model=UserOut)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user