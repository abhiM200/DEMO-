import axios from "axios";

// ✅ Direct backend URL (no localhost issue)
const API_BASE = "https://demo-jy2r.onrender.com";

const api = axios.create({ baseURL: API_BASE });

// Attach token automatically
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ Removed /api क्योंकि backend me nahi hai
export const register = (data) => api.post("/users/register", data);
export const login = (data) => api.post("/users/login", data);
export const getMe = () => api.get("/users/me");
export const getMyReviews = () => api.get("/users/my-reviews");
export const getMyPayments = () => api.get("/users/my-payments");

// Payment
export const checkout = (data) => api.post("/payments/checkout", data);
export const getPaymentStatus = () => api.get("/payments/status");

// Admin
export const getAdminDashboard = () => api.get("/admin/dashboard");
export const getAdminUsers = () => api.get("/admin/users");
export const deleteUser = (id) => api.delete(`/admin/users/${id}`);
export const getAdminReviews = () => api.get("/admin/reviews");
export const updateReview = (id, data) => api.put(`/admin/reviews/${id}`, data);
export const getAdminPayments = () => api.get("/admin/payments");

export default api;
