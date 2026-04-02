import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const u = localStorage.getItem("user");
      if (u && u !== "undefined" && u !== "null") {
        setUser(JSON.parse(u));
      }
    } catch (e) {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
  }, []);

  const logout = () => {
    localStorage.clear();
    router.push("/login");
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">OS</span>
            </div>
            <span className="font-bold text-xl text-blue-700">OutSpark</span>
          </Link>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link
                  href={user.is_admin ? "/admin" : "/dashboard"}
                  className="text-sm text-gray-600 hover:text-blue-600"
                >
                  {user.is_admin ? "Admin Panel" : "My Dashboard"}
                </Link>
                <button
                  onClick={logout}
                  className="text-sm bg-red-50 text-red-600 px-4 py-2 rounded-full hover:bg-red-100"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm text-gray-600 hover:text-blue-600">
                  Login
                </Link>
                <Link
                  href="/register"
                  className="text-sm bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700"
                >
                  Get Started Free
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
