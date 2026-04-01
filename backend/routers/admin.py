from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
import models, schemas, auth

router = APIRouter(prefix="/api/admin", tags=["Admin"])


@router.get("/dashboard")
def admin_dashboard(
    admin: models.User = Depends(auth.get_admin_user),
    db: Session = Depends(get_db)
):
    total_users = db.query(models.User).filter(models.User.is_admin == False).count()
    total_payments = db.query(models.Payment).count()
    total_reviews = db.query(models.ProfileReview).count()
    pending_reviews = db.query(models.ProfileReview).filter(models.ProfileReview.status == "pending").count()
    in_progress = db.query(models.ProfileReview).filter(models.ProfileReview.status == "in_progress").count()
    completed = db.query(models.ProfileReview).filter(models.ProfileReview.status == "completed").count()
    revenue = db.query(models.Payment).count() * 999

    return {
        "total_users": total_users,
        "total_payments": total_payments,
        "total_reviews": total_reviews,
        "pending_reviews": pending_reviews,
        "in_progress_reviews": in_progress,
        "completed_reviews": completed,
        "total_revenue_inr": revenue,
    }


@router.get("/users")
def list_users(admin: models.User = Depends(auth.get_admin_user), db: Session = Depends(get_db)):
    return db.query(models.User).filter(models.User.is_admin == False).all()


@router.delete("/users/{user_id}")
def delete_user(user_id: int, admin: models.User = Depends(auth.get_admin_user), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(user)
    db.commit()
    return {"message": "User deleted"}


@router.get("/reviews")
def list_reviews(admin: models.User = Depends(auth.get_admin_user), db: Session = Depends(get_db)):
    return db.query(models.ProfileReview).order_by(models.ProfileReview.created_at.desc()).all()


@router.put("/reviews/{review_id}")
def update_review(
    review_id: int,
    data: schemas.ReviewUpdate,
    admin: models.User = Depends(auth.get_admin_user),
    db: Session = Depends(get_db)
):
    review = db.query(models.ProfileReview).filter(models.ProfileReview.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    if data.status is not None:
        review.status = data.status
    if data.score is not None:
        review.score = data.score
    if data.review_notes is not None:
        review.review_notes = data.review_notes
    if data.admin_notes is not None:
        review.admin_notes = data.admin_notes
    db.commit()
    db.refresh(review)
    return review


@router.get("/payments")
def list_payments(admin: models.User = Depends(auth.get_admin_user), db: Session = Depends(get_db)):
    return db.query(models.Payment).order_by(models.Payment.created_at.desc()).all()
