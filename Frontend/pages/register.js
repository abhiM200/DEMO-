import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { register } from "../utils/api";

export default function Register() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "", linkedin_url: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // 🕵️‍♂️ Debugging: Dekhte hain kya data ja raha hai
    console.log("🚀 Attempting registration with:", form);

    try {
      const res = await register(form);
      console.log("✅ Server Response:", res.data);

      localStorage.setItem("token", res.data.access_token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      router.push("/dashboard");
    } catch (err) {
      // 🔴 Yaha asli error dikhega console mein
      console.error("❌ Registration Error Details:", err.response);

      // Agar backend se proper message aa raha hai toh wo dikhao, warna default
      const errorMsg = err.response?.data?.detail;
      if (Array.isArray(errorMsg)) {
        setError(errorMsg[0].msg); // Validation errors ke liye
      } else {
        setError(errorMsg || "Registration failed. Please check your internet or API path.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head><title>Register — OutSpark</title></Head>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-12">
        <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-8">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">OS</span>
              </div>
              <span className="font-bold text-xl text-blue-700">OutSpark</span>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Create your free account</h1>
            <p className="text-gray-500 text-sm mt-1">Get your LinkedIn profile reviewed by experts</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl mb-4 border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
              <input
                name="name" type="text" required value={form.name} onChange={handleChange}
                placeholder="e.g. Abhishek Sharma"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
              <input
                name="email" type="email" required value={form.email} onChange={handleChange}
                placeholder="you@email.com"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
              <input
                name="password" type="password" required minLength={6} value={form.password} onChange={handleChange}
                placeholder="Min. 6 characters"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input
                name="phone" type="tel" value={form.phone} onChange={handleChange}
                placeholder="+91 9876543210"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn Profile URL</label>
              <input
                name="linkedin_url" type="url" value={form.linkedin_url} onChange={handleChange}
                placeholder="https://linkedin.com/in/yourname"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl text-sm transition-all mt-2"
            >
              {loading ? "Creating account..." : "Create Account & Get Review →"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 font-medium hover:underline">Login</Link>
          </p>
        </div>
      </div>
    </>
  );
}
