import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const api = axios.create({ baseURL: API_BASE });

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const register = (data) => api.post("/api/users/register", data);
export const login = (data) => api.post("/api/users/login", data);
export const getMe = () => api.get("/api/users/me");
export const getMyReviews = () => api.get("/api/users/my-reviews");
export const getMyPayments = () => api.get("/api/users/my-payments");

export const checkout = (data) => api.post("/api/payments/checkout", data);
export const getPaymentStatus = () => api.get("/api/payments/status");

export const getAdminDashboard = () => api.get("/api/admin/dashboard");
export const getAdminUsers = () => api.get("/api/admin/users");
export const deleteUser = (id) => api.delete(`/api/admin/users/${id}`);
export const getAdminReviews = () => api.get("/api/admin/reviews");
export const updateReview = (id, data) => api.put(`/api/admin/reviews/${id}`, data);
export const getAdminPayments = () => api.get("/api/admin/payments");

export default api;
