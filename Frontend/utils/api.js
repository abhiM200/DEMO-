import axios from "axios";

const API_BASE = "https://demo-jy2r.onrender.com"; 

const api = axios.create({ 
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" }
});

// Request interceptor 
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 🔥 FIXED PATHS: Prefix + Endpoint
export const register = (data) => api.post("/api/users/register", data);
export const login = (data) => api.post("/api/users/login", data);
export const getMe = () => api.get("/api/users/me");

export default api;
