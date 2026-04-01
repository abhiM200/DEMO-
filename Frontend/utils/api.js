// utils/api.js
import axios from "axios";

const API_BASE = "https://demo-jy2r.onrender.com"; // ✅ Tera Render Backend

const api = axios.create({ baseURL: API_BASE });

// 🔥 REGISTER PATH MATCH KARO (Prefix ke saath)
export const register = (data) => api.post("/api/users/register", data);
export const login = (data) => api.post("/api/users/login", data);
