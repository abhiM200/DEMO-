from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

from database import engine, SessionLocal
import models
import auth
from routers import users, admin, payments

# Database tables create karna (Auto-migration)
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="OutSpark LinkedIn Profile Review API",
    description="Backend API for OutSpark SaaS platform",
    version="1.0.0"
)

# ✅ CORS Fix: Added Wildcard and Vercel Subdomains support
origins = [
    "http://localhost:3000",
    "https://demo-lr5d.vercel.app",
    "https://demo-lr5d-git-main-abhim200.vercel.app", # Vercel preview branch support
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # 🔥 Easy Way: Production tak ke liye isse '*' rakho 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Routers Integration
app.include_router(users.router)
app.include_router(admin.router)
app.include_router(payments.router)

@app.get("/")
def root():
    return {
        "status": "Online",
        "message": "OutSpark API is running ✅",
        "docs": "/docs"
    }

# ✅ Startup Event: Default Admin Create Karna safely
@app.on_event("startup")
def seed_admin():
    db = SessionLocal()
    try:
        admin_email = os.getenv("ADMIN_EMAIL", "admin@outspark.com")
        admin_password = os.getenv("ADMIN_PASSWORD", "admin@123")
        
        # Check if admin already exists
        existing_admin = db.query(models.User).filter(models.User.email == admin_email).first()
        
        if not existing_admin:
            # argon2 hashing using your auth.py
            hashed_pw = auth.hash_password(admin_password)
            
            new_admin = models.User(
                name="System Admin",
                email=admin_email,
                hashed_password=hashed_pw,
                is_admin=True,
                is_active=True
            )
            db.add(new_admin)
            db.commit()
            print(f"🚀 Admin seeded successfully: {admin_email}")
        else:
            print("ℹ️ Admin user already exists. Skipping seed.")
            
    except Exception as e:
        print(f"❌ Error during admin seeding: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    import uvicorn
    # Render sets PORT env variable automatically
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port)
