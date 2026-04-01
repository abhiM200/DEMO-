from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
import models, schemas, auth

router = APIRouter(prefix="/api/users", tags=["Users"])


@router.post("/register", response_model=schemas.Token)
def register(user_data: schemas.UserCreate, db: Session = Depends(get_db)):
    existing = db.query(models.User).filter(models.User.email == user_data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    user = models.User(
        name=user_data.name,
        email=user_data.email,
        hashed_password=auth.hash_password(user_data.password),
        phone=user_data.phone,
        linkedin_url=user_data.linkedin_url,
        is_admin=False,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = auth.create_access_token({"sub": str(user.id)})
    return {"access_token": token, "token_type": "bearer", "user": user}


@router.post("/login", response_model=schemas.Token)
def login(credentials: schemas.UserLogin, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == credentials.email).first()
    if not user or not auth.verify_password(credentials.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    if not user.is_active:
        raise HTTPException(status_code=403, detail="Account is inactive")

    token = auth.create_access_token({"sub": str(user.id)})
    return {"access_token": token, "token_type": "bearer", "user": user}


@router.get("/me", response_model=schemas.UserOut)
def get_me(current_user: models.User = Depends(auth.get_current_user)):
    return current_user


@router.get("/my-reviews")
def get_my_reviews(
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    reviews = db.query(models.ProfileReview).filter(
        models.ProfileReview.user_id == current_user.id
    ).all()
    return reviews


@router.get("/my-payments")
def get_my_payments(
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    payments = db.query(models.Payment).filter(
        models.Payment.user_id == current_user.id
    ).all()
    return payments
