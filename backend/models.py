from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, Float
from sqlalchemy.sql import func
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(200), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    is_admin = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    linkedin_url = Column(String(500), nullable=True)
    phone = Column(String(20), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False)
    user_email = Column(String(200), nullable=False)
    user_name = Column(String(100), nullable=False)
    amount = Column(Float, default=999.0)
    currency = Column(String(10), default="INR")
    status = Column(String(50), default="completed")   # bypassed — always completed
    plan = Column(String(100), default="LinkedIn Profile Review")
    linkedin_url = Column(String(500), nullable=True)
    transaction_id = Column(String(100), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class ProfileReview(Base):
    __tablename__ = "profile_reviews"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False)
    user_email = Column(String(200), nullable=False)
    linkedin_url = Column(String(500), nullable=False)
    status = Column(String(50), default="pending")   # pending / in_progress / completed
    score = Column(Integer, nullable=True)
    review_notes = Column(Text, nullable=True)
    admin_notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
