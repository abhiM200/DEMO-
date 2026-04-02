import { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Navbar from "../components/Navbar";
import { getMe, getMyReviews, getMyPayments, checkout } from "../utils/api";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-700",
  in_progress: "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
};

const statusLabels = {
  pending: "⏳ Pending",
  in_progress: "🔄 In Progress",
  completed: "✅ Completed",
};

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [payments, setPayments] = useState([]);
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [paySuccess, setPaySuccess] = useState(false);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("overview");

  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      if (!token || token === "undefined") { router.push("/login"); return; }
      loadData();
    } catch { router.push("/login"); }
  }, []);

  const loadData = async () => {
    try {
      const [meRes, reviewsRes, paymentsRes] = await Promise.all([
        getMe(), getMyReviews(), getMyPayments()
      ]);
      setUser(meRes.data);
      setLinkedinUrl(meRes.data?.linkedin_url || "");
      setReviews(reviewsRes.data || []);
      setPayments(paymentsRes.data || []);
    } catch (err) {
      console.error("Dashboard Load Error:", err);
      if (err.response?.status === 401 || err.response?.status === 404) {
        localStorage.clear();
        router.push("/login");
      }
    } finally {
      setInitialLoading(false);
    }
  };

  const handleCheckout = async () => {
    if (!linkedinUrl) { setError("Please enter your LinkedIn profile URL"); return; }
    setError("");
    setLoading(true);
    try {
      await checkout({ linkedin_url: linkedinUrl });
      setPaySuccess(true);
      await loadData();
    } catch (err) {
      setError(err.response?.data?.detail || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const hasPaid = payments && payments.length > 0;

  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-400 text-sm">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head><title>My Dashboard — OutSpark</title></Head>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 py-10">

          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white mb-8 shadow-lg">
            <h1 className="text-2xl font-bold mb-1">Welcome back, {user?.name?.split(" ")[0] || "User"}! 👋</h1>
            <p className="text-blue-100 text-sm">{user?.email}</p>
            <div className="flex gap-4 mt-4 text-sm">
              <div className="bg-white/10 rounded-xl px-4 py-2 border border-white/10">
                <div className="font-bold text-lg">{reviews?.length || 0}</div>
                <div className="text-blue-200 text-xs">My Reviews</div>
              </div>
              <div className="bg-white/10 rounded-xl px-4 py-2 border border-white/10">
                <div className="font-bold text-lg">{payments?.length || 0}</div>
                <div className="text-blue-200 text-xs">Payments</div>
              </div>
              <div className="bg-white/10 rounded-xl px-4 py-2 border border-white/10">
                <div className="font-bold text-lg">{reviews?.filter(r => r.status === "completed").length || 0}</div>
                <div className="text-blue-200 text-xs">Completed</div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {["overview", "reviews", "payments"].map((t) => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-6 py-2.5 rounded-full text-sm font-semibold capitalize transition-all whitespace-nowrap ${tab === t ? "bg-blue-600 text-white shadow-md" : "bg-white text-gray-500 border border-gray-200 hover:bg-gray-50"}`}>
                {t}
              </button>
            ))}
          </div>

          {/* OVERVIEW */}
          {tab === "overview" && (
            <div className="space-y-6">
              {!hasPaid ? (
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                  <div className="text-center max-w-md mx-auto mb-8">
                    <span className="text-5xl">🎯</span>
                    <h2 className="text-2xl font-bold text-gray-900 mt-4">Get Your LinkedIn Profile Reviewed</h2>
                    <p className="text-gray-500 mt-2 text-sm">Expert analysis delivered in 2–4 working days.</p>
                  </div>
                  {paySuccess && (
                    <div className="bg-green-50 border border-green-200 text-green-700 rounded-2xl px-4 py-3 mb-4 text-sm text-center">
                      🎉 Payment successful! Your profile review has been submitted.
                    </div>
                  )}
                  {error && (
                    <div className="bg-red-50 border border-red-100 text-red-600 rounded-2xl px-4 py-3 mb-4 text-sm">{error}</div>
                  )}
                  <div className="max-w-md mx-auto space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Your LinkedIn Profile URL *</label>
                      <input type="url" value={linkedinUrl} onChange={(e) => setLinkedinUrl(e.target.value)}
                        placeholder="https://linkedin.com/in/yourname"
                        className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-gray-800 text-sm">LinkedIn Profile Review</span>
                        <div>
                          <span className="text-gray-400 line-through text-sm mr-1">₹1,999</span>
                          <span className="font-bold text-blue-600 text-lg">₹999</span>
                        </div>
                      </div>
                      <ul className="text-xs text-gray-500 space-y-1">
                        <li>✓ Full expert review of all profile sections</li>
                        <li>✓ Keyword & SEO optimization feedback</li>
                        <li>✓ Delivered in 2–4 working days</li>
                        <li>✓ One free revision round</li>
                      </ul>
                    </div>
                    <button onClick={handleCheckout} disabled={loading}
                      className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold py-4 rounded-2xl text-sm transition-all shadow-lg">
                      {loading ? "Processing..." : "Pay ₹999 & Submit My Profile →"}
                    </button>
                    <p className="text-center text-xs text-gray-400">🔒 Secure · Instant confirmation · 100% confidential</p>
                  </div>
                </div>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">✅</div>
                    <div>
                      <h3 className="font-bold text-green-800 text-lg">Payment Confirmed!</h3>
                      <p className="text-green-700 text-sm mt-1">Our expert will deliver feedback within 2–4 working days.</p>
                      {payments?.[0]?.transaction_id && (
                        <p className="text-green-600 text-xs mt-2">Transaction ID: <span className="font-mono">{payments[0].transaction_id}</span></p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {reviews?.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h3 className="font-bold text-gray-900 mb-4">Latest Review Status</h3>
                  <div className="flex items-center gap-3 flex-wrap mb-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[reviews[0].status] || "bg-gray-100 text-gray-600"}`}>
                      {statusLabels[reviews[0].status] || reviews[0].status}
                    </span>
                    <span className="text-gray-400 text-sm truncate max-w-xs">{reviews[0].linkedin_url}</span>
                  </div>
                  {reviews[0].score && (
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-sm text-gray-500 whitespace-nowrap">Profile Score:</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${reviews[0].score}%` }} />
                      </div>
                      <span className="font-bold text-blue-600">{reviews[0].score}/100</span>
                    </div>
                  )}
                  {reviews[0].review_notes && (
                    <div className="mt-3 bg-blue-50 rounded-xl p-4">
                      <p className="text-sm font-medium text-gray-700 mb-1">Expert Feedback:</p>
                      <p className="text-sm text-gray-600 leading-relaxed">{reviews[0].review_notes}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* REVIEWS TAB */}
          {tab === "reviews" && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-gray-900 mb-4">My Profile Reviews</h3>
              {!reviews || reviews.length === 0 ? (
                <div className="text-center py-12">
                  <span className="text-5xl">📋</span>
                  <p className="text-gray-400 text-sm mt-4">No reviews yet. Submit your LinkedIn profile to get started.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map((r) => (
                    <div key={r.id} className="border border-gray-100 rounded-xl p-4 hover:border-blue-200 transition-colors">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <a href={r.linkedin_url} target="_blank" rel="noreferrer"
                          className="text-sm text-blue-600 hover:underline truncate max-w-xs">{r.linkedin_url}</a>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium whitespace-nowrap ${statusColors[r.status] || "bg-gray-100 text-gray-600"}`}>
                          {statusLabels[r.status] || r.status}
                        </span>
                      </div>
                      {r.score && (
                        <div className="flex items-center gap-3 my-2">
                          <span className="text-xs text-gray-500">Score:</span>
                          <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                            <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${r.score}%` }} />
                          </div>
                          <span className="text-xs font-bold text-blue-600">{r.score}/100</span>
                        </div>
                      )}
                      {r.review_notes && (
                        <p className="text-sm text-gray-500 mt-2 leading-relaxed">{r.review_notes}</p>
                      )}
                      <p className="text-xs text-gray-300 mt-2">Submitted: {new Date(r.created_at).toLocaleDateString("en-IN")}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* PAYMENTS TAB */}
          {tab === "payments" && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-gray-900 mb-4">Payment History</h3>
              {!payments || payments.length === 0 ? (
                <div className="text-center py-12">
                  <span className="text-5xl">💳</span>
                  <p className="text-gray-400 text-sm mt-4">No payments yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {payments.map((p) => (
                    <div key={p.id} className="border border-gray-100 rounded-xl p-4 flex items-center justify-between hover:border-green-200 transition-colors">
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{p.plan}</p>
                        <p className="text-xs text-gray-400 font-mono mt-0.5">{p.transaction_id}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{new Date(p.created_at).toLocaleDateString("en-IN")}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">₹{p.amount}</p>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">{p.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </>
  );
}
