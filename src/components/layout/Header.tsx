"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { getCurrentUser, logout } from "@/lib/auth";
import { useCart } from "@/context/cart-context";

export const Header: React.FC = () => {
  const router = useRouter();
  const {
    totalItems,
    items,
    updateQuantity,
    removeItem,
    totalAmount,
    clearCart,
  } = useCart();
  const [currentUser, setCurrentUser] = useState<{
    name: string;
    role: string;
    id: string;
    email: string;
  } | null>(null);
  const [isCartDropdownOpen, setIsCartDropdownOpen] = useState(false);
  const [isCheckingOutFromDropdown, setIsCheckingOutFromDropdown] =
    useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const { user } = getCurrentUser();
    if (user) {
      setCurrentUser({
        name: user.name,
        role: user.role,
        id: user.id,
        email: user.email,
      });
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsCartDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    setCurrentUser(null);
    router.refresh();
  };

  const handleQuickCheckout = async () => {
    if (!currentUser || items.length === 0) return;

    try {
      setIsCheckingOutFromDropdown(true);

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: currentUser.name,
          email: currentUser.email,
          userId: currentUser.id,
          items,
        }),
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || "Checkout failed");
      }

      clearCart();
      setIsCartDropdownOpen(false);
      router.push("/cart");
      router.refresh();
    } catch (error) {
      console.error("Checkout failed:", error);
    } finally {
      setIsCheckingOutFromDropdown(false);
    }
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

              {/* Cart Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsCartDropdownOpen(!isCartDropdownOpen)}
                  className="relative text-sm font-medium text-slate-600 hover:text-violet-600 transition-colors duration-200 flex items-center gap-2"
                >
                  Cart
                  {totalItems > 0 && (
                    <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 text-xs font-bold text-white shadow-md">
                      {totalItems}
                    </span>
                  )}
                </button>

                {/* Dropdown Menu */}
                {isCartDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-96 rounded-xl border border-violet-200 bg-white shadow-xl z-50">
                    <div className="max-h-96 overflow-y-auto">
                      {items.length === 0 ? (
                        <div className="p-6 text-center">
                          <p className="text-slate-600">Your cart is empty</p>
                        </div>
                      ) : (
                        <div className="divide-y divide-slate-200">
                          {items.map((item) => (
                            <div
                              key={item.id}
                              className="p-4 hover:bg-slate-50 transition-colors"
                            >
                              <div className="flex gap-3 mb-2">
                                {item.image && (
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="h-12 w-12 rounded-lg object-cover"
                                  />
                                )}
                                <div className="flex-1">
                                  <h3 className="font-semibold text-slate-900 text-sm">
                                    {item.name}
                                  </h3>
                                  <p className="text-xs text-slate-600">
                                    ${item.price.toFixed(2)} each
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center justify-between mt-3">
                                <div className="flex items-center gap-2 border border-slate-300 rounded-lg">
                                  <button
                                    onClick={() =>
                                      updateQuantity(item.id, item.quantity - 1)
                                    }
                                    className="px-2 py-1 hover:bg-slate-100 transition-colors"
                                  >
                                    −
                                  </button>
                                  <span className="px-2 text-sm font-medium">
                                    {item.quantity}
                                  </span>
                                  <button
                                    onClick={() =>
                                      updateQuantity(item.id, item.quantity + 1)
                                    }
                                    className="px-2 py-1 hover:bg-slate-100 transition-colors"
                                  >
                                    +
                                  </button>
                                </div>
                                <div className="flex items-center gap-2">
                                  <p className="font-semibold text-slate-900 text-sm">
                                    ${(item.price * item.quantity).toFixed(2)}
                                  </p>
                                  <button
                                    onClick={() => removeItem(item.id)}
                                    className="text-xs text-red-500 hover:text-red-700 transition-colors font-medium"
                                  >
                                    ✕
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {items.length > 0 && (
                      <div className="border-t border-slate-200 p-4 space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-slate-900">
                            Total:
                          </span>
                          <span className="font-bold text-lg text-violet-600">
                            ${totalAmount.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setIsCartDropdownOpen(false);
                              router.push("/cart");
                            }}
                            className="flex-1 py-2 px-3 rounded-lg border border-violet-600 text-violet-600 text-sm font-medium hover:bg-violet-50 transition-colors"
                          >
                            View Cart
                          </button>
                          <button
                            onClick={handleQuickCheckout}
                            disabled={isCheckingOutFromDropdown}
                            className="flex-1 py-2 px-3 rounded-lg bg-gradient-to-r from-violet-600 to-cyan-500 text-white text-sm font-medium hover:shadow-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                          >
                            {isCheckingOutFromDropdown
                              ? "Processing..."
                              : "Checkout"}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
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
