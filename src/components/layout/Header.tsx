"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { getCurrentUser, logout } from "@/lib/auth";
import { useCart } from "@/context/cart-context";

export const Header: React.FC = () => {
  const router = useRouter();
  const { totalItems } = useCart();
  const [currentUser, setCurrentUser] = useState<{
    name: string;
    role: string;
  } | null>(null);

  useEffect(() => {
    const { user } = getCurrentUser();
    if (user) {
      setCurrentUser({ name: user.name, role: user.role });
    }
  }, []);

  const handleLogout = async () => {
    await logout();
    setCurrentUser(null);
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-40 border-b border-violet-200 bg-gradient-to-r from-white to-slate-50 shadow-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 via-purple-600 to-cyan-500 shadow-lg group-hover:shadow-xl transition-shadow">
            <span className="text-lg font-bold text-white">🛍️</span>
          </div>
          <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-cyan-500 bg-clip-text text-2xl font-bold text-transparent hidden sm:inline hover:opacity-80 transition-opacity">
            T-Cart
          </span>
        </Link>

        <nav className="flex items-center gap-6">
          {currentUser ? (
            <>
              {currentUser.role === "admin" && (
                <Link
                  href="/admin/dashboard"
                  className="text-sm font-medium text-slate-600 hover:text-violet-600 transition-colors duration-200"
                >
                  Dashboard
                </Link>
              )}
              <Link
                href="/products"
                className="text-sm font-medium text-slate-600 hover:text-violet-600 transition-colors duration-200"
              >
                Products
              </Link>
              <Link
                href="/cart"
                className="relative text-sm font-medium text-slate-600 hover:text-violet-600 transition-colors duration-200"
              >
                Cart
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 inline-flex items-center justify-center h-5 w-5 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 text-xs font-bold text-white shadow-md">
                    {totalItems}
                  </span>
                )}
              </Link>
              <div className="flex items-center gap-3">
                <span className="text-sm text-slate-600">
                  Hi{" "}
                  <span className="font-semibold text-slate-900">
                    {currentUser.name}
                  </span>
                  {currentUser.role === "admin" && (
                    <span className="ml-1 text-xs bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full">
                      (Admin)
                    </span>
                  )}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-red-500 to-pink-500 text-sm font-medium text-white hover:shadow-lg hover:scale-105 transition-all duration-200"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="text-sm font-medium text-slate-600 hover:text-violet-600 transition-colors duration-200"
              >
                Login
              </Link>
              <Link
                href="/auth/signup"
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-violet-600 to-cyan-500 text-sm font-medium text-white hover:shadow-lg hover:scale-105 transition-all duration-200"
              >
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};
