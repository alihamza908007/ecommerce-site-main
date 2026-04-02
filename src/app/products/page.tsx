"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header, Footer } from "@/components/layout";
import { ProductGrid } from "@/components/product";
import { LoadingSpinner } from "@/components/common";
import { Product } from "@/types";
import { getCurrentUser } from "@/lib/auth";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      if (data.success) setProducts(data.data);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <LoadingSpinner size="lg" text="Loading products..." />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1 mx-auto max-w-7xl w-full px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900">Products</h1>
          <p className="mt-2 text-lg text-slate-600">
            Discover our collection of quality products
          </p>
        </div>

        <ProductGrid products={products} />
      </main>

      <Footer />
    </div>
  );
}
