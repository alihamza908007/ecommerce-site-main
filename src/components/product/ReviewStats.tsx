"use client";

import React from "react";

interface ReviewStatsProps {
  averageRating: number;
  totalReviews: number;
  showLabel?: boolean;
}

export const ReviewStats: React.FC<ReviewStatsProps> = ({
  averageRating,
  totalReviews,
  showLabel = true,
}) => {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`text-lg ${
              star <= Math.round(averageRating)
                ? "text-yellow-400"
                : "text-slate-300"
            }`}
          >
            ★
          </span>
        ))}
      </div>
      <span className="text-sm font-medium text-slate-700">
        {averageRating.toFixed(1)}
      </span>
      {showLabel && (
        <span className="text-xs text-slate-600">
          ({totalReviews} {totalReviews === 1 ? "review" : "reviews"})
        </span>
      )}
    </div>
  );
};
