from pydantic import BaseModel, EmailStr
from datetime import datetime

class UserCreate(BaseModel):
    email:     EmailStr
    full_name: str
    password:  str

class UserLogin(BaseModel):
    email:    EmailStr
    password: str

class UserOut(BaseModel):
    id:        int
    email:     str
    full_name: str
    role:      str
    is_active: bool

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type:   str

class TokenData(BaseModel):
    email: str | None = None