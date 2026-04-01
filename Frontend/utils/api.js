import axios from "axios";

// ✅ Live Backend URL
const API_BASE = "https://demo-jy2r.onrender.com";

const api = axios.create({ 
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  }
});

// Request Interceptor for Auth Token
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// 🔥 FIXED PATHS: Added '/api/users' prefix as per your main.py
export const register = (data) => api.post("/api/users/register", data);
export const login = (data) => api.post("/api/users/login", data);
export const getMe = () => api.get("/api/users/me");

// Admin & Payments (Check if they also need /api/admin or /api/payments)
export const getAdminDashboard = () => api.get("/api/admin/dashboard");
export const checkout = (data) => api.post("/api/payments/checkout", data);

export default api;
