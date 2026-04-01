import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { login } from "../utils/api";

export default function Login() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await login(form);
      localStorage.setItem("token", res.data.access_token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      router.push(res.data.user.is_admin ? "/admin" : "/dashboard");
    } catch (err) {
      setError(err.response?.data?.detail || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head><title>Login — OutSpark</title></Head>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-8">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">OS</span>
              </div>
              <span className="font-bold text-xl text-blue-700">OutSpark</span>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
            <p className="text-gray-500 text-sm mt-1">Login to your OutSpark account</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl mb-4 border border-red-100">
              {error}
            </div>
          )}

          {/* Admin hint */}
          <div className="bg-blue-50 border border-blue-100 text-blue-700 text-xs rounded-xl px-4 py-3 mb-4">
            <strong>Admin Login:</strong> admin@outspark.com / admin@123
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                name="email" type="email" required value={form.email} onChange={handleChange}
                placeholder="you@email.com"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                name="password" type="password" required value={form.password} onChange={handleChange}
                placeholder="Your password"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl text-sm transition-all mt-2"
            >
              {loading ? "Logging in..." : "Login to My Account →"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don't have an account?{" "}
            <Link href="/register" className="text-blue-600 font-medium hover:underline">Register Free</Link>
          </p>
        </div>
      </div>
    </>
  );
}
