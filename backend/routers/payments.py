import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models, schemas, auth

router = APIRouter(prefix="/api/payments", tags=["Payments"])


@router.post("/checkout", response_model=schemas.PaymentOut)
def checkout(
    payload: schemas.PaymentCreate,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    """
    Payment bypass — instantly marks payment as completed.
    Replace this with Razorpay / Stripe in production.
    """
    # Check if user already paid
    existing = db.query(models.Payment).filter(
        models.Payment.user_id == current_user.id,
        models.Payment.status == "completed"
    ).first()
    if existing:
        return existing

    payment = models.Payment(
        user_id=current_user.id,
        user_email=current_user.email,
        user_name=current_user.name,
        amount=999.0,
        currency="INR",
        status="completed",
        plan=payload.plan,
        linkedin_url=payload.linkedin_url,
        transaction_id=f"TXN-{uuid.uuid4().hex[:12].upper()}",
    )
    db.add(payment)

    # Also auto-create a profile review
    review = models.ProfileReview(
        user_id=current_user.id,
        user_email=current_user.email,
        linkedin_url=payload.linkedin_url,
        status="pending",
    )
    db.add(review)

    # Update user's linkedin_url
    current_user.linkedin_url = payload.linkedin_url
    db.commit()
    db.refresh(payment)
    return payment


@router.get("/status")
def payment_status(
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    payment = db.query(models.Payment).filter(
        models.Payment.user_id == current_user.id
    ).first()
    if not payment:
        return {"paid": False}
    return {"paid": True, "payment": payment}
