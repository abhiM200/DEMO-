@app.on_event("startup")
def seed_admin():
    db = SessionLocal()
    try:
        admin_email = os.getenv("ADMIN_EMAIL", "admin@outspark.com")
        admin_password = os.getenv("ADMIN_PASSWORD", "admin@123")
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
        else:
            existing.is_admin = True
            existing.is_active = True
            existing.hashed_password = auth.hash_password(admin_password)
            db.commit()
            print(f"✅ Admin updated: {admin_email}")
    finally:
        db.close()
```

