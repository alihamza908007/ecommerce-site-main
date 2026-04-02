"use client";

import React from "react";
import Link from "next/link";

export default function CartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo & Links */}
            <div className="flex items-center gap-8">
              <Link href="/" className="text-2xl font-bold text-indigo-600">
                T-Cart
              </Link>

              <div className="hidden sm:flex sm:space-x-6">
                <Link
                  href="/products"
                  className="text-gray-500 hover:text-gray-700 text-sm font-medium pb-1 border-b-2 border-transparent hover:border-indigo-500 transition"
                >
                  Products
                </Link>
                <Link
                  href="/cart"
                  className="text-gray-900 border-b-2 border-indigo-500 text-sm font-medium pb-1"
                >
                  Cart
                </Link>
              </div>
            </div>

            {/* Back to Home */}
            <div className="flex items-center">
              <Link
                href="/"
                className="text-gray-500 hover:text-gray-700 text-sm font-medium"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
