"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useCart } from "@/context/cart-context";
import { Product } from "@/types";
import { getCurrentSessionUser } from "@/lib/auth";
import Link from "next/link";
import { Header, Footer } from "@/components/layout";
import { ReviewForm } from "@/components/product/ReviewForm";
import { ReviewStats } from "@/components/product/ReviewStats";

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const { addItem, totalItems } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showSignInPrompt, setShowSignInPrompt] = useState(false);
  const [reviews, setReviews] = useState<any[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    fetchProduct();
    getCurrentSessionUser().then(({ user }) => setCurrentUser(user));
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products?id=${id}`);

      const data = await response.json();

      if (data.success && data.data) {
        setProduct(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch product:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await fetch(`/api/products/${id}/reviews`);

      if (!response.ok) {
        throw new Error("Failed to fetch reviews");
      }

      const data = await response.json();

      if (data.success && data.data) {
        setReviews(data.data.reviews);
        setAverageRating(data.data.averageRating);
      }
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    } finally {
      setLoadingReviews(false);
    }
  };

  useEffect(() => {
    if (product) {
      fetchReviews();
    }
  }, [product]);

  const handleAddToCart = (product: Product) => {
    if (!currentUser) {
      setShowSignInPrompt(true);
      return;
    }
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Product not found
          </h1>

          <button
            onClick={() => router.push("/products")}
            className="text-indigo-600 hover:text-indigo-500 font-medium"
          >
            Go back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Image */}

            <div className="h-96 lg:h-auto bg-slate-100 rounded-lg flex items-center justify-center overflow-hidden">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src =
                      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect fill='%23e2e8f0' width='400' height='400'/%3E%3Ctext x='50%25' y='50%25' font-size='48' fill='%23999' text-anchor='middle' dy='.3em'%3E📦%3C/text%3E%3Ctext x='50%25' y='65%25' font-size='16' fill='%23999' text-anchor='middle'%3EImage not available%3C/text%3E%3C/svg%3E";
                  }}
                />
              ) : (
                <div className="text-center">
                  <div className="text-6xl mb-4">📦</div>
                  <p className="text-slate-500">No image available</p>
                </div>
              )}
            </div>

            {/* Product Details */}

            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {product.name}
              </h2>

              <p className="text-gray-600 mb-4">{product.description}</p>

              {/* Price */}

              <div className="mb-6">
                <span className="text-3xl font-bold text-gray-900">
                  ${product.price.toFixed(2)}
                </span>
                <span className="text-gray-500 ml-2">/ item</span>
              </div>

              {/* Stock */}

              <div className="mb-6">
                <span className="text-sm font-medium text-gray-700">
                  Stock:
                </span>

                <span
                  className={`ml-2 text-sm font-medium ${
                    product.stock > 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {product.stock > 0
                    ? `${product.stock} available`
                    : "Out of stock"}
                </span>
              </div>

              {/* Buttons */}

              <div className="flex gap-4">
                <button
                  onClick={() => handleAddToCart(product)}
                  disabled={product.stock <= 0}
                  className={`flex-1 py-3 px-6 rounded-lg font-semibold text-white transition-all ${
                    product.stock > 0
                      ? "bg-gradient-to-r from-violet-600 to-cyan-500 hover:shadow-lg hover:scale-105"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
                </button>

                <Link
                  href="/products"
                  className="px-6 py-3 border-2 border-violet-600 rounded-lg font-semibold text-violet-600 hover:bg-violet-50 transition-colors"
                >
                  Back
                </Link>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="border-t border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Customer Reviews
                </h3>
                {!loadingReviews && reviews.length > 0 && (
                  <div className="mt-1">
                    <ReviewStats
                      averageRating={averageRating}
                      totalReviews={reviews.length}
                    />
                  </div>
                )}
              </div>
              {currentUser && !showReviewForm && (
                !reviews.some((r) => r.user?.id === currentUser.id) ? (
                  <button
                    onClick={() => setShowReviewForm(true)}
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-violet-600 to-cyan-500 text-white text-sm font-medium hover:shadow-lg transition-all"
                  >
                    Write a Review
                  </button>
                ) : (
                  <span className="text-sm text-gray-500 italic">You've already reviewed this product</span>
                )
              )}
              {!currentUser && (
                <button
                  onClick={() => setShowSignInPrompt(true)}
                  className="px-4 py-2 rounded-lg border border-violet-600 text-violet-600 text-sm font-medium hover:bg-violet-50 transition-colors"
                >
                  Sign in to Review
                </button>
              )}
            </div>

            {showReviewForm && (
              <div className="mb-6">
                <ReviewForm
                  productId={id}
                  onReviewSubmitted={() => {
                    setShowReviewForm(false);
                    fetchReviews();
                  }}
                  onCancel={() => setShowReviewForm(false)}
                />
              </div>
            )}

            {loadingReviews ? (
              <p className="text-gray-500">Loading reviews...</p>
            ) : reviews.length === 0 ? (
              <p className="text-gray-500">
                No reviews yet. Be the first to review this product!
              </p>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="border-b border-gray-100 pb-4"
                  >
                    <div className="flex items-center mb-2">
                      <span className="font-semibold text-gray-900">
                        {review.user.name}
                      </span>
                      <span className="mx-2 text-gray-300">•</span>
                      <span className="text-sm text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-5 h-5 ${i < review.rating ? "text-yellow-400" : "text-gray-300"}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-gray-700">{review.reviewText}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {showSignInPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Sign In Required
            </h2>
            <p className="text-gray-700 mb-6">
              Please sign in to add items to your cart and proceed with
              checkout.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowSignInPrompt(false)}
                className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => router.push("/auth/login")}
                className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-semibold hover:shadow-lg transition-all"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
