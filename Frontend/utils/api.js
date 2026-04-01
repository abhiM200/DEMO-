import axios from "axios";

// ✅ Live Backend URL
const API_BASE = "https://demo-jy2r.onrender.com";

const api = axios.create({ 
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  }
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 🔥 Sabse Important: Path match karna
// Tumhare main.py mein prefix="/api/users" hai, isliye ye path hoga:
export const register = (data) => api.post("/api/users/register", data);
export const login = (data) => api.post("/api/users/login", data);
export const getMe = () => api.get("/api/users/me");

export default api;
