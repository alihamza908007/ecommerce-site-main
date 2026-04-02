"use client";

import React, { useState } from "react";

interface ReviewFormProps {
  productId: string;
  onReviewSubmitted: () => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({
  productId,
  onReviewSubmitted,
  onCancel,
  isSubmitting = false,
}) => {
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!reviewText.trim()) {
      setError("Please write a review");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`/api/products/${productId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, reviewText }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.error || "Failed to submit review");
        return;
      }

      setRating(5);
      setReviewText("");
      onReviewSubmitted();
    } catch (err) {
      console.error("Failed to submit review:", err);
      setError("Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border border-slate-200 p-6"
    >
      <h3 className="mb-4 text-lg font-semibold text-slate-900">
        Write a Review
      </h3>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Rating */}
      <div className="mb-4">
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Rating
        </label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className={`text-2xl transition-transform hover:scale-110 ${
                star <= rating ? "text-yellow-400" : "text-slate-300"
              }`}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      {/* Review Text */}
      <div className="mb-4">
        <label
          htmlFor="review"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Your Review
        </label>
        <textarea
          id="review"
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          placeholder="Share your experience with this product..."
          rows={4}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-500 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading || isSubmitting}
          className="flex-1 rounded-lg bg-gradient-to-r from-violet-600 to-cyan-500 px-4 py-2 text-sm font-medium text-white hover:shadow-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Submitting..." : "Submit Review"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-lg border border-slate-300 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};
