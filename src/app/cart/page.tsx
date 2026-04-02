"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/context/cart-context";
import { Header, Footer } from "@/components/layout";
import { LoadingSpinner } from "@/components/common";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

export default function CartPage() {
  const { items, totalAmount, updateQuantity, removeItem, clearCart } =
    useCart();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutMessage, setCheckoutMessage] = useState<string | null>(null);

  useEffect(() => {
    const { user } = getCurrentUser();
    if (!user) {
      router.push("/auth/login");
      return;
    }
    setIsLoading(false);
  }, [router]);

  const handleCheckout = async () => {
    const { user } = getCurrentUser();
    if (!user) {
      router.push("/auth/login");
      return;
    }

    if (items.length === 0) {
      setCheckoutMessage("Your cart is empty.");
      return;
    }

    try {
      setIsCheckingOut(true);
      setCheckoutMessage(null);

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: user.name,
          email: user.email,
          userId: user.id,
          items,
        }),
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || "Checkout failed");
      }

      clearCart();
      setCheckoutMessage(
        `Order placed successfully! Order ID: ${result.data.id}`,
      );
      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Checkout failed";
      setCheckoutMessage(message);
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <LoadingSpinner size="lg" text="Loading your cart..." />
        </main>
        <Footer />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1 mx-auto max-w-7xl w-full px-4 py-12 sm:px-6 lg:px-8">
          <div className="rounded-xl border border-violet-200 bg-gradient-to-r from-violet-50 to-purple-50 p-10 text-center shadow-lg">
            <h1 className="text-3xl font-bold text-slate-900">
              Your cart is empty
            </h1>
            <p className="mt-2 text-slate-600">
              Add products to place an order.
            </p>
            <Link
              href="/products"
              className="mt-6 inline-flex rounded-lg bg-gradient-to-r from-violet-600 to-cyan-500 px-6 py-2.5 font-semibold text-white hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              Continue Shopping
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1 mx-auto max-w-7xl w-full px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="mb-6 text-4xl font-bold text-slate-900">
          Shopping Cart
        </h1>
        {checkoutMessage && (
          <div className="mb-5 rounded-xl border border-violet-400/30 bg-violet-500/10 px-4 py-3 text-sm font-medium">
            {checkoutMessage}
          </div>
        )}

        <div className="lg:grid lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] shadow-xl">
              <ul className="divide-y divide-[var(--border-color)]">
                {items.map((item) => (
                  <li
                    key={item.id}
                    className="flex p-5 transition-colors hover:bg-white/5 cursor-pointer"
                    onClick={() => router.push(`/products/${item.id}`)}
                  >
                    <div className="h-24 w-24 rounded-xl bg-gradient-to-br from-indigo-400/20 to-cyan-400/20 overflow-hidden flex items-center justify-center flex-shrink-0">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src =
                              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23e2e8f0' width='100' height='100'/%3E%3Ctext x='50%25' y='50%25' font-size='32' fill='%23999' text-anchor='middle' dy='.3em'%3E📦%3C/text%3E%3C/svg%3E";
                          }}
                        />
                      ) : (
                        <span className="text-2xl">📦</span>
                      )}
                    </div>
                    <div className="ml-4 flex flex-1 flex-col">
                      <div className="flex justify-between">
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="font-semibold">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center rounded-md border border-[var(--border-color)]">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="px-3 py-1"
                          >
                            -
                          </button>
                          <span className="px-3 py-1">{item.quantity}</span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="px-3 py-1"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-sm font-medium text-rose-400 transition hover:text-rose-300"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-6 lg:col-span-5 lg:mt-0">
            <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-6 shadow-xl">
              <h2 className="text-lg font-semibold">Order Summary</h2>
              <div className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between text-[var(--text-secondary)]">
                  <span>Subtotal</span>
                  <span>${totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[var(--text-secondary)]">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between border-t border-[var(--border-color)] pt-3 text-base font-semibold">
                  <span>Total</span>
                  <span>${totalAmount.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="mt-6 w-full rounded-lg bg-gradient-to-r from-violet-600 to-cyan-500 px-4 py-3 font-semibold text-white transition-all duration-300 hover:shadow-lg hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isCheckingOut ? "Placing Order..." : "Checkout"}
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
