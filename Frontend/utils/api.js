import axios from "axios";

// ✅ 100% Production Ready Backend URL
const API_BASE = "https://demo-jy2r.onrender.com";

const api = axios.create({ 
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  }
});

// ✅ Request Interceptor: Token automatically attach karega
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// ---------------------------------------------------------
// 🔥 API ENDPOINTS (As per your FastAPI Routers)
// ---------------------------------------------------------

// --- AUTH & USER ---
export const register = (data) => api.post("/users/register", data);
export const login = (data) => api.post("/users/login", data);
export const getMe = () => api.get("/users/me");
export const getMyReviews = () => api.get("/users/my-reviews");
export const getMyPayments = () => api.get("/users/my-payments");

// --- PAYMENTS ---
export const checkout = (data) => api.post("/payments/checkout", data);
export const getPaymentStatus = () => api.get("/payments/status");

// --- ADMIN PANEL ---
export const getAdminDashboard = () => api.get("/admin/dashboard");
export const getAdminUsers = () => api.get("/admin/users");
export const deleteUser = (id) => api.delete(`/admin/users/${id}`);
export const getAdminReviews = () => api.get("/admin/reviews");
export const updateReview = (id, data) => api.put(`/admin/reviews/${id}`, data);
export const getAdminPayments = () => api.get("/admin/payments");

// Debugging ke liye (Optional): Log base URL on load
console.log("🚀 API connected to:", API_BASE);

export default api;
