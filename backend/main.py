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

app = FastAPI(title="OutSpark API")

# CORS
 app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)
# ✅ Routers — NO prefix here (prefix already inside each router file)
app.include_router(users.router)
app.include_router(admin.router)
app.include_router(payments.router)

@app.get("/")
def root():
    return {"status": "Online", "docs": "/docs"}

@app.on_event("startup")
def seed_admin():
    db = SessionLocal()
    try:
        admin_email = os.getenv("ADMIN_EMAIL", "superadmin@outspark.com")
        admin_password = os.getenv("ADMIN_PASSWORD", "Admin@2025")
        existing = db.query(models.User).filter(
            models.User.email == admin_email
        ).first()
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
            print(f"✅ Admin created: {admin_email}")
    finally:
        db.close()
