"use client";

import Link from "next/link";
import { Header, Footer } from "@/components/layout";
import { getCurrentUser } from "@/lib/auth";
import { useEffect, useState } from "react";

export default function HomePage() {
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

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white via-violet-50 to-purple-50">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl sm:text-6xl font-bold text-slate-900 leading-tight">
            The Future of{" "}
            <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-cyan-500 bg-clip-text text-transparent">
              Online Shopping
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 leading-relaxed">
            Discover the latest tech products, curated collections, and a
            seamless shopping experience designed for modern customers.
          </p>

          {!currentUser ? (
            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/auth/signup"
                className="rounded-lg bg-gradient-to-r from-violet-600 to-cyan-500 px-8 py-4 font-semibold text-white hover:shadow-lg hover:scale-105 transition-all inline-block"
              >
                Start Shopping
              </Link>

              <Link
                href="/auth/login"
                className="rounded-lg border-2 border-violet-200 px-8 py-4 font-semibold text-slate-900 hover:bg-violet-50 hover:border-violet-300 transition-all inline-block"
              >
                Login
              </Link>
            </div>
          ) : (
            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/products"
                className="rounded-lg bg-gradient-to-r from-violet-600 to-cyan-500 px-8 py-4 font-semibold text-white hover:shadow-lg hover:scale-105 transition-all inline-block"
              >
                Browse Products
              </Link>

              <Link
                href="/cart"
                className="rounded-lg border-2 border-violet-200 px-8 py-4 font-semibold text-slate-900 hover:bg-violet-50 hover:border-violet-300 transition-all inline-block"
              >
                View Cart
              </Link>
            </div>
          )}
        </section>

        {/* Features Section */}
        <section className="bg-gradient-to-r from-violet-50 to-purple-50 py-16 border-t border-violet-200">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h3 className="text-3xl font-bold text-slate-900 text-center mb-12">
              Why Choose T-Cart?
            </h3>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {[
                {
                  icon: "⚡",
                  title: "Lightning Fast",
                  desc: "Built with Next.js for incredible performance",
                },
                {
                  icon: "🔒",
                  title: "Secure",
                  desc: "Your data is protected with modern security",
                },
                {
                  icon: "🎯",
                  title: "User-Friendly",
                  desc: "Intuitive interface for seamless shopping",
                },
              ].map((feature) => (
                <div
                  key={feature.title}
                  className="rounded-xl bg-white p-8 border border-violet-100 hover:shadow-xl hover:border-violet-300 hover:scale-105 transition-all duration-300"
                >
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h4 className="text-xl font-semibold text-slate-900">
                    {feature.title}
                  </h4>
                  <p className="mt-2 text-slate-600">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
