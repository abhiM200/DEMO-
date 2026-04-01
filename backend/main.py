from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import users, admin, payments
import models
from database import engine

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="OutSpark API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Production ke liye easy access
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Prefix integration
app.include_router(users.router, prefix="/api/users", tags=["Users"])
app.include_router(admin.router, prefix="/api/admin", tags=["Admin"])
app.include_router(payments.router, prefix="/api/payments", tags=["Payments"])

@app.get("/")
def root():
    return {"status": "Online", "docs": "/docs"}
