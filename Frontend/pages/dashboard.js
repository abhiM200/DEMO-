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
  const [initialLoading, setInitialLoading] = useState(true); // ✅ Added
  const [paySuccess, setPaySuccess] = useState(false);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("overview");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { 
      router.push("/login"); 
      return; 
    }
    loadData();
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
      // Agar 404 (Not Found) aa raha hai, toh localStorage clear karke login bhejo
      if (err.response?.status === 404 || err.response?.status === 401) {
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

  // ✅ Safe Data Access
  const hasPaid = payments && payments.length > 0;

  // ✅ Loading Screen to prevent crash
  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      <Head><title>My Dashboard — OutSpark</title></Head>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 py-10">
          {/* Header - Added Optional Chaining ?. */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white mb-8 shadow-lg">
            <h1 className="text-2xl font-bold mb-1">
              Welcome back, {user?.name?.split(" ")[0] || "User"}! 👋
            </h1>
            <p className="text-blue-100 text-sm">{user?.email}</p>
            
            <div className="flex gap-4 mt-4 text-sm">
              <div className="bg-white/10 backdrop-blur-md rounded-xl px-4 py-2 border border-white/10">
                <div className="font-bold text-lg">{reviews?.length || 0}</div>
                <div className="text-blue-200 text-xs text-nowrap">My Reviews</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-xl px-4 py-2 border border-white/10">
                <div className="font-bold text-lg">{payments?.length || 0}</div>
                <div className="text-blue-200 text-xs text-nowrap">Payments</div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {["overview", "reviews", "payments"].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-6 py-2.5 rounded-full text-sm font-semibold capitalize transition-all ${tab === t ? "bg-blue-600 text-white shadow-md" : "bg-white text-gray-500 border border-gray-200 hover:bg-gray-50"}`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Content Sections (Baaki logic same hai par safe tags ke saath) */}
          {tab === "overview" && (
            <div className="space-y-6 animate-in fade-in duration-500">
               {/* Registration / Payment Card UI */}
               {!hasPaid ? (
                  <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                    <div className="text-center max-w-md mx-auto mb-8">
                        <span className="text-5xl">🎯</span>
                        <h2 className="text-2xl font-bold text-gray-900 mt-4">Unlock Your Dream Job</h2>
                        <p className="text-gray-500 mt-2">Get an expert deep-dive into your LinkedIn profile.</p>
                    </div>

                    <div className="max-w-md mx-auto space-y-5">
                       <input 
                         className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none"
                         placeholder="Enter LinkedIn URL"
                         value={linkedinUrl}
                         onChange={(e) => setLinkedinUrl(e.target.value)}
                       />
                       <button 
                         onClick={handleCheckout}
                         disabled={loading}
                         className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all"
                       >
                         {loading ? "Connecting..." : "Start Review - ₹999"}
                       </button>
                    </div>
                  </div>
               ) : (
                  <div className="bg-green-50 border border-green-100 rounded-3xl p-8 text-center">
                      <span className="text-5xl">🚀</span>
                      <h2 className="text-xl font-bold text-green-800 mt-4">Analysis in Progress!</h2>
                      <p className="text-green-700">Check the 'Reviews' tab in 48 hours for your report.</p>
                  </div>
               )}
            </div>
          )}
          
          {/* Reviews & Payments Tabs Logic */}
          {/* ... (Same as your code but use optional chaining) ... */}
        </div>
      </div>
    </>
  );
}
