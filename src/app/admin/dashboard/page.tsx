"use client";

import React, {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { getCurrentSessionUser } from "@/lib/auth";
import {
  StatCard,
  ProductForm,
  ProductTable,
  OrderTable,
} from "@/components/admin";
import { LoadingSpinner, Alert } from "@/components/common";

type AdminProduct = {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  image: string;
};

type OrderItem = {
  id: string;
  productName: string;
  quantity: number;
  price: number;
};

type DashboardOrder = {
  id: string;
  customerName: string;
  email: string;
  total: number;
  status: string;
  createdAt: Date | string;
  items: OrderItem[];
};

export default function AdminDashboard() {
  const router = useRouter();
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [orders, setOrders] = useState<DashboardOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [initialFormData, setInitialFormData] = useState<any>(null);

  const fetchDashboardData = useCallback(async (showLoader = false) => {
    if (showLoader) {
      setIsLoading(true);
    }

    try {
      const [productsRes, ordersRes] = await Promise.all([
        fetch("/api/products", { cache: "no-store" }),
        fetch("/api/orders?limit=100", { cache: "no-store" }),
      ]);

      const productsJson = await productsRes.json();
      const ordersJson = await ordersRes.json();

      if (productsJson.success && Array.isArray(productsJson.data)) {
        setProducts(productsJson.data);
      }

      if (ordersJson.success && Array.isArray(ordersJson.data)) {
        setOrders(ordersJson.data);
      }

      setLastUpdated(new Date());
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      setFeedback({
        type: "error",
        message: "Could not refresh live data. Please try again.",
      });
    } finally {
      if (showLoader) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const initializeDashboard = async () => {
      const { user, role } = await getCurrentSessionUser();
      if (!user || role !== "admin") {
        router.push("/auth/login");
        return;
      }

      fetchDashboardData(true);
    };

    initializeDashboard();

    const interval = setInterval(() => {
      fetchDashboardData(false);
    }, 6000);

    return () => clearInterval(interval);
  }, [fetchDashboardData, router]);

  const totalRevenue = useMemo(
    () => orders.reduce((sum, order) => sum + order.total, 0),
    [orders],
  );
  const totalOrders = orders.length;
  const pendingOrders = useMemo(
    () =>
      orders.filter((order) => ["pending", "processing"].includes(order.status))
        .length,
    [orders],
  );
  const lowStockItems = useMemo(
    () => products.filter((product) => product.stock <= 5).length,
    [products],
  );

  const beginEdit = (product: AdminProduct) => {
    setEditingProductId(product.id);
    setInitialFormData({
      name: product.name,
      description: product.description,
      price: String(product.price),
      stock: String(product.stock),
      imageUrl: product.image || "",
    });
  };

  const resetForm = () => {
    setEditingProductId(null);
    setInitialFormData(null);
  };

  const handleSubmit = async (payload: any) => {
    if (!payload.name || !payload.description || payload.price === undefined) {
      setFeedback({
        type: "error",
        message: "Name, description, and price are required.",
      });
      return;
    }

    const price = Number(payload.price);
    const stock = Number(payload.stock || 0);

    if (Number.isNaN(price) || price < 0 || Number.isNaN(stock) || stock < 0) {
      setFeedback({
        type: "error",
        message: "Please enter valid positive values for price and stock.",
      });
      return;
    }

    try {
      setIsSaving(true);
      const isEditing = Boolean(editingProductId);
      const endpoint = isEditing
        ? `/api/products?id=${editingProductId}`
        : "/api/products";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to save product");
      }

      setFeedback({
        type: "success",
        message: isEditing
          ? "Product updated successfully."
          : "Product added successfully.",
      });
      resetForm();
      await fetchDashboardData(false);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to save product";
      setFeedback({ type: "error", message });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    const approved = window.confirm(
      "Are you sure you want to delete this product?",
    );
    if (!approved) {
      return;
    }

    try {
      const response = await fetch(`/api/products?id=${id}`, {
        method: "DELETE",
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to delete product");
      }

      setFeedback({
        type: "success",
        message: "Product deleted successfully.",
      });
      await fetchDashboardData(false);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to delete product";
      setFeedback({ type: "error", message });
    }
  };

  const updateStock = async (product: AdminProduct, nextStock: number) => {
    if (nextStock < 0) {
      return;
    }

    try {
      const response = await fetch(`/api/products?id=${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: product.name,
          description: product.description,
          price: product.price,
          stock: nextStock,
          images: product.image ? [product.image] : [],
        }),
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || "Could not update stock");
      }

      setProducts((prev) =>
        prev.map((item) =>
          item.id === product.id ? { ...item, stock: nextStock } : item,
        ),
      );
      setFeedback({
        type: "success",
        message: `Stock for ${product.name} updated.`,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Could not update stock";
      setFeedback({ type: "error", message });
    }
  };

  const handleUpdateOrderStatus = async (
    orderId: string,
    newStatus: string,
  ) => {
    try {
      setIsSaving(true);
      const response = await fetch("/api/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: orderId, status: newStatus }),
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to update order status");
      }

      setFeedback({
        type: "success",
        message: `Order status updated to ${newStatus}.`,
      });
      await fetchDashboardData(false);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to update order status";
      setFeedback({ type: "error", message });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    const approved = window.confirm(
      "Are you sure you want to delete this order? This action cannot be undone.",
    );
    if (!approved) {
      return;
    }

    try {
      setIsSaving(true);
      const response = await fetch(`/api/orders?id=${orderId}`, {
        method: "DELETE",
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to delete order");
      }

      setFeedback({
        type: "success",
        message: "Order deleted successfully.",
      });
      await fetchDashboardData(false);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to delete order";
      setFeedback({ type: "error", message });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoadingSpinner size="lg" text="Loading admin dashboard..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with status */}
      <div className="flex items-center justify-between bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl p-6 border border-violet-200">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Manage products and orders in real-time
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-600 bg-white rounded-lg px-4 py-2 border border-violet-100">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-violet-500" />
          </span>
          Live
          {lastUpdated && (
            <span className="text-xs text-slate-500">
              {lastUpdated.toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Revenue"
          value={`$${totalRevenue.toFixed(2)}`}
          color="emerald"
        />
        <StatCard label="Total Orders" value={totalOrders} color="violet" />
        <StatCard label="Pending Orders" value={pendingOrders} color="amber" />
        <StatCard label="Low Stock Items" value={lowStockItems} color="rose" />
      </div>

      {/* Feedback Alert */}
      {feedback && (
        <Alert
          type={feedback.type}
          message={feedback.message}
          onClose={() => setFeedback(null)}
        />
      )}

      {/* Product Form */}
      <ProductForm
        isEditing={!!editingProductId}
        initialData={initialFormData}
        onSubmit={handleSubmit}
        onCancel={resetForm}
        isSaving={isSaving}
        feedback={feedback}
      />

      {/* Products Table */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-6">
          Manage Products
        </h2>
        <ProductTable
          products={products}
          onEdit={beginEdit}
          onDelete={handleDelete}
          onStockChange={updateStock}
        />
      </div>

      {/* Orders Table */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-6">
          Manage Orders
        </h2>
        <OrderTable
          orders={orders}
          onUpdateStatus={handleUpdateOrderStatus}
          onDelete={handleDeleteOrder}
          isLoading={isSaving}
        />
      </div>
    </div>
  );
}
