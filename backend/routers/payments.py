from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models, auth
from pydantic import BaseModel

router = APIRouter(prefix="/api/payments")

class CheckoutRequest(BaseModel):
    linkedin_url: str = ""
    notes: str = ""

@router.post("/checkout")
def checkout(
    data: CheckoutRequest,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    # Check already paid
    existing = db.query(models.Payment).filter(
        models.Payment.user_id == current_user.id
    ).first()
    if existing:
        return {"message": "Already paid", "payment": existing}

    # Create payment (bypassed)
    payment = models.Payment(
        user_id=current_user.id,
        amount=999,
        status="completed",
        transaction_id=f"BYPASS_{current_user.id}"
    )
    db.add(payment)

    # Create review
    review = models.ProfileReview(
        user_id=current_user.id,
        linkedin_url=data.linkedin_url or current_user.linkedin_url or "",
        status="pending"
    )
    db.add(review)
    db.commit()
    db.refresh(payment)

    return {"message": "Payment successful", "payment": payment}

@router.get("/status")
def payment_status(
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    payment = db.query(models.Payment).filter(
        models.Payment.user_id == current_user.id
    ).first()
    return {"paid": payment is not None, "payment": payment}
