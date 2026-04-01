[README.md](https://github.com/user-attachments/files/26398551/README.md)
# OutSpark LinkedIn Profile Review — Full Stack Clone

> A pixel-faithful clone of myoutspark.com/linkedin-profile-review with payment bypass, user dashboard, and admin panel.

---

## 🏗 Tech Stack

| Layer     | Technology                              |
|-----------|-----------------------------------------|
| Frontend  | Next.js 14 + Tailwind CSS               |
| Backend   | FastAPI + Uvicorn                       |
| Database  | PostgreSQL                              |
| ORM       | SQLAlchemy                              |
| Auth      | JWT (python-jose + passlib/bcrypt)      |
| Hosting   | Render (backend) + Vercel (frontend)    |

---

## 📁 Project Structure

```
outspark-clone/
├── backend/
│   ├── main.py              # FastAPI app entry point + admin seed
│   ├── database.py          # SQLAlchemy engine + session
│   ├── models.py            # DB models: User, Payment, ProfileReview
│   ├── schemas.py           # Pydantic request/response schemas
│   ├── auth.py              # JWT + password hashing utilities
│   ├── requirements.txt
│   ├── .env                 # Environment variables
│   ├── render.yaml          # Render deployment config
│   └── routers/
│       ├── users.py         # /api/users — register, login, me, my-reviews, my-payments
│       ├── payments.py      # /api/payments — checkout (bypassed), status
│       └── admin.py         # /api/admin — dashboard, users, reviews, payments
│
└── frontend/
    ├── pages/
    │   ├── index.js         # Landing page (clone of OutSpark)
    │   ├── register.js      # User registration
    │   ├── login.js         # Login (user + admin)
    │   ├── dashboard.js     # User dashboard + payment flow
    │   ├── _app.js
    │   └── admin/
    │       └── index.js     # Full admin panel
    ├── components/
    │   └── Navbar.js
    ├── utils/
    │   └── api.js           # Axios API client
    ├── styles/
    │   └── globals.css
    ├── package.json
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── next.config.js
    └── .env.local
```

---

## ⚡ Quick Start (Local)

### 1. PostgreSQL — Create Database

```sql
CREATE DATABASE outspark_db;
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env .env.local
# Edit .env — update DATABASE_URL with your PostgreSQL credentials

# Run backend
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

Backend will be live at: **http://localhost:8000**
API docs (Swagger): **http://localhost:8000/docs**

On first startup, the admin user is automatically seeded:
- **Email:** admin@outspark.com
- **Password:** admin@123

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
# Edit .env.local — set NEXT_PUBLIC_API_URL=http://localhost:8000

# Run frontend
npm run dev
```

Frontend will be live at: **http://localhost:3000**

---

## 🔐 Login Credentials

| Role  | Email                  | Password   | Redirects to   |
|-------|------------------------|------------|----------------|
| Admin | admin@outspark.com     | admin@123  | /admin         |
| User  | (register any email)   | (any)      | /dashboard     |

---

## 💳 Payment Flow (Bypassed)

The payment section is fully bypassed — no real payment gateway required.

**How it works:**
1. User registers and logs in → redirected to `/dashboard`
2. User enters their LinkedIn URL and clicks **"Pay ₹999 & Submit"**
3. Backend immediately creates a payment record with `status: completed` and a fake `TXN-XXXXXXXX` transaction ID
4. A `ProfileReview` record is auto-created with `status: pending`
5. Admin can update the review status, score, and feedback from the admin panel

**To add real payments later**, replace the `checkout` endpoint in `backend/routers/payments.py` with Razorpay or Stripe integration.

---

## 🛡 API Endpoints

### Auth
| Method | Endpoint               | Description          |
|--------|------------------------|----------------------|
| POST   | /api/users/register    | Register new user    |
| POST   | /api/users/login       | Login (user/admin)   |
| GET    | /api/users/me          | Get current user     |
| GET    | /api/users/my-reviews  | Get user's reviews   |
| GET    | /api/users/my-payments | Get user's payments  |

### Payments
| Method | Endpoint                | Description             |
|--------|-------------------------|-------------------------|
| POST   | /api/payments/checkout  | Bypass payment + create review |
| GET    | /api/payments/status    | Check payment status    |

### Admin (requires admin JWT)
| Method | Endpoint                     | Description          |
|--------|------------------------------|----------------------|
| GET    | /api/admin/dashboard         | Stats overview       |
| GET    | /api/admin/users             | List all users       |
| DELETE | /api/admin/users/{id}        | Delete a user        |
| GET    | /api/admin/reviews           | List all reviews     |
| PUT    | /api/admin/reviews/{id}      | Update review        |
| GET    | /api/admin/payments          | List all payments    |

---

## 🚀 Deploy to Render (Backend)

1. Push `backend/` to a GitHub repo
2. Go to [render.com](https://render.com) → **New Web Service**
3. Connect your repo
4. Set environment variables:
   - `DATABASE_URL` → your PostgreSQL connection string (Render provides free PostgreSQL)
   - `SECRET_KEY` → any long random string
   - `ADMIN_EMAIL` → admin@outspark.com
   - `ADMIN_PASSWORD` → admin@123
5. Build command: `pip install -r requirements.txt`
6. Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

## 🚀 Deploy Frontend to Vercel

```bash
cd frontend
npx vercel
# Set NEXT_PUBLIC_API_URL = https://your-backend.onrender.com
```

---

## 👥 Testimonials (User Stories)

The landing page features real-looking testimonials from:
- **Abhishek Sharma** — Software Engineer at TCS
- **Priyanshu Verma** — Product Manager at Infosys
- **Altamash Khan** — Data Analyst at Wipro

---

## 🔧 Customization

| What to change             | Where                                      |
|----------------------------|--------------------------------------------|
| Pricing (₹999)             | `backend/routers/payments.py` + `frontend/pages/dashboard.js` |
| Admin credentials          | `backend/.env` → ADMIN_EMAIL, ADMIN_PASSWORD |
| CORS allowed origins       | `backend/main.py` → `allow_origins`       |
| Real payment gateway       | Replace `checkout()` in `payments.py`      |
| Testimonials               | `frontend/pages/index.js` → `testimonials` array |
| Brand name/colors          | `frontend/components/Navbar.js` + `index.js` |
