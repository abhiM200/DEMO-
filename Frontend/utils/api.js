import axios from "axios";

const API_BASE = "https://demo-jy2r.onrender.com/api"; // ✅ Base mein hi /api daal diya

const api = axios.create({ baseURL: API_BASE });

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 🔥 Endpoints simplified (Kyunki baseURL mein /api hai)
// Auth (Prefix: /users)
export const register = (data) => api.post("/users/register", data);
export const login = (data) => api.post("/users/login", data);
export const getMe = () => api.get("/users/me");

// Admin (Prefix: /admin)
export const getAdminDashboard = () => api.get("/admin/dashboard");
export const getAdminUsers = () => api.get("/admin/users");

// Payments (Prefix: /payments)
export const checkout = (data) => api.post("/payments/checkout", data);

export default api;
