from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

load_dotenv()

from database import engine, SessionLocal
import models
import auth
from routers import users, admin, payments

# Create all tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="OutSpark LinkedIn Profile Review API", version="1.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://your-frontend-domain.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(users.router)
app.include_router(admin.router)
app.include_router(payments.router)


@app.get("/")
def root():
    return {"message": "OutSpark API is running ✅"}


@app.on_event("startup")
def seed_admin():
    """Create default admin on first run."""
    db = SessionLocal()
    try:
        admin_email = os.getenv("ADMIN_EMAIL", "admin@outspark.com")
        admin_password = os.getenv("ADMIN_PASSWORD", "admin@123")
        existing = db.query(models.User).filter(models.User.email == admin_email).first()
        if not existing:
            admin_user = models.User(
                name="Admin",
                email=admin_email,
                hashed_password=auth.hash_password(admin_password),
                is_admin=True,
                is_active=True,
            )
            db.add(admin_user)
            db.commit()
            print(f"✅ Admin seeded: {admin_email} / {admin_password}")
    finally:
        db.close()
