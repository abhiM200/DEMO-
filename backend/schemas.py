from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


# ── Auth ────────────────────────────────────────────────────────────────────
class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    phone: Optional[str] = None
    linkedin_url: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: int
    name: str
    email: str
    is_admin: bool
    is_active: bool
    linkedin_url: Optional[str] = None
    phone: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserOut


# ── Payment ──────────────────────────────────────────────────────────────────
class PaymentCreate(BaseModel):
    linkedin_url: str
    plan: Optional[str] = "LinkedIn Profile Review"

class PaymentOut(BaseModel):
    id: int
    user_id: int
    user_email: str
    user_name: str
    amount: float
    currency: str
    status: str
    plan: str
    linkedin_url: Optional[str]
    transaction_id: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


# ── Profile Review ────────────────────────────────────────────────────────────
class ReviewCreate(BaseModel):
    linkedin_url: str

class ReviewUpdate(BaseModel):
    status: Optional[str] = None
    score: Optional[int] = None
    review_notes: Optional[str] = None
    admin_notes: Optional[str] = None

class ReviewOut(BaseModel):
    id: int
    user_id: int
    user_email: str
    linkedin_url: str
    status: str
    score: Optional[int]
    review_notes: Optional[str]
    admin_notes: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True
