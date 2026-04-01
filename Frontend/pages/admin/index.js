import { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import {
  getAdminDashboard, getAdminUsers, getAdminReviews,
  getAdminPayments, updateReview, deleteUser
} from "../../utils/api";

const tabs = ["Dashboard", "Reviews", "Users", "Payments"];

const statusColors = {
  pending: "bg-yellow-100 text-yellow-700",
  in_progress: "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
};

export default function AdminPanel() {
  const router = useRouter();
  const [tab, setTab] = useState("Dashboard");
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [payments, setPayments] = useState([]);
  const [editReview, setEditReview] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const u = localStorage.getItem("user");
    if (!u) { router.push("/login"); return; }
    const parsed = JSON.parse(u);
    if (!parsed.is_admin) { router.push("/dashboard"); return; }
    loadAll();
  }, []);

  const loadAll = async () => {
    try {
      const [d, u, r, p] = await Promise.all([
        getAdminDashboard(), getAdminUsers(), getAdminReviews(), getAdminPayments()
      ]);
      setStats(d.data);
      setUsers(u.data);
      setReviews(r.data);
      setPayments(p.data);
    } catch { router.push("/login"); }
  };

  const handleUpdateReview = async () => {
    setSaving(true);
    try {
      await updateReview(editReview.id, editForm);
      setEditReview(null);
      await loadAll();
    } finally { setSaving(false); }
  };

  const handleDeleteUser = async (id) => {
    if (!confirm("Delete this user permanently?")) return;
    await deleteUser(id);
    await loadAll();
  };

  const logout = () => { localStorage.clear(); router.push("/login"); };

  const StatCard = ({ label, value, color, icon }) => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
      <div className="flex items-center justify-between mb-2">
        <span className="text-gray-400 text-sm">{label}</span>
        <span className="text-2xl">{icon}</span>
      </div>
      <div className={`text-3xl font-extrabold ${color}`}>{value}</div>
    </div>
  );

  return (
    <>
      <Head><title>Admin Panel — OutSpark</title></Head>
      <div className="min-h-screen bg-gray-50 flex">
        {/* Sidebar */}
        <div className="w-60 bg-gray-900 text-white flex flex-col py-6 px-4 fixed inset-y-0 left-0">
          <div className="flex items-center gap-2 mb-10 px-2">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center font-bold text-sm">OS</div>
            <div>
              <p className="font-bold text-sm">OutSpark</p>
              <p className="text-gray-400 text-xs">Admin Panel</p>
            </div>
          </div>

          <nav className="flex flex-col gap-1">
            {tabs.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${tab === t ? "bg-blue-600 text-white" : "text-gray-400 hover:bg-gray-800 hover:text-white"}`}
              >
                {t === "Dashboard" && "📊 "}{t === "Reviews" && "📋 "}{t === "Users" && "👥 "}{t === "Payments" && "💳 "}{t}
              </button>
            ))}
          </nav>

          <div className="mt-auto">
            <button
              onClick={logout}
              className="w-full text-left px-4 py-2.5 rounded-xl text-sm text-red-400 hover:bg-gray-800 hover:text-red-300 transition-all"
            >
              🚪 Logout
            </button>
          </div>
        </div>

        {/* Main */}
        <div className="ml-60 flex-1 p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">{tab}</h1>

          {/* DASHBOARD */}
          {tab === "Dashboard" && stats && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="Total Users" value={stats.total_users} color="text-blue-600" icon="👥" />
                <StatCard label="Total Revenue" value={`₹${stats.total_revenue_inr}`} color="text-green-600" icon="💰" />
                <StatCard label="Total Reviews" value={stats.total_reviews} color="text-purple-600" icon="📋" />
                <StatCard label="Pending Reviews" value={stats.pending_reviews} color="text-yellow-600" icon="⏳" />
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                <StatCard label="In Progress" value={stats.in_progress_reviews} color="text-blue-600" icon="🔄" />
                <StatCard label="Completed" value={stats.completed_reviews} color="text-green-600" icon="✅" />
                <StatCard label="Total Payments" value={stats.total_payments} color="text-indigo-600" icon="💳" />
              </div>

              {/* Recent reviews quick view */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-bold text-gray-900 mb-4">Recent Reviews</h3>
                <div className="space-y-3">
                  {reviews.slice(0, 5).map((r) => (
                    <div key={r.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                      <div>
                        <p className="text-sm font-medium text-gray-800">{r.user_email}</p>
                        <p className="text-xs text-gray-400 truncate max-w-xs">{r.linkedin_url}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[r.status] || "bg-gray-100 text-gray-600"}`}>
                        {r.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* REVIEWS */}
          {tab === "Reviews" && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-400 border-b border-gray-100">
                      <th className="pb-3 font-medium">User</th>
                      <th className="pb-3 font-medium">LinkedIn URL</th>
                      <th className="pb-3 font-medium">Status</th>
                      <th className="pb-3 font-medium">Score</th>
                      <th className="pb-3 font-medium">Date</th>
                      <th className="pb-3 font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {reviews.map((r) => (
                      <tr key={r.id}>
                        <td className="py-3 text-gray-700">{r.user_email}</td>
                        <td className="py-3 text-gray-400 truncate max-w-[180px]">
                          <a href={r.linkedin_url} target="_blank" rel="noreferrer" className="hover:text-blue-600 truncate block max-w-[180px]">
                            {r.linkedin_url}
                          </a>
                        </td>
                        <td className="py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[r.status] || "bg-gray-100 text-gray-600"}`}>
                            {r.status}
                          </span>
                        </td>
                        <td className="py-3 text-gray-600">{r.score ? `${r.score}/100` : "—"}</td>
                        <td className="py-3 text-gray-400 text-xs">{new Date(r.created_at).toLocaleDateString()}</td>
                        <td className="py-3">
                          <button
                            onClick={() => { setEditReview(r); setEditForm({ status: r.status, score: r.score || "", review_notes: r.review_notes || "", admin_notes: r.admin_notes || "" }); }}
                            className="text-blue-600 hover:underline text-xs font-medium"
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {reviews.length === 0 && <p className="text-center text-gray-400 py-8">No reviews yet</p>}
              </div>
            </div>
          )}

          {/* USERS */}
          {tab === "Users" && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-400 border-b border-gray-100">
                      <th className="pb-3 font-medium">Name</th>
                      <th className="pb-3 font-medium">Email</th>
                      <th className="pb-3 font-medium">Phone</th>
                      <th className="pb-3 font-medium">LinkedIn</th>
                      <th className="pb-3 font-medium">Joined</th>
                      <th className="pb-3 font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {users.map((u) => (
                      <tr key={u.id}>
                        <td className="py-3 font-medium text-gray-800">{u.name}</td>
                        <td className="py-3 text-gray-600">{u.email}</td>
                        <td className="py-3 text-gray-400">{u.phone || "—"}</td>
                        <td className="py-3">
                          {u.linkedin_url ? (
                            <a href={u.linkedin_url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline text-xs">View</a>
                          ) : "—"}
                        </td>
                        <td className="py-3 text-gray-400 text-xs">{new Date(u.created_at).toLocaleDateString()}</td>
                        <td className="py-3">
                          <button onClick={() => handleDeleteUser(u.id)} className="text-red-500 hover:underline text-xs font-medium">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {users.length === 0 && <p className="text-center text-gray-400 py-8">No users yet</p>}
              </div>
            </div>
          )}

          {/* PAYMENTS */}
          {tab === "Payments" && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-400 border-b border-gray-100">
                      <th className="pb-3 font-medium">User</th>
                      <th className="pb-3 font-medium">Plan</th>
                      <th className="pb-3 font-medium">Amount</th>
                      <th className="pb-3 font-medium">Status</th>
                      <th className="pb-3 font-medium">Transaction ID</th>
                      <th className="pb-3 font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {payments.map((p) => (
                      <tr key={p.id}>
                        <td className="py-3">
                          <p className="font-medium text-gray-800">{p.user_name}</p>
                          <p className="text-xs text-gray-400">{p.user_email}</p>
                        </td>
                        <td className="py-3 text-gray-600">{p.plan}</td>
                        <td className="py-3 font-bold text-gray-900">₹{p.amount}</td>
                        <td className="py-3">
                          <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">{p.status}</span>
                        </td>
                        <td className="py-3 font-mono text-xs text-gray-400">{p.transaction_id}</td>
                        <td className="py-3 text-gray-400 text-xs">{new Date(p.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {payments.length === 0 && <p className="text-center text-gray-400 py-8">No payments yet</p>}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Review Modal */}
      {editReview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6">
            <h3 className="font-bold text-gray-900 text-lg mb-4">Edit Review #{editReview.id}</h3>
            <p className="text-xs text-gray-400 mb-4">{editReview.user_email}</p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Profile Score (0–100)</label>
                <input
                  type="number" min="0" max="100" value={editForm.score}
                  onChange={(e) => setEditForm({ ...editForm, score: parseInt(e.target.value) || "" })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Review Feedback (shown to user)</label>
                <textarea
                  rows={4} value={editForm.review_notes}
                  onChange={(e) => setEditForm({ ...editForm, review_notes: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your detailed feedback for the user..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Internal Notes (admin only)</label>
                <textarea
                  rows={2} value={editForm.admin_notes}
                  onChange={(e) => setEditForm({ ...editForm, admin_notes: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Internal notes..."
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleUpdateReview}
                disabled={saving}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold py-2.5 rounded-xl text-sm"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
              <button
                onClick={() => setEditReview(null)}
                className="flex-1 border border-gray-200 text-gray-600 font-medium py-2.5 rounded-xl text-sm hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
